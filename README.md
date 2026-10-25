# HR:RUSH FOR PRACTICE

## Applications

- `apps/website/` — public Next.js website, application form, and admin area.
- `apps/mission-control/` — student/mentor Mission Control portal, Python Lambda backend, AWS SAM infrastructure, and tests.

The applications remain independently deployable. Shared UI and data contracts can be extracted later, after both deployment paths are stable.

## Checks

- Website: `npm run typecheck`, `npm run lint`, `npm run build`
- Mission Control: `python -m unittest discover -s apps/mission-control/tests -v`

## Architecture map

See [`apps/website/graphify-out/GRAPH_REPORT.md`](apps/website/graphify-out/GRAPH_REPORT.md) and [`apps/website/graphify-out/graph.html`](apps/website/graphify-out/graph.html).
