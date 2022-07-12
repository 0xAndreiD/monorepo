const defaultTheme = require("tailwindcss/defaultTheme")

// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: {
    content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        green: {
          100: "#01e6c1",
          300: "#00ddb9",
          500: "#5DD3B4",
          700: "#01cead",
        },
      },
      fontFamily: {
        sans: ["Proxima Nova", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
