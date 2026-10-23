/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#030712',
        surface: {
          50: '#0b0f19',
          100: '#111827',
          200: '#1f2937',
          300: '#374151',
          elevated: '#1e2638'
        },
        brand: {
          primary: '#ff6b00',
          hover: '#ff8533',
          glow: 'rgba(255, 107, 0, 0.35)',
          subtle: 'rgba(255, 107, 0, 0.12)'
        },
        linear: {
          void: '#08090a',
          surface1: '#0f1011',
          surface2: '#121414',
          surface3: '#161718',
          elevated: '#1a1c1e',
          textSnow: '#f7f8f8',
          textSlate: '#8a8f98',
          textMuted: '#62666d',
          accent: '#ff6b00',
          cyan: '#06b6d4',
          emerald: '#10b981',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Geist', 'Inter Display', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-beam': 'borderBeam 6s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        borderBeam: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'specular': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'specular-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 0 25px rgba(255, 107, 0, 0.25)',
        'card-glow': '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 107, 0, 0.08)',
        'modal-depth': '0 30px 100px -20px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
