import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'gold-500': '#D4AF37',
        'steel-blue-500': '#4682B4',
        'steel-blue-600': '#357ABD',
      },
    },
  },
  plugins: [],
} satisfies Config;
