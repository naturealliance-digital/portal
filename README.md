# Nature A Digital Hub

## Run locally

Run `powershell -ExecutionPolicy Bypass -File .\Start-DigitalHub.ps1`, then open http://localhost:8787/.

## Project structure

- `assets/fonts/` — local Poppins font files.
- `assets/images/` — dashboard logos and favicon.
- `data/tickets-data.js` — Service Ticket data used by the dashboard.
- `app.js` and `styles.css` — dashboard behavior and theme.

Dashboard edits are saved in the browser’s local storage. The current menu is preserved for the active browser session.
