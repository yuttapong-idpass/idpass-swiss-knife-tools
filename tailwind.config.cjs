/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // colors: {
      //   dark: {
      //     // elem: '#222222',
      //     // bg: '#121212',
      //     // text: 'rgba(255,255,255,0.87)'
      //   },
      //   light: {

      //   },
      // },


      // colors: {
      //   primary: "var(--color-bg-primary)",
      //   secondary: "var(--color-bg-secondary)",
      //   success: "var(--color-bg-success)",
      //   warning: "var(--color-bg-warning)",
      //   error: "var(--color-bg-error)",
      //   "button-primary": "var(--color-button-primary)",
      //   information: "var(--color-bg-information)",
      //   "dark-100": "var(--color-surface-100)",
      //   "dark-200": "var(--color-surface-200)",
      //   "dark-300": "var(--color-surface-300)",
      //   "dark-400": "var(--color-surface-400)",
      //   "dark-500": "var(--color-surface-500)",
      //   "dark-600": "var(--color-surface-600)",
      // },
      // backgroundColor: {
      //   primary: "var(--color-bg-primary)",
      //   secondary: "var(--color-bg-secondary)",
      //   success: "var(--color-bg-success)",
      //   warning: "var(--color-bg-warning)",
      //   error: "var(--color-bg-error)",
      //   information: "var(--color-bg-information)",
      //   "button-primary": "var(--color-button-primary)",
      // },
      // textColor: {
      //   accent: "var(--color-text-accent)",
      //   primary: "var(--color-text-primary)",
      //   secondary: "var(--color-text-secondary)",
      // },
    },
  },
  plugins: [nextui({
    themes: {
      light: {
        color: {

        },
      },
      dark: {

      }
    }
  })],
};
