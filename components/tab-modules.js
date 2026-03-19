// components/tab-modules.js
// Light DOM Web Component — Modules tab: grid of module cards + detail view + channels.

import { MODULES, CHANNELS } from '../js/data.js';
import { loadState } from '../js/storage.js';

class TabModules extends HTMLElement {
  constructor() {
    super();
    this._activeSlug = null;
  }

  connectedCallback() {
    this._render();
    this._bindEvents();

    this._boundStateChanged = () => {
      if (!this._activeSlug) this._renderGrid();
    };
    document.addEventListener('state-changed', this._boundStateChanged);
  }

  disconnectedCallback() {
    document.removeEventListener('state-changed', this._boundStateChanged);
  }

  // ----------------------------------------------------------------- events

  _bindEvents() {
    this.addEventListener('module-select', (e) => {
      this._activeSlug = e.detail.slug;
      this._renderDetail(this._activeSlug);
    });

    this.addEventListener('module-back', () => {
      this._activeSlug = null;
      this._renderGrid();
    });
  }

  // ----------------------------------------------------------------- progress helpers

  _calcOverallProgress(state) {
    let totalDone = 0;
    let totalAll = 0;

    for (const mod of MODULES) {
      const modState = (state.modules && state.modules[mod.slug]) || {};
      const concepts = mod.concepts || [];
      const resources = mod.resources || [];

      totalDone += concepts.filter(c => modState.concepts && modState.concepts[c.id]?.checked).length;
      totalDone += resources.filter(r => modState.resources && modState.resources[r.id]?.checked).length;
      totalAll += concepts.length + resources.length;
    }

    return { done: totalDone, total: totalAll };
  }

  // ----------------------------------------------------------------- render

  _render() {
    if (this._activeSlug) {
      this._renderDetail(this._activeSlug);
    } else {
      this._renderGrid();
    }
  }

  _renderGrid() {
    const state = loadState();
    const { done, total } = this._calcOverallProgress(state);

    this.innerHTML = `
      <div class="tab-modules">

        <!-- Overall progress -->
        <div class="card" style="margin-bottom: var(--space-5);">
          <h2 style="margin: 0 0 var(--space-3); font-size: 1.1rem;">Progresso Geral</h2>
          <progress-bar value="${done}" max="${total || 1}" label="${done}/${total} itens estudados"></progress-bar>
        </div>

        <!-- Module grid -->
        <div
          class="modules-grid"
          style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-4);
            margin-bottom: var(--space-6);
          "
        >
          ${MODULES.map(mod => `<module-card data-slug="${mod.slug}"></module-card>`).join('')}
        </div>

        <!-- Canais Recomendados -->
        <section>
          <h2 style="margin: 0 0 var(--space-4); font-size: 1.1rem;">📺 Canais Recomendados</h2>
          <ul style="margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-3);">
            ${CHANNELS.map(ch => {
              const langTag = ch.lang === 'pt'
                ? `<span class="tag-pt">PT</span>`
                : ch.lang === 'en'
                  ? `<span class="tag-en">EN</span>`
                  : '';
              return `
                <li class="card card--surface" style="
                  list-style: none;
                  display: flex;
                  align-items: flex-start;
                  gap: var(--space-3);
                ">
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-bottom: 2px;">
                      <strong style="font-size: 0.95rem;">${ch.name}</strong>
                      ${langTag}
                    </div>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">${ch.description}</p>
                  </div>
                </li>
              `;
            }).join('')}
          </ul>
        </section>

      </div>
    `;

    // Assign module objects to module-card elements (after innerHTML is set)
    this.querySelectorAll('module-card[data-slug]').forEach(cardEl => {
      const slug = cardEl.dataset.slug;
      const mod = MODULES.find(m => m.slug === slug);
      if (mod) cardEl.module = mod;
    });
  }

  _renderDetail(slug) {
    const mod = MODULES.find(m => m.slug === slug);
    if (!mod) {
      this._activeSlug = null;
      this._renderGrid();
      return;
    }

    this.innerHTML = `<module-detail></module-detail>`;
    const detailEl = this.querySelector('module-detail');
    if (detailEl) detailEl.module = mod;
  }
}

// Responsive: single column on narrow viewports via CSS media query injection
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 640px) {
    .modules-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(style);

customElements.define('tab-modules', TabModules);
