// components/gameplan-tree.js
// Light DOM Web Component — renders a full decision tree for a BJJ position.

import { GAMEPLAN_TREES } from '../js/data.js';
import {
  loadState,
  saveGameplanNote,
  editGameplanNode,
  addUserNode,
  deleteUserNode,
} from '../js/storage.js';

import './gameplan-node.js';

class GameplanTree extends HTMLElement {
  set position(value) {
    this._position = value;
    if (this.isConnected) this._render();
  }

  get position() {
    return this._position;
  }

  connectedCallback() {
    this._showAddForm = false;
    if (this._position) this._render();

    this._boundStateChanged = () => this._render();
    document.addEventListener('state-changed', this._boundStateChanged);

    this.addEventListener('node-delete', (e) => {
      deleteUserNode(this._position, e.detail.nodeId);
    });

    this.addEventListener('node-note', (e) => {
      saveGameplanNote(this._position, e.detail.nodeId, e.detail.note);
    });

    this.addEventListener('node-edit', (e) => {
      editGameplanNode(this._position, e.detail.nodeId, e.detail.trigger, e.detail.response);
    });
  }

  disconnectedCallback() {
    document.removeEventListener('state-changed', this._boundStateChanged);
  }

  // ----------------------------------------------------------------- build tree

  _buildTree() {
    const posData = GAMEPLAN_TREES[this._position];
    if (!posData) return null;

    const state = loadState();
    const posState = state.gameplan?.[this._position] || {};
    const overrides = posState.overrides || {};
    const userNodes = posState.userNodes || {};

    // Deep-copy hardcoded nodes and apply overrides
    const nodeMap = {};
    for (const [id, node] of Object.entries(posData.nodes)) {
      const override = overrides[id] || {};
      nodeMap[id] = {
        ...node,
        trigger: override.trigger !== undefined ? override.trigger : node.trigger,
        response: override.response !== undefined ? override.response : node.response,
        note: override.note !== undefined ? override.note : node.note,
        children: [...node.children], // will resolve to objects below
      };
    }

    // Merge user nodes
    for (const [id, uNode] of Object.entries(userNodes)) {
      nodeMap[id] = {
        ...uNode,
        children: Array.isArray(uNode.children) ? [...uNode.children] : [],
      };
    }

    // Inject user nodes as children of their parents
    for (const [id, uNode] of Object.entries(userNodes)) {
      const parentId = uNode.parentId;
      if (parentId && nodeMap[parentId]) {
        if (!nodeMap[parentId].children.includes(id)) {
          nodeMap[parentId].children.push(id);
        }
      }
    }

    // Resolve children IDs -> node objects recursively
    const resolveChildren = (node, visited = new Set()) => {
      if (visited.has(node.id)) return { ...node, children: [] };
      visited.add(node.id);
      const childObjects = (node.children || [])
        .map(childId => (typeof childId === 'string' ? nodeMap[childId] : childId))
        .filter(Boolean)
        .map(child => resolveChildren(child, new Set(visited)));
      return { ...node, children: childObjects };
    };

    const rootId = posData.rootId;
    const rootNode = nodeMap[rootId];
    if (!rootNode) return null;

    return resolveChildren(rootNode);
  }

  // ----------------------------------------------------------------- render

