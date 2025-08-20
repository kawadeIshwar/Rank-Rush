/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          panel: '#1a1a25',
          card: '#232332',
        },
        accent: {
          green: '#10b981',
          purple: '#8b5cf6',
          gold: '#f59e0b',
          orange: '#f97316',
        },
        border: {
          DEFAULT: '#2d2d3a',
        },
        text: {
          primary: '#ffffff',
          muted: '#a1a1aa',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        'gradient-gold': 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 146, 60, 0.1) 100%)',
        'gradient-silver': 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(209, 213, 219, 0.1) 100%)',
        'gradient-bronze': 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(251, 146, 60, 0.1) 100%)',
      },
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      textShadow: {
        'purple': '0 4px 16px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-purple': {
          textShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
        },
        // Custom scrollbar utilities
        '.scrollbar-thin': {
          'scrollbar-width':' thin',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '20px',
        },
        '.scrollbar-track-dark-panel::-webkit-scrollbar-track': {
          'background-color': '#1a1a25',
          'border-radius': '10px',
        },
        '.scrollbar-thumb-accent-purple::-webkit-scrollbar-thumb': {
          'background-color': '#8b5cf6',
          'border-radius': '10px',
        },
        '.scrollbar-thumb-accent-purple::-webkit-scrollbar-thumb:hover': {
          'background-color': 'rgba(139, 92, 246, 1)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
