const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          750: '#11B980',
        },
        gray: {
          350: '#F1F1F1',
          450: '#505050',
          550: '#E2E2E2',
        },
        blue: {
          650: '#549DF2',
        },
      }
    },
    container: {
      padding: '165px',
    },
  },
  plugins: [],
}
