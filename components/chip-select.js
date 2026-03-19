class ChipSelect extends HTMLElement {
  static get observedAttributes() {
    return ['name'];
  }

  set options(val) {
    this._options = val;
    if (this.isConnected) this.render();
  }

  get options() {
    return this._options || [];
  }

  set selected(val) {
    this._selected = Array.isArray(val) ? val : [];
    if (this.isConnected) this.render();
  }

  get selected() {
    return this._selected || [];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  _isSelected(value) {
    return this.selected.includes(value);
  }

  render() {
    const name = this.getAttribute('name') || '';

    const chipsHTML = this.options.map(({ value, label }) => {
      const sel = this._isSelected(value);
      return `
        <button
          class="chip-select-chip"
          data-value="${value}"
          type="button"
          style="
            display: inline-flex;
            align-items: center;
            padding: var(--space-1) var(--space-3, 12px);
            border-radius: var(--radius-full);
            border: none;
            cursor: pointer;
            font-size: 0.85rem;
            font-family: inherit;
            transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
            background: ${sel ? 'var(--accent-blue)' : 'var(--bg-surface)'};
            color: ${sel ? '#ffffff' : 'var(--text-secondary)'};
          "
        >${label}</button>
      `;
    }).join('');

    this.innerHTML = `
      <div class="chip-select-row" style="
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      ">
        ${chipsHTML}
      </div>
    `;

    this._bindChipEvents(name);
  }

  _bindChipEvents(name) {
    this.querySelectorAll('.chip-select-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const value = chip.dataset.value;
        const currentSelected = [...this.selected];
        const idx = currentSelected.indexOf(value);

        if (idx === -1) {
          currentSelected.push(value);
        } else {
          currentSelected.splice(idx, 1);
        }

        this._selected = currentSelected;
        this.render();

        this.dispatchEvent(new CustomEvent('chips-changed', {
          detail: {
            name,
            selected: this.selected,
          },
          bubbles: true,
        }));
      });

      chip.addEventListener('mousedown', () => {
        chip.style.transform = 'scale(0.93)';
      });
      chip.addEventListener('mouseup', () => {
        chip.style.transform = 'scale(1)';
      });
      chip.addEventListener('mouseleave', () => {
        chip.style.transform = 'scale(1)';
      });
    });
  }
}

customElements.define('chip-select', ChipSelect);