  _render() {
    const posData = GAMEPLAN_TREES[this._position];
    if (!posData) {
      this.innerHTML = `<p style="color: var(--accent-red);">Posição não encontrada: ${this._position}</p>`;
      return;
    }

    const tree = this._buildTree();

    // Build flat node list for the "parent" dropdown in the add form
    const allNodes = this._getAllNodes();

    const addFormHtml = this._showAddForm ? `
      <div class="gp-tree__add-form" style="
        margin-top: var(--space-4);
        background: var(--bg-surface);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      ">
        <h4 style="margin: 0; font-size: var(--text-sm); color: var(--text-primary);">Nova decisão</h4>
        <div>
          <label style="font-size: var(--text-xs); color: var(--text-secondary); display: block; margin-bottom: 4px;">Nó pai:</label>
          <select
            class="gp-tree__parent-select"
            style="
              width: 100%;
              background: var(--bg-card);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: var(--radius-sm);
              color: var(--text-primary);
              padding: var(--space-2) var(--space-3);
              font-size: var(--text-sm);
            "
          >
            ${allNodes.map(n => `<option value="${this._escAttr(n.id)}">${this._escAttr(n.id)} — ${this._escAttr(n.response)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size: var(--text-xs); color: var(--text-secondary); display: block; margin-bottom: 4px;">Se (trigger):</label>
          <input
            class="gp-tree__trigger-input"
            type="text"
            placeholder="Ex: Ele defende a gola..."
            style="
              width: 100%;
              background: var(--bg-card);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: var(--radius-sm);
              color: var(--text-primary);
              padding: var(--space-2) var(--space-3);
              font-size: var(--text-sm);
            "
          />
        </div>
        <div>
          <label style="font-size: var(--text-xs); color: var(--text-secondary); display: block; margin-bottom: 4px;">Resposta:</label>
          <input
            class="gp-tree__response-input"
            type="text"
            placeholder="Ex: troca de lado..."
            style="
              width: 100%;
              background: var(--bg-card);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: var(--radius-sm);
              color: var(--text-primary);
              padding: var(--space-2) var(--space-3);
              font-size: var(--text-sm);
            "
          />
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button
            class="gp-tree__add-confirm-btn"
            style="
              background: var(--accent-blue);
              color: #fff;
              border: none;
              border-radius: var(--radius-sm);
              padding: var(--space-2) var(--space-4);
              font-size: var(--text-sm);
              cursor: pointer;
            "
          >Adicionar</button>
          <button
            class="gp-tree__add-cancel-btn"
            style="
              background: none;
              color: var(--text-secondary);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: var(--radius-sm);
              padding: var(--space-2) var(--space-4);
              font-size: var(--text-sm);
              cursor: pointer;
            "
          >Cancelar</button>
        </div>
      </div>
    ` : '';

    this.innerHTML = `
      <div class="gp-tree">
        <div class="gp-tree__root"></div>
        <div style="margin-top: var(--space-4);">
          ${this._showAddForm ? '' : `
            <button
              class="gp-tree__add-btn"
              style="
                background: none;
                border: 1px dashed var(--accent-blue);
                color: var(--accent-blue);
                border-radius: var(--radius-sm);
                padding: var(--space-2) var(--space-4);
                font-size: var(--text-sm);
                cursor: pointer;
              "
            >+ Adicionar decisão</button>
          `}
          ${addFormHtml}
        </div>
      </div>
    `;

    // Mount root node component
    if (tree) {
      const rootContainer = this.querySelector('.gp-tree__root');
      const rootEl = document.createElement('gameplan-node');
      rootContainer.appendChild(rootEl);
      rootEl.node = tree;
    }

    this._bindEvents();
  }

  _getAllNodes() {
    const posData = GAMEPLAN_TREES[this._position];
    if (!posData) return [];

    const state = loadState();
    const posState = state.gameplan?.[this._position] || {};
    const userNodes = posState.userNodes || {};

    const nodes = Object.values(posData.nodes).map(n => ({
      id: n.id,
      response: n.response,
    }));

    for (const uNode of Object.values(userNodes)) {
      nodes.push({ id: uNode.id, response: uNode.response });
    }

    return nodes;
  }

  // ----------------------------------------------------------------- events

  _bindEvents() {
    const addBtn = this.querySelector('.gp-tree__add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this._showAddForm = true;
        this._render();
      });
    }

    const cancelBtn = this.querySelector('.gp-tree__add-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this._showAddForm = false;
        this._render();
      });
    }

    const confirmBtn = this.querySelector('.gp-tree__add-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const parentSelect = this.querySelector('.gp-tree__parent-select');
        const triggerInput = this.querySelector('.gp-tree__trigger-input');
        const responseInput = this.querySelector('.gp-tree__response-input');

        const parentId = parentSelect ? parentSelect.value : null;
        const trigger = triggerInput ? triggerInput.value.trim() : '';
        const response = responseInput ? responseInput.value.trim() : '';

        if (!response) {
          if (responseInput) responseInput.focus();
          return;
        }

        const newNode = {
          id: crypto.randomUUID(),
          parentId: parentId || null,
          trigger: trigger || null,
          response,
          children: [],
          isUserCreated: true,
          note: '',
        };

        addUserNode(this._position, newNode);
        this._showAddForm = false;
        // state-changed event will trigger re-render
      });
    }
  }

  // ----------------------------------------------------------------- helpers

  _escAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

customElements.define('gameplan-tree', GameplanTree);
