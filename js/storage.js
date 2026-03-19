// js/storage.js
const STORAGE_KEY = 'bjj-tracker';
const SCHEMA_VERSION = 1;

function getDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    modules: {},
    gameplan: {},
    training: { logs: [], focusSubmissions: {} },
    notes: []
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

// Notes helpers
export function addNote(note) {
  return updateState(s => {
    if (!s.notes) s.notes = [];
    s.notes.unshift(note);
  });
}

export function deleteNote(noteId) {
  return updateState(s => {
    if (!s.notes) s.notes = [];
    s.notes = s.notes.filter(n => n.id !== noteId);
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
