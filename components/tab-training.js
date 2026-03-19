// components/tab-training.js
// Light DOM Web Component — Training tab: stats, log form, log list, focus submissions.

import { SUBMISSIONS, SUBMISSION_LABELS } from '../js/data.js';
import { loadState, updateFocusSubmission, removeFocusSubmission } from '../js/storage.js';
import './training-form.js';
import './training-log.js';
import './training-stats.js';

class TabTraining extends HTMLElement {
  constructor() {
    super();
    this._formVisible = false;
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
    this.innerHTML = `
      <div class="tab-training" style="
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      ">

        <!-- Section: Stats -->
        <section>
          <h2 style="margin: 0 0 var(--space-3); font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Estatísticas</h2>
          <training-stats></training-stats>
        </section>

        <!-- Section: Log form toggle -->
        <section>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
            <h2 style="margin: 0; font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Treinos</h2>
            <button
              type="button"
              class="btn-toggle-form"
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
            >${this._formVisible ? '✕ Fechar' : '+ Registrar Treino'}</button>
          </div>

          <!-- Form (conditionally visible) -->
          <div class="form-wrapper" style="display: ${this._formVisible ? 'block' : 'none'}; margin-bottom: var(--space-4);">
            <training-form></training-form>
          </div>

          <!-- Log list -->
          <training-log></training-log>
        </section>

        <!-- Section: Focus Submissions -->
        <section>
          <h2 style="margin: 0 0 var(--space-3); font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Finalizações em Foco</h2>
          <p style="margin: 0 0 var(--space-3); font-size: 0.85rem; color: var(--text-secondary);">
            Selecione as finalizações que está trabalhando ativamente.
          </p>

          <!-- Chip select to pick focus submissions -->
          <div style="margin-bottom: var(--space-4);">
            <chip-select name="focus-subs"></chip-select>
          </div>

          <!-- Focus submission cards -->
          <div class="focus-cards" style="display: flex; flex-direction: column; gap: var(--space-3);">
            <!-- rendered by _renderFocusCards -->
          </div>
        </section>

      </div>
    `;

    this._initFocusChipSelect();
    this._renderFocusCards();
    this._bindLocalEvents();
  }

  _initFocusChipSelect() {
    const chipSelect = this.querySelector('chip-select[name="focus-subs"]');
    if (!chipSelect) return;

    const subOpts = SUBMISSIONS.map(s => ({ value: s, label: SUBMISSION_LABELS[s] }));
    chipSelect.options = subOpts;

    // Pre-select currently focused submissions
    const state = loadState();
    const focused = Object.keys(state.training?.focusSubmissions || {});
    chipSelect.selected = focused;
  }

  _renderFocusCards() {
    const container = this.querySelector('.focus-cards');
    if (!container) return;

    const state = loadState();
    const focusMap = state.training?.focusSubmissions || {};
    const focused = Object.keys(focusMap);

    if (focused.length === 0) {
      container.innerHTML = `
        <div style="color: var(--text-secondary); font-size: 0.9rem; padding: var(--space-2) 0;">
          Nenhuma finalização em foco. Selecione acima para começar a rastrear.
        </div>
      `;
      return;
    }

    container.innerHTML = focused.map(slug => {
      const data = focusMap[slug] || {};
      const tried = data.tried || 0;
      const landed = data.landed || 0;
      const notes = data.notes || '';
      const rate = tried > 0 ? Math.round((landed / tried) * 100) : null;
      const label = SUBMISSION_LABELS[slug] || slug;

      return `
        <div class="focus-card card" data-slug="${slug}" style="padding: var(--space-4);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${label}</div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              ${rate !== null
                ? `<span style="
                    font-size: 0.78rem;
                    font-weight: 700;
                    color: ${rate >= 50 ? 'var(--accent-green)' : 'var(--accent-amber)'};
                    background: var(--bg-surface);
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                  ">${rate}%</span>`
                : ''
              }
              <button
                type="button"
                class="btn-remove-focus"
                data-slug="${slug}"
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
                title="Remover do foco"
              >✕</button>
            </div>
          </div>

          <!-- Tried counter -->
          <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2);">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; min-width: 80px;">Tentativas:</span>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <button type="button" class="btn-counter btn-dec" data-slug="${slug}" data-field="tried" style="${counterBtnStyle()}" title="Diminuir">−</button>
              <span class="counter-val" data-slug="${slug}" data-field="tried" style="
                font-size: 1.1rem;
                font-weight: 700;
                color: var(--text-primary);
                min-width: 28px;
                text-align: center;
              ">${tried}</span>
              <button type="button" class="btn-counter btn-inc" data-slug="${slug}" data-field="tried" style="${counterBtnStyle()}" title="Aumentar">+</button>
            </div>
          </div>

          <!-- Landed counter -->
          <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3);">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; min-width: 80px;">Concluídas:</span>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <button type="button" class="btn-counter btn-dec" data-slug="${slug}" data-field="landed" style="${counterBtnStyle()}" title="Diminuir">−</button>
              <span class="counter-val" data-slug="${slug}" data-field="landed" style="
                font-size: 1.1rem;
                font-weight: 700;
                color: var(--accent-green);
                min-width: 28px;
                text-align: center;
              ">${landed}</span>
              <button type="button" class="btn-counter btn-inc" data-slug="${slug}" data-field="landed" style="${counterBtnStyle()}" title="Aumentar">+</button>
            </div>
          </div>

