/** @type {import('tailwindcss').Config} */
const opacitySteps = Object.fromEntries(
  Array.from({ length: 100 }, (_, i) => [String(i + 1), (i + 1) / 100])
);

module.exports = {
  content: ['./index.html', './index.tsx', './App.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        'pitch-green': '#CCFF00',
        gold: '#D4AF37',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      opacity: opacitySteps,
    },
  },
  plugins: [],
};