/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ important for manual dark/light toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
