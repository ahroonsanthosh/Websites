import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EE",
        paper: "#F5EDDF",
        cocoa: "#2B1D16",
        espresso: "#1A110C",
        caramel: "#C98A3D",
        honey: "#E8B45A",
        blush: "#F2A0A0",
        pistachio: "#9DBD8E",
        berry: "#C4526A",
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        body: ['"Space Grotesk"', "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        wiggle: "wiggle 3s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
