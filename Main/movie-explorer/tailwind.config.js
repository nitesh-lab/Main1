/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        body:['Dancing Script'],
        roboto:["Roboto"],
      },
      colors:{
        custom:{
        "03045e":"#3a0ca3",
      }
    }
    },
  },
  plugins: [],
}

