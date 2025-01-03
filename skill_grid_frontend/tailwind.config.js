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
        200: "#929292",
        300: "#858585",
        400: "#707070",
        500: "7B7B7B"

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
