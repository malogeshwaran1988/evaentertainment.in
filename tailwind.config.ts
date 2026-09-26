import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Admin UI has its own config (tailwind.admin.config.ts).
    "!./src/app/\\(admin\\)/**",
    "!./src/components/admin/**",
    "!./src/components/ui/**",
  ],
  theme: {
    extend: {},
  },
  // Legacy EVA CSS owns most visual styles; keep Tailwind utilities available
  // without fighting Bootstrap/custom class names.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
} satisfies Config;
