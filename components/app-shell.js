// components/app-shell.js
// Main layout Web Component — light DOM (no Shadow DOM) so global CSS applies.

const TABS = [
  { hash: '#modules',  label: 'Módulos',   icon: '📚', tag: 'tab-modules'  },
  { hash: '#gameplan', label: 'Game Plan', icon: '🗺️', tag: 'tab-gameplan' },
  { hash: '#training', label: 'Treino',    icon: '🥋', tag: 'tab-training' },
  { hash: '#notes',    label: 'Notas',     icon: '📝', tag: 'tab-notes'    },
  { hash: '#config',   label: 'Config',    icon: '⚙️', tag: 'tab-config'   },
];

const DEFAULT_HASH = '#modules';
const UNLOCK_KEY = 'bjj-tracker-unlocked';

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

function isUnlocked() {
  return localStorage.getItem(UNLOCK_KEY) === '1';
}

class AppShell extends HTMLElement {
  connectedCallback() {
    if (isUnlocked()) {
      this._boot();
    } else {
      this._renderLockScreen();
    }
  }

  disconnectedCallback() {
    if (this._boundOnHashChange) {
      window.removeEventListener('hashchange', this._boundOnHashChange);
    }
  }

  // ------------------------------------------------------- lock screen

  _renderLockScreen() {
    this.innerHTML = `
      <div class="lock-screen" style="
        position: fixed; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: var(--bg-primary);
        z-index: 9999;
      ">
        <div style="
          text-align: center;
          max-width: 360px;
          padding: 0 var(--space-4);
          animation: slide-up 600ms ease both;
        ">
          <div style="font-size: 4rem; margin-bottom: var(--space-6);">🥋</div>
          <h1 style="
            font-family: var(--font-heading);
            font-size: var(--text-2xl);
            color: var(--text-primary);
            margin-bottom: var(--space-2);
          ">BJJ GI Study Tracker</h1>
          <p style="
            color: var(--text-secondary);
            font-size: var(--text-sm);
            margin-bottom: var(--space-8);
          ">Saudação para entrar no tatame</p>
          <input
            type="text"
            class="lock-input"
            placeholder="..."
            autocomplete="off"
            spellcheck="false"
            style="
              width: 100%;
              max-width: 200px;
              text-align: center;
              background: var(--bg-surface);
              border: 2px solid rgba(255,255,255,0.1);
              border-radius: var(--radius-lg);
              color: var(--text-primary);
              padding: var(--space-3) var(--space-4);
              font-size: var(--text-lg);
              font-family: var(--font-heading);
              letter-spacing: 0.1em;
              outline: none;
              transition: border-color 0.2s;
            "
          />
          <p class="lock-error" style="
            color: var(--accent-red);
            font-size: var(--text-xs);
            margin-top: var(--space-2);
            opacity: 0;
            transition: opacity 0.2s;
          ">Não é essa a saudação...</p>
        </div>
      </div>
    `;

    const input = this.querySelector('.lock-input');
    const error = this.querySelector('.lock-error');
    input.focus();

    input.addEventListener('input', () => {
      const val = input.value.trim().toLowerCase();
      error.style.opacity = '0';
      if (val === 'oss') {
        this._unlock(input);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value.trim().toLowerCase();
        if (val === 'oss') {
          this._unlock(input);
        } else if (val.length > 0) {
          error.style.opacity = '1';
          input.style.borderColor = 'var(--accent-red)';
          setTimeout(() => {
            input.style.borderColor = 'rgba(255,255,255,0.1)';
          }, 600);
        }
      }
    });
  }

  _unlock(input) {
    input.disabled = true;
    input.style.borderColor = 'var(--accent-green)';

    localStorage.setItem(UNLOCK_KEY, '1');

    const quote = MASTER_QUOTES[Math.floor(Math.random() * MASTER_QUOTES.length)];
    const lockScreen = this.querySelector('.lock-screen');

    // Show quote briefly, then transition to app
    const quoteDiv = document.createElement('div');
    quoteDiv.style.cssText = `
      margin-top: var(--space-8);
      animation: fade-in 500ms ease both;
    `;
    quoteDiv.innerHTML = `
      <p style="
        font-family: var(--font-heading);
        font-size: var(--text-lg);
        color: var(--text-primary);
        font-style: italic;
        line-height: 1.5;
        margin-bottom: var(--space-3);
      ">"${quote.text}"</p>
      <p style="
        font-size: var(--text-sm);
        color: var(--accent-blue);
        font-weight: 600;
      ">— ${quote.author}</p>
      <p style="
        margin-top: var(--space-6);
        font-size: var(--text-xs);
        color: var(--text-secondary);
      ">OSS! 🤙</p>
    `;
    input.parentElement.appendChild(quoteDiv);

    setTimeout(() => {
      lockScreen.style.transition = 'opacity 400ms ease';
      lockScreen.style.opacity = '0';
      setTimeout(() => {
        lockScreen.remove();
        this._boot();
      }, 400);
    }, 2500);
  }

  // ------------------------------------------------------- app boot

  _boot() {
    this._render();
    this._boundOnHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._boundOnHashChange);

    const tabTags = TABS.map(t => t.tag);
    Promise.all(tabTags.map(tag => customElements.whenDefined(tag)))
      .then(() => this._applyHash());
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
