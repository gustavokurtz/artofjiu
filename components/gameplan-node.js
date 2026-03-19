// components/gameplan-node.js
// Light DOM Web Component — renders a single decision tree node with edit/note/delete controls.

class GameplanNode extends HTMLElement {
  set node(value) {
    this._node = value;
    if (this.isConnected) this._render();
  }

  get node() {
    return this._node;
  }

  connectedCallback() {
    this._editMode = false;
    this._noteMode = false;
    if (this._node) this._render();
  }

  // ----------------------------------------------------------------- render

  _render() {
    const node = this._node;
    if (!node) return;

    const hasTrigger = node.trigger !== null && node.trigger !== undefined && node.trigger !== '';
    const isUserCreated = !!node.isUserCreated;
    const note = node.note || '';
    const children = Array.isArray(node.children) ? node.children : [];

    const borderStyle = isUserCreated
      ? 'border: 2px dashed var(--accent-amber); border-radius: var(--radius-md); padding: var(--space-3);'
      : '';

    // Build display content
    let contentHtml;
    if (this._editMode) {
      contentHtml = `
        <div class="gp-node__edit" style="display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-2);">
          ${hasTrigger || isUserCreated ? `
            <label style="font-size: var(--text-xs); color: var(--text-secondary);">Se (trigger):</label>
            <input
              class="gp-node__edit-trigger"
              type="text"
              value="${this._escAttr(node.trigger || '')}"
              style="
                background: var(--bg-surface);
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: var(--radius-sm);
                color: var(--text-primary);
                padding: var(--space-2) var(--space-3);
                font-size: var(--text-sm);
              "
            />
          ` : ''}
          <label style="font-size: var(--text-xs); color: var(--text-secondary);">Resposta:</label>
          <input
            class="gp-node__edit-response"
            type="text"
            value="${this._escAttr(node.response || '')}"
            style="
              background: var(--bg-surface);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: var(--radius-sm);
              color: var(--text-primary);
              padding: var(--space-2) var(--space-3);
              font-size: var(--text-sm);
            "
          />
          <button
            class="gp-node__save-btn"
            style="
              align-self: flex-start;
              background: var(--accent-blue);
              color: #fff;
              border: none;
              border-radius: var(--radius-sm);
              padding: var(--space-1) var(--space-3);
              font-size: var(--text-sm);
              cursor: pointer;
            "
          >Salvar</button>
        </div>
      `;
    } else if (hasTrigger) {
      contentHtml = `
        <div class="gp-node__content">
          <div style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 2px;">
            <strong>Se:</strong> ${this._esc(node.trigger)}
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-primary);">
            &rarr; ${this._esc(node.response)}
          </div>
        </div>
      `;
    } else {
      // Root node — show as title
      contentHtml = `
        <div class="gp-node__content">
          <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">
            ${this._esc(node.response)}
          </div>
        </div>
      `;
    }

    // Note section
    const noteHtml = this._noteMode ? `
      <div class="gp-node__note-area" style="margin-top: var(--space-2);">
        <textarea
          class="gp-node__note-input"
          rows="3"
          placeholder="Anotação pessoal..."
          style="
            width: 100%;
            background: var(--bg-surface);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            padding: var(--space-2) var(--space-3);
            font-size: var(--text-sm);
            resize: vertical;
          "
        >${this._esc(note)}</textarea>
        <button
          class="gp-node__note-save-btn"
          style="
            margin-top: var(--space-1);
            background: var(--accent-green);
            color: #000;
            border: none;
            border-radius: var(--radius-sm);
            padding: var(--space-1) var(--space-3);
            font-size: var(--text-sm);
            cursor: pointer;
          "
        >Salvar nota</button>
      </div>
    ` : (note ? `
      <div class="gp-node__note-display" style="
        margin-top: var(--space-2);
        font-size: var(--text-xs);
        color: var(--text-secondary);
        font-style: italic;
        border-left: 2px solid var(--accent-amber);
        padding-left: var(--space-2);
      ">${this._esc(note)}</div>
    ` : '');

    // Action buttons
    const editBtn = `
      <button
        class="gp-node__edit-btn icon-btn"
        title="${this._editMode ? 'Cancelar edição' : 'Editar'}"
        style="
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 2px 4px;
          font-size: 0.85rem;
          border-radius: var(--radius-sm);
        "
      >${this._editMode ? '✕' : '✏️'}</button>
    `;

    const noteBtn = `
      <button
        class="gp-node__note-btn icon-btn"
        title="${this._noteMode ? 'Fechar nota' : 'Anotação'}"
        style="
          background: none;
          border: none;
          cursor: pointer;
          color: ${note ? 'var(--accent-amber)' : 'var(--text-secondary)'};
          padding: 2px 4px;
          font-size: 0.85rem;
          border-radius: var(--radius-sm);
        "
      >📝</button>
    `;

    const deleteBtn = isUserCreated ? `
      <button
        class="gp-node__delete-btn icon-btn"
        title="Excluir"
        style="
          background: none;
          border: none;
          cursor: pointer;
          color: var(--accent-red);
          padding: 2px 4px;
          font-size: 0.85rem;
          border-radius: var(--radius-sm);
        "
      >🗑️</button>
    ` : '';

    // Children
    const childrenHtml = children.length > 0 ? `
      <div class="gp-node__children" style="
        margin-top: var(--space-3);
        padding-left: var(--space-5);
        border-left: 2px solid rgba(255,255,255,0.1);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      ">
        ${children.map((child, i) => `
          <div class="gp-node__child-wrapper" style="
            position: relative;
          ">
            <div style="
              position: absolute;
              left: calc(-1 * var(--space-5));
              top: 50%;
              width: var(--space-4);
              height: 1px;
              background: rgba(255,255,255,0.1);
            "></div>
            <gameplan-node data-child-index="${i}"></gameplan-node>
          </div>
        `).join('')}
      </div>
    ` : '';

    this.innerHTML = `
      <div class="gp-node" style="${borderStyle} position: relative;">
        <div style="display: flex; align-items: flex-start; gap: var(--space-2);">
          <div style="flex: 1; min-width: 0;">
            ${contentHtml}
            ${noteHtml}
          </div>
          <div class="gp-node__actions" style="
            display: flex;
            align-items: center;
            gap: 2px;
            flex-shrink: 0;
          ">
            ${editBtn}
            ${noteBtn}
            ${deleteBtn}
          </div>
        </div>
        ${childrenHtml}
      </div>
    `;

    // Assign child node objects to child <gameplan-node> elements
    if (children.length > 0) {
      this.querySelectorAll(':scope > .gp-node > .gp-node__children .gp-node__child-wrapper > gameplan-node').forEach((el, i) => {
        el.node = children[i];
      });
    }

    // Bind events
    this._bindEvents();
  }

