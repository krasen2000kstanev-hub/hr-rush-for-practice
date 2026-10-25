import json
import os
import re
import time
import uuid
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ.get("TABLE_NAME", "hr-rush-local")
table = boto3.resource("dynamodb").Table(TABLE_NAME)


class ApiError(Exception):
    def __init__(self, status, message):
        self.status = status
        self.message = message


def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
        },
        "body": json.dumps(body, default=decimal_default),
    }


def decimal_default(value):
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)
    raise TypeError(f"Unsupported type: {type(value)}")


def body(event):
    raw = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        import base64
        raw = base64.b64decode(raw).decode("utf-8")
    try:
        value = json.loads(raw)
    except json.JSONDecodeError:
        raise ApiError(400, "Invalid JSON body")
    if not isinstance(value, dict):
        raise ApiError(400, "JSON body must be an object")
    return value


def claims(event):
    request_context = event.get("requestContext", {})
    jwt = request_context.get("authorizer", {}).get("jwt", {})
    return jwt.get("claims", {})


def user_id(event):
    value = claims(event).get("sub")
    if not value:
        raise ApiError(401, "Authentication required")
    return value


def roles(event):
    raw = claims(event).get("cognito:groups", "")
    if isinstance(raw, list):
        return set(raw)
    return {part.strip() for part in str(raw).split(",") if part.strip()}


def require_role(event, allowed):
    if not roles(event).intersection(allowed):
        raise ApiError(403, "You do not have permission for this action")


def path(event):
    return event.get("rawPath") or event.get("path") or "/"


def method(event):
    return event.get("requestContext", {}).get("http", {}).get("method") or event.get("httpMethod", "GET")


def now():
    return int(time.time())


def clean_id(value, field="id"):
    if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,80}", value):
        raise ApiError(400, f"Invalid {field}")
    return value


def get_item(pk, sk):
    return table.get_item(Key={"PK": pk, "SK": sk}).get("Item")


def query(pk, begins=None, index=None, limit=100):
    key_names = {"GSI1": ("GSI1PK", "GSI1SK"), "GSI2": ("GSI2PK", "GSI2SK")}
    key_name, sort_name = key_names.get(index, ("PK", "SK"))
    kwargs = {"KeyConditionExpression": Key(key_name).eq(pk), "Limit": limit}
    if begins:
        kwargs["KeyConditionExpression"] = Key(key_name).eq(pk) & Key(sort_name).begins_with(begins)
    if index:
        kwargs["IndexName"] = index
    return table.query(**kwargs).get("Items", [])


def public_item(item):
    if not item:
        return None
    return {k: v for k, v in item.items() if not k.startswith("PK") and k not in {"SK", "GSI1PK", "GSI1SK", "GSI2PK", "GSI2SK"}}


def ensure_profile(event):
    uid = user_id(event)
    existing = get_item(f"USER#{uid}", "PROFILE")
    if existing:
        return existing
    c = claims(event)
    item = {
        "PK": f"USER#{uid}", "SK": "PROFILE", "entity": "user", "id": uid,
        "name": c.get("name") or c.get("email", "Student"),
        "email": c.get("email", ""), "photo": c.get("picture", ""),
        "role": "student", "createdAt": now(), "totalPoints": 0, "missionPoints": 0,
    }
    table.put_item(Item=item, ConditionExpression="attribute_not_exists(PK)")
    return item


def get_missions(event):
    ensure_profile(event)
    items = query("MISSIONS", begins="ACTIVE#", index="GSI1")
    return [public_item(item) for item in items if item.get("active", True)]


def get_mission(event, mission_id):
    item = get_item(f"MISSION#{mission_id}", "META")
    if not item or not item.get("active", True):
        raise ApiError(404, "Mission not found")
    return public_item(item)


