class StudyCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'checked', 'date', 'item-id', 'module-slug'];
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
      this._bindEvents();
    }
  }

  get _checked() {
    return this.hasAttribute('checked');
  }

  _formatDate(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `Marcado em ${day}/${month}/${year}`;
  }

  render() {
    const label = this.getAttribute('label') || '';
    const checked = this._checked;
    const date = this.getAttribute('date') || '';
    const dateText = checked ? this._formatDate(date) : '';

    this.innerHTML = `
      <label class="study-checkbox-label" style="
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        cursor: pointer;
        user-select: none;
      ">
        <span style="display: flex; align-items: center; gap: var(--space-2);">
          <span class="study-checkbox-box" style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: var(--radius-sm);
            border: 2px solid ${checked ? 'var(--accent-blue)' : 'var(--text-secondary)'};
            background: ${checked ? 'var(--accent-blue)' : 'transparent'};
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
            flex-shrink: 0;
          ">
            ${checked ? `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6L5 9L10 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>` : ''}
          </span>
          <span style="
            color: ${checked ? 'var(--text-primary)' : 'var(--text-secondary)'};
            font-size: 0.9rem;
            transition: color 0.2s ease;
          ">${label}</span>
        </span>
        ${dateText ? `<span class="study-checkbox-date" style="
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding-left: 28px;
        ">${dateText}</span>` : ''}
      </label>
    `;
  }

  _bindEvents() {
    const label = this.querySelector('.study-checkbox-label');
    if (!label) return;

    label.addEventListener('click', (e) => {
      e.preventDefault();
      const box = this.querySelector('.study-checkbox-box');
      const wasChecked = this._checked;

      if (box) {
        if (!wasChecked) {
          // Checking: scale up pulse animation
          box.classList.remove('checkbox-check-anim');
          // Force reflow to restart animation
          void box.offsetWidth;
          box.classList.add('checkbox-check-anim');
        } else {
          box.style.transform = 'scale(0.85)';
          setTimeout(() => { box.style.transform = 'scale(1)'; }, 150);
        }
      }

      if (wasChecked) {
        this.removeAttribute('checked');
      } else {
        this.setAttribute('checked', '');
      }

      this.dispatchEvent(new CustomEvent('checkbox-toggle', {
        detail: {
          id: this.getAttribute('item-id'),
          moduleSlug: this.getAttribute('module-slug'),
          checked: !wasChecked,
        },
        bubbles: true,
      }));
    });
  }
}

customElements.define('study-checkbox', StudyCheckbox);
