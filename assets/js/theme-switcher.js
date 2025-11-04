/* ===================================
   THEME SWITCHER - DevTools Center
   File: assets/js/theme-switcher.js
   =================================== */

// Theme configuration
const themes = {
  'zen-light': {
    name: 'Zen Light',
    description: 'Calm & focused',
    icon: '🍃',
    type: 'light'
  },
  'premium-dark': {
    name: 'Premium Dark',
    description: 'Interactive & modern',
    icon: '🌙',
    type: 'dark'
  },
  'cyberpunk': {
    name: 'Cyberpunk Neon',
    description: 'High-energy vibes',
    icon: '⚡',
    type: 'dark'
  }
};

// Theme Manager
const ThemeManager = {
  currentTheme: 'premium-dark',
  storageKey: 'devtools-theme-preference',
  
  // Initialize theme system
  init() {
    this.detectSystemPreference();
    this.loadTheme();
    this.createSwitcher();
    this.attachEventListeners();
    this.initPremiumDarkEffects();
    console.log('🎨 Theme system initialized');
  },
  
  // Initialize premium-dark theme effects (cursor trail, gradient mesh)
  initPremiumDarkEffects() {
    const cursorTrail = document.getElementById('cursorTrail');
    if (!cursorTrail) return;
    
    // Remove existing listeners if any
    if (this._cursorTrailHandler) {
      document.removeEventListener('mousemove', this._cursorTrailHandler);
    }
    
    // Store mouse position for parallax
    this._mouseX = this._mouseX || 0;
    this._mouseY = this._mouseY || 0;
    this._currentX = this._currentX || 0;
    this._currentY = this._currentY || 0;
    
    // Combined mousemove handler for cursor trail and parallax
    this._cursorTrailHandler = (e) => {
      if (this.currentTheme === 'premium-dark') {
        // Update cursor trail
        cursorTrail.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
        
        // Update parallax target
        this._mouseX = (e.clientX / window.innerWidth - 0.5) * 50;
        this._mouseY = (e.clientY / window.innerHeight - 0.5) * 50;
      }
    };
    
    document.addEventListener('mousemove', this._cursorTrailHandler);
    
    // Start parallax animation if not already running
    if (!this._animationFrameId) {
      const animateMesh = () => {
        if (this.currentTheme === 'premium-dark') {
          this._currentX += (this._mouseX - this._currentX) * 0.05;
          this._currentY += (this._mouseY - this._currentY) * 0.05;
          
          const meshGradients = document.querySelectorAll('[class^="mesh-gradient-"]');
          meshGradients.forEach((gradient, index) => {
            const speed = (index + 1) * 0.3;
            gradient.style.transform = `translate(${this._currentX * speed}px, ${this._currentY * speed}px)`;
          });
        }
        this._animationFrameId = requestAnimationFrame(animateMesh);
      };
      animateMesh();
    }
  },
  
  // Detect system dark mode preference
  detectSystemPreference() {
    if (!localStorage.getItem(this.storageKey)) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'premium-dark' : 'zen-light';
    }
  },
  
  // Load saved theme from localStorage
  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme && themes[savedTheme]) {
      this.setTheme(savedTheme, false);
    } else {
      this.setTheme(this.currentTheme, false);
    }
  },
  
  // Set theme
  setTheme(themeName, animate = true) {
    if (!themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }
    
    // Add transition class for smooth theme changes
    if (animate) {
      document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 300);
    }
    
    // Update data-theme attribute
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Save to localStorage
    localStorage.setItem(this.storageKey, themeName);
    
    // Update current theme
    this.currentTheme = themeName;
    
    // Update UI
    if (document.getElementById('theme-switcher')) {
      this.updateSwitcherUI();
    }
    
    // Initialize theme-specific effects
    this.initPremiumDarkEffects();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { 
        theme: themeName,
        themeName: themes[themeName].name,
        themeType: themes[themeName].type
      } 
    }));
    
    console.log(`✨ Theme switched to: ${themes[themeName].name}`);
  },
  
  // Create theme switcher UI
  createSwitcher() {
    const switcherHTML = `
      <div id="theme-switcher" class="theme-switcher" role="navigation" aria-label="Theme selector">
        <button 
          id="theme-toggle-btn" 
          class="theme-toggle-btn" 
          aria-label="Change theme - Currently: ${themes[this.currentTheme].name}"
          aria-expanded="false"
          aria-haspopup="true"
          title="${themes[this.currentTheme].name}"
        >
          <span class="theme-icon" role="img" aria-hidden="true">${themes[this.currentTheme].icon}</span>
          <span class="sr-only">${themes[this.currentTheme].name}</span>
        </button>
        
        <div id="theme-dropdown" class="theme-dropdown hidden" role="menu">
          ${Object.keys(themes).map(key => `
            <button 
              class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
              data-theme="${key}"
              role="menuitem"
              aria-label="Switch to ${themes[key].name}"
              data-tooltip="${themes[key].name}"
              title="${themes[key].name}"
            >
              <span class="theme-icon" role="img" aria-hidden="true">${themes[key].icon}</span>
              <span class="sr-only">${themes[key].name}</span>
              ${key === this.currentTheme ? '<span class="check-mark" aria-hidden="true">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const existingSwitcher = document.getElementById('theme-switcher');
    if (existingSwitcher) {
      existingSwitcher.remove();
    }

    const template = document.createElement('div');
    template.innerHTML = switcherHTML.trim();
    const switcherElement = template.firstElementChild;

    const container = document.getElementById('theme-switcher-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(switcherElement);
      switcherElement.classList.add('theme-switcher--inline');
    } else {
      document.body.appendChild(switcherElement);
    }

    // Add styles
    this.injectStyles();
  },
  
  // Inject switcher styles
  injectStyles() {
    if (document.getElementById('theme-switcher-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-switcher-styles';
    style.textContent = `
      .theme-switcher {
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 9999;
        display: inline-flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .theme-switcher--inline {
        position: relative;
        top: auto;
        right: auto;
        inset: auto;
        flex-direction: row;
        align-items: center;
        gap: 0;
      }

      .theme-toggle-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        padding: 8px;
        background: var(--bg-secondary, #ffffff);
        border: 2px solid var(--accent-primary, #b7c9a5);
        color: var(--text-primary, #3d3d3d);
        font-family: inherit;
        cursor: pointer;
        border-radius: var(--radius-full, 50%);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.1));
      }

      .theme-toggle-btn:hover,
      .theme-toggle-btn:focus-visible {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md, 0 6px 18px rgba(0,0,0,0.16));
        border-color: var(--accent-primary, #b7c9a5);
      }

      .theme-toggle-btn:focus-visible {
        outline: none;
      }

      .theme-toggle-btn[aria-expanded="true"] {
        border-radius: var(--radius-md, 14px);
      }

      .theme-icon {
        font-size: 1.2rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .theme-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        display: flex;
        gap: 8px;
        padding: 10px;
        background: var(--bg-secondary, #ffffff);
        border: 2px solid var(--accent-primary, #b7c9a5);
        border-radius: var(--radius-lg, 16px);
        box-shadow: var(--shadow-lg, 0 12px 32px rgba(0,0,0,0.18));
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      .theme-dropdown.hidden {
        opacity: 0;
        transform: translateY(-12px);
        pointer-events: none;
      }

      .theme-option {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md, 14px);
        border: 2px solid transparent;
        background: var(--bg-tertiary, rgba(0, 0, 0, 0.04));
        color: var(--text-primary, #3d3d3d);
        cursor: pointer;
        transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
      }

      .theme-option:hover,
      .theme-option:focus-visible {
        transform: translateY(-2px);
        background: var(--bg-secondary, #ffffff);
        border-color: rgba(183, 201, 165, 0.4);
        outline: none;
      }

      .theme-option.active {
        border-color: var(--accent-primary, #b7c9a5);
        background: var(--bg-secondary, #ffffff);
        box-shadow: var(--shadow-sm, 0 4px 12px rgba(0,0,0,0.14));
      }

      .theme-option .theme-icon {
        font-size: 1.25rem;
      }

      .check-mark {
        position: absolute;
        bottom: -6px;
        right: -6px;
        width: 18px;
        height: 18px;
        border-radius: 9999px;
        background: var(--bg-secondary, #ffffff);
        border: 1px solid var(--accent-primary, #b7c9a5);
        color: var(--accent-primary, #b7c9a5);
        font-weight: 700;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-xs, 0 2px 6px rgba(0,0,0,0.12));
      }

      .theme-option[data-tooltip]::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        border-radius: 8px;
        background: var(--bg-secondary, #ffffff);
        border: 1px solid rgba(0, 0, 0, 0.08);
        color: var(--text-primary, #3d3d3d);
        font-size: 0.75rem;
        line-height: 1.2;
        white-space: nowrap;
        box-shadow: var(--shadow-sm, 0 6px 16px rgba(0,0,0,0.16));
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease, transform 0.15s ease;
        z-index: 20;
      }

      .theme-option[data-tooltip]::before {
        content: '';
        position: absolute;
        bottom: calc(100% + 4px);
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 10px;
        height: 10px;
        background: var(--bg-secondary, #ffffff);
        border-left: 1px solid rgba(0, 0, 0, 0.08);
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        transform-origin: center;
        opacity: 0;
        transition: opacity 0.15s ease;
        z-index: 19;
      }

      .theme-option:hover::after,
      .theme-option:hover::before,
      .theme-option:focus-visible::after,
      .theme-option:focus-visible::before {
        opacity: 1;
      }

      .theme-option:hover::after,
      .theme-option:focus-visible::after {
        transform: translate(-50%, -4px);
      }

      .theme-switcher .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      @media (max-width: 768px) {
        .theme-switcher {
          top: 10px;
          right: 12px;
        }

        .theme-dropdown {
          gap: 6px;
          padding: 8px;
        }

        .theme-option {
          width: 40px;
          height: 40px;
        }
      }

      /* Smooth theme transition */
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }

      /* Disable transitions during theme switch for immediate elements */
      .theme-switching * {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  },
  
  // Update switcher UI after theme change
  updateSwitcherUI() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <span class="theme-icon" role="img" aria-hidden="true">${themes[this.currentTheme].icon}</span>
        <span class="sr-only">${themes[this.currentTheme].name}</span>
      `;
      toggleBtn.setAttribute('aria-label', `Change theme - Currently: ${themes[this.currentTheme].name}`);
      toggleBtn.setAttribute('title', themes[this.currentTheme].name);
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.theme-option').forEach(option => {
      const themeName = option.getAttribute('data-theme');
      if (themeName === this.currentTheme) {
        option.classList.add('active');
        option.innerHTML = `
          <span class="theme-icon" role="img" aria-hidden="true">${themes[themeName].icon}</span>
          <span class="sr-only">${themes[themeName].name}</span>
          <span class="check-mark" aria-hidden="true">✓</span>
        `;
      } else {
        option.classList.remove('active');
        option.innerHTML = `
          <span class="theme-icon" role="img" aria-hidden="true">${themes[themeName].icon}</span>
          <span class="sr-only">${themes[themeName].name}</span>
        `;
      }
      option.setAttribute('title', themes[themeName].name);
      option.setAttribute('data-tooltip', themes[themeName].name);
    });
  },
  
  // Attach event listeners
  attachEventListeners() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const dropdown = document.getElementById('theme-dropdown');
    
    if (toggleBtn && dropdown) {
      // Toggle dropdown
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden');
        toggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#theme-switcher')) {
          dropdown.classList.add('hidden');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Theme option clicks
      document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const themeName = option.getAttribute('data-theme');
          this.setTheme(themeName);
          dropdown.classList.add('hidden');
          toggleBtn.setAttribute('aria-expanded', 'false');
        });
      });
      
      // Keyboard navigation
      dropdown.addEventListener('keydown', (e) => {
        const options = Array.from(dropdown.querySelectorAll('.theme-option'));
        const currentIndex = options.findIndex(opt => opt === document.activeElement);
        
        switch(e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % options.length;
            options[nextIndex].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + options.length) % options.length;
            options[prevIndex].focus();
            break;
          case 'Escape':
            dropdown.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (document.activeElement.classList.contains('theme-option')) {
              document.activeElement.click();
            }
            break;
        }
      });
    }
    
    // Keyboard shortcuts (optional)
    document.addEventListener('keydown', (e) => {
      // Alt + T to toggle theme menu
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        dropdown.classList.toggle('hidden');
        const isHidden = dropdown.classList.contains('hidden');
        toggleBtn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
        if (!isHidden) {
          dropdown.querySelector('.theme-option')?.focus();
        }
      }
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        const newTheme = e.matches ? 'premium-dark' : 'zen-light';
        this.setTheme(newTheme);
      }
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}

// Export for use in other scripts
window.ThemeManager = ThemeManager;

// Example: Listen for theme changes
window.addEventListener('themeChanged', (e) => {
  console.log('Theme changed to:', e.detail.themeName);
  
  // Optional: Send analytics
  // gtag('event', 'theme_change', { 'theme_name': e.detail.theme });
});