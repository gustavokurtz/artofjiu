// components/module-detail.js
// Light DOM Web Component — detail view for a single study module.

import { loadState, toggleConcept, toggleResource } from '../js/storage.js';

const PRIORITY_LABELS = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Média',
};

const TYPE_ICONS = {
  video: '🎥',
  article: '📝',
  paid: '💰',
};

class ModuleDetail extends HTMLElement {
  set module(value) {
    this._module = value;
    if (this.isConnected) this._render();
  }

  get module() {
    return this._module;
  }

  connectedCallback() {
    if (this._module) this._render();
    this._boundToggle = this._onCheckboxToggle.bind(this);
    this.addEventListener('checkbox-toggle', this._boundToggle);
  }

  disconnectedCallback() {
    this.removeEventListener('checkbox-toggle', this._boundToggle);
  }

  _onCheckboxToggle(e) {
    const { id, moduleSlug, checked } = e.detail;
    const mod = this._module;
    if (!mod) return;

    // Determine if this is a concept or resource id
    const isConcept = mod.concepts && mod.concepts.some(c => c.id === id);
    if (isConcept) {
      toggleConcept(moduleSlug, id, checked);
    } else {
      toggleResource(moduleSlug, id, checked);
    }

    // Re-render to reflect updated state
    this._render();
  }

  _render() {
    const mod = this._module;
    if (!mod) return;

    const state = loadState();
    const modState = (state.modules && state.modules[mod.slug]) || { concepts: {}, resources: {} };

    const priorityClass = `tag-${mod.priority}`;
    const priorityLabel = PRIORITY_LABELS[mod.priority] || mod.priority;

    // --- Conceitos-Chave section ---
    const conceptsHTML = (mod.concepts || []).map(concept => {
      const saved = modState.concepts && modState.concepts[concept.id];
      const isChecked = saved?.checked || false;
      const dateAttr = isChecked && saved?.date ? `date="${saved.date}"` : '';
      const checkedAttr = isChecked ? 'checked' : '';
      return `
        <li style="list-style: none; padding: var(--space-2) 0; border-bottom: 1px solid var(--border-card);">
          <study-checkbox
            label="${concept.text.replace(/"/g, '&quot;')}"
            item-id="${concept.id}"
            module-slug="${mod.slug}"
            ${checkedAttr}
            ${dateAttr}
          ></study-checkbox>
        </li>
      `;
    }).join('');

    // --- Recursos section ---
    const resourcesHTML = (mod.resources || []).map(resource => {
      const saved = modState.resources && modState.resources[resource.id];
      const isChecked = saved?.checked || false;
      const dateAttr = isChecked && saved?.date ? `date="${saved.date}"` : '';
      const checkedAttr = isChecked ? 'checked' : '';
      const typeIcon = TYPE_ICONS[resource.type] || '📄';
      const langClass = resource.lang ? `tag-${resource.lang}` : '';
      const langLabel = resource.lang === 'pt' ? 'PT' : resource.lang === 'en' ? 'EN' : '';

      let titleHTML;
      if (resource.placeholder) {
        titleHTML = `<span style="color: var(--text-secondary); font-style: italic; cursor: default;">${resource.title}</span>
          <button
            type="button"
            onclick="alert('Em breve')"
            style="
              font-size: 0.7rem;
              background: rgba(245,158,11,0.15);
              color: var(--accent-amber);
              border: 1px solid rgba(245,158,11,0.3);
              border-radius: var(--radius-full);
              padding: 1px 6px;
              cursor: pointer;
              margin-left: 4px;
              vertical-align: middle;
            "
          >Em breve</button>`;
      } else if (resource.url) {
        titleHTML = `<a href="${resource.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: underline; text-underline-offset: 2px;">${resource.title}</a>`;
      } else {
        titleHTML = `<span style="color: var(--text-primary);">${resource.title}</span>`;
      }

      return `
        <li style="list-style: none; padding: var(--space-3) 0; border-bottom: 1px solid var(--border-card);">
          <div style="display: flex; align-items: flex-start; gap: var(--space-2);">
            <div style="flex: 1;">
              <study-checkbox
                label=""
                item-id="${resource.id}"
                module-slug="${mod.slug}"
                ${checkedAttr}
                ${dateAttr}
              ></study-checkbox>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: var(--space-2); margin-top: var(--space-1); padding-left: 28px;">
            <span aria-hidden="true" style="font-size: 1rem; flex-shrink: 0;">${typeIcon}</span>
            <span style="flex: 1; font-size: 0.875rem; line-height: 1.5;">${titleHTML}</span>
            ${langLabel ? `<span class="${langClass}" style="flex-shrink: 0;">${langLabel}</span>` : ''}
          </div>
        </li>
      `;
    }).join('');

    // --- Erros Comuns section ---
    const commonErrorsHTML = (mod.commonErrors && mod.commonErrors.length)
      ? `
        <section style="margin-top: var(--space-6);">
          <h3 style="margin: 0 0 var(--space-3); font-size: 1rem; color: var(--accent-red);">⚠️ Erros Comuns</h3>
          <ol style="margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2);">
            ${mod.commonErrors.map((err, i) => `
              <li style="
                list-style: none;
                display: flex;
                align-items: flex-start;
                gap: var(--space-3);
                padding: var(--space-3);
                background: rgba(239, 68, 68, 0.08);
                border: 1px solid rgba(239, 68, 68, 0.2);
                border-radius: var(--radius-md, 8px);
                font-size: 0.875rem;
                line-height: 1.5;
              ">
                <span style="
                  font-weight: 700;
                  color: var(--accent-red);
                  font-size: 0.875rem;
                  flex-shrink: 0;
                  min-width: 20px;
                ">${i + 1}.</span>
                <span style="color: var(--text-primary);">${err}</span>
              </li>
            `).join('')}
          </ol>
        </section>
      `
      : '';

    this.innerHTML = `
      <div class="module-detail">
        <!-- Back button -->
        <button
          type="button"
          class="module-detail__back"
          style="
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            background: none;
            border: none;
            cursor: pointer;
            color: var(--accent-blue);
            font-size: 0.9rem;
            padding: 0;
            margin-bottom: var(--space-4);
          "
        >
          ← Voltar
        </button>

        <!-- Header -->
        <div style="display: flex; align-items: flex-start; gap: var(--space-3); margin-bottom: var(--space-6); flex-wrap: wrap;">
          <h2 style="margin: 0; flex: 1; font-size: 1.25rem; line-height: 1.3;">${mod.title}</h2>
          <span class="${priorityClass}">${priorityLabel}</span>
        </div>

        <!-- Conceitos-Chave -->
        <section style="margin-bottom: var(--space-6);">
          <h3 style="margin: 0 0 var(--space-3); font-size: 1rem;">💡 Conceitos-Chave</h3>
          <ul style="margin: 0; padding: 0;">
            ${conceptsHTML}
          </ul>
        </section>

        <!-- Recursos -->
        <section style="margin-bottom: var(--space-6);">
          <h3 style="margin: 0 0 var(--space-3); font-size: 1rem;">📚 Recursos</h3>
          <ul style="margin: 0; padding: 0;">
            ${resourcesHTML}
          </ul>
        </section>

        <!-- Erros Comuns -->
        ${commonErrorsHTML}
      </div>
    `;

    // Bind back button after render (can't use onclick= with CSP in mind)
    const backBtn = this.querySelector('.module-detail__back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('module-back', { bubbles: true }));
      });
    }
  }
}

customElements.define('module-detail', ModuleDetail);
