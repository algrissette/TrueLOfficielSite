/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        edwardian: ['"Edwardian Script ITC"', 'cursive'],
      },
      height: {
        '210': '840px',
      },
      borderWidth: {
        '1': '1px',
        '6': '6px',
      },
      zIndex: {
        '1': '1',
        '1000': '1000',
      },
    },
  },
  plugins: [],
};