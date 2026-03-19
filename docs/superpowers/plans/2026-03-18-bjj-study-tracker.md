# BJJ GI Study Tracker — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first BJJ study tracker SPA with Web Components, localStorage persistence, dark theme — covering study modules, game plans, training logs, and data management.

**Architecture:** Vanilla JS Web Components (Custom Elements) with hash-based routing. `storage.js` is the single source of truth wrapping localStorage. `data.js` holds all hardcoded content (modules, game plan trees, constants). Components communicate via Custom Events. No build step, no frameworks.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), Vanilla JS (ES modules, Custom Elements v1), Google Fonts, localStorage.

**Spec:** `docs/superpowers/specs/2026-03-18-bjj-study-tracker-design.md`

---

## File Map

| File | Responsibility | Created in Task |
|------|---------------|-----------------|
| `index.html` | Entry point, loads CSS + JS modules, defines `<app-shell>` | 1 |
| `css/style.css` | Dark theme, CSS variables, responsive layout, all styling | 1 |
| `js/storage.js` | localStorage wrapper, save/load/export/import, QuotaExceededError handling | 2 |
| `js/data.js` | Constants (POSITIONS, SUBMISSIONS, MOODS), module content, game plan trees | 3 |
| `js/app.js` | App initialization, registers all components | 4 |
| `components/app-shell.js` | Layout shell, bottom tabs (mobile) / sidebar (desktop), hash routing | 4 |
| `components/study-checkbox.js` | Checkbox with timestamp display, fires save event | 5 |
| `components/progress-bar.js` | Animated progress bar, accepts value/max attributes | 5 |
| `components/chip-select.js` | Multi-select chip component, accepts options, fires change event | 5 |
| `components/module-card.js` | Module summary card (title, priority tag, progress, counts) | 6 |
| `components/module-detail.js` | Full module view (concepts, resources, errors), back button | 6 |
| `components/tab-modules.js` | Modules tab: grid of cards, detail swap, channels section | 6 |
| `components/gameplan-node.js` | Single decision node (trigger → response), edit/note UI | 7 |
| `components/gameplan-tree.js` | Tree for one position, renders nodes with CSS connectors | 7 |
| `components/tab-gameplan.js` | Game Plan tab: position cards, expand to tree | 7 |
| `components/training-form.js` | Training log form with chips, mood selector | 8 |
| `components/training-log.js` | Chronological list of training entries, expand/filter | 8 |
| `components/training-stats.js` | Mini-dashboard stat cards | 8 |
| `components/tab-training.js` | Training tab: stats + log + focus submissions | 8 |
| `components/tab-config.js` | Config tab: export/import/reset, storage usage | 9 |

---

### Task 1: Foundation — HTML + CSS

**Files:**
- Create: `index.html`
- Create: `css/style.css`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BJJ GI Study Tracker</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <app-shell></app-shell>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create CSS foundation with variables and base styles**

Create `css/style.css` with:
- CSS custom properties for colors, spacing, typography, border-radius
- Dark theme colors: `--bg-primary: #0a0a0f`, `--bg-card: #141420`, `--bg-surface: #1a1a2e`, `--text-primary: #e8e8ed`, `--text-secondary: #8888a0`, `--accent-blue: #3b82f6`, `--accent-red: #ef4444`, `--accent-amber: #f59e0b`, `--accent-green: #22c55e`
- Base reset (box-sizing, margin, font-family)
- Typography: Space Grotesk for headings, DM Sans for body
- Utility classes: `.tag-urgente`, `.tag-alta`, `.tag-media`, `.tag-pt`, `.tag-en`
- Bottom tab bar styles (fixed bottom, 4 items, icon + label)
- Sidebar styles for desktop (fixed left, vertical nav)
- Media query breakpoint at 768px
- Card base styles (bg-card, border-radius, padding, subtle border)
- Transition/animation defaults

- [ ] **Step 3: Verify in browser**

Open `index.html` in browser. Should see dark background, no errors in console. Fonts should load.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: foundation — HTML entry + dark theme CSS"
```

---

### Task 2: Storage Layer

**Files:**
- Create: `js/storage.js`

- [ ] **Step 1: Implement storage.js**

```js
// js/storage.js
const STORAGE_KEY = 'bjj-tracker';
const SCHEMA_VERSION = 1;

function getDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    modules: {},
    gameplan: {},
    training: { logs: [], focusSubmissions: {} }
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const state = JSON.parse(raw);
    if (state.schemaVersion !== SCHEMA_VERSION) {
      console.warn('Schema version mismatch, returning default');
      return getDefaultState();
    }
    return state;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      document.dispatchEvent(new CustomEvent('storage-full'));
    }
    throw e;
  }
}

