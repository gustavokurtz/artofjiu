// components/tab-notes.js
// Light DOM Web Component — Notes tab: quick notes with tags, date, and action plan.

import { NOTE_TAGS, NOTE_TAG_LABELS } from '../js/data.js';
import { loadState, addNote, deleteNote } from '../js/storage.js';

function todayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const TAG_COLORS = {
  geral: '#6b7280',
  tecnica: '#3b82f6',
  treino: '#22c55e',
  gameplan: '#f59e0b',
  competicao: '#ef4444',
  professor: '#a855f7'
};

class TabNotes extends HTMLElement {
  constructor() {
    super();
    this._formVisible = false;
    this._filterTag = 'all';
  }

  connectedCallback() {
    this._render();
    this._bindGlobalEvents();
  }

  disconnectedCallback() {
    document.removeEventListener('state-changed', this._onStateChanged);
  }

  // ----------------------------------------------------------------- render

  _render() {
    const state = loadState();
    const notes = state.notes || [];

    this.innerHTML = `
      <div class="tab-notes" style="
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      ">

        <!-- Header + New Note button -->
        <section>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
            <h2 style="margin: 0; font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Notas</h2>
            <button
              type="button"
              class="btn-toggle-note-form"
              style="
                background: var(--accent-blue);
                color: #fff;
                border: none;
                border-radius: var(--radius-md);
                padding: var(--space-2) var(--space-3);
                font-size: 0.9rem;
                font-family: inherit;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.15s;
              "
            >${this._formVisible ? '✕ Fechar' : '+ Nova Nota'}</button>
          </div>

          <!-- Form (conditionally visible) -->
          <div class="note-form-wrapper" style="display: ${this._formVisible ? 'block' : 'none'}; margin-bottom: var(--space-4);">
            ${this._renderForm()}
          </div>
        </section>

        <!-- Tag filter -->
        <section>
          <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; align-items: center;">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Filtrar:</span>
            <button
              type="button"
              class="filter-tag-btn"
              data-tag="all"
              style="${this._filterTagBtnStyle('all')}"
            >Todas</button>
            ${NOTE_TAGS.map(tag => `
              <button
                type="button"
                class="filter-tag-btn"
                data-tag="${tag}"
                style="${this._filterTagBtnStyle(tag)}"
              >${NOTE_TAG_LABELS[tag]}</button>
            `).join('')}
          </div>
        </section>

        <!-- Notes list -->
        <section class="notes-list" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${this._renderNotesList(notes)}
        </section>

      </div>
    `;

    this._bindLocalEvents();
  }

  _renderForm() {
    return `
      <div class="card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4);">
        <h3 style="margin: 0; font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Nova Nota</h3>

        <!-- Date + Tag row -->
        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
          <label style="display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 140px;">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Data</span>
            <input
              type="date"
              name="note-date"
              value="${todayISO()}"
              style="
                background: var(--bg-surface);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: var(--radius-md);
                color: var(--text-primary);
                padding: var(--space-2) var(--space-3);
                font-size: 0.95rem;
                font-family: inherit;
                width: 100%;
                box-sizing: border-box;
              "
            />
          </label>

          <label style="display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 140px;">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Tag</span>
            <select
              name="note-tag"
              style="
                background: var(--bg-surface);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: var(--radius-md);
                color: var(--text-primary);
                padding: var(--space-2) var(--space-3);
                font-size: 0.95rem;
                font-family: inherit;
                width: 100%;
                box-sizing: border-box;
                cursor: pointer;
              "
            >
              ${NOTE_TAGS.map(tag => `
                <option value="${tag}" ${tag === 'geral' ? 'selected' : ''}>${NOTE_TAG_LABELS[tag]}</option>
              `).join('')}
            </select>
          </label>
        </div>

        <!-- Text -->
        <label style="display: flex; flex-direction: column; gap: var(--space-1);">
          <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">O que observei / aprendi</span>
          <textarea
            name="note-text"
            rows="3"
            placeholder="Escreva sua observacao aqui..."
            style="
              background: var(--bg-surface);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: var(--radius-md);
              color: var(--text-primary);
              padding: var(--space-2) var(--space-3);
              font-size: 0.95rem;
              font-family: inherit;
              resize: vertical;
              width: 100%;
              box-sizing: border-box;
            "
          ></textarea>
          <span class="error-note-text" style="color: var(--accent-red); font-size: 0.78rem; display: none;">Escreva algo na nota</span>
        </label>

        <!-- Action -->
        <label style="display: flex; flex-direction: column; gap: var(--space-1);">
          <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">O que vou fazer com isso</span>
          <textarea
            name="note-action"
            rows="2"
            placeholder="Ex: usar no treino, perguntar ao professor, revisar semana que vem..."
            style="
              background: var(--bg-surface);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: var(--radius-md);
              color: var(--text-primary);
              padding: var(--space-2) var(--space-3);
              font-size: 0.95rem;
              font-family: inherit;
              resize: vertical;
              width: 100%;
              box-sizing: border-box;
            "
          ></textarea>
        </label>

        <!-- Save -->
        <button
          type="button"
          class="btn-save-note"
          style="
            background: var(--accent-blue);
            color: #fff;
            border: none;
            border-radius: var(--radius-md);
            padding: var(--space-3) var(--space-4);
            font-size: 1rem;
            font-family: inherit;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.15s;
            align-self: flex-end;
          "
        >Salvar Nota</button>
      </div>
    `;
  }

