// components/training-log.js
// Light DOM Web Component — filterable list of training log entries.

import { loadState, deleteTrainingLog } from '../js/storage.js';
import { POSITION_LABELS, SUBMISSION_LABELS, MOODS } from '../js/data.js';

const MOOD_EMOJI = Object.fromEntries(MOODS.map(m => [m.value, m.emoji]));

const DURATION_LABELS = {
  '30min': '30 min',
  '1h': '1h',
  '1h30': '1h30',
  '2h': '2h'
};

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}`;
}

function filterByPeriod(logs, period) {
  if (period === 'all') return logs;
  const now = new Date();
  const cutoff = new Date(now);
  if (period === 'week') {
    cutoff.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    cutoff.setDate(now.getDate() - 30);
  }
  return logs.filter(log => new Date(log.date) >= cutoff);
}

function positionTagsHTML(positions, color = 'var(--accent-blue)') {
  if (!positions || positions.length === 0) return '';
  return positions.map(p => `
    <span style="
      display: inline-block;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      background: ${color};
      color: #fff;
      font-size: 0.7rem;
      font-weight: 600;
      white-space: nowrap;
      line-height: 1.4;
    ">${POSITION_LABELS[p] || p}</span>
  `).join('');
}

class TrainingLog extends HTMLElement {
  constructor() {
    super();
    this._period = 'all';
    this._expandedIds = new Set();
  }

  connectedCallback() {
    this._render();
    this._onStateChanged = () => this._render();
    document.addEventListener('state-changed', this._onStateChanged);
  }

  disconnectedCallback() {
    document.removeEventListener('state-changed', this._onStateChanged);
  }

  // ----------------------------------------------------------------- render

  _render() {
    const state = loadState();
    const allLogs = state.training?.logs || [];
    const filtered = filterByPeriod(allLogs, this._period);

    const filterBtns = [
      { value: 'week', label: 'Semana' },
      { value: 'month', label: 'Mês' },
      { value: 'all', label: 'Tudo' }
    ].map(({ value, label }) => {
      const active = this._period === value;
      return `
        <button
          type="button"
          class="period-btn"
          data-period="${value}"
          style="
            padding: var(--space-1) var(--space-3);
            border-radius: var(--radius-full);
            border: none;
            cursor: pointer;
            font-size: 0.85rem;
            font-family: inherit;
            font-weight: ${active ? '600' : '400'};
            background: ${active ? 'var(--accent-blue)' : 'var(--bg-surface)'};
            color: ${active ? '#fff' : 'var(--text-secondary)'};
            transition: background 0.15s, color 0.15s;
          "
        >${label}</button>
      `;
    }).join('');

    let logsHTML = '';
    if (filtered.length === 0) {
      logsHTML = `
        <div style="text-align: center; padding: var(--space-8) var(--space-4); color: var(--text-secondary); font-size: 0.95rem;">
          Nenhum treino registrado ainda. Bora treinar! 🥋
        </div>
      `;
    } else {
      logsHTML = filtered.map(log => this._renderLogCard(log)).join('');
    }

    this.innerHTML = `
      <div class="training-log" style="display: flex; flex-direction: column; gap: var(--space-3);">
        <!-- Filter -->
        <div style="display: flex; gap: var(--space-2); align-items: center;">
          <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">Período:</span>
          ${filterBtns}
        </div>

        <!-- Log entries -->
        <div class="log-list" style="display: flex; flex-direction: column; gap: var(--space-2);">
          ${logsHTML}
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _renderLogCard(log) {
    const expanded = this._expandedIds.has(log.id);
    const moodEmoji = log.mood ? (MOOD_EMOJI[log.mood] || '') : '';
    const durationLabel = DURATION_LABELS[log.duration] || log.duration || '';

    const posGotHTML = positionTagsHTML(log.positionsGot);
    const posLostHTML = positionTagsHTML(log.positionsLost);

    let expandedSection = '';
    if (expanded) {
      const subsAttempted = (log.submissionsAttempted || []).map(s => SUBMISSION_LABELS[s] || s).join(', ') || '—';
      const subsLanded = (log.submissionsLanded || []).map(s => SUBMISSION_LABELS[s] || s).join(', ') || '—';
      const notesText = log.notes ? log.notes : '—';

      expandedSection = `
        <div class="log-expanded" style="
          padding: var(--space-3) var(--space-4) var(--space-4);
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          font-size: 0.87rem;
        ">
          <div>
            <span style="color: var(--text-secondary); font-weight: 600;">Notas: </span>
            <span style="color: var(--text-primary);">${notesText}</span>
          </div>
          <div>
            <span style="color: var(--text-secondary); font-weight: 600;">Finalizações tentadas: </span>
            <span style="color: var(--text-primary);">${subsAttempted}</span>
          </div>
          <div>
            <span style="color: var(--text-secondary); font-weight: 600;">Finalizações concluídas: </span>
            <span style="color: var(--text-primary);">${subsLanded}</span>
          </div>
          ${(log.positionsLost && log.positionsLost.length > 0) ? `
          <div>
            <div style="color: var(--text-secondary); font-weight: 600; margin-bottom: 4px;">Posições perdidas:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${positionTagsHTML(log.positionsLost, 'var(--accent-red)')}
            </div>
          </div>
          ` : ''}
        </div>
      `;
    }

    const chevron = expanded ? '▲' : '▼';

    return `
      <div class="log-card card" data-id="${log.id}" style="overflow: hidden; cursor: pointer; transition: border-color 0.15s;">
        <!-- Card header -->
        <div class="log-card-header" data-id="${log.id}" style="
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
        ">
          <!-- Top row: date, duration, mood, actions -->
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div style="
              font-weight: 700;
              font-size: 1rem;
              color: var(--text-primary);
              min-width: 44px;
            ">${formatDate(log.date)}</div>

            <div style="
              font-size: 0.8rem;
              color: var(--text-secondary);
              padding: 2px 8px;
              background: var(--bg-surface);
              border-radius: var(--radius-full);
            ">${durationLabel}</div>

            ${moodEmoji ? `<div style="font-size: 1.2rem;">${moodEmoji}</div>` : ''}

            <div style="flex: 1;"></div>

            <!-- Chevron -->
            <span style="
              color: var(--text-secondary);
              font-size: 0.7rem;
              transition: transform 0.2s;
              ${expanded ? 'transform: rotate(180deg);' : ''}
            ">${chevron}</span>

            <!-- Delete button -->
            <button
              type="button"
              class="btn-delete-log"
              data-id="${log.id}"
              style="
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 1rem;
                padding: var(--space-1);
                border-radius: var(--radius-sm);
                line-height: 1;
                flex-shrink: 0;
                transition: color 0.15s;
              "
              title="Excluir treino"
            >✕</button>
          </div>

          <!-- Bottom row: position chips -->
          ${posGotHTML ? `
          <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
            ${posGotHTML}
          </div>
          ` : ''}
        </div>

        ${expandedSection}
      </div>
    `;
  }

  // ----------------------------------------------------------------- events

  _bindEvents() {
    // Period filter
    this.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._period = btn.dataset.period;
        this._render();
      });
    });

    // Card expand/collapse
    this.querySelectorAll('.log-card-header').forEach(header => {
      header.addEventListener('click', e => {
        // Don't toggle when clicking delete button
        if (e.target.closest('.btn-delete-log')) return;
        const id = header.dataset.id;
        if (this._expandedIds.has(id)) {
          this._expandedIds.delete(id);
        } else {
          this._expandedIds.add(id);
        }
        this._render();
      });
    });

    // Delete
    this.querySelectorAll('.btn-delete-log').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (window.confirm('Excluir este registro de treino?')) {
          this._expandedIds.delete(id);
          deleteTrainingLog(id);
          // state-changed will trigger re-render
        }
      });
    });
  }
}

customElements.define('training-log', TrainingLog);
