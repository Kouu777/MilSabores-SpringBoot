/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        titulo: ['Pacifico', 'cursive'],
        texto: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
};


