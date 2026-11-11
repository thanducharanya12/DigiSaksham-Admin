/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1b4332',
          primary: '#2d6a4f',
          accent: '#52b788',
          light: '#d8f3dc',
          navy: '#0f2027',
          surface: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
