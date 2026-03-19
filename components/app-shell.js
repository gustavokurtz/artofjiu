// components/app-shell.js
// Main layout Web Component — light DOM (no Shadow DOM) so global CSS applies.

const TABS = [
  { hash: '#modules',  label: 'Módulos',   icon: '📚', tag: 'tab-modules'  },
  { hash: '#gameplan', label: 'Game Plan', icon: '🗺️', tag: 'tab-gameplan' },
  { hash: '#training', label: 'Treino',    icon: '🥋', tag: 'tab-training' },
  { hash: '#config',   label: 'Config',    icon: '⚙️', tag: 'tab-config'   },
];

const DEFAULT_HASH = '#modules';

class AppShell extends HTMLElement {
  connectedCallback() {
    this._render();
    this._applyHash();
    this._boundOnHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._boundOnHashChange);
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this._boundOnHashChange);
  }

  // ------------------------------------------------------------------ render

  _render() {
    this.innerHTML = `
      <header class="app-header">
        <h1 class="app-header__title">BJJ GI Study Tracker</h1>
        <p class="app-header__subtitle">Faixa Azul · 85kg · Foco em GI</p>
      </header>

      <nav class="sidebar" aria-label="Navegação principal">
        <div class="sidebar__logo">BJJ GI Study Tracker</div>
        <ul class="sidebar__nav" role="tablist">
          ${TABS.map(t => `
            <li role="presentation">
              <a
                href="${t.hash}"
                role="tab"
                class="sidebar__item"
                data-hash="${t.hash}"
                aria-selected="false"
              >
                <span class="sidebar__icon" aria-hidden="true">${t.icon}</span>
                <span class="sidebar__label">${t.label}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </nav>

      <main class="main-content">
        <div id="tab-content"></div>
      </main>

      <nav class="tab-bar" aria-label="Navegação por abas">
        ${TABS.map(t => `
          <a
            href="${t.hash}"
            class="tab-bar__item"
            data-hash="${t.hash}"
            aria-selected="false"
            role="tab"
          >
            <span class="tab-bar__icon" aria-hidden="true">${t.icon}</span>
            <span class="tab-bar__label">${t.label}</span>
          </a>
        `).join('')}
      </nav>
    `;
  }

  // ------------------------------------------------------- hash routing

  _currentHash() {
    return window.location.hash || DEFAULT_HASH;
  }

  _onHashChange() {
    this._applyHash();
  }

  _applyHash() {
    // Set default hash without pushing a new history entry
    if (!window.location.hash) {
      history.replaceState(null, '', DEFAULT_HASH);
    }

    const hash = this._currentHash();
    this._updateActiveNav(hash);
    this._swapContent(hash);
  }

  // -------------------------------------------------- active nav state

  _updateActiveNav(hash) {
    // Sidebar items
    this.querySelectorAll('.sidebar__item').forEach(el => {
      const isActive = el.dataset.hash === hash;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Bottom tab bar items
    this.querySelectorAll('.tab-bar__item').forEach(el => {
      const isActive = el.dataset.hash === hash;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  // ----------------------------------------------- content swap

  _swapContent(hash) {
    const contentArea = this.querySelector('#tab-content');
    if (!contentArea) return;

    const tab = TABS.find(t => t.hash === hash);

    if (!tab) {
      contentArea.innerHTML = `<div class="tab-placeholder"><p>Tab não encontrada: ${hash}</p></div>`;
      return;
    }

    // Try to use the real custom element if registered; fall back to placeholder
    const tagDefined = customElements.get(tab.tag);
    if (tagDefined) {
      contentArea.innerHTML = '';
      contentArea.appendChild(document.createElement(tab.tag));
    } else {
      contentArea.innerHTML = `
        <div class="tab-placeholder card">
          <span aria-hidden="true" style="font-size:2rem">${tab.icon}</span>
          <h2 style="margin-top:0.5rem">${tab.label}</h2>
          <p style="margin-top:0.25rem">Conteúdo da aba <strong>${tab.label}</strong> em breve.</p>
        </div>
      `;
    }
  }
}

customElements.define('app-shell', AppShell);
