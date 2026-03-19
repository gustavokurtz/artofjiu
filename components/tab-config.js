// components/tab-config.js
// Light DOM Web Component — Config tab: storage usage, export/import/reset.

import { exportData, importData, resetAll, getStorageUsage, loadState } from '../js/storage.js';

const MAX_STORAGE_BYTES = 5 * 1024 * 1024; // 5 MB

class TabConfig extends HTMLElement {
  constructor() {
    super();
    this._resetPending = false;
    this._resetTimer = null;
  }

  connectedCallback() {
    this._render();
    this._bindLocalEvents();
    this._bindGlobalEvents();
  }

  disconnectedCallback() {
    document.removeEventListener('storage-full', this._onStorageFull);
    document.removeEventListener('state-changed', this._onStateChanged);
    if (this._resetTimer) clearTimeout(this._resetTimer);
  }

  // ----------------------------------------------------------------- render

  _render() {
    const usageBytes = getStorageUsage();
    const usageKB = Math.round(usageBytes / 1024);
    const maxKB = Math.round(MAX_STORAGE_BYTES / 1024);

    this.innerHTML = `
      <div class="tab-config" style="
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
        max-width: 600px;
      ">

        <!-- Storage full warning banner (hidden by default) -->
        <div class="storage-full-banner" style="
          display: none;
          background: rgba(239,68,68,0.15);
          border: 1px solid var(--accent-red);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          color: var(--accent-red);
          font-size: 0.9rem;
          font-weight: 600;
        ">
          Storage cheio. Exporte seus dados e limpe treinos antigos.
        </div>

        <!-- Section: Storage Usage -->
        <section class="card" style="padding: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-3); font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Uso de Armazenamento</h2>
          <div class="storage-usage" style="display: flex; flex-direction: column; gap: var(--space-2);">
            <p class="storage-label" style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">
              Usando <strong style="color: var(--text-primary);">${usageKB} KB</strong> de ~${maxKB} KB
            </p>
            <progress-bar value="${usageKB}" max="${maxKB}"></progress-bar>
          </div>
        </section>

        <!-- Section: Export / Import -->
        <section class="card" style="padding: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-3); font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Dados</h2>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">

            <!-- Export -->
            <div>
              <button
                type="button"
                class="btn-export"
                style="${btnStyle('var(--accent-blue)')}"
              >Exportar Dados</button>
              <p style="margin: var(--space-1) 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                Faz download de um arquivo JSON com todos os seus dados.
              </p>
            </div>

            <!-- Import -->
            <div>
              <button
                type="button"
                class="btn-import"
                style="${btnStyle('var(--bg-surface)', 'rgba(255,255,255,0.15)')}"
              >Importar Dados</button>
              <p style="margin: var(--space-1) 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                Restaura dados de um backup JSON. Os dados atuais serão substituídos após confirmação.
              </p>
              <!-- Hidden file input -->
              <input type="file" accept=".json" class="file-input" style="display: none;" />
            </div>

            <!-- Import preview -->
            <div class="import-preview" style="
              display: none;
              background: var(--bg-surface);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: var(--radius-md);
              padding: var(--space-3) var(--space-4);
            ">
              <p class="import-preview-text" style="margin: 0 0 var(--space-3); font-size: 0.9rem; color: var(--text-primary);"></p>
              <div style="display: flex; gap: var(--space-2);">
                <button type="button" class="btn-import-confirm" style="${btnStyle('var(--accent-green)')}">Importar</button>
                <button type="button" class="btn-import-cancel" style="${btnStyle('var(--bg-surface)', 'rgba(255,255,255,0.15)')}">Cancelar</button>
              </div>
            </div>

            <!-- Import feedback -->
            <div class="import-feedback" style="display: none; font-size: 0.85rem; color: var(--accent-green); font-weight: 600;"></div>

          </div>
        </section>

        <!-- Section: Reset (danger zone) -->
        <section class="card" style="
          padding: var(--space-4);
          border: 1px solid rgba(239,68,68,0.3);
        ">
          <h2 style="margin: 0 0 var(--space-2); font-size: 1.1rem; font-family: var(--font-heading); color: var(--accent-red);">Zona de Perigo</h2>
          <p style="margin: 0 0 var(--space-3); font-size: 0.85rem; color: var(--text-secondary);">
            Esta ação apaga permanentemente todos os seus dados e não pode ser desfeita.
          </p>
          <button
            type="button"
            class="btn-reset"
            style="${btnStyle('var(--accent-red)')}"
          >Resetar Tudo</button>
          <!-- Reset feedback -->
          <div class="reset-feedback" style="display: none; margin-top: var(--space-2); font-size: 0.85rem; color: var(--accent-green); font-weight: 600;"></div>
        </section>

      </div>
    `;
  }

  _updateStorageUsage() {
    const usageBytes = getStorageUsage();
    const usageKB = Math.round(usageBytes / 1024);
    const maxKB = Math.round(MAX_STORAGE_BYTES / 1024);

    const label = this.querySelector('.storage-label');
    if (label) {
      label.innerHTML = `Usando <strong style="color: var(--text-primary);">${usageKB} KB</strong> de ~${maxKB} KB`;
    }

    const bar = this.querySelector('progress-bar');
    if (bar) {
      bar.setAttribute('value', usageKB);
      bar.setAttribute('max', maxKB);
    }
  }

