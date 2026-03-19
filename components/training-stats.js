// components/training-stats.js
// Light DOM Web Component — statistics dashboard derived from training logs.

import { loadState } from '../js/storage.js';
import { POSITION_LABELS, SUBMISSION_LABELS } from '../js/data.js';

function countOccurrences(logs, field) {
  const counts = {};
  for (const log of logs) {
    const items = log[field] || [];
    for (const item of items) {
      counts[item] = (counts[item] || 0) + 1;
    }
  }
  return counts;
}

function topN(countMap, n, labelMap) {
  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, label: labelMap[key] || key, count }));
}

function calcStreak(logs) {
  if (logs.length === 0) return 0;

  // Build set of ISO week strings (YYYY-Www) that have at least one training
  const weeksWithTraining = new Set();
  for (const log of logs) {
    if (!log.date) continue;
    const d = new Date(log.date + 'T12:00:00');
    const week = getISOWeek(d);
    weeksWithTraining.add(week);
  }

  // Walk backwards from current week
  let streak = 0;
  let d = new Date();
  while (true) {
    const week = getISOWeek(d);
    if (weeksWithTraining.has(week)) {
      streak++;
      d.setDate(d.getDate() - 7);
    } else {
      break;
    }
  }
  return streak;
}

function getISOWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function logsLastNDays(logs, days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return logs.filter(l => l.date && new Date(l.date + 'T12:00:00') >= cutoff);
}

function subSuccessRates(logs) {
  // Per-submission: { attempted, landed }
  const map = {};
  for (const log of logs) {
    for (const s of (log.submissionsAttempted || [])) {
      if (!map[s]) map[s] = { attempted: 0, landed: 0 };
      map[s].attempted++;
    }
    for (const s of (log.submissionsLanded || [])) {
      if (!map[s]) map[s] = { attempted: 0, landed: 0 };
      map[s].landed++;
    }
  }
  return map;
}

function statCardHTML({ title, main, sub, accent }) {
  return `
    <div class="stat-card" style="
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      min-width: 180px;
      flex: 1 0 180px;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    ">
      <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">${title}</div>
      <div style="font-size: 1.8rem; font-weight: 700; color: ${accent || 'var(--text-primary)'}; line-height: 1.1;">${main}</div>
      ${sub ? `<div style="font-size: 0.8rem; color: var(--text-secondary);">${sub}</div>` : ''}
    </div>
  `;
}

function topListCardHTML({ title, items, emptyText, accent }) {
  const listHTML = items.length === 0
    ? `<div style="color: var(--text-secondary); font-size: 0.85rem;">${emptyText}</div>`
    : items.map((item, i) => `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-2);">
          <div style="display: flex; align-items: center; gap: var(--space-2); min-width: 0;">
            <span style="
              font-size: 0.7rem;
              font-weight: 700;
              color: #fff;
              background: ${accent || 'var(--accent-blue)'};
              border-radius: var(--radius-full);
              width: 18px;
              height: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            ">${i + 1}</span>
            <span style="font-size: 0.85rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.label}</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-secondary); flex-shrink: 0;">${item.count}x</span>
        </div>
      `).join('');

  return `
    <div class="stat-card" style="
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      min-width: 200px;
      flex: 1 0 200px;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    ">
      <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">${title}</div>
      <div style="display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-1);">
        ${listHTML}
      </div>
    </div>
  `;
}

class TrainingStats extends HTMLElement {
  connectedCallback() {
    this._render();
    this._onStateChanged = () => this._render();
    document.addEventListener('state-changed', this._onStateChanged);
  }

  disconnectedCallback() {
    document.removeEventListener('state-changed', this._onStateChanged);
  }

  _render() {
    const state = loadState();
    const logs = state.training?.logs || [];

    if (logs.length === 0) {
      this.innerHTML = `
        <div style="
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.95rem;
        ">
          Registre treinos para ver suas estatísticas
        </div>
      `;
      return;
    }

    // Calculations
    const last4WeeksLogs = logsLastNDays(logs, 28);
    const streak = calcStreak(logs);

    const posGotCounts = countOccurrences(logs, 'positionsGot');
    const posLostCounts = countOccurrences(logs, 'positionsLost');
    const topGot = topN(posGotCounts, 3, POSITION_LABELS);
    const topLost = topN(posLostCounts, 3, POSITION_LABELS);

    // Submission rate
    const totalAttempted = logs.reduce((acc, l) => acc + (l.submissionsAttempted?.length || 0), 0);
    const totalLanded = logs.reduce((acc, l) => acc + (l.submissionsLanded?.length || 0), 0);
    const subRate = totalAttempted > 0 ? Math.round((totalLanded / totalAttempted) * 100) : null;

    // Top 3 submissions by individual success rate (min 1 attempted)
    const subRates = subSuccessRates(logs);
    const topSubs = Object.entries(subRates)
      .filter(([, v]) => v.attempted > 0)
      .map(([key, v]) => ({
        key,
        label: SUBMISSION_LABELS[key] || key,
        count: v.landed,
        rate: Math.round((v.landed / v.attempted) * 100)
      }))
      .sort((a, b) => b.rate - a.rate || b.count - a.count)
      .slice(0, 3);

    const cards = [
      statCardHTML({
        title: 'Treinos (4 sem / total)',
        main: `${last4WeeksLogs.length}`,
        sub: `${logs.length} treinos no total`,
        accent: 'var(--accent-blue)'
      }),
      statCardHTML({
        title: 'Sequência de semanas',
        main: `${streak}`,
        sub: streak === 1 ? 'semana seguida' : 'semanas seguidas',
        accent: streak >= 3 ? 'var(--accent-amber)' : 'var(--text-primary)'
      }),
      topListCardHTML({
        title: 'Top posições pegadas',
        items: topGot,
        emptyText: 'Sem dados',
        accent: 'var(--accent-green)'
      }),
      topListCardHTML({
        title: 'Top posições perdidas',
        items: topLost,
        emptyText: 'Sem dados',
        accent: 'var(--accent-red)'
      }),
      statCardHTML({
        title: 'Taxa de finalização',
        main: subRate !== null ? `${subRate}%` : '—',
        sub: subRate !== null ? `${totalLanded} de ${totalAttempted} tentativas` : 'Sem finalizações registradas',
        accent: subRate !== null && subRate >= 50 ? 'var(--accent-green)' : 'var(--accent-amber)'
      }),
      topListCardHTML({
        title: 'Top finalizações efetivas',
        items: topSubs.map(s => ({ label: `${s.label} (${s.rate}%)`, count: s.count })),
        emptyText: 'Sem dados',
        accent: 'var(--accent-blue)'
      })
    ].join('');

    this.innerHTML = `
      <div class="training-stats" style="
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: var(--space-2);
      ">
        <div style="
          display: flex;
          gap: var(--space-3);
          min-width: max-content;
        ">
          ${cards}
        </div>
      </div>

      <style>
        @media (min-width: 768px) {
          .training-stats > div {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr);
            min-width: unset !important;
          }
        }
      </style>
    `;
  }
}

customElements.define('training-stats', TrainingStats);
