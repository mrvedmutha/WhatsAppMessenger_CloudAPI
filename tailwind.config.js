/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // Adjust the path based on your project's structure
    "./public/**/*.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
