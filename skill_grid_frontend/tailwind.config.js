/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      purple: {
        50: "#E7E7FF",
        100: "#CCCAFF",
        200: "#8984F2",
        300: "#7975D8",
        400: "#544FBD",
        500: "#450098",
        600: "#3D007F",
        700: "#322E86",
        800: "#2F2A86"
      },
      
      grey: {

        50: "#D9D9D9",
        100: "#C8C8C8",
        200: "#D3CDCD",
        300: "#929292",
        400: "#858585",
        500: "#707070",
        600: "#7B7B7B",
        700: "#625D5D"
      },

      red: {
        100: "#FFA8A8",
        500: "#E50000"
      },

      blue: {
        100: "#9EB8FF",
        200: "#7B8EFF",
        400: "#5B9EE6",
        500: "#236FD2",
        700: "#03006F"
      },

      pink: {
        300: "#FF9DE0"
      },

      white: "#FFFFFF",

      black: {
        50: "#2E2E2E",
        400: "#111111",
        700: "#000000"
      },

      green: {
        100: "#A7FFBD",
        600: "#29A82D",
        700: "#43B925"
      }
    },
    extend: {
      fontFamily: {
        caprasimo: ["Caprasimo", "sans-serif"],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