  // ----------------------------------------------------------------- events

  _bindEvents() {
    const editBtn = this.querySelector('.gp-node__edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._editMode = !this._editMode;
        this._render();
      });
    }

    const noteBtn = this.querySelector('.gp-node__note-btn');
    if (noteBtn) {
      noteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._noteMode = !this._noteMode;
        this._render();
      });
    }

    const deleteBtn = this.querySelector('.gp-node__delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('node-delete', {
          detail: { nodeId: this._node.id },
          bubbles: true,
        }));
      });
    }

    const saveBtn = this.querySelector('.gp-node__save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const triggerInput = this.querySelector('.gp-node__edit-trigger');
        const responseInput = this.querySelector('.gp-node__edit-response');
        const trigger = triggerInput ? triggerInput.value.trim() : (this._node.trigger || null);
        const response = responseInput ? responseInput.value.trim() : (this._node.response || '');
        this.dispatchEvent(new CustomEvent('node-edit', {
          detail: { nodeId: this._node.id, trigger: trigger || null, response },
          bubbles: true,
        }));
        this._editMode = false;
        // Optimistically update local node
        this._node = { ...this._node, trigger: trigger || null, response };
        this._render();
      });
    }

    const noteSaveBtn = this.querySelector('.gp-node__note-save-btn');
    if (noteSaveBtn) {
      noteSaveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const noteInput = this.querySelector('.gp-node__note-input');
        const note = noteInput ? noteInput.value : '';
        this.dispatchEvent(new CustomEvent('node-note', {
          detail: { nodeId: this._node.id, note },
          bubbles: true,
        }));
        this._noteMode = false;
        this._node = { ...this._node, note };
        this._render();
      });
    }
  }

  // ----------------------------------------------------------------- helpers

  _esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  _escAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

customElements.define('gameplan-node', GameplanNode);
