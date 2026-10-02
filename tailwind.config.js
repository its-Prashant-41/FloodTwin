/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d1b',
          900: '#0b192c',
          800: '#1e3e62',
          700: '#2b5484',
          600: '#3a6da7',
          500: '#4b88cc',
        },
        emergency: {
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#22c55e',
          blue: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}
