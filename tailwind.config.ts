import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        primary: {
          DEFAULT: "#1D6F76",
          dark: "#155358",
          light: "#2A8D96",
        },
        secondary: {
          DEFAULT: "#F2994A",
          dark: "#D97B2C",
          light: "#FFB675",
        },
        gray: {
          50: "#F5F7FA",
          100: "#E0E4E8",
          800: "#4A5568",
        },
        success: "#27AE60",
        warning: "#F2C94C",
        error: "#EB5757",
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      fontSize: {
        headline: ["32px", "1.2"],
        subheading: ["20px", "1.4"],
        body: ["16px", "1.5"],
        small: ["13px", "1.4"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;