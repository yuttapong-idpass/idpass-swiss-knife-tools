/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          elem: '#222222',
          bg: '#121212',
          text: 'rgba(255,255,255,0.87)'
        },
        light: {
          elem: '#fafafa',
          bg: '#f0f2f5',
          text: 'rgba(0,0,0,0.87)'
        },
      }
    },
  },
  plugins: [],
}
