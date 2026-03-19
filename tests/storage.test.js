import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadState, saveState, updateState, resetAll,
  toggleConcept, toggleResource,
  saveGameplanNote, editGameplanNode, addUserNode, deleteUserNode,
  addTrainingLog, deleteTrainingLog,
  updateFocusSubmission, removeFocusSubmission,
  importData, getStorageUsage,
} from '../js/storage.js';

beforeEach(() => {
  localStorage.clear();
});

describe('storage — state basics', () => {
  it('loadState returns default when empty', () => {
    const state = loadState();
    expect(state.schemaVersion).toBe(1);
    expect(state.modules).toEqual({});
    expect(state.gameplan).toEqual({});
    expect(state.training.logs).toEqual([]);
    expect(state.training.focusSubmissions).toEqual({});
  });

  it('saveState + loadState roundtrip', () => {
    const state = loadState();
    state.modules['test'] = { concepts: {}, resources: {} };
    saveState(state);
    const loaded = loadState();
    expect(loaded.modules['test']).toEqual({ concepts: {}, resources: {} });
  });

  it('loadState returns default on bad JSON', () => {
    localStorage.setItem('bjj-tracker', 'not-json');
    const state = loadState();
    expect(state.schemaVersion).toBe(1);
  });

  it('loadState returns default on wrong schema version', () => {
    localStorage.setItem('bjj-tracker', JSON.stringify({ schemaVersion: 999 }));
    const state = loadState();
    expect(state.schemaVersion).toBe(1);
    expect(state.modules).toEqual({});
  });

  it('updateState dispatches state-changed event', () => {
    let fired = false;
    document.addEventListener('state-changed', () => { fired = true; }, { once: true });
    updateState(s => { s.modules['x'] = {}; });
    expect(fired).toBe(true);
  });

  it('resetAll clears all data', () => {
    toggleConcept('bow-and-arrow', 'c1', true);
    resetAll();
    const state = loadState();
    expect(state.modules).toEqual({});
  });

  it('getStorageUsage returns bytes > 0 after save', () => {
    saveState(loadState());
    expect(getStorageUsage()).toBeGreaterThan(0);
  });
});

describe('storage — modules', () => {
  it('toggleConcept checks and records date', () => {
    toggleConcept('bow-and-arrow', 'c1', true);
    const state = loadState();
    expect(state.modules['bow-and-arrow'].concepts['c1'].checked).toBe(true);
    expect(state.modules['bow-and-arrow'].concepts['c1'].date).toBeTruthy();
  });

  it('toggleConcept unchecks and removes entry', () => {
    toggleConcept('bow-and-arrow', 'c1', true);
    toggleConcept('bow-and-arrow', 'c1', false);
    const state = loadState();
    expect(state.modules['bow-and-arrow'].concepts['c1']).toBeUndefined();
  });

  it('toggleResource works the same way', () => {
    toggleResource('bow-and-arrow', 'r1', true);
    const state = loadState();
    expect(state.modules['bow-and-arrow'].resources['r1'].checked).toBe(true);

    toggleResource('bow-and-arrow', 'r1', false);
    const state2 = loadState();
    expect(state2.modules['bow-and-arrow'].resources['r1']).toBeUndefined();
  });
});

describe('storage — gameplan', () => {
  it('saveGameplanNote stores note for hardcoded node in overrides', () => {
    saveGameplanNote('costas', 'costas-n1', 'minha nota');
    const state = loadState();
    expect(state.gameplan.costas.overrides['costas-n1'].note).toBe('minha nota');
  });

  it('editGameplanNode stores trigger/response in overrides', () => {
    editGameplanNode('costas', 'costas-n2', 'novo trigger', 'nova response');
    const state = loadState();
    expect(state.gameplan.costas.overrides['costas-n2'].trigger).toBe('novo trigger');
    expect(state.gameplan.costas.overrides['costas-n2'].response).toBe('nova response');
  });

  it('addUserNode + deleteUserNode', () => {
    const node = { id: 'user-1', parentId: 'costas-n1', trigger: 'test', response: 'resp', children: [], isUserCreated: true, note: '' };
    addUserNode('costas', node);
    let state = loadState();
    expect(state.gameplan.costas.userNodes['user-1']).toBeTruthy();

    deleteUserNode('costas', 'user-1');
    state = loadState();
    expect(state.gameplan.costas.userNodes['user-1']).toBeUndefined();
  });

  it('saveGameplanNote on user node saves directly on node', () => {
    const node = { id: 'user-2', parentId: 'costas-n1', trigger: 't', response: 'r', children: [], isUserCreated: true, note: '' };
    addUserNode('costas', node);
    saveGameplanNote('costas', 'user-2', 'user note');
    const state = loadState();
    expect(state.gameplan.costas.userNodes['user-2'].note).toBe('user note');
  });
});

describe('storage — training', () => {
  const makeEntry = (id = 'log-1') => ({
    id, date: '2026-03-18', duration: '1h', notes: 'treino bom',
    positionsGot: ['costas'], positionsLost: ['side-control'],
    submissionsAttempted: ['bow-and-arrow'], submissionsLanded: ['bow-and-arrow'],
    mood: 'fire', createdAt: new Date().toISOString()
  });

  it('addTrainingLog adds entry at front', () => {
    addTrainingLog(makeEntry('a'));
    addTrainingLog(makeEntry('b'));
    const state = loadState();
    expect(state.training.logs.length).toBe(2);
    expect(state.training.logs[0].id).toBe('b');
  });

  it('deleteTrainingLog removes by id', () => {
    addTrainingLog(makeEntry('a'));
    addTrainingLog(makeEntry('b'));
    deleteTrainingLog('a');
    const state = loadState();
    expect(state.training.logs.length).toBe(1);
    expect(state.training.logs[0].id).toBe('b');
  });

  it('updateFocusSubmission + removeFocusSubmission', () => {
    updateFocusSubmission('bow-and-arrow', { tried: 5, landed: 3, notes: 'bom' });
    let state = loadState();
    expect(state.training.focusSubmissions['bow-and-arrow'].tried).toBe(5);

    removeFocusSubmission('bow-and-arrow');
    state = loadState();
    expect(state.training.focusSubmissions['bow-and-arrow']).toBeUndefined();
  });
});

describe('storage — import/export', () => {
  it('importData loads valid data', () => {
    const data = { schemaVersion: 1, modules: { test: {} }, gameplan: {}, training: { logs: [], focusSubmissions: {} } };
    importData(JSON.stringify(data));
    const state = loadState();
    expect(state.modules.test).toEqual({});
  });

  it('importData rejects wrong schema version', () => {
    const data = { schemaVersion: 99 };
    expect(() => importData(JSON.stringify(data))).toThrow('Versão incompatível');
  });
});
