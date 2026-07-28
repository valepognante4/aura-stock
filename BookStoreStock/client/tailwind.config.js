/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#0A0C10',
        surface: '#12151B',
        'surface-2': '#0D1015',
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.07)',
          strong: 'rgba(255, 255, 255, 0.14)'
        },
        txt: {
          primary: '#F3F5F7',
          body: '#DDE2E8',
          sub: '#98A2AE',
          muted: '#69727D',
          dim: '#4B525C',
          faint: '#333941'
        },
        accent: {
          DEFAULT: '#0F9C8E',
          light: '#34D6C4',
          bg: 'rgba(15, 156, 142, 0.12)',
          border: 'rgba(15, 156, 142, 0.28)'
        },
        success: {
          DEFAULT: '#4ADE80',
          bg: 'rgba(74, 222, 128, 0.10)'
        },
        warning: {
          DEFAULT: '#FBBF24'
        },
        danger: {
          DEFAULT: '#F87171',
          border: 'rgba(248, 113, 113, 0.20)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'hero': '0 32px 80px rgba(0,0,0,0.55)',
        'modal': '0 24px 80px rgba(0,0,0,0.60)'
      },
      backgroundImage: {
        'gradient-user': 'linear-gradient(135deg, #0F9C8E, #2AB6C9)',
        'gradient-cta': 'linear-gradient(135deg, rgba(15,156,142,0.18) 0%, rgba(42,182,201,0.10) 100%)',
      }
    },
  },
  plugins: [],
}
