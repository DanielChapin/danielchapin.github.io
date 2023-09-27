/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%': { opacity: 1.0 },
          '50%': { opacity: 0.0 },
        }
      },
      animation: {
        blink: 'blink 1s linear infinite'
      },
      width: {
        'a4': "8.5in",
      },
      height: {
        'a4': "11in"
      }
    },
  },
  plugins: [],
}

