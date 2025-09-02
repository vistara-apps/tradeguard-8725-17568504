import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Design system color tokens as specified in the PRD
      colors: {
        bg: "hsl(220 20% 15%)",
        accent: "hsl(300 70% 60%)",
        primary: "hsl(200 80% 50%)",
        surface: "hsl(215 25% 20%)",
        "text-primary": "hsl(0 0% 95%)",
        "text-secondary": "hsl(0 0% 70%)",
        destructive: "hsl(0 100% 50%)",
        success: "hsl(120 100% 40%)",
        warning: "hsl(40 100% 50%)",
      },
      // Border radius tokens as specified in the PRD
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      // Spacing tokens as specified in the PRD
      spacing: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      // Shadow tokens as specified in the PRD
      boxShadow: {
        card: "0 4px 12px hsla(0, 0%, 0%, 0.2)",
        input: "inset 0 2px 4px hsla(0, 0%, 0%, 0.05)",
      },
      // Typography tokens
      fontSize: {
        base: ["16px", "24px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "38px"],
      },
      fontWeight: {
        normal: "400",
        semibold: "600",
        bold: "700",
      },
      // Animation tokens
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.22,1,0.36,1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
      // Container sizes
      maxWidth: {
        md: "28rem",
      },
      // Grid layout
      gridTemplateColumns: {
        "2-fluid": "repeat(2, minmax(0, 1fr))",
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
  plugins: [],
};

export default config;
