// components/training-form.js
// Light DOM Web Component — form for logging a BJJ training session.

import { POSITIONS, POSITION_LABELS, SUBMISSIONS, SUBMISSION_LABELS, MOODS } from '../js/data.js';
import { addTrainingLog } from '../js/storage.js';

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

class TrainingForm extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bindEvents();
  }

  // ----------------------------------------------------------------- render

  _render() {
    const moodBtns = MOODS.map(m => `
      <button
        type="button"
        class="mood-btn"
        data-value="${m.value}"
        style="
          font-size: 1.6rem;
          background: var(--bg-surface);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-3);
          cursor: pointer;
          transition: border-color 0.15s, transform 0.1s;
        "
        title="${m.value}"
      >${m.emoji}</button>
    `).join('');

    this.innerHTML = `
      <div class="training-form card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4);">

        <h3 style="margin: 0; font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">Registrar Treino</h3>

        <!-- Date & Duration row -->
        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
          <label style="display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 140px;">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Data</span>
            <input
              type="date"
              name="date"
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
            <span class="error-date" style="color: var(--accent-red); font-size: 0.78rem; display: none;">Data obrigatória</span>
          </label>

          <label style="display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 140px;">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Duração</span>
            <select
              name="duration"
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
              <option value="30min">30 min</option>
              <option value="1h" selected>1 hora</option>
              <option value="1h30">1h30</option>
              <option value="2h">2 horas</option>
            </select>
          </label>
        </div>

        <!-- Notes -->
        <label style="display: flex; flex-direction: column; gap: var(--space-1);">
          <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Notas</span>
          <textarea
            name="notes"
            rows="3"
            placeholder="O que treinei..."
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

        <!-- Positions Got -->
        <div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-bottom: var(--space-2);">Posições que peguei</div>
          <chip-select name="positions-got"></chip-select>
        </div>

        <!-- Positions Lost -->
        <div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-bottom: var(--space-2);">Posições que perdi</div>
          <chip-select name="positions-lost"></chip-select>
        </div>

        <!-- Submissions Attempted -->
        <div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-bottom: var(--space-2);">Finalizações que tentei</div>
          <chip-select name="subs-attempted"></chip-select>
        </div>

        <!-- Submissions Landed -->
        <div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-bottom: var(--space-2);">Finalizações que peguei</div>
          <chip-select name="subs-landed"></chip-select>
        </div>

        <!-- Mood -->
        <div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-bottom: var(--space-2);">Humor do treino</div>
          <div class="mood-selector" style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            ${moodBtns}
          </div>
        </div>

        <!-- Submit -->
        <button
          type="button"
          class="btn-save-training"
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
        >Salvar Treino</button>

      </div>
    `;

    // Set chip-select options after innerHTML
    const posOpts = POSITIONS.map(p => ({ value: p, label: POSITION_LABELS[p] }));
    const subOpts = SUBMISSIONS.map(s => ({ value: s, label: SUBMISSION_LABELS[s] }));

    this.querySelector('chip-select[name="positions-got"]').options = posOpts;
    this.querySelector('chip-select[name="positions-lost"]').options = posOpts;
    this.querySelector('chip-select[name="subs-attempted"]').options = subOpts;
    this.querySelector('chip-select[name="subs-landed"]').options = subOpts;
  }

  // ----------------------------------------------------------------- events

  _bindEvents() {
    // Mood buttons
    this.addEventListener('click', e => {
      const moodBtn = e.target.closest('.mood-btn');
      if (moodBtn) {
        this.querySelectorAll('.mood-btn').forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = 'transparent';
          b.style.transform = 'scale(1)';
        });
        moodBtn.classList.add('selected');
        moodBtn.style.borderColor = 'var(--accent-blue)';
        moodBtn.style.transform = 'scale(1.1)';
      }
    });

    // Save button
    this.querySelector('.btn-save-training').addEventListener('click', () => {
      this._handleSave();
    });
  }

  _handleSave() {
    const dateInput = this.querySelector('input[name="date"]');
    const durationSelect = this.querySelector('select[name="duration"]');
    const notesTextarea = this.querySelector('textarea[name="notes"]');
    const errorDate = this.querySelector('.error-date');

    // Validate date
    if (!dateInput.value) {
      errorDate.style.display = 'block';
      dateInput.focus();
      return;
    }
    errorDate.style.display = 'none';

    // Collect chips
    const positionsGotChips = this.querySelector('chip-select[name="positions-got"]');
    const positionsLostChips = this.querySelector('chip-select[name="positions-lost"]');
    const subsAttemptedChips = this.querySelector('chip-select[name="subs-attempted"]');
    const subsLandedChips = this.querySelector('chip-select[name="subs-landed"]');

    // Mood
    const selectedMoodBtn = this.querySelector('.mood-btn.selected');
    const selectedMood = selectedMoodBtn ? selectedMoodBtn.dataset.value : null;

    const entry = {
      id: crypto.randomUUID(),
      date: dateInput.value,
      duration: durationSelect.value,
      notes: notesTextarea.value,
      positionsGot: positionsGotChips.selected,
      positionsLost: positionsLostChips.selected,
      submissionsAttempted: subsAttemptedChips.selected,
      submissionsLanded: subsLandedChips.selected,
      mood: selectedMood,
      createdAt: new Date().toISOString()
    };

    addTrainingLog(entry);

    this.dispatchEvent(new CustomEvent('training-saved', { bubbles: true }));

    this._resetForm();
  }

  _resetForm() {
    const dateInput = this.querySelector('input[name="date"]');
    const durationSelect = this.querySelector('select[name="duration"]');
    const notesTextarea = this.querySelector('textarea[name="notes"]');

    dateInput.value = todayISO();
    durationSelect.value = '1h';
    notesTextarea.value = '';

    // Reset chip selects
    ['positions-got', 'positions-lost', 'subs-attempted', 'subs-landed'].forEach(name => {
      const cs = this.querySelector(`chip-select[name="${name}"]`);
      if (cs) cs.selected = [];
    });

    // Reset mood
    this.querySelectorAll('.mood-btn').forEach(b => {
      b.classList.remove('selected');
      b.style.borderColor = 'transparent';
      b.style.transform = 'scale(1)';
    });
  }
}

customElements.define('training-form', TrainingForm);