// Convenience: update a nested path and save
export function updateState(updater) {
  const state = loadState();
  updater(state);
  saveState(state);
  document.dispatchEvent(new CustomEvent('state-changed', { detail: state }));
  return state;
}

// Module checkbox helpers
export function toggleConcept(moduleSlug, conceptId, checked) {
  return updateState(s => {
    if (!s.modules[moduleSlug]) s.modules[moduleSlug] = { concepts: {}, resources: {} };
    s.modules[moduleSlug].concepts[conceptId] = checked
      ? { checked: true, date: new Date().toISOString() }
      : undefined;
    if (!checked) delete s.modules[moduleSlug].concepts[conceptId];
  });
}

export function toggleResource(moduleSlug, resourceId, checked) {
  return updateState(s => {
    if (!s.modules[moduleSlug]) s.modules[moduleSlug] = { concepts: {}, resources: {} };
    s.modules[moduleSlug].resources[resourceId] = checked
      ? { checked: true, date: new Date().toISOString() }
      : undefined;
    if (!checked) delete s.modules[moduleSlug].resources[resourceId];
  });
}

// Game plan helpers
// Notes and edits on hardcoded nodes are stored in a separate overrides map,
// since hardcoded nodes live in data.js and are NOT copied into storage.
// Storage structure: gameplan[position] = { overrides: { nodeId: { note, trigger, response } }, userNodes: { ... } }

export function saveGameplanNote(position, nodeId, note) {
  return updateState(s => {
    if (!s.gameplan[position]) s.gameplan[position] = { overrides: {}, userNodes: {} };
    // For user nodes, save directly on the node
    if (s.gameplan[position].userNodes[nodeId]) {
      s.gameplan[position].userNodes[nodeId].note = note;
    } else {
      // For hardcoded nodes, save in overrides map
      if (!s.gameplan[position].overrides[nodeId]) s.gameplan[position].overrides[nodeId] = {};
      s.gameplan[position].overrides[nodeId].note = note;
    }
  });
}

export function editGameplanNode(position, nodeId, trigger, response) {
  return updateState(s => {
    if (!s.gameplan[position]) s.gameplan[position] = { overrides: {}, userNodes: {} };
    // For user nodes, edit directly
    if (s.gameplan[position].userNodes[nodeId]) {
      s.gameplan[position].userNodes[nodeId].trigger = trigger;
      s.gameplan[position].userNodes[nodeId].response = response;
    } else {
      // For hardcoded nodes, save edits in overrides
      if (!s.gameplan[position].overrides[nodeId]) s.gameplan[position].overrides[nodeId] = {};
      s.gameplan[position].overrides[nodeId].trigger = trigger;
      s.gameplan[position].overrides[nodeId].response = response;
    }
  });
}

export function addUserNode(position, node) {
  return updateState(s => {
    if (!s.gameplan[position]) s.gameplan[position] = { overrides: {}, userNodes: {} };
    s.gameplan[position].userNodes[node.id] = node;
  });
}

export function deleteUserNode(position, nodeId) {
  return updateState(s => {
    if (s.gameplan[position]?.userNodes[nodeId]) {
      delete s.gameplan[position].userNodes[nodeId];
    }
  });
}

// Training helpers
export function addTrainingLog(entry) {
  return updateState(s => {
    s.training.logs.unshift(entry); // newest first
  });
}

export function deleteTrainingLog(logId) {
  return updateState(s => {
    s.training.logs = s.training.logs.filter(l => l.id !== logId);
  });
}

export function updateFocusSubmission(slug, data) {
  return updateState(s => {
    s.training.focusSubmissions[slug] = data;
  });
}

export function removeFocusSubmission(slug) {
  return updateState(s => {
    delete s.training.focusSubmissions[slug];
  });
}

