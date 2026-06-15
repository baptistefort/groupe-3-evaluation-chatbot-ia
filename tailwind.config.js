/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        blood: "#E50914",
        ink: "#050505",
        paper: "#FFFFFF",
        smoke: "#F4F4F4"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Impact", "Arial Black", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        neo: "10px 10px 0 #050505",
        red: "10px 10px 0 #E50914",
        hard: "0 0 0 3px #050505, 12px 12px 0 #E50914",
        insetHard: "inset 0 0 0 3px #050505"
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        marqueeReverse: "marqueeReverse 24s linear infinite",
        pulseHard: "pulseHard 1.35s steps(2, end) infinite",
        floatPanel: "floatPanel 4s ease-in-out infinite",
        scan: "scan 3.8s linear infinite",
        blink: "blink 1s steps(2, end) infinite",
        shakeTiny: "shakeTiny .42s steps(2, end) infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" }
        },
        pulseHard: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" }
        },
        floatPanel: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-14px) rotate(1deg)" }
        },
        scan: {
          "0%": { transform: "translateY(-110%)" },
          "100%": { transform: "translateY(110%)" }
        },
        blink: {
          "0%, 48%": { opacity: "1" },
          "49%, 100%": { opacity: "0" }
        },
        shakeTiny: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(2px, -1px)" }
        }
      }
    }
  },
  plugins: []
};
