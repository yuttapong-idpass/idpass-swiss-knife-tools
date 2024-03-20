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
          elem: '#2b3945',
          bg: '#252525',
          text: '#808080'
        },
        light: {
          elem: '#ffff',
          bg: '#fafafa',
          text: '#111517'
        }
      }
    },
  },
  plugins: [],
}
