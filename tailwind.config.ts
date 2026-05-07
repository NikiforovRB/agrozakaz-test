import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F5132",
          dark: "#0A3D24",
          darker: "#062818",
          light: "#1A7A4E",
          accent: "#16A34A",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          500: "#10B981",
          700: "#0F5132",
          900: "#062818",
        },
        muted: {
          DEFAULT: "#F4F6F8",
          foreground: "#6B7280",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#0F5132",
        background: "#FFFFFF",
        foreground: "#111827",
        card: "#FFFFFF",
        "card-foreground": "#111827",
        popover: "#FFFFFF",
        "popover-foreground": "#111827",
        primary: {
          DEFAULT: "#0F5132",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4F6F8",
          foreground: "#111827",
        },
        accent: {
          DEFAULT: "#F4F6F8",
          foreground: "#111827",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Gilroy",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(16, 24, 40, 0.05), 0 1px 2px rgba(16, 24, 40, 0.03)",
        "card-hover":
          "0 8px 24px rgba(16, 24, 40, 0.08), 0 2px 4px rgba(16, 24, 40, 0.04)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
