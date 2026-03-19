import { describe, it, expect } from 'vitest';
import {
  POSITIONS, SUBMISSIONS, MOODS,
  POSITION_LABELS, SUBMISSION_LABELS,
  MODULES, GAMEPLAN_TREES, CHANNELS
} from '../js/data.js';

describe('data — constants', () => {
  it('POSITIONS has 8 entries', () => {
    expect(POSITIONS).toHaveLength(8);
  });

  it('SUBMISSIONS has 10 entries', () => {
    expect(SUBMISSIONS).toHaveLength(10);
  });

  it('MOODS has 4 entries with value and emoji', () => {
    expect(MOODS).toHaveLength(4);
    MOODS.forEach(m => {
      expect(m).toHaveProperty('value');
      expect(m).toHaveProperty('emoji');
    });
  });

  it('every POSITION has a label', () => {
    POSITIONS.forEach(p => {
      expect(POSITION_LABELS[p]).toBeTruthy();
    });
  });

  it('every SUBMISSION has a label', () => {
    SUBMISSIONS.forEach(s => {
      expect(SUBMISSION_LABELS[s]).toBeTruthy();
    });
  });
});

describe('data — modules', () => {
  it('has 7 modules', () => {
    expect(MODULES).toHaveLength(7);
  });

  it('each module has required fields', () => {
    MODULES.forEach(mod => {
      expect(mod.slug).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(['urgente', 'alta', 'media']).toContain(mod.priority);
      expect(mod.concepts.length).toBeGreaterThan(0);
      expect(mod.resources.length).toBeGreaterThan(0);
    });
  });

  it('concept IDs follow {slug}-c{N} pattern', () => {
    MODULES.forEach(mod => {
      mod.concepts.forEach(c => {
        expect(c.id).toMatch(new RegExp(`^${mod.slug}-c\\d+$`));
        expect(c.text).toBeTruthy();
      });
    });
  });

  it('resource IDs follow {slug}-r{N} pattern', () => {
    MODULES.forEach(mod => {
      mod.resources.forEach(r => {
        expect(r.id).toMatch(new RegExp(`^${mod.slug}-r\\d+$`));
        expect(r.title).toBeTruthy();
        expect(['video', 'article', 'paid']).toContain(r.type);
        expect(['pt', 'en']).toContain(r.lang);
      });
    });
  });

  it('module 1 (bow-and-arrow) has commonErrors', () => {
    const m1 = MODULES.find(m => m.slug === 'bow-and-arrow');
    expect(m1.commonErrors).toHaveLength(5);
  });

  it('module 7 (side-control-top) has placeholder resources', () => {
    const m7 = MODULES.find(m => m.slug === 'side-control-top');
    m7.resources.forEach(r => {
      expect(r.placeholder).toBe(true);
      expect(r.url).toBeNull();
    });
  });

  it('all concept and resource IDs are unique', () => {
    const ids = [];
    MODULES.forEach(mod => {
      mod.concepts.forEach(c => ids.push(c.id));
      mod.resources.forEach(r => ids.push(r.id));
    });
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('data — gameplan trees', () => {
  it('has 4 positions', () => {
    expect(Object.keys(GAMEPLAN_TREES)).toHaveLength(4);
    expect(Object.keys(GAMEPLAN_TREES)).toEqual(
      expect.arrayContaining(['costas', 'montada', 'side-control', 'meia-guarda'])
    );
  });

  it('each position has title, rootId, and nodes', () => {
    Object.values(GAMEPLAN_TREES).forEach(tree => {
      expect(tree.title).toBeTruthy();
      expect(tree.rootId).toBeTruthy();
      expect(tree.nodes[tree.rootId]).toBeTruthy();
    });
  });

  it('root nodes have no parentId', () => {
    Object.values(GAMEPLAN_TREES).forEach(tree => {
      expect(tree.nodes[tree.rootId].parentId).toBeNull();
    });
  });

  it('children references are valid node IDs', () => {
    Object.values(GAMEPLAN_TREES).forEach(tree => {
      Object.values(tree.nodes).forEach(node => {
        node.children.forEach(childId => {
          expect(tree.nodes[childId]).toBeTruthy();
        });
      });
    });
  });

  it('costas tree has 6 nodes', () => {
    expect(Object.keys(GAMEPLAN_TREES.costas.nodes)).toHaveLength(6);
  });

  it('montada tree has 7 nodes (includes sub-children)', () => {
    expect(Object.keys(GAMEPLAN_TREES.montada.nodes)).toHaveLength(7);
  });
});

describe('data — channels', () => {
  it('has 10 channels', () => {
    expect(CHANNELS).toHaveLength(10);
  });

  it('each channel has name and description', () => {
    CHANNELS.forEach(ch => {
      expect(ch.name).toBeTruthy();
      expect(ch.description).toBeTruthy();
    });
  });
});
