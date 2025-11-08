/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,njk,md,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Existing color palette (preserved for compatibility)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Design token integration
        'token-bg': 'var(--color-bg)',
        'token-surface': 'var(--color-surface)',
        'token-subtle': 'var(--color-subtle)',
        'token-border': 'var(--color-border)',
        'token-text': 'var(--color-text)',
        'token-text-muted': 'var(--color-text-muted)',
        'token-primary': 'var(--color-primary)',
        'token-primary-contrast': 'var(--color-primary-contrast)',
        'token-primary-soft': 'var(--color-primary-soft)',
        'token-halo': 'var(--color-halo)',
        'token-accent': 'var(--color-accent)',
        'token-success': 'var(--color-success)',
        'token-warning': 'var(--color-warning)',
        'token-danger': 'var(--color-danger)',
      },
      fontFamily: {
        mono: ['Fira Code', 'Courier New', 'monospace'],
        sans: 'var(--font-sans)',
      },
      fontSize: {
        'token-xs': 'var(--font-size-xs)',
        'token-sm': 'var(--font-size-sm)',
        'token-base': 'var(--font-size-base)',
        'token-lg': 'var(--font-size-lg)',
        'token-xl': 'var(--font-size-xl)',
        'token-2xl': 'var(--font-size-2xl)',
        'token-3xl': 'var(--font-size-3xl)',
      },
      fontWeight: {
        'token-regular': 'var(--font-weight-regular)',
        'token-medium': 'var(--font-weight-medium)',
        'token-semibold': 'var(--font-weight-semibold)',
        'token-bold': 'var(--font-weight-bold)',
      },
      borderRadius: {
        'token-xs': 'var(--radius-xs)',
        'token-sm': 'var(--radius-sm)',
        'token-md': 'var(--radius-md)',
        'token-lg': 'var(--radius-lg)',
        'token-full': 'var(--radius-full)',
      },
      boxShadow: {
        'token-xs': 'var(--shadow-xs)',
        'token-sm': 'var(--shadow-sm)',
        'token-md': 'var(--shadow-md)',
      },
      transitionDuration: {
        'token-quick': 'var(--motion-duration-quick)',
        'token-normal': 'var(--motion-duration-normal)',
        'token-slow': 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        'token-standard': 'var(--motion-ease-standard)',
        'token-emphasized': 'var(--motion-ease-emphasized)',
      },
      animation: {
        'motion-fade-in': 'motionFadeIn var(--motion-duration-normal) var(--motion-ease-standard)',
        'motion-slide-in-y-8': 'motionSlideInY8 var(--motion-duration-normal) var(--motion-ease-emphasized)',
        'motion-pulse-soft': 'motionPulseSoft 2s var(--motion-ease-standard) infinite',
      },
      keyframes: {
        motionFadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        motionSlideInY8: {
          'from': { opacity: '0', transform: 'translateY(2rem)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        motionPulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