          <!-- Notes -->
          <textarea
            class="focus-notes"
            data-slug="${slug}"
            rows="2"
            placeholder="Notas sobre esta finalização..."
            style="
              width: 100%;
              box-sizing: border-box;
              background: var(--bg-surface);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: var(--radius-md);
              color: var(--text-primary);
              padding: var(--space-2) var(--space-3);
              font-size: 0.87rem;
              font-family: inherit;
              resize: vertical;
            "
          >${notes}</textarea>
        </div>
      `;
    }).join('');

    this._bindFocusCardEvents();
  }

  // ----------------------------------------------------------------- events

  _bindLocalEvents() {
    // Toggle form
    const toggleBtn = this.querySelector('.btn-toggle-form');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this._formVisible = !this._formVisible;
        const wrapper = this.querySelector('.form-wrapper');
        if (wrapper) wrapper.style.display = this._formVisible ? 'block' : 'none';
        toggleBtn.textContent = this._formVisible ? '✕ Fechar' : '+ Registrar Treino';
      });
    }

    // training-saved event
    this.addEventListener('training-saved', () => {
      this._formVisible = false;
      const wrapper = this.querySelector('.form-wrapper');
      if (wrapper) wrapper.style.display = 'none';
      const toggleBtn2 = this.querySelector('.btn-toggle-form');
      if (toggleBtn2) toggleBtn2.textContent = '+ Registrar Treino';
    });

    // Focus submissions chip-select
    const focusChips = this.querySelector('chip-select[name="focus-subs"]');
    if (focusChips) {
      focusChips.addEventListener('chips-changed', e => {
        const { selected } = e.detail;
        this._syncFocusSubmissions(selected);
      });
    }
  }

  _bindGlobalEvents() {
    this._onStateChanged = () => {
      // Re-init chip-select selections and re-render focus cards without full re-render
      this._initFocusChipSelect();
      this._renderFocusCards();
    };
    document.addEventListener('state-changed', this._onStateChanged);
  }

  _bindFocusCardEvents() {
    // Counter buttons
    this.querySelectorAll('.btn-counter').forEach(btn => {
      btn.addEventListener('click', () => {
        const { slug, field } = btn.dataset;
        const state = loadState();
        const current = state.training?.focusSubmissions?.[slug] || {};
        const currentVal = current[field] || 0;
        const isInc = btn.classList.contains('btn-inc');
        const newVal = isInc ? currentVal + 1 : Math.max(0, currentVal - 1);

        updateFocusSubmission(slug, { ...current, [field]: newVal });
        // state-changed triggers re-render via _onStateChanged, but let's update inline for responsiveness
        const valEl = this.querySelector(`.counter-val[data-slug="${slug}"][data-field="${field}"]`);
        if (valEl) valEl.textContent = newVal;

        // Update success rate inline
        const card = this.querySelector(`.focus-card[data-slug="${slug}"]`);
        if (card) {
          const triedEl = card.querySelector(`.counter-val[data-field="tried"]`);
          const landedEl = card.querySelector(`.counter-val[data-field="landed"]`);
          if (triedEl && landedEl) {
            const tried = parseInt(triedEl.textContent) || 0;
            const landed = parseInt(landedEl.textContent) || 0;
            const rateSpan = card.querySelector('span[style*="border-radius: var(--radius-full)"]');
            if (tried > 0) {
              const newRate = Math.round((landed / tried) * 100);
              if (rateSpan) {
                rateSpan.textContent = `${newRate}%`;
                rateSpan.style.color = newRate >= 50 ? 'var(--accent-green)' : 'var(--accent-amber)';
              }
            }
          }
        }
      });
    });

    // Notes textarea — debounced save
    this.querySelectorAll('.focus-notes').forEach(ta => {
      let timer;
      ta.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const { slug } = ta.dataset;
          const state = loadState();
          const current = state.training?.focusSubmissions?.[slug] || {};
          updateFocusSubmission(slug, { ...current, notes: ta.value });
        }, 600);
      });
    });

    // Remove focus
    this.querySelectorAll('.btn-remove-focus').forEach(btn => {
      btn.addEventListener('click', () => {
        const { slug } = btn.dataset;
        // Also update chip-select
        const focusChips = this.querySelector('chip-select[name="focus-subs"]');
        if (focusChips) {
          focusChips.selected = focusChips.selected.filter(s => s !== slug);
        }
        removeFocusSubmission(slug);
      });
    });
  }

  _syncFocusSubmissions(selected) {
    const state = loadState();
    const currentFocus = state.training?.focusSubmissions || {};

    // Add newly selected
    for (const slug of selected) {
      if (!currentFocus[slug]) {
        updateFocusSubmission(slug, { tried: 0, landed: 0, notes: '' });
      }
    }

    // Remove deselected
    for (const slug of Object.keys(currentFocus)) {
      if (!selected.includes(slug)) {
        removeFocusSubmission(slug);
      }
    }
  }
}

function counterBtnStyle() {
  return `
    background: var(--bg-surface);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: 700;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-family: inherit;
    transition: background 0.1s;
  `;
}

customElements.define('tab-training', TabTraining);
