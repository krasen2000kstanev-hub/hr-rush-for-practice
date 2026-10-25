# HR Rush for Practice

Serverless Mission Hub for GitHub Pages + AWS.

## Architecture

- `docs/` — static frontend deployed by GitHub Pages.
- `backend/app.py` — one Python Lambda handler for the Mission Hub API.
- `template.yaml` — AWS SAM infrastructure: Cognito, HTTP API JWT authorizer, Lambda, DynamoDB.
- `tests/` — dependency-free unit tests for validation and authorization helpers.

The implementation uses an API Gateway HTTP API with a Cognito JWT authorizer. This is the secure browser-compatible equivalent of the initially proposed public Lambda Function URL: browsers can send Cognito tokens, while Lambda receives verified claims.

## Deploy

1. Install AWS SAM CLI and configure AWS credentials.
2. Create a Cognito Google OAuth client in Google Cloud Console. Set the redirect URI to:
   `https://<cognito-domain>.auth.<region>.amazoncognito.com/oauth2/idpresponse`
3. Build and deploy:

```powershell
sam build
sam deploy --guided
```

Provide these values during deployment:

- `GoogleClientId`
- `GoogleClientSecret`
- `CognitoDomainPrefix`
- `FrontendUrl` (the GitHub Pages URL)

After deployment, copy the outputs into `docs/config.js` and publish `docs/` with GitHub Pages.

Create the first administrator after the first Google sign-in:

```powershell
aws cognito-idp admin-add-user-to-group --user-pool-id <UserPoolId> --username <student-email> --group-name admin --region <region>
```

The first admin can then create teams and missions through the API. A student must sign in once before an admin can assign that account to a team.

The frontend uses the Cognito implicit OAuth flow so the static site can complete Google sign-in without a client secret. Add the callback URL in the Google OAuth client and in the Cognito app client exactly as the deployed Pages URL.

Admin API operations:

- `POST /missions` — create a mission (`mission_creator` or `admin`)
- `POST /teams` — create a team (`admin`)
- `POST /teams/{id}/members` — assign an existing user (`admin`)
- `GET /review-queue` — review pending submissions
- `POST /submissions/{missionId}/{studentId}/approve`
- `POST /submissions/{missionId}/{studentId}/request-changes`
- `POST /submissions/{missionId}/{studentId}/reject`

## Data model

The DynamoDB table is single-table with `PK` and `SK`, plus a sparse GSI for reviewer queues and leaderboards. Approval uses a DynamoDB transaction and an idempotent points ledger so the same submission cannot award points twice.

## Free-tier guardrails

The template uses one DynamoDB table, one Lambda, one HTTP API, Cognito, and no file storage. Evidence is link/text only in v1. Add AWS Budgets separately in the billing console; budgets are account-level and should not be hard-coded into this application.
