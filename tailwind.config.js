/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'ice-gradient': 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 25%, #93c5fd 50%, #60a5fa 75%, #3b82f6 100%)',
        'steel-gradient': 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)',
        'ice-steel': 'linear-gradient(135deg, #e0f2fe 0%, #cbd5e1 50%, #94a3b8 100%)',
      },
    },
  },
  plugins: [],
}
