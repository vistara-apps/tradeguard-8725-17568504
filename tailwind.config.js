    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {
          colors: {
            bg: "hsl(220 20% 15%)",
            accent: "hsl(300 70% 60%)",
            primary: "hsl(200 80% 50%)",
            surface: "hsl(215 25% 20%)",
            "text-primary": "hsl(0 0% 95%)",
            "text-secondary": "hsl(0 0% 70%)",
          },
          borderRadius: {
            sm: "6px",
            md: "10px",
            lg: "16px",
            xl: "24px",
          },
          boxShadow: {
            card: "0 4px 12px hsla(0, 0%, 0%, 0.2)",
            input: "inset 0 2px 4px hsla(0, 0%, 0%, 0.05)",
          },
          spacing: {
            sm: "8px",
            md: "12px",
            lg: "20px",
            xl: "32px",
          },
          fontSize: {
            body: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
            heading: ["1.25rem", { fontWeight: "600" }],
            display: ["1.875rem", { fontWeight: "700" }],
          },
          transitionTimingFunction: {
            ease: "cubic-bezier(0.22,1,0.36,1)",
          },
          transitionDuration: {
            base: "250ms",
            fast: "150ms",
            slow: "400ms",
          },
        },
      },
      plugins: [],
    };
  