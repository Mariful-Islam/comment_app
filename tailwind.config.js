/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // if using the app directory
    './src/**/*.{js,ts,jsx,tsx}', // if you're using src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
