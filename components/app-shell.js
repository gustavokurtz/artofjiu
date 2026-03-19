// components/app-shell.js
// Main layout Web Component — light DOM (no Shadow DOM) so global CSS applies.

const TABS = [
  { hash: '#modules',  label: 'Módulos',   icon: '📚', tag: 'tab-modules'  },
  { hash: '#gameplan', label: 'Game Plan', icon: '🗺️', tag: 'tab-gameplan' },
  { hash: '#training', label: 'Treino',    icon: '🥋', tag: 'tab-training' },
  { hash: '#config',   label: 'Config',    icon: '⚙️', tag: 'tab-config'   },
];

const DEFAULT_HASH = '#modules';

// 🥋 Easter egg — type "oss" anywhere
const MASTER_QUOTES = [
  { text: "Não existe cara durão pra estrangulamento.", author: "Hélio Gracie" },
  { text: "O Jiu-Jitsu é perfeito. São as pessoas que precisam melhorar.", author: "Hélio Gracie" },
  { text: "Se você quer ser um leão, treine com leões.", author: "Carlson Gracie" },
  { text: "Jiu-Jitsu é a arte de manter a calma quando todo mundo está tentando te matar.", author: "Renzo Gracie" },
  { text: "O tatame é o espelho que não mente.", author: "Carlos Gracie Jr." },
  { text: "Flua como a água. Se você não consegue ir por cima, vá por baixo.", author: "Jean Jacques Machado" },
  { text: "O cara mais perigoso é aquele que sabe perder sem perder a cabeça.", author: "Rickson Gracie" },
  { text: "Você não perde no Jiu-Jitsu. Ou você ganha, ou você aprende.", author: "Carlos Gracie Sr." },
  { text: "O Jiu-Jitsu ensina que a pressão transforma carvão em diamante.", author: "Saulo Ribeiro" },
  { text: "Faixa preta é uma faixa branca que nunca desistiu.", author: "Ditado do Jiu-Jitsu" },
  { text: "Quanto mais você sua no treino, menos sangra na luta.", author: "Richard Marcinko" },
  { text: "A maior vitória é aquela sobre si mesmo.", author: "Jigoro Kano" },
];

let _ossBuffer = '';
let _ossTimer = null;

function initOssListener() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

    _ossBuffer += e.key.toLowerCase();
    clearTimeout(_ossTimer);
    _ossTimer = setTimeout(() => { _ossBuffer = ''; }, 1500);

    if (_ossBuffer.includes('oss')) {
      _ossBuffer = '';
      showMasterQuote();
    }
  });
}

function showMasterQuote() {
  const existing = document.querySelector('.oss-overlay');
  if (existing) existing.remove();

  const quote = MASTER_QUOTES[Math.floor(Math.random() * MASTER_QUOTES.length)];

  const overlay = document.createElement('div');
  overlay.className = 'oss-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    animation: tab-fade-in 300ms ease both;
    cursor: pointer;
  `;
  overlay.innerHTML = `
    <div style="
      max-width: 480px; padding: 40px 32px;
      text-align: center;
      animation: slide-up 500ms ease both;
    ">
      <div style="font-size: 3rem; margin-bottom: 24px;">🥋</div>
      <p style="
        font-family: var(--font-heading);
        font-size: 1.4rem;
        color: var(--text-primary);
        line-height: 1.5;
        font-style: italic;
        margin-bottom: 20px;
      ">"${quote.text}"</p>
      <p style="
        font-size: 0.95rem;
        color: var(--accent-blue);
        font-weight: 600;
      ">— ${quote.author}</p>
      <p style="
        margin-top: 32px;
        font-size: 0.75rem;
        color: var(--text-secondary);
      ">OSS! 🤙 (clique para fechar)</p>
    </div>
  `;
  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 200ms ease';
    setTimeout(() => overlay.remove(), 200);
  });
  document.body.appendChild(overlay);
}

initOssListener();

class AppShell extends HTMLElement {
  connectedCallback() {
    this._render();
    this._boundOnHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._boundOnHashChange);

    // Wait for all tab components to be registered before first render
    const tabTags = TABS.map(t => t.tag);
    Promise.all(tabTags.map(tag => customElements.whenDefined(tag)))
      .then(() => this._applyHash());
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
