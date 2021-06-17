// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: {
    content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
