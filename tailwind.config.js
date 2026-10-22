/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          950: "#0B1F2E",
          900: "#0F2A3D",
          800: "#173B52",
          700: "#204C69",
          600: "#2D6285",
          100: "#E7EEF2"
        },
        paper: "#FBF8F1",
        brass: {
          400: "#D9B65B",
          500: "#C9A227",
          600: "#A9821A"
        },
        growth: {
          500: "#3C8067",
          600: "#2E6851"
        },
        clay: "#B4573F"
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      backgroundImage: {
        blueprint: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "28px 28px"
      }
    }
  },
  plugins: []
};