def create_mission(event):
    require_role(event, {"mission_creator", "admin"})
    data = body(event)
    title = data.get("title")
    description = data.get("description", "")
    if not isinstance(title, str) or not 2 <= len(title.strip()) <= 160:
        raise ApiError(400, "title must be between 2 and 160 characters")
    if not isinstance(description, str) or len(description) > 5000:
        raise ApiError(400, "description must be at most 5000 characters")
    try:
        points = int(data.get("points", 0))
    except (TypeError, ValueError):
        raise ApiError(400, "points must be an integer")
    if points < 0 or points > 10000:
        raise ApiError(400, "points must be between 0 and 10000")
    contact_url = data.get("contactUrl", "")
    if contact_url and (not isinstance(contact_url, str) or len(contact_url) > 2000 or not re.match(r"^https?://", contact_url)):
        raise ApiError(400, "contactUrl must be a valid http(s) URL")
    mission_id = str(uuid.uuid4())
    item = {
        "PK": f"MISSION#{mission_id}", "SK": "META", "entity": "mission", "id": mission_id,
        "title": title.strip(), "description": description.strip(), "category": data.get("category", "General"),
        "points": points, "deadline": data.get("deadline", ""), "active": True,
        "creatorId": user_id(event), "reviewerIds": data.get("reviewerIds", []),
        "requiredEvidenceType": data.get("requiredEvidenceType", "link_or_text"),
        "contactLabel": data.get("contactLabel", "Свържи се със създателя"),
        "contactUrl": contact_url, "createdAt": now(),
        "GSI1PK": "MISSIONS", "GSI1SK": f"ACTIVE#{now()}#{mission_id}",
    }
    table.put_item(Item=item, ConditionExpression="attribute_not_exists(PK)")
    return public_item(item)


def create_team(event):
    require_role(event, {"admin"})
    data = body(event)
    name = data.get("name")
    if not isinstance(name, str) or not 2 <= len(name.strip()) <= 120:
        raise ApiError(400, "name must be between 2 and 120 characters")
    team_id = str(uuid.uuid4())
    item = {
        "PK": f"TEAM#{team_id}", "SK": "META", "entity": "team", "id": team_id,
        "name": name.strip(), "totalPoints": 0, "missionPoints": 0, "createdAt": now(),
        "GSI1PK": "LEADERBOARD", "GSI1SK": f"TEAM#{team_id}",
    }
    table.put_item(Item=item, ConditionExpression="attribute_not_exists(PK)")
    return public_item(item)


def add_team_member(event, team_id):
    require_role(event, {"admin"})
    team_id = clean_id(team_id, "teamId")
    member_id = clean_id(body(event).get("userId", ""), "userId")
    team = get_item(f"TEAM#{team_id}", "META")
    member = get_item(f"USER#{member_id}", "PROFILE")
    if not team or not member:
        raise ApiError(404, "Team or user not found")
    table.update_item(Key={"PK": f"USER#{member_id}", "SK": "PROFILE"}, UpdateExpression="SET teamId = :team", ExpressionAttributeValues={":team": team_id})
    table.put_item(Item={"PK": f"TEAM#{team_id}", "SK": f"MEMBER#{member_id}", "entity": "team_member", "teamId": team_id, "userId": member_id, "name": member.get("name", ""), "photo": member.get("photo", ""), "missionPoints": member.get("missionPoints", 0)})
    return {"ok": True, "teamId": team_id, "userId": member_id}


def submission(event, mission_id):
    uid = user_id(event)
    return get_item(f"SUBMISSION#{mission_id}#{uid}", "META")


def submit(event, mission_id):
    uid = user_id(event)
    profile = ensure_profile(event)
    mission = get_mission(event, mission_id)
    data = body(event)
    link = data.get("link", "")
    note = data.get("note", "")
    if link and (not isinstance(link, str) or len(link) > 2000 or not re.match(r"^https?://", link)):
        raise ApiError(400, "link must be a valid http(s) URL")
    if not link and not note:
        raise ApiError(400, "Provide a link or note")
    if not isinstance(note, str) or len(note) > 5000:
        raise ApiError(400, "note must be at most 5000 characters")
    existing = submission(event, mission_id)
    attempt = int(existing.get("attemptNumber", 0)) + 1 if existing else 1
    team_id = profile.get("teamId", "")
    item = {
        "PK": f"SUBMISSION#{mission_id}#{uid}", "SK": "META", "entity": "submission",
        "id": f"{mission_id}:{uid}", "missionId": mission_id, "studentId": uid,
        "teamId": team_id, "evidence": {"link": link, "note": note},
        "status": "pending", "attemptNumber": attempt, "submittedAt": now(),
        "GSI1PK": f"USER#{uid}", "GSI1SK": f"SUBMISSION#{mission_id}",
        "GSI2PK": "REVIEW", "GSI2SK": f"PENDING#{now()}#{mission_id}#{uid}",
    }
    table.put_item(Item=item)
    return public_item(item)


