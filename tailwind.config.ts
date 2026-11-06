import type { Config } from "tailwindcss";

// Brand tokens carried over from the original YBCSOFT site (css/style.css)
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        char: "#303030",
        deep: "#242424",
        ink: "#1b1b1b",
        brand: { yellow: "#FFF000", red: "#ED3038", redDark: "#c9222a" },
        paper: "#F7F7F7",
      },
      fontFamily: { sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"] },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        spin3d: { from: { transform: "rotateX(-18deg) rotateY(0deg)" }, to: { transform: "rotateX(-18deg) rotateY(360deg)" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        spin3d: "spin3d 22s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
