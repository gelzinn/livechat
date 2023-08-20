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
      screens: {
        desktop: '1400px',
        laptop: '1200px',
        tablet: '1024px',
        mobileHorizontal: '768px',
        mobile: '450px',
      },
    },
  },
};