def my_submissions(event):
    uid = user_id(event)
    items = query(f"USER#{uid}", begins="SUBMISSION#", index="GSI1")
    return [public_item(item) for item in items]


def points_history(event):
    uid = user_id(event)
    items = query(f"USER#{uid}", begins="POINTS#")
    return sorted([public_item(item) for item in items], key=lambda item: int(item.get("createdAt", 0)), reverse=True)


def get_team(event):
    profile = ensure_profile(event)
    team_id = profile.get("teamId")
    if not team_id:
        return {"team": None, "members": []}
    team = get_item(f"TEAM#{team_id}", "META")
    members = query(f"TEAM#{team_id}", begins="MEMBER#")
    return {"team": public_item(team), "members": [public_item(m) for m in members]}


def notifications(event):
    uid = user_id(event)
    return [public_item(item) for item in query(f"NOTIF#{uid}", begins="ITEM#", limit=50)]


def mark_notification(event, notification_id):
    uid = user_id(event)
    item = get_item(f"NOTIF#{uid}", f"ITEM#{notification_id}")
    if not item:
        raise ApiError(404, "Notification not found")
    table.update_item(Key={"PK": f"NOTIF#{uid}", "SK": f"ITEM#{notification_id}"}, UpdateExpression="SET isRead = :v", ExpressionAttributeValues={":v": True})
    return {"ok": True}


def review_queue(event):
    require_role(event, {"reviewer", "mission_creator", "admin"})
    items = query("REVIEW", begins="PENDING#", index="GSI2")
    return [public_item(item) for item in items]


def notify(uid, title, message, mission_id, kind):
    nid = str(uuid.uuid4())
    table.put_item(Item={
        "PK": f"NOTIF#{uid}", "SK": f"ITEM#{nid}", "entity": "notification", "id": nid,
        "userId": uid, "type": kind, "title": title, "message": message,
        "relatedMissionId": mission_id, "isRead": False, "createdAt": now(),
    })


def review(event, mission_id, student_id, status):
    require_role(event, {"reviewer", "mission_creator", "admin"})
    reviewer = user_id(event)
    item = get_item(f"SUBMISSION#{mission_id}#{student_id}", "META")
    if not item:
        raise ApiError(404, "Submission not found")
    data = body(event)
    comment = data.get("comment", "")
    if not isinstance(comment, str) or len(comment) > 5000:
        raise ApiError(400, "comment must be at most 5000 characters")
    if status == "approved":
        approve_transaction(item, reviewer, comment)
    else:
        table.update_item(Key={"PK": item["PK"], "SK": item["SK"]}, UpdateExpression="SET #s = :s, reviewerId = :r, reviewComment = :c, reviewedAt = :t REMOVE GSI2PK, GSI2SK", ExpressionAttributeNames={"#s": "status"}, ExpressionAttributeValues={":s": status, ":r": reviewer, ":c": comment, ":t": now()})
        notify(student_id, "Мисията има нов статус", comment or f"Статус: {status}", mission_id, status)
    return {"ok": True, "status": status}