  // ----------------------------------------------------------------- events

  _bindLocalEvents() {
    // Export
    const btnExport = this.querySelector('.btn-export');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        exportData();
      });
    }

    // Import: open file picker
    const btnImport = this.querySelector('.btn-import');
    const fileInput = this.querySelector('.file-input');
    if (btnImport && fileInput) {
      btnImport.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
      });

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        this._readImportFile(file);
      });
    }

    // Import confirm
    const btnImportConfirm = this.querySelector('.btn-import-confirm');
    if (btnImportConfirm) {
      btnImportConfirm.addEventListener('click', () => {
        const jsonStr = btnImportConfirm.dataset.json;
        if (!jsonStr) return;
        try {
          importData(jsonStr);
          this._hideImportPreview();
          this._showImportFeedback('Dados importados com sucesso!');
          this._updateStorageUsage();
        } catch (err) {
          this._hideImportPreview();
          this._showImportFeedback(`Erro ao importar: ${err.message}`, true);
        }
      });
    }

    // Import cancel
    const btnImportCancel = this.querySelector('.btn-import-cancel');
    if (btnImportCancel) {
      btnImportCancel.addEventListener('click', () => {
        this._hideImportPreview();
      });
    }

    // Reset
    const btnReset = this.querySelector('.btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (!this._resetPending) {
          // First click: ask for confirmation
          this._resetPending = true;
          btnReset.textContent = 'Tem certeza? Clique novamente para confirmar';
          btnReset.style.background = 'var(--accent-red)';
          btnReset.style.opacity = '0.85';

          this._resetTimer = setTimeout(() => {
            this._cancelReset();
          }, 3000);
        } else {
          // Second click within 3 seconds: perform reset
          clearTimeout(this._resetTimer);
          this._resetPending = false;
          try {
            resetAll();
            this._cancelReset();
            const feedback = this.querySelector('.reset-feedback');
            if (feedback) {
              feedback.textContent = 'Dados resetados com sucesso!';
              feedback.style.display = 'block';
              setTimeout(() => { feedback.style.display = 'none'; }, 4000);
            }
            this._updateStorageUsage();
          } catch (err) {
            this._cancelReset();
          }
        }
      });
    }
  }

  _bindGlobalEvents() {
    this._onStorageFull = () => {
      const banner = this.querySelector('.storage-full-banner');
      if (banner) banner.style.display = 'block';
    };

    this._onStateChanged = () => {
      this._updateStorageUsage();
    };

    document.addEventListener('storage-full', this._onStorageFull);
    document.addEventListener('state-changed', this._onStateChanged);
  }

  // ----------------------------------------------------------------- helpers

  _readImportFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonStr = e.target.result;
      try {
        const data = JSON.parse(jsonStr);

        // Count trainings and checked concepts
        const trainings = data.training?.logs?.length ?? 0;
        let checkedConcepts = 0;
        if (data.modules) {
          for (const mod of Object.values(data.modules)) {
            checkedConcepts += Object.keys(mod.concepts || {}).length;
          }
        }

        this._showImportPreview(jsonStr, trainings, checkedConcepts);
      } catch {
        this._showImportFeedback('Arquivo JSON inválido.', true);
      }
    };
    reader.onerror = () => {
      this._showImportFeedback('Erro ao ler o arquivo.', true);
    };
    reader.readAsText(file);
  }

  _showImportPreview(jsonStr, trainings, concepts) {
    const preview = this.querySelector('.import-preview');
    const previewText = this.querySelector('.import-preview-text');
    const btnConfirm = this.querySelector('.btn-import-confirm');
    const feedback = this.querySelector('.import-feedback');

    if (feedback) feedback.style.display = 'none';

    if (previewText) {
      previewText.textContent = `${trainings} treino${trainings !== 1 ? 's' : ''}, ${concepts} conceito${concepts !== 1 ? 's' : ''} marcado${concepts !== 1 ? 's' : ''} — Importar?`;
    }
    if (btnConfirm) {
      btnConfirm.dataset.json = jsonStr;
    }
    if (preview) {
      preview.style.display = 'block';
    }
  }

  _hideImportPreview() {
    const preview = this.querySelector('.import-preview');
    if (preview) preview.style.display = 'none';
  }

  _showImportFeedback(message, isError = false) {
    const feedback = this.querySelector('.import-feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.style.color = isError ? 'var(--accent-red)' : 'var(--accent-green)';
      feedback.style.display = 'block';
      setTimeout(() => { feedback.style.display = 'none'; }, 4000);
    }
  }

  _cancelReset() {
    this._resetPending = false;
    if (this._resetTimer) {
      clearTimeout(this._resetTimer);
      this._resetTimer = null;
    }
    const btnReset = this.querySelector('.btn-reset');
    if (btnReset) {
      btnReset.textContent = 'Resetar Tudo';
      btnReset.style.background = 'var(--accent-red)';
      btnReset.style.opacity = '1';
    }
  }
}

function btnStyle(bg, border = 'transparent') {
  return `
    background: ${bg};
    color: #fff;
    border: 1px solid ${border};
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
    font-size: 0.9rem;
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  `;
}

customElements.define('tab-config', TabConfig);
