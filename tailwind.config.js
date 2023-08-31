/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './page/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        large: '1400px',
        medium: '1200px',
      },
      margin: {
        'margin-left-align-center': '0 0 0 calc(50% - 50vw)',
        'margin-right-align-center': '0 calc(50% - 50vw) 0 0',
      },
      colors: {
        'zinc-1000': '#080808',
      },
      screens: {
        'xs': '320px',
      },
    },
  },
};
