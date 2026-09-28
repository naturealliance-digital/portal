# Nature A Digital Hub

## Project structure

Each dashboard has its own folder and entry page. Shared styles, scripts,
assets, and data remain central so a common improvement is made only once.

- `index.html` — Digital Operations overview
- `manpower/index.html` — Manpower
- `budget-expense/index.html` — Budget & Expense
- `copier-printer/index.html` — Copier & Printer Usage
- `service-tickets/index.html` — Service Tickets
- `fixed-assets/index.html` — Fixed Assets
- `microsoft-365/index.html` — Microsoft 365
- `fy-comparison/index.html` — FY Comparison
- `src/css/styles.css` — shared dashboard styles
- `src/js/app.js` — shared dashboard behavior

## Run locally

Run `powershell -ExecutionPolicy Bypass -File .\Start-DigitalHub.ps1`, then open http://localhost:8787/.

## Shared resources

- `assets/fonts/` — local Poppins font files.
- `assets/images/` — dashboard logos and favicon.
- `data/` — dashboard data sources, including `data/2026/` for Budget and Copier reporting data.

Dashboard edits are saved in the browser’s local storage. The current menu is preserved for the active browser session.
