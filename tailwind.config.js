/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./widgets/**/*.{js,jsx,ts,tsx}', './components/**/*.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  prefix: 'tw-',
}

