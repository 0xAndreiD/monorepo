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
          // 100: "#01e6c1",
          100: "#00DDB9",
          // 300: "#00ddb9",
          300: "#00DDB9",
          // 500: "#5DD3B4",
          500: "#00DDB9",
          // 700: "#01cead",
          700: "#00DDB9",
          1000: "#00DDB9",
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