def approve_transaction(item, reviewer, comment):
    mission = get_item(f"MISSION#{item['missionId']}", "META")
    points = int(mission.get("points", 0))
    uid = item["studentId"]
    team_id = item.get("teamId")
    timestamp = now()
    transact = [
        {"Update": {"TableName": TABLE_NAME, "Key": {"PK": item["PK"], "SK": item["SK"]}, "UpdateExpression": "SET #s = :approved, reviewerId = :r, reviewComment = :c, reviewedAt = :t REMOVE GSI2PK, GSI2SK", "ConditionExpression": "#s = :pending OR #s = :changes", "ExpressionAttributeNames": {"#s": "status"}, "ExpressionAttributeValues": {":approved": "approved", ":pending": "pending", ":changes": "changes_requested", ":r": reviewer, ":c": comment, ":t": timestamp}}},
        {"Put": {"TableName": TABLE_NAME, "Item": {"PK": f"POINTS#{item['id']}", "SK": "LEDGER", "entity": "points_ledger", "submissionId": item["id"], "studentId": uid, "teamId": team_id or "", "points": points, "createdAt": timestamp}, "ConditionExpression": "attribute_not_exists(PK)"}},
        {"Put": {"TableName": TABLE_NAME, "Item": {"PK": f"USER#{uid}", "SK": f"POINTS#{timestamp}#{uuid.uuid4()}", "entity": "points_event", "missionId": item["missionId"], "submissionId": item["id"], "teamId": team_id or "", "points": points, "source": "mission", "createdAt": timestamp}, "ConditionExpression": "attribute_not_exists(PK)"}},
        {"Update": {"TableName": TABLE_NAME, "Key": {"PK": f"USER#{uid}", "SK": "PROFILE"}, "UpdateExpression": "SET missionPoints = if_not_exists(missionPoints, :zero) + :p, totalPoints = if_not_exists(totalPoints, :zero) + :p", "ExpressionAttributeValues": {":p": points, ":zero": 0}}},
    ]
    if team_id:
        transact.append({"Update": {"TableName": TABLE_NAME, "Key": {"PK": f"TEAM#{team_id}", "SK": "META"}, "UpdateExpression": "SET missionPoints = if_not_exists(missionPoints, :zero) + :p, totalPoints = if_not_exists(totalPoints, :zero) + :p", "ExpressionAttributeValues": {":p": points, ":zero": 0}}})
    table.meta.client.transact_write_items(TransactItems=transact)
    notify(uid, "Мисията е одобрена", f"Получаваш {points} точки.", item["missionId"], "approved")


def leaderboard(event):
    items = query("LEADERBOARD", begins="TEAM#", index="GSI1")
    return sorted([public_item(item) for item in items], key=lambda x: int(x.get("totalPoints", 0)), reverse=True)


def dispatch(event):
    p = path(event).rstrip("/") or "/"
    m = method(event).upper()
    if p == "/health":
        return {"ok": True}
    if p == "/missions" and m == "GET":
        return get_missions(event)
    if p == "/missions" and m == "POST":
        return create_mission(event)
    if p == "/teams" and m == "POST":
        return create_team(event)
    match = re.fullmatch(r"/teams/([^/]+)/members", p)
    if match and m == "POST":
        return add_team_member(event, match.group(1))
    match = re.fullmatch(r"/missions/([^/]+)", p)
    if match and m == "GET":
        return get_mission(event, clean_id(match.group(1), "missionId"))
    match = re.fullmatch(r"/missions/([^/]+)/submit", p)
    if match and m == "POST":
        return submit(event, clean_id(match.group(1), "missionId"))
    if p == "/my-submissions" and m == "GET":
        return my_submissions(event)
    if p == "/points-history" and m == "GET":
        return points_history(event)
    if p == "/team" and m == "GET":
        return get_team(event)
    if p == "/notifications" and m == "GET":
        return notifications(event)
    match = re.fullmatch(r"/notifications/([^/]+)/read", p)
    if match and m == "PATCH":
        return mark_notification(event, clean_id(match.group(1), "notificationId"))
    if p == "/review-queue" and m == "GET":
        return review_queue(event)
    match = re.fullmatch(r"/submissions/([^/]+)/([^/]+)/(approve|request-changes|reject)", p)
    if match and m == "POST":
        status = {"approve": "approved", "request-changes": "changes_requested", "reject": "rejected"}[match.group(3)]
        return review(event, clean_id(match.group(1), "missionId"), clean_id(match.group(2), "studentId"), status)
    if p == "/leaderboard" and m == "GET":
        return leaderboard(event)
    raise ApiError(404, "Route not found")


def handler(event, context):
    try:
        return response(200, dispatch(event))
    except ApiError as exc:
        return response(exc.status, {"error": exc.message})
    except Exception:
        import traceback
        traceback.print_exc()
        return response(500, {"error": "Internal server error"})
