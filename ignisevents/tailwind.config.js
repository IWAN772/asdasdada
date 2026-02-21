/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-bg': 'rgb(255 255 255)',
        gold: {
          50: '#fff9ef',
          400: '#e8c76b',
          500: '#D4AF37',
          600: '#b58526'
        },
        pink: {
          400: '#ff8bb3',
          500: '#ff6fa3'
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 600ms ease-out both',
        'slide-up-fade': 'slide-up-fade 560ms cubic-bezier(.16,.84,.44,1) both',
        'pop-in': 'pop-in 260ms ease-out both'
      }
    }
  },
  plugins: []
}
