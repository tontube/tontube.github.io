const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          350: '#1E1E1E',
        },
        green: {
          750: '#11B980',
        },
        gray: {
          210: "#0000007a",
          350: '#F1F1F1',
          360: '#989898',
          450: '#505050',
          550: '#E2E2E2',
        },
        blue: {
          650: '#549DF2',
          450: '#318FE7',
        },
      }
    },
    container: {
      padding: '165px',
    },
  },
  plugins: [],
}