// Export/Import
export function exportData() {
  const state = loadState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `bjj-tracker-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(jsonString) {
  const data = JSON.parse(jsonString);
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error('Versão incompatível do backup');
  }
  saveState(data);
  document.dispatchEvent(new CustomEvent('state-changed', { detail: data }));
  return data;
}

export function resetAll() {
  const state = getDefaultState();
  saveState(state);
  document.dispatchEvent(new CustomEvent('state-changed', { detail: state }));
  return state;
}

export function getStorageUsage() {
  const raw = localStorage.getItem(STORAGE_KEY) || '';
  return new Blob([raw]).size;
}
```

- [ ] **Step 2: Verify in browser console**

Open browser console, run:
```js
import('./js/storage.js').then(s => { console.log(s.loadState()); })
```
Should print default state object with `schemaVersion: 1`.

- [ ] **Step 3: Commit**

```bash
git add js/storage.js
git commit -m "feat: storage layer — localStorage wrapper with export/import"
```

---

### Task 3: Data Layer — Constants + Module Content + Game Plan Trees

**Files:**
- Create: `js/data.js`

- [ ] **Step 1: Create data.js with constants**

Export `POSITIONS`, `SUBMISSIONS`, `MOODS` arrays exactly as defined in the spec (Section 6).

- [ ] **Step 2: Add display label maps and MODULES array (Modules 1-3)**

Add label maps used across the app:
```js
export const POSITION_LABELS = {
  "montada": "Montada", "costas": "Costas", "side-control": "Side Control",
  "meia-guarda": "Meia-guarda", "guarda": "Guarda", "passagem": "Passagem",
  "turtle": "Turtle", "norte-sul": "Norte-Sul"
};

export const SUBMISSION_LABELS = {
  "bow-and-arrow": "Bow and Arrow", "zipper-choke": "Zipper Choke",
  "sliding-collar": "Sliding Collar", "cross-choke": "Cross Choke",
  "mata-leao": "Mata Leão", "ezekiel": "Ezekiel pela Manga",
  "guilhotina": "Guilhotina", "omoplata": "Omoplata",
  "loop-choke": "Loop Choke", "clock-choke": "Clock Choke"
};
```

Then start the `MODULES` array with modules 1-3. Each module object shape:
```js
{
  slug: "bow-and-arrow",
  title: "Corrigir o Bow and Arrow",
  priority: "urgente",  // "urgente" | "alta" | "media"
  concepts: [
    { id: "bow-and-arrow-c1", text: "Mão DIREITA na gola → cair pro lado DIREITO..." },
    // all concepts for this module from spec Section 2
  ],
  resources: [
    { id: "bow-and-arrow-r1", type: "video", lang: "pt", title: "Buchecha — Bow and Arrow passo a passo (GI)", url: "https://www.youtube.com/watch?v=TfDt15dbgLk" },
    // all resources for this module from spec Section 2
  ],
  commonErrors: [  // only Module 1 has this
    "Cair pro lado errado (cria espaço pro escape)",
    // all 5 errors from spec
  ]
}
```

Populate modules 1 (Bow and Arrow), 2 (Mount Retention), 3 (Back Control) with ALL their concepts and resources from the spec.

- [ ] **Step 3: Add MODULES 4-7**

Continue the `MODULES` array with modules 4 (Contra Pesados), 5 (Grip Fighting), 6 (Energia/Respiração), 7 (Side Control por Cima). Module 7 resources should have `url: null` and `placeholder: true` flag. All other modules: copy all concepts and resources from spec Section 2.

- [ ] **Step 4: Add GAMEPLAN_TREES — Costas + Montada**

```js
export const GAMEPLAN_TREES = {
  costas: {
    title: "Costas (você atrás)",
    rootId: "costas-n1",
    nodes: {
      "costas-n1": { id: "costas-n1", parentId: null, trigger: null, response: "Costas com seatbelt", children: ["costas-n2", "costas-n3", "costas-n4", "costas-n5", "costas-n6"], isUserCreated: false, note: "" },
      "costas-n2": { id: "costas-n2", parentId: "costas-n1", trigger: "Ele defende a gola", response: "troca de lado (underhook vira mão de choke)", children: [], isUserCreated: false, note: "" },
      "costas-n3": { id: "costas-n3", parentId: "costas-n1", trigger: "Ele tenta sentar no chão", response: "body triangle + puxar pra trás", children: [], isUserCreated: false, note: "" },
      "costas-n4": { id: "costas-n4", parentId: "costas-n1", trigger: "Ele descola seatbelt", response: "recompor grip ANTES que vire", children: [], isUserCreated: false, note: "" },
      "costas-n5": { id: "costas-n5", parentId: "costas-n1", trigger: "Gola aberta", response: "Bow and Arrow", children: [], isUserCreated: false, note: "" },
      "costas-n6": { id: "costas-n6", parentId: "costas-n1", trigger: "Gola fechada", response: "Mata Leão / Zipper Choke", children: [], isUserCreated: false, note: "" }
    }
  },
  montada: {
    title: "Montada",
    rootId: "montada-n1",
    nodes: {
      "montada-n1": { id: "montada-n1", parentId: null, trigger: null, response: "Low Mount", children: ["montada-n2", "montada-n3", "montada-n4", "montada-n5"], isUserCreated: false, note: "" },
      "montada-n2": { id: "montada-n2", parentId: "montada-n1", trigger: "Ele faz upa", response: "postar mão + surfar → volta", children: [], isUserCreated: false, note: "" },
      "montada-n3": { id: "montada-n3", parentId: "montada-n1", trigger: "Ele faz elbow-knee", response: "subir pra High Mount", children: [], isUserCreated: false, note: "" },
      "montada-n4": { id: "montada-n4", parentId: "montada-n1", trigger: "Ele fica parado", response: "atacar gola (cross choke / ezekiel)", children: [], isUserCreated: false, note: "" },
      "montada-n5": { id: "montada-n5", parentId: "montada-n1", trigger: "Ele coloca cotovelo", response: "Technical Mount", children: ["montada-n6", "montada-n7"], isUserCreated: false, note: "" },
      "montada-n6": { id: "montada-n6", parentId: "montada-n5", trigger: null, response: "Bow and Arrow", children: [], isUserCreated: false, note: "" },
      "montada-n7": { id: "montada-n7", parentId: "montada-n5", trigger: null, response: "Armbar (se ele for mais leve)", children: [], isUserCreated: false, note: "" }
    }
  }
};
```

- [ ] **Step 5: Add GAMEPLAN_TREES — Side Control + Half Guard**

Add remaining positions to `GAMEPLAN_TREES`:
```js
  "side-control": {
    title: "Side Control (você em cima)",
    rootId: "sc-n1",
    nodes: {
      "sc-n1": { id: "sc-n1", parentId: null, trigger: null, response: "Kuzure / 100 kilos", children: ["sc-n2", "sc-n3", "sc-n4", "sc-n5"], isUserCreated: false, note: "" },
      "sc-n2": { id: "sc-n2", parentId: "sc-n1", trigger: "Ele empurra", response: "montar (knee slide)", children: [], isUserCreated: false, note: "" },
      "sc-n3": { id: "sc-n3", parentId: "sc-n1", trigger: "Ele vira de costas", response: "back take", children: [], isUserCreated: false, note: "" },
      "sc-n4": { id: "sc-n4", parentId: "sc-n1", trigger: "Ele fica parado", response: "norte-sul / kimura", children: [], isUserCreated: false, note: "" },
      "sc-n5": { id: "sc-n5", parentId: "sc-n1", trigger: "Ele tenta recompor guarda", response: "joelho na cintura + crossface", children: [], isUserCreated: false, note: "" }
    }
  },
  "meia-guarda": {
    title: "Half Guard (você por cima)",
    rootId: "hg-n1",
    nodes: {
      "hg-n1": { id: "hg-n1", parentId: null, trigger: null, response: "Half Guard top", children: ["hg-n2", "hg-n3", "hg-n4"], isUserCreated: false, note: "" },
      "hg-n2": { id: "hg-n2", parentId: "hg-n1", trigger: "Ele tem underhook", response: "whizzer + crossface", children: [], isUserCreated: false, note: "" },
      "hg-n3": { id: "hg-n3", parentId: "hg-n1", trigger: "Ele flat", response: "shoulder pressure + liberar perna", children: [], isUserCreated: false, note: "" },
      "hg-n4": { id: "hg-n4", parentId: "hg-n1", trigger: "Ele puxa deep half", response: "sprawl + back step", children: [], isUserCreated: false, note: "" }
    }
  }
```

- [ ] **Step 6: Add CHANNELS array**

```js
export const CHANNELS = [
  { name: "Feu BJJ", lang: "pt", description: "Maior canal BR de BJJ, GI, fundamentais" },
  { name: "Art of Jiu-Jitsu / AOJ", lang: "en", description: "Irmãos Mendes, GI 100%, sistemático" },
  { name: "Chewjitsu", lang: "en", description: "Blue belt tips, retenção, mentalidade" },
  { name: "Lachlan Giles / Submeta", lang: "en", description: "Giant killer, metódico, GI e NoGI" },
  { name: "Bernardo Faria", lang: "en", description: "5x mundial, sotaque BR fácil de entender" },
  { name: "BJJ Scout", lang: "en", description: "Análise visual pura, sem barreira de idioma" },
  { name: "Jordan Teaches Jiujitsu", lang: "en", description: "Conceitual, pronúncia clara" },
  { name: "Stephan Kesting", lang: "en", description: "Educacional, breathing, fundamentos" },
  { name: "Keenan Cornelius", lang: "en", description: "Jogo de lapela, worm guard, GI focado" },
  { name: "IBJJF Oficial", lang: null, description: "Lutas completas de mundiais" }
];
```

- [ ] **Step 7: Verify — import data.js in console and check counts**

```js
import('./js/data.js').then(d => {
  console.log('Modules:', d.MODULES.length);  // should be 7
  console.log('Positions:', d.POSITIONS.length);  // should be 8
  console.log('Submissions:', d.SUBMISSIONS.length);  // should be 10
  console.log('Gameplan positions:', Object.keys(d.GAMEPLAN_TREES).length);  // should be 4
  console.log('Channels:', d.CHANNELS.length);  // should be 10
});
```

- [ ] **Step 8: Commit**

```bash
git add js/data.js
git commit -m "feat: data layer — modules, game plan trees, constants, channels"
```

---

### Task 4: App Shell + Routing

**Files:**
- Create: `components/app-shell.js`
- Create: `js/app.js`

- [ ] **Step 1: Create app-shell.js**

Web Component `<app-shell>` that:
- Renders header ("BJJ GI Study Tracker" + subtitle "Faixa Azul . 85kg . Foco em GI")
- Renders a `<main>` content area where tab content is swapped
- Renders bottom tab bar (mobile) with 4 tabs: Módulos (book icon), Game Plan (map icon), Treino (dumbbell icon), Config (gear icon) — use simple SVG or unicode icons
- On desktop (>= 768px), renders sidebar instead of bottom bar via CSS
- Listens to `hashchange` and swaps the active tab content
- Sets `#modules` as default hash if none present
- Highlights the active tab
- Uses unicode icons: Módulos = "📚", Game Plan = "🗺️", Treino = "🥋", Config = "⚙️"

- [ ] **Step 2: Create app.js**

```js
// js/app.js
// Import and register all components
import './components/app-shell.js';
// (future component imports will be added here as tasks progress)
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Should see:
- Dark background with header text
- Bottom tab bar with 4 tabs (on mobile viewport)
- Sidebar on wide viewport
- Clicking tabs changes URL hash and highlights active tab
- Empty content area for each tab

- [ ] **Step 4: Commit**

```bash
git add components/app-shell.js js/app.js
git commit -m "feat: app shell — layout, tabs, hash routing"
```

---

### Task 5: Shared Components — Checkbox, Progress Bar, Chip Select

**Files:**
- Create: `components/study-checkbox.js`
- Create: `components/progress-bar.js`
- Create: `components/chip-select.js`

- [ ] **Step 1: Create study-checkbox.js**

Web Component `<study-checkbox>` with attributes:
- `label` — text to display
- `checked` — boolean
- `date` — ISO date string (shown as "Marcado em DD/MM/YYYY" when checked)
- `item-id` — the concept/resource ID
- `module-slug` — parent module slug

Behavior:
- Renders a styled checkbox with label text
- When toggled, dispatches `CustomEvent('checkbox-toggle', { detail: { id, moduleSlug, checked }, bubbles: true })`
- When checked, shows date in small gray text below label
- Smooth animation on check (scale + color transition)

- [ ] **Step 2: Create progress-bar.js**

Web Component `<progress-bar>` with attributes:
- `value` — current number
- `max` — total number
- `label` — optional text (e.g., "5/8 conceitos")

Renders an animated bar that fills proportionally. Uses CSS transition on width. Bar color uses `--accent-blue`.

- [ ] **Step 3: Create chip-select.js**

Web Component `<chip-select>` with:
- Property `options` — array of `{ value, label }` (set via JS, not attribute)
- Property `selected` — array of selected values
- Attribute `name` — identifier for the chip group

Behavior:
- Renders chips in a flex-wrap row
- Clicking a chip toggles selection (add/remove from selected array)
- Selected chips get accent color, unselected are muted
- Dispatches `CustomEvent('chips-changed', { detail: { name, selected }, bubbles: true })`

Property setting: parent components set `options` and `selected` via JS property setters (not attributes). The component uses a setter that triggers re-render:
```js
set options(val) { this._options = val; this.render(); }
get options() { return this._options || []; }
set selected(val) { this._selected = val; this.render(); }
get selected() { return this._selected || []; }
```

- [ ] **Step 4: Verify — add test instances in app-shell temporarily**

Temporarily render one of each component in app-shell to verify visuals and interactions. Remove after verification.

- [ ] **Step 5: Commit**

```bash
git add components/study-checkbox.js components/progress-bar.js components/chip-select.js
git commit -m "feat: shared components — study-checkbox, progress-bar, chip-select"
```

---

### Task 6: Modules Tab — Cards, Detail View, Channels

**Files:**
- Create: `components/module-card.js`
- Create: `components/module-detail.js`
- Create: `components/tab-modules.js`
- Modify: `js/app.js` — add imports
- Modify: `components/app-shell.js` — render `<tab-modules>` for `#modules` hash

- [ ] **Step 1: Create module-card.js**

Web Component `<module-card>` with property `module` (object from `MODULES` array).

Renders:
- Module title
- Priority tag (`.tag-urgente`, `.tag-alta`, `.tag-media`)
- `<progress-bar>` showing combined progress (concepts checked + resources checked / total)
- Count text: "X/Y conceitos . Z/W recursos"
- Click handler dispatches `CustomEvent('module-select', { detail: { slug }, bubbles: true })`
- When 100% complete: add checkmark badge and green-tinted border

Reads checked state from `storage.loadState()` to calculate progress.

- [ ] **Step 2: Create module-detail.js**

Web Component `<module-detail>` with property `module`.

Renders:
- Back button (arrow + "Voltar") at top — dispatches `CustomEvent('module-back', { bubbles: true })`
- Module title + priority tag
- **Conceitos-Chave section:** list of `<study-checkbox>` components for each concept
- **Recursos section:** list of `<study-checkbox>` components for each resource, plus:
  - Type icon (🎥/📝/💰)
  - Clickable title (opens URL in new tab, or shows "Em breve" if `placeholder: true`)
  - Language tag (`.tag-pt` or `.tag-en`)
- **Erros Comuns section** (if module has `commonErrors`): styled warning cards (red-tinted background, numbered list)

Listens for `checkbox-toggle` events and calls appropriate `storage.toggleConcept()` or `storage.toggleResource()`.

- [ ] **Step 3: Create tab-modules.js**

Web Component `<tab-modules>` that:
- Shows grid of `<module-card>` components (2 columns desktop, 1 column mobile)
- Overall progress bar at top (all modules combined)
- Listens for `module-select` event → swaps grid for `<module-detail>` view
- Listens for `module-back` event → swaps back to grid
- At bottom of grid view: "Canais Recomendados" section rendering `CHANNELS` data as styled list items with name, lang tag, description, link
- Listens for `state-changed` event to re-render progress

- [ ] **Step 4: Wire into app-shell**

Update `app-shell.js` to render `<tab-modules>` when hash is `#modules`.
Update `js/app.js` to import all new components.

- [ ] **Step 5: Verify in browser**

- Grid of 7 module cards visible
- Click a card → detail view with concepts, resources, checkboxes
- Check a checkbox → refreshes, shows date, persists on reload
- Back button returns to grid
- Progress bars update
- Channels section visible at bottom
- Responsive: 2 columns on desktop, 1 on mobile

- [ ] **Step 6: Commit**

```bash
git add components/module-card.js components/module-detail.js components/tab-modules.js
git add -u js/app.js components/app-shell.js
git commit -m "feat: modules tab — cards, detail view, checkboxes, channels"
```

---

### Task 7: Game Plan Tab

**Files:**
- Create: `components/gameplan-node.js`
- Create: `components/gameplan-tree.js`
- Create: `components/tab-gameplan.js`
- Modify: `js/app.js` — add imports
- Modify: `components/app-shell.js` — render `<tab-gameplan>` for `#gameplan` hash

- [ ] **Step 1: Create gameplan-node.js**

Web Component `<gameplan-node>` with property `node` (node object).

Renders:
- If has trigger: "Se: {trigger}" in bold, "→ {response}" below
- If root node (no trigger): just the response text as title
- Edit icon button — toggles inline edit mode for trigger/response text
- Note icon button — toggles a textarea for personal notes
- If `isUserCreated`: dashed border style
- If `isUserCreated`: delete icon button (trash) — dispatches `CustomEvent('node-delete', { detail: { nodeId }, bubbles: true })`
- Save button for edits — dispatches `CustomEvent('node-edit', { detail: { nodeId, trigger, response }, bubbles: true })`
- Note save — dispatches `CustomEvent('node-note', { detail: { nodeId, note }, bubbles: true })`
- Children rendered as indented nested `<gameplan-node>` elements

- [ ] **Step 2: Create gameplan-tree.js**

Web Component `<gameplan-tree>` with property `position` (position slug, e.g., "costas").

Behavior:
- Loads hardcoded nodes from `GAMEPLAN_TREES[position]`
- Applies overrides from `storage.loadState().gameplan[position]?.overrides` (merges note/trigger/response edits onto hardcoded node copies)
- Merges user nodes from `storage.loadState().gameplan[position]?.userNodes`
- Renders root node and recursively renders children as `<gameplan-node>`
- CSS connectors: left border line + small horizontal line before each child node
- "Adicionar decisão" button at bottom — shows mini-form (parent select, trigger text, response text) → calls `storage.addUserNode()` with `crypto.randomUUID()` as ID
- Listens for `node-delete` → calls `storage.deleteUserNode()`
- Listens for `node-note` → calls `storage.saveGameplanNote()`
- Listens for `node-edit` → calls `storage.editGameplanNode()`
- Re-renders on `state-changed`

- [ ] **Step 3: Create tab-gameplan.js**

Web Component `<tab-gameplan>` that:
- Renders a card for each position in `GAMEPLAN_TREES`
- Each card shows position title, node count
- Click card → expands to show `<gameplan-tree>` (accordion style, one at a time)
- Click again → collapses

- [ ] **Step 4: Wire into app-shell**

Update `app-shell.js` to render `<tab-gameplan>` when hash is `#gameplan`.
Update `js/app.js` to import new components.

- [ ] **Step 5: Verify in browser**

- 4 position cards visible
- Click "Costas" → tree expands with nodes and CSS connectors
- Nodes show trigger → response text
- Click note icon → textarea appears, save persists
- "Adicionar decisão" → new node with dashed border appears
- Delete user node → disappears
- Data persists on reload

- [ ] **Step 6: Commit**

```bash
git add components/gameplan-node.js components/gameplan-tree.js components/tab-gameplan.js
git add -u js/app.js components/app-shell.js
git commit -m "feat: game plan tab — decision trees with CRUD and notes"
```

---

### Task 8: Training Tab — Form, Log, Stats

**Files:**
- Create: `components/training-form.js`
- Create: `components/training-log.js`
- Create: `components/training-stats.js`
- Create: `components/tab-training.js`
- Modify: `js/app.js` — add imports
- Modify: `components/app-shell.js` — render `<tab-training>` for `#training` hash

- [ ] **Step 1a: Create training-form.js — form rendering**

Web Component `<training-form>` that renders the form fields:
- Date input (default: today, `type="date"`)
- Duration select (`<select>` with options: 30min, 1h, 1h30, 2h)
- Notes textarea (2-3 lines, `rows="3"`)
- `<chip-select name="positions-got">` for "Posições que peguei" — options built from `POSITIONS` + `POSITION_LABELS` imported from `data.js`
- `<chip-select name="positions-lost">` for "Posições que perdi" — same options
- `<chip-select name="subs-attempted">` for "Finalizações que tentei" — options from `SUBMISSIONS` + `SUBMISSION_LABELS`
- `<chip-select name="subs-landed">` for "Finalizações que peguei" — same options
- Mood selector: 4 buttons rendering each `MOODS` entry, clicking one sets `.selected` class
- "Salvar Treino" button

Chip-select `options` property is set in `connectedCallback` via JS: `this.querySelector('chip-select[name="positions-got"]').options = POSITIONS.map(p => ({ value: p, label: POSITION_LABELS[p] }))`.

- [ ] **Step 1b: Create training-form.js — submission logic**

On "Salvar Treino" click:
1. Validate date is present (show inline error if not)
2. Collect all chip selections from each `<chip-select>` via `.selected` property
3. Get mood from `.selected` button
4. Build training log entry:
```js
{
  id: crypto.randomUUID(),
  date: dateInput.value,
  duration: durationSelect.value,
  notes: notesTextarea.value,
  positionsGot: positionsGotChips.selected,
  positionsLost: positionsLostChips.selected,
  submissionsAttempted: subsAttemptedChips.selected,
  submissionsLanded: subsLandedChips.selected,
  mood: selectedMood,
  createdAt: new Date().toISOString()
}
```
5. Call `storage.addTrainingLog(entry)`
6. Dispatch `CustomEvent('training-saved', { bubbles: true })`
7. Reset form (clear all fields, deselect chips, reset mood)

- [ ] **Step 2: Create training-log.js**

Web Component `<training-log>`:
- Period filter buttons: "Semana", "Mês", "Tudo" (default: Tudo)
- Reads `storage.loadState().training.logs`
- Filters by selected period
- Renders each log as a compact card: date (DD/MM), duration, mood emoji, position chips
- Click card → expands to show notes, submissions attempted/landed
- Delete button per entry (with confirm) → calls `storage.deleteTrainingLog()`
- Empty state: motivational message "Nenhum treino registrado ainda. Bora treinar! 🥋"
- Listens for `state-changed` to re-render

- [ ] **Step 3: Create training-stats.js**

Web Component `<training-stats>`:
- Reads all training logs from storage
- Calculates and renders stat cards:
  - Total treinos (last 4 weeks count + total)
  - Streak (consecutive weeks with at least 1 training)
  - Top 3 posições pegadas (from `positionsGot` across all logs)
  - Top 3 posições perdidas (from `positionsLost`)
  - Taxa de finalização (sum of all `submissionsLanded.length` / `submissionsAttempted.length`)
  - Top 3 finalizações efetivas (by individual success rate)
- Renders as a horizontal-scroll row of cards on mobile, grid on desktop
- If no logs exist, shows "Registre treinos para ver suas estatísticas"

- [ ] **Step 4: Create tab-training.js**

Web Component `<tab-training>` that composes:
- `<training-stats>` at top
- "Registrar Treino" button → toggles `<training-form>` visibility (hidden by default)
- `<training-log>` below
- **"Finalizações em Foco" sub-section:**
  - `<chip-select>` to pick which submissions are in focus
  - For each focused submission: card with name, tried/landed counters (+/- buttons), notes textarea, auto-calculated success rate
  - Uses `storage.updateFocusSubmission()` and `storage.removeFocusSubmission()`
- Listens for `training-saved` → hides form, refreshes log and stats

- [ ] **Step 5: Wire into app-shell**

Update `app-shell.js` to render `<tab-training>` when hash is `#training`.
Update `js/app.js` to import new components.

- [ ] **Step 6: Verify in browser**

- Stats section shows empty state message
- Click "Registrar Treino" → form appears
- Fill form, select chips, pick mood, save → entry appears in log
- Stats update with data
- Expand log entry → shows full details
- Focus submissions: select a submission, increment counters, see rate
- Persist on reload
- Filter log by period

- [ ] **Step 7: Commit**

```bash
git add components/training-form.js components/training-log.js components/training-stats.js components/tab-training.js
git add -u js/app.js components/app-shell.js
git commit -m "feat: training tab — log form, stats dashboard, focus submissions"
```

---

### Task 9: Config Tab

**Files:**
- Create: `components/tab-config.js`
- Modify: `js/app.js` — add import
- Modify: `components/app-shell.js` — render `<tab-config>` for `#config` hash

- [ ] **Step 1: Create tab-config.js**

Web Component `<tab-config>`:
- **Storage usage** display: "Usando X KB de ~5 MB" with a small bar
- **Exportar Dados** button → calls `storage.exportData()` (triggers JSON download)
- **Importar Dados** button → opens hidden `<input type="file" accept=".json">`, reads file, parses JSON, shows preview ("X treinos, Y conceitos marcados — Importar?"), on confirm calls `storage.importData()`
- **Resetar Tudo** button (red, at bottom, separated):
  - First click: changes to "Tem certeza? Clique novamente para confirmar"
  - Second click within 3 seconds: calls `storage.resetAll()`, shows success toast
  - After 3 seconds without second click: reverts to original state
- Listens for `storage-full` event → shows warning banner: "Storage cheio. Exporte seus dados e limpe treinos antigos."
- Listens for `state-changed` → re-render storage usage

- [ ] **Step 2: Wire into app-shell**

Update `app-shell.js` to render `<tab-config>` when hash is `#config`.
Update `js/app.js` to import.

- [ ] **Step 3: Verify in browser**

- Storage usage shows correctly
- Export downloads a valid JSON file
- Import: pick exported file → preview shows → confirm → data loads
- Reset: double-click flow works, data is cleared
- All tabs still work after reset

- [ ] **Step 4: Commit**

```bash
git add components/tab-config.js
git add -u js/app.js components/app-shell.js
git commit -m "feat: config tab — export/import/reset, storage usage"
```

---

### Task 10: Polish — Responsive, Animations, Empty States, Completion Badge

**Files:**
- Modify: `css/style.css`
- Modify: various components as needed

- [ ] **Step 1: Responsive audit**

Test all tabs at 375px (mobile), 768px (tablet), 1280px (desktop) widths:
- Bottom tab bar visible only on mobile, sidebar on desktop
- Cards stack on mobile, grid on desktop
- Training form is usable on mobile (chips don't overflow)
- Game plan tree nodes don't overflow on small screens
- Fix any layout issues found

- [ ] **Step 2: Animations**

- Checkbox: on check, brief scale(1.2) + color pulse animation
- Progress bars: `transition: width 0.4s ease`
- Tab content: subtle fade-in on switch (`opacity 0 → 1`, 150ms)
- Module cards: hover effect on desktop (subtle lift/shadow)
- Chip select: toggle animation (background-color transition)

- [ ] **Step 3: Empty states**

Verify each section has appropriate empty state:
- Training log: "Nenhum treino registrado ainda. Bora treinar! 🥋"
- Training stats: "Registre treinos para ver suas estatísticas"
- Focus submissions: "Selecione finalizações para acompanhar"
- Game plan notes: placeholder text in textarea "Suas anotações..."

- [ ] **Step 4: Completion badges**

When a module reaches 100%:
- Module card gets a green checkmark overlay and subtle green-tinted border
- Progress bar turns green

- [ ] **Step 5: Final browser test**

Full walkthrough:
1. Open app → Modules tab, all 7 cards visible
2. Click module → detail view, check concepts and resources
3. Back → progress updated on card
4. Game Plan tab → expand position, add node, add note
5. Training tab → register training, check stats
6. Focus submission → increment counters
7. Config → export, then reset, then import backup
8. Test on mobile viewport
9. Reload → all data persists

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "feat: polish — responsive fixes, animations, empty states, badges"
```

---

### Task 11: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with architecture and patterns"
```
