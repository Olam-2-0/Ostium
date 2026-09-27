/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F7FA',
        card: '#FFFFFF',
        border: '#E8E8EF',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#EEF2FF',
          dark: '#3730A3',
        },
        secondaryIndigo: '#8B7CF6',
        accentBlue: '#5B9CF6',
        accentGreen: '#5BB98C',
        accentAmber: '#E8A84A',
        accentRose: '#E8798F',
        textPrimary: '#202124',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 25px -5px rgba(99, 102, 241, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'slide-up': 'slideUp 250ms ease-out forwards',
        'slide-left': 'slideLeft 250ms ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      }
    },
  },
  plugins: [],
}
