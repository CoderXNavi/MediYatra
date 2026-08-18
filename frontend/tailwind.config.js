/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pal: {
          cream: '#FFFDFB',
          blush: '#FBE7F1',
          lavender: '#D7C6FF',
          blue: '#8FA9FF',
          navy: '#2D3A5E',
          navyDark: '#1A233D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