  _renderNotesList(notes) {
    const filtered = this._filterTag === 'all'
      ? notes
      : notes.filter(n => n.tag === this._filterTag);

    if (filtered.length === 0) {
      return `
        <div style="
          text-align: center;
          padding: var(--space-8) var(--space-4);
          color: var(--text-secondary);
          font-size: 0.9rem;
        ">
          ${notes.length === 0
            ? 'Nenhuma nota ainda. Clique em "+ Nova Nota" para comecar.'
            : 'Nenhuma nota com essa tag.'}
        </div>
      `;
    }

    return filtered.map(note => {
      const tagColor = TAG_COLORS[note.tag] || TAG_COLORS.geral;
      const tagLabel = NOTE_TAG_LABELS[note.tag] || note.tag;

      return `
        <div class="note-card card" data-note-id="${note.id}" style="padding: var(--space-4);">
          <!-- Header: date + tag + delete -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
            <div style="display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap;">
              <span style="
                font-size: 0.8rem;
                color: var(--text-secondary);
                font-weight: 600;
              ">${formatDate(note.date)}</span>
              <span style="
                font-size: 0.72rem;
                font-weight: 700;
                color: #fff;
                background: ${tagColor};
                padding: 2px 10px;
                border-radius: var(--radius-full);
                text-transform: uppercase;
                letter-spacing: 0.04em;
              ">${tagLabel}</span>
            </div>
            <button
              type="button"
              class="btn-delete-note"
              data-note-id="${note.id}"
              style="
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 1rem;
                padding: var(--space-1);
                border-radius: var(--radius-sm);
                line-height: 1;
                transition: color 0.15s;
              "
              title="Deletar nota"
            >✕</button>
          </div>

          <!-- Text -->
          <p style="
            margin: 0 0 var(--space-2);
            color: var(--text-primary);
            font-size: 0.95rem;
            line-height: 1.5;
            white-space: pre-wrap;
            word-break: break-word;
          ">${this._escapeHtml(note.text)}</p>

          <!-- Action -->
          ${note.action ? `
            <div style="
              margin-top: var(--space-2);
              padding: var(--space-2) var(--space-3);
              background: var(--bg-surface);
              border-radius: var(--radius-md);
              border-left: 3px solid ${tagColor};
            ">
              <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; display: block; margin-bottom: 2px;">O que vou fazer:</span>
              <span style="font-size: 0.88rem; color: var(--text-primary); font-style: italic; white-space: pre-wrap; word-break: break-word;">${this._escapeHtml(note.action)}</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  _escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _filterTagBtnStyle(tag) {
    const isActive = this._filterTag === tag;
    const color = tag === 'all' ? '#6b7280' : (TAG_COLORS[tag] || '#6b7280');
    return `
      background: ${isActive ? color : 'var(--bg-surface)'};
      color: ${isActive ? '#fff' : 'var(--text-secondary)'};
      border: 1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'};
      border-radius: var(--radius-full);
      padding: var(--space-1) var(--space-3);
      font-size: 0.78rem;
      font-family: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    `;
  }

  // ----------------------------------------------------------------- events

  _bindLocalEvents() {
    // Toggle form
    const toggleBtn = this.querySelector('.btn-toggle-note-form');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this._formVisible = !this._formVisible;
        const wrapper = this.querySelector('.note-form-wrapper');
        if (wrapper) wrapper.style.display = this._formVisible ? 'block' : 'none';
        toggleBtn.textContent = this._formVisible ? '✕ Fechar' : '+ Nova Nota';
      });
    }

    // Save note
    const saveBtn = this.querySelector('.btn-save-note');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this._handleSave());
    }

    // Filter tags
    this.querySelectorAll('.filter-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._filterTag = btn.dataset.tag;
        this._render();
      });
    });

    // Delete note
    this.querySelectorAll('.btn-delete-note').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteNote(btn.dataset.noteId);
      });
    });
  }

  _bindGlobalEvents() {
    this._onStateChanged = () => {
      // Re-render just the notes list, preserving form state
      const state = loadState();
      const listContainer = this.querySelector('.notes-list');
      if (listContainer) {
        listContainer.innerHTML = this._renderNotesList(state.notes || []);
        // Re-bind delete buttons
        listContainer.querySelectorAll('.btn-delete-note').forEach(btn => {
          btn.addEventListener('click', () => {
            deleteNote(btn.dataset.noteId);
          });
        });
      }
    };
    document.addEventListener('state-changed', this._onStateChanged);
  }

  _handleSave() {
    const textArea = this.querySelector('textarea[name="note-text"]');
    const errorText = this.querySelector('.error-note-text');

    if (!textArea.value.trim()) {
      errorText.style.display = 'block';
      textArea.focus();
      return;
    }
    errorText.style.display = 'none';

    const dateInput = this.querySelector('input[name="note-date"]');
    const tagSelect = this.querySelector('select[name="note-tag"]');
    const actionArea = this.querySelector('textarea[name="note-action"]');

    const note = {
      id: crypto.randomUUID(),
      date: dateInput.value || todayISO(),
      text: textArea.value.trim(),
      action: actionArea.value.trim(),
      tag: tagSelect.value,
      createdAt: new Date().toISOString()
    };

    // Reset form before saving (addNote triggers state-changed which re-renders list)
    textArea.value = '';
    actionArea.value = '';
    dateInput.value = todayISO();
    tagSelect.value = 'geral';

    this._formVisible = false;
    const wrapper = this.querySelector('.note-form-wrapper');
    if (wrapper) wrapper.style.display = 'none';
    const toggleBtn = this.querySelector('.btn-toggle-note-form');
    if (toggleBtn) toggleBtn.textContent = '+ Nova Nota';

    addNote(note);
  }
}

customElements.define('tab-notes', TabNotes);
