## 2026 New England Systems Day — Static Site

### Quick start
- Edit core content in `site.config.json` (name, date, location, links, emails).
- Open a local server from this directory (fetch requires HTTP, not file://):

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8000/website/` (adjust path if serving repo root).

### Structure
- `index.html`, `schedule.html`, `speakers.html`, `venue.html`, `registration.html`
- `partials/header.html`, `partials/footer.html` — included at runtime
- `assets/css/style.css` — dark, responsive theme
- `assets/js/main.js` — loads partials + applies config (text and links)
- `site.config.json` — event details and URLs

### Customize
- Titles, dates, locations, registration and contact links come from `site.config.json`.
- Update content sections directly in each page as needed.

### Deploy options
- GitHub Pages: serve `website/` folder; include `.nojekyll` (already present).
- Any static host: upload the `website/` directory as-is.

### Notes
- Because partials/config are fetched, use an HTTP server locally.
- External links marked in config will open in a new tab.


