/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#06090f',
          surface: '#0b111e',
          card: '#0e1626',
          panel: '#131e33',
          cardLight: '#18243c',
          border: '#1b2a47',
          borderGlow: '#223860',
          neonGreen: '#00ff9d',
          neonCyan: '#00f0ff',
          neonAmber: '#ffaa00',
          neonRed: '#ff3366',
          neonPurple: '#a855f7',
          textMuted: '#64748b',
          textDim: '#94a3b8',
          textBright: '#e2e8f0',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -3px rgba(0, 255, 157, 0.25)',
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.25)',
        'glow-red': '0 0 20px -3px rgba(255, 51, 102, 0.25)',
        'glow-amber': '0 0 20px -3px rgba(255, 170, 0, 0.25)',
        'card-glow': '0 4px 24px -1px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
