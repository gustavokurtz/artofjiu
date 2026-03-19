// components/tab-gameplan.js
// Light DOM Web Component — Game Plan tab: accordion of position decision trees.

import { GAMEPLAN_TREES } from '../js/data.js';
import './gameplan-tree.js';

const POSITION_KEYS = Object.keys(GAMEPLAN_TREES); // ["costas", "montada", "side-control", "meia-guarda"]

class TabGameplan extends HTMLElement {
  constructor() {
    super();
    this._activePosition = null;
  }

  connectedCallback() {
    this._render();
  }

  // ----------------------------------------------------------------- helpers

  _countNodes(posKey) {
    const posData = GAMEPLAN_TREES[posKey];
    if (!posData) return 0;
    return Object.keys(posData.nodes).length;
  }

  // ----------------------------------------------------------------- render

  _render() {
    this.innerHTML = `
      <div class="tab-gameplan" style="
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      ">
        <div style="margin-bottom: var(--space-2);">
          <h2 style="margin: 0 0 var(--space-1); font-size: 1.25rem; font-family: var(--font-heading);">Game Plan</h2>
          <p style="margin: 0; font-size: var(--text-sm); color: var(--text-secondary);">
            Árvores de decisão por posição. Personalize com notas e novas ramificações.
          </p>
        </div>

        <div class="gp-accordion" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${POSITION_KEYS.map(posKey => {
            const posData = GAMEPLAN_TREES[posKey];
            const nodeCount = this._countNodes(posKey);
            const isActive = this._activePosition === posKey;

            return `
              <div
                class="gp-accordion__item card"
                data-position="${posKey}"
                style="overflow: hidden;"
              >
                <!-- Card header (clickable) -->
                <div
                  class="gp-accordion__header"
                  data-position="${posKey}"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    padding: var(--space-4);
                    user-select: none;
                  "
                >
                  <div>
                    <div style="
                      font-weight: 600;
                      font-size: 1rem;
                      color: var(--text-primary);
                      margin-bottom: 2px;
                    ">${posData.title}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-secondary);">
                      ${nodeCount} ${nodeCount === 1 ? 'nó' : 'nós'} na árvore
                    </div>
                  </div>
                  <span style="
                    font-size: 1rem;
                    color: var(--text-secondary);
                    transform: ${isActive ? 'rotate(90deg)' : 'rotate(0deg)'};
                    transition: transform var(--transition-fast);
                    display: inline-block;
                  ">›</span>
                </div>

                <!-- Expandable tree panel -->
                ${isActive ? `
                  <div
                    class="gp-accordion__panel"
                    style="
                      padding: 0 var(--space-4) var(--space-4);
                      border-top: 1px solid rgba(255,255,255,0.06);
                    "
                  >
                    <div style="padding-top: var(--space-4);">
                      <gameplan-tree data-pos="${posKey}"></gameplan-tree>
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Set position property on tree elements (after innerHTML)
    this.querySelectorAll('gameplan-tree[data-pos]').forEach(el => {
      el.position = el.dataset.pos;
    });

    this._bindEvents();
  }

  // ----------------------------------------------------------------- events

  _bindEvents() {
    this.querySelectorAll('.gp-accordion__header').forEach(header => {
      header.addEventListener('click', () => {
        const pos = header.dataset.position;
        this._activePosition = this._activePosition === pos ? null : pos;
        this._render();
      });
    });
  }
}

customElements.define('tab-gameplan', TabGameplan);
