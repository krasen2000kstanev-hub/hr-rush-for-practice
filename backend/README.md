# HR:Rush for Practice AWS backend

## Prerequisites

- AWS CLI configured for the target account and region
- AWS SAM CLI
- Node.js 20+

## Deploy

```bash
cd backend
npm install
sam build
sam deploy --guided
```

Use the published Google Sheets gviz JSON URLs for `TeamsSheetUrl` and `CompaniesSheetUrl`, and the exact GitHub Pages origin for `FrontendOrigin`.

Create the single admin user after the stack is deployed:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id USER_POOL_ID \
  --username ADMIN_EMAIL \
  --user-attributes Name=email,Value=ADMIN_EMAIL \
  --temporary-password 'REPLACE_WITH_STRONG_TEMP_PASSWORD'
```

The temporary password must be changed on first login. Public endpoints are read-only. The admin endpoints require a Cognito access token.

## GitHub Pages

In the GitHub repository, enable Pages with **GitHub Actions** and add these repository variables:

```text
LEADERBOARD_API_BASE=https://YOUR_API_ID.execute-api.eu-central-1.amazonaws.com
COGNITO_CLIENT_ID=YOUR_USER_POOL_CLIENT_ID
AWS_REGION=eu-central-1
```

The workflow publishes `dist/` and injects those values into `dist/api-config.js`. The public page never contains AWS credentials.
