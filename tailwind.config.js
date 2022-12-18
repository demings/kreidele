/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "pulse-bg-once": "pulse-bg-once 2s forwards",
      },
      keyframes: {
        "pulse-bg-once": {
          to: { backgroundColor: "transparent" },
        },
      },
    },
  },
  plugins: [],
};
