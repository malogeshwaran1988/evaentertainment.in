import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/** Admin-only Tailwind config (loaded via `@config` in src/styles/admin.css). */
export default {
  darkMode: "class",
  content: [
    "./src/app/(admin)/**/*.{ts,tsx}",
    "./src/components/admin/**/*.{ts,tsx}",
    "./src/components/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Tailwind 3 has no `invalid` aria variant; shadcn styles `aria-invalid:*`.
      aria: {
        invalid: 'invalid="true"',
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        link: "rgb(var(--link-rgb) / <alpha-value>)",
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
          raised: "var(--surface-raised)",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          muted: "var(--border-muted)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          subtle: "var(--ink-subtle)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "var(--card-shadow)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
