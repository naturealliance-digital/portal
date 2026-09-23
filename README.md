# Nature A Digital Hub

## Run locally

Run `powershell -ExecutionPolicy Bypass -File .\Start-DigitalHub.ps1`, then open http://localhost:8787/.

## Project structure

- `assets/fonts/` — local Poppins font files.
- `assets/images/` — dashboard logos and favicon.
- `data/` — dashboard data sources, including `data/2026/` for Budget and Copier reporting data.
- `app.js` and `styles.css` — dashboard behavior and theme.

Dashboard edits are saved in the browser’s local storage. The current menu is preserved for the active browser session.
