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
          550: '#E2E2E2',
        },
        blue: {
          650: '#549DF2',
        },
      }
    },
  },
  plugins: [],
}
