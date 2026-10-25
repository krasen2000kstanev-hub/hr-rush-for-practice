# HR:RUSH applications

## Applications

- `mission-control/` — static Mission Control frontend, AWS SAM template, Python Lambda backend, and tests.
- The existing Next.js website remains at the repository root for now. It is the public site and candidate application.

## Migration boundary

Keep the two applications independently deployable. Share UI or data contracts only after both deployment paths are stable.
