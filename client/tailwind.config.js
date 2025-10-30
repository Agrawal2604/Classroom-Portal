/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef3ff',
          100: '#e0e7ff',
          500: '#1366d6',
          600: '#0f5cb8',
          700: '#0d4a9a',
        },
        gray: {
          50: '#f6f7fb',
          100: '#e6e9ef',
          500: '#6b7280',
          600: '#4b5563',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}