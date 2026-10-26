# NEURO//X — Beyond Human

A complete, responsive, cyborg-themed landing page built for a creative web-design assignment. **NEURO//X and NEX-01 are fictional concept brands**, not actual medical or consumer products.

## Run it

**Quickest:** Open `index.html` in any modern web browser. All visual assets and scripts are included locally; no network, install, or build step is required.

**Optional local dev server:**

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project files

- `index.html` — semantic, accessible landing-page markup
- `styles.css` — responsive styles, motion, layout, transitions
- `app.js` — mobile menu, tabbed system module viewer, local demo modal, optional sound and scroll animation
- `assets/cyborg-portrait.svg` — original custom SVG cyborg illustration
- `assets/favicon.svg` — custom icon

## Highlights

- Responsive desktop, tablet, and mobile layouts
- Distinctive dark/neon cyberpunk aesthetic and original vector portrait
- Animated hero, ticker, section transitions, and system visualizer
- Working mobile navigation with Escape and outside-click support
- Keyboard-friendly module selector (arrow keys, Home and End)
- Working local simulation modal with focus management and Escape support
- Optional interface sounds synthesized in browser; sound off by default
- Reduced-motion accessibility preference respected
- No external libraries, API keys, fonts or analytics

## Customize

Colors are defined at the top of `styles.css` (`--accent`, `--bg`, etc.). Edit product copy and sections in `index.html`. Modules are configured in the `modules` constant in `app.js`.

## Deployment

Upload the project folder to any static host (GitHub Pages, Netlify, Vercel, etc.) or submit the ZIP. `index.html` must remain alongside `styles.css`, `app.js`, and the `assets` folder.
