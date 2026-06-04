export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#18212f",
        mint: "#2f9f89",
        coral: "#e56b5d",
        amber: "#f3b23c"
      }
    }
  },
  plugins: []
};
