/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#070d17', 900: '#0b1524', 800: '#101e33', 700: '#182a45' },
        steel: { 100: '#e6ecf5', 300: '#a9b8d0', 500: '#6c82a6' },
        amber: { eng: '#f5a524' },
        cyanx: { DEFAULT: '#38bdf8', dark: '#0ea5e9' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
