class ProgressBar extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'max', 'label'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    const value = parseFloat(this.getAttribute('value')) || 0;
    const max = parseFloat(this.getAttribute('max')) || 1;
    const label = this.getAttribute('label') || '';
    const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

    this.innerHTML = `
      <div class="progress-bar-wrapper" style="
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        width: 100%;
      ">
        ${label ? `<span class="progress-bar-label" style="
          font-size: 0.8rem;
          color: var(--text-secondary);
        ">${label}</span>` : ''}
        <div class="progress-bar-track" style="
          width: 100%;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          overflow: hidden;
        ">
          <div class="progress-bar-fill" style="
            height: 100%;
            width: 0%;
            border-radius: var(--radius-full);
            background: var(--accent-blue);
            transition: width 0.5s ease;
          "></div>
        </div>
      </div>
    `;

    // Trigger CSS transition after paint
    requestAnimationFrame(() => {
      const fill = this.querySelector('.progress-bar-fill');
      if (fill) {
        fill.style.width = `${percent}%`;
        // Turn green when complete
        if (percent >= 100) {
          fill.classList.add('progress-bar-fill--complete');
        } else {
          fill.classList.remove('progress-bar-fill--complete');
        }
      }
    });
  }
}

customElements.define('progress-bar', ProgressBar);
