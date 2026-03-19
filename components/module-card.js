// components/module-card.js
// Light DOM Web Component — displays a summary card for a study module.

import { loadState } from '../js/storage.js';

const PRIORITY_LABELS = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Média',
};

class ModuleCard extends HTMLElement {
  set module(value) {
    this._module = value;
    if (this.isConnected) this._render();
  }

  get module() {
    return this._module;
  }

  connectedCallback() {
    if (this._module) this._render();
    this.addEventListener('click', this._onClick.bind(this));
  }

  _onClick() {
    if (!this._module) return;
    this.dispatchEvent(new CustomEvent('module-select', {
      detail: { slug: this._module.slug },
      bubbles: true,
    }));
  }

  _calcProgress(mod, state) {
    const modState = (state.modules && state.modules[mod.slug]) || {};
    const concepts = mod.concepts || [];
    const resources = mod.resources || [];

    const conceptsDone = concepts.filter(c => modState.concepts && modState.concepts[c.id]?.checked).length;
    const resourcesDone = resources.filter(r => modState.resources && modState.resources[r.id]?.checked).length;

    const total = concepts.length + resources.length;
    const done = conceptsDone + resourcesDone;

    return { done, total, conceptsDone, conceptsTotal: concepts.length, resourcesDone, resourcesTotal: resources.length };
  }

  _render() {
    const mod = this._module;
    if (!mod) return;

    const state = loadState();
    const { done, total, conceptsDone, conceptsTotal, resourcesDone, resourcesTotal } = this._calcProgress(mod, state);
    const isComplete = total > 0 && done === total;

    const priorityClass = `tag-${mod.priority}`;
    const priorityLabel = PRIORITY_LABELS[mod.priority] || mod.priority;

    const completeBadge = isComplete
      ? `<span style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--accent-green);
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: var(--radius-full);
          padding: 2px 8px;
        ">✓ Completo</span>`
      : '';

    const borderStyle = isComplete
      ? 'border-color: rgba(34, 197, 94, 0.5); background: linear-gradient(135deg, var(--bg-card), rgba(34, 197, 94, 0.05));'
      : '';

    this.innerHTML = `
      <article class="card module-card" style="cursor: pointer; ${borderStyle}">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-2); margin-bottom: var(--space-3);">
          <h3 style="margin: 0; font-size: 1rem; line-height: 1.4; flex: 1;">${mod.title}</h3>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-1); flex-shrink: 0;">
            <span class="${priorityClass}">${priorityLabel}</span>
            ${completeBadge}
          </div>
        </div>
        <progress-bar value="${done}" max="${total || 1}" label="${done}/${total} itens"></progress-bar>
        <p style="margin: var(--space-2) 0 0; font-size: 0.8rem; color: var(--text-secondary);">
          ${conceptsDone}/${conceptsTotal} conceitos · ${resourcesDone}/${resourcesTotal} recursos
        </p>
      </article>
    `;
  }
}

customElements.define('module-card', ModuleCard);
