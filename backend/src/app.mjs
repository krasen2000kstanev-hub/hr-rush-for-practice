import crypto from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const season = Number(process.env.SEASON || 9);
const currentTable = process.env.CURRENT_TABLE;
const historyTable = process.env.HISTORY_TABLE;
const teamsSheetUrl = process.env.TEAMS_SHEET_URL;
const companiesSheetUrl = process.env.COMPANIES_SHEET_URL;

const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  body: JSON.stringify(body)
});

function parseGviz(text) {
  return JSON.parse(text.replace(/^.*?\(/, '').replace(/\);?\s*$/, ''));
}

async function readSheet(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);
  return parseGviz(await response.text()).table.rows || [];
}

function cell(row, index) {
  return row.c?.[index]?.v ?? '';
}

function teamFromRow(row, index) {
  const university = String(cell(row, 1)).trim();
  const teamName = String(cell(row, 2)).trim();
  const company = String(cell(row, 3) || 'Без компания').trim();
  return {
    teamId: `${university}::${teamName}::${index}`,
    teamName,
    university,
    company,
    points: Number(cell(row, 7) || 0),
    missionsPoints: Number(cell(row, 8) || 0),
    activityPoints: Number(cell(row, 9) || 0)
  };
}

function companyFromRow(row) {
  return { name: String(cell(row, 0)).trim(), people: Number(cell(row, 1) || 0) };
}

function rankTeams(teams) {
  return [...teams].sort((a, b) => b.points - a.points || a.teamId.localeCompare(b.teamId)).map((team, index) => ({ ...team, rank: index + 1 }));
}

function sourceHash(teams, companies) {
  return crypto.createHash('sha256').update(JSON.stringify({ teams, companies })).digest('hex');
}

async function getCurrent() {
  const result = await db.send(new GetCommand({ TableName: currentTable, Key: { id: `SEASON#${season}` } }));
  return result.Item?.payload || null;
}

async function sync() {
  const sourceTeams = (await readSheet(teamsSheetUrl)).map(teamFromRow).filter(team => team.teamName);
  const sourceCompanies = (await readSheet(companiesSheetUrl)).map(companyFromRow).filter(company => company.name);
  const uniqueCompanies = [...new Map(sourceCompanies.map(company => [company.name, company])).values()].sort((a, b) => b.people - a.people);
  const nextHash = sourceHash(sourceTeams, uniqueCompanies);
  const previous = await getCurrent();
  if (previous?.sourceHash === nextHash) return { changed: false, snapshot: previous };

  const previousRanks = new Map((previous?.teams || []).map(team => [team.teamId, team.rank]));
  const teams = rankTeams(sourceTeams).map(team => {
    const previousRank = previousRanks.get(team.teamId) ?? null;
    const movement = previousRank === null ? 0 : previousRank - team.rank;
    return {
      ...team,
      previousRank,
      movement,
      movementLabel: previousRank === null ? 'Ново' : movement > 0 ? `↑ ${movement}` : movement < 0 ? `↓ ${Math.abs(movement)}` : 'Държи място'
    };
  });
  const updatedAt = new Date().toISOString();
  const snapshot = { season, sourceHash: nextHash, updatedAt, teams, companies: uniqueCompanies };
  await db.send(new PutCommand({ TableName: currentTable, Item: { id: `SEASON#${season}`, updatedAt, payload: snapshot } }));
  await db.send(new PutCommand({ TableName: historyTable, Item: { season, snapshotAt: updatedAt, sourceHash: nextHash, payload: snapshot } }));
  return { changed: true, snapshot };
}

async function adminHistory() {
  const result = await db.send(new QueryCommand({
    TableName: historyTable,
    KeyConditionExpression: '#season = :season',
    ExpressionAttributeNames: { '#season': 'season' },
    ExpressionAttributeValues: { ':season': season },
    ScanIndexForward: false,
    Limit: 100
  }));
  return (result.Items || []).map(item => ({ snapshotAt: item.snapshotAt, sourceHash: item.sourceHash }));
}

export async function handler(event) {
  const method = event.requestContext?.http?.method || event.httpMethod;
  const path = event.requestContext?.http?.path || event.path || '';
  try {
    if (event.source === 'aws.scheduler' || event.source === 'schedule') return json(200, await sync());
    if (method === 'GET' && path.endsWith('/leaderboard')) {
      const payload = await getCurrent();
      return payload ? json(200, payload, { 'cache-control': 'public, max-age=20' }) : json(503, { error: 'No snapshot available yet' });
    }
    if (method === 'GET' && path.endsWith('/companies')) {
      const payload = await getCurrent();
      return payload ? json(200, { season: payload.season, updatedAt: payload.updatedAt, companies: payload.companies }) : json(503, { error: 'No snapshot available yet' });
    }
    if (method === 'GET' && path.endsWith('/admin/status')) {
      const payload = await getCurrent();
      return json(200, { season, updatedAt: payload?.updatedAt || null, sourceHash: payload?.sourceHash || null });
    }
    if (method === 'GET' && path.endsWith('/admin/history')) return json(200, { season, history: await adminHistory() });
    if (method === 'POST' && path.endsWith('/admin/sync')) return json(200, await sync());
    if (method === 'POST' && path.endsWith('/sync')) return json(200, await sync());
    return json(404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    return json(500, { error: 'Service temporarily unavailable' });
  }
}
