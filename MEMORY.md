# HR:RUSH FOR PRACTICE — project memory

## Repository

- GitHub: `https://github.com/krasen2000kstanev-hub/hr-rush-for-practice`
- Active branch: `design-refresh`
- Current workspace is a monorepo.

## Applications

- `apps/website/`: Next.js public website, application form, admin area, Supabase.
- `apps/mission-control/`: separate Mission Control portal for students and mentors.
  - Static frontend: `docs/`
  - Python Lambda: `backend/app.py`
  - AWS SAM: `template.yaml`
  - Tests: `tests/`

## Important decisions

- Keep the two applications independently deployable.
- Do not rewrite Mission Control into Next.js without a separate migration plan.
- Supabase remains the source of truth for website applications.
- Google Sheets is an optional mirror.

## QA status

- Website typecheck: passing.
- Website lint: passing.
- Website production build: passing.
- Mission Control tests: 3 passing.
- Duplicate application race handling added in `apps/website/app/api/apply/route.ts`.

## Graphify

- Website graph: `apps/website/graphify-out/`
- Mission Control source graph: `apps/mission-control/` includes its existing graph/report files.
