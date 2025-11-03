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
  currentTheme: 'zen-light',
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
          aria-label="Change theme"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span class="theme-icon" role="img" aria-label="${themes[this.currentTheme].name}">${themes[this.currentTheme].icon}</span>
          <span class="theme-name" style="display: none;">${themes[this.currentTheme].name}</span>
          <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style="display: none;">
            <path d="M2 4l4 4 4-4z"/>
          </svg>
        </button>
        
        <div id="theme-dropdown" class="theme-dropdown hidden" role="menu">
          ${Object.keys(themes).map(key => `
            <button 
              class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
              data-theme="${key}"
              role="menuitem"
              aria-label="Switch to ${themes[key].name}"
            >
              <span class="theme-icon" role="img">${themes[key].icon}</span>
              <div class="theme-info">
                <div class="theme-option-name">${themes[key].name}</div>
                <div class="theme-description">${themes[key].description}</div>
              </div>
              ${key === this.currentTheme ? '<span class="check-mark" aria-label="Currently active">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    // Insert before closing body tag
    document.body.insertAdjacentHTML('beforeend', switcherHTML);
    
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
      }
      
      .theme-toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px;
        width: 40px;
        height: 40px;
        background: var(--bg-secondary, #ffffff);
        border: 2px solid var(--accent-primary, #b7c9a5);
        color: var(--text-primary, #3d3d3d);
        font-family: inherit;
        font-size: 0;
        font-weight: 600;
        cursor: pointer;
        border-radius: var(--radius-full, 50%);
        transition: all 0.2s ease;
        box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.1));
      }
      
      .theme-toggle-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md, 0 4px 16px rgba(0,0,0,0.15));
      }
      
      .theme-toggle-btn:focus {
        outline: 2px solid var(--accent-primary, #b7c9a5);
        outline-offset: 2px;
      }
      
      .theme-icon {
        font-size: 1.25rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .theme-toggle-btn .theme-name {
        display: none;
      }
      
      .dropdown-arrow {
        display: none;
      }
      
      .theme-toggle-btn[aria-expanded="true"] {
        border-radius: var(--radius-md, 16px);
      }
      
      .theme-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: var(--bg-secondary, #ffffff);
        border: 2px solid var(--accent-primary, #b7c9a5);
        border-radius: var(--radius-md, 16px);
        min-width: 240px;
        box-shadow: var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.15));
        opacity: 1;
        transform: translateY(0);
        transition: all 0.2s ease;
        overflow: hidden;
      }
      
      .theme-dropdown.hidden {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
      }
      
      .theme-option {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        padding: 14px 18px;
        background: transparent;
        border: none;
        color: var(--text-primary, #3d3d3d);
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s ease;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      
      .theme-option:last-child {
        border-bottom: none;
      }
      
      .theme-option:hover {
        background: var(--bg-tertiary, rgba(0, 0, 0, 0.03));
      }
      
      .theme-option:focus {
        outline: 2px solid var(--accent-primary, #b7c9a5);
        outline-offset: -2px;
      }
      
      .theme-option.active {
        background: var(--bg-tertiary, rgba(183, 201, 165, 0.1));
      }
      
      .theme-info {
        flex: 1;
      }
      
      .theme-option-name {
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 2px;
      }
      
      .theme-description {
        font-size: 0.8rem;
        color: var(--text-muted, #9a9a9a);
      }
      
      .check-mark {
        color: var(--accent-primary, #b7c9a5);
        font-weight: bold;
        font-size: 1.1rem;
      }
      
      /* Theme-specific overrides */
      [data-theme="cyberpunk"] .theme-switcher {
        border: 2px solid var(--accent-secondary);
      }
      
      [data-theme="cyberpunk"] .theme-toggle-btn {
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      [data-theme="cyberpunk"] .theme-dropdown {
        border-radius: 0;
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        .theme-switcher {
          top: 10px;
          right: 60px;
        }
        
        .theme-dropdown {
          min-width: 200px;
          right: 0;
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
        <span class="theme-icon" role="img" aria-label="${themes[this.currentTheme].name}">${themes[this.currentTheme].icon}</span>
        <span class="theme-name" style="display: none;">${themes[this.currentTheme].name}</span>
        <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style="display: none;">
          <path d="M2 4l4 4 4-4z"/>
        </svg>
      `;
      toggleBtn.setAttribute('aria-label', `Change theme - Currently: ${themes[this.currentTheme].name}`);
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.theme-option').forEach(option => {
      const themeName = option.getAttribute('data-theme');
      if (themeName === this.currentTheme) {
        option.classList.add('active');
        option.innerHTML = `
          <span class="theme-icon" role="img">${themes[themeName].icon}</span>
          <div class="theme-info">
            <div class="theme-option-name">${themes[themeName].name}</div>
            <div class="theme-description">${themes[themeName].description}</div>
          </div>
          <span class="check-mark" aria-label="Currently active">✓</span>
        `;
      } else {
        option.classList.remove('active');
        option.innerHTML = `
          <span class="theme-icon" role="img">${themes[themeName].icon}</span>
          <div class="theme-info">
            <div class="theme-option-name">${themes[themeName].name}</div>
            <div class="theme-description">${themes[themeName].description}</div>
          </div>
        `;
      }
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