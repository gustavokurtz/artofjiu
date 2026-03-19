# BJJ GI Study Tracker

## What is this?
Personal study tracker for BJJ GI training. Built for a blue belt (85kg) who trains against heavy opponents (100kg+). Tracks study modules, game plans, training logs, and submission statistics.

## Architecture
- **Stack:** Vanilla JS with Web Components (Custom Elements), no build step, no frameworks
- **Routing:** Hash-based (`#modules`, `#gameplan`, `#training`, `#config`)
- **Persistence:** localStorage via `js/storage.js` (single source of truth)
- **Data:** Hardcoded content in `js/data.js` (modules, game plan trees, constants)

## File Structure
- `index.html` — entry point
- `css/style.css` — dark theme, responsive layout
- `js/app.js` — initializes and imports all components
- `js/storage.js` — localStorage wrapper, export/import, state management
- `js/data.js` — constants (POSITIONS, SUBMISSIONS, MOODS), module content, game plan trees, channels
- `components/` — Web Components (one per file, self-contained)

## Key Patterns
- Components communicate via Custom Events (bubble up) and `state-changed` event (broadcast)
- `storage.updateState(updater)` is the main way to modify state — it loads, applies updater function, saves, and dispatches `state-changed`
- IDs: module slugs, `{slug}-c{N}` for concepts, `{slug}-r{N}` for resources, `crypto.randomUUID()` for user-created items

## Running
Open `index.html` in a browser. No build step needed. Use Live Server for development.

## Design
- Dark theme, blue accent (faixa azul), mobile-first
- Fonts: Space Grotesk (headings) + DM Sans (body) via Google Fonts
