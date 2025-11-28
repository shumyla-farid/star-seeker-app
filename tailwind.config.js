/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Purple theme
        "purple-space": {
          bg: "#0a0e27",
          primary: "#8b5cf6",
          secondary: "#6366f1",
          accent: "#a78bfa",
          text: "#e9d5ff",
          card: "#1e1b4b",
        },
        // Teal theme
        "teal-space": {
          bg: "#0f1419",
          primary: "#14b8a6",
          secondary: "#0d9488",
          accent: "#2dd4bf",
          text: "#ccfbf1",
          card: "#1a2830",
        },
      },
    },
  },
  plugins: [],
};
