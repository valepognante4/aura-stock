/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#0B0E14',
        surface: '#141720',
        'surface-2': '#0F131B',
        border: {
          DEFAULT: '#1E2330',
          strong: '#2D3448'
        },
        txt: {
          primary: '#F1F5F9',
          body: '#E2E8F0',
          sub: '#94A3B8',
          muted: '#64748B',
          dim: '#475569',
          faint: '#334155'
        },
        accent: {
          DEFAULT: '#4F46E5',
          light: '#818CF8',
          bg: 'rgba(79, 70, 229, 0.12)',
          border: 'rgba(79, 70, 229, 0.28)'
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
        'gradient-user': 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        'gradient-cta': 'linear-gradient(135deg, rgba(79,70,229,0.18) 0%, rgba(124,58,237,0.10) 100%)',
      }
    },
  },
  plugins: [],
}
