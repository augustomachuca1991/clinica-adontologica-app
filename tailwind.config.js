/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", // slate-200
        input: "var(--color-input)", // slate-200
        ring: "var(--color-ring)", // blue-600
        background: "var(--color-background)", // gray-50
        foreground: "var(--color-foreground)", // slate-800
        primary: {
          DEFAULT: "var(--color-primary)", // blue-600
          foreground: "var(--color-primary-foreground)", // white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // teal-700
          foreground: "var(--color-secondary-foreground)", // white
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)", // teal-700
          foreground: "var(--color-tertiary-foreground)", // white
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // red-600
          foreground: "var(--color-destructive-foreground)", // white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // slate-100
          foreground: "var(--color-muted-foreground)", // slate-500
        },
        accent: {
          DEFAULT: "var(--color-accent)", // red-600
          foreground: "var(--color-accent-foreground)", // white
        },
        popover: {
          DEFAULT: "var(--color-popover)", // white
          foreground: "var(--color-popover-foreground)", // slate-800
        },
        card: {
          DEFAULT: "var(--color-card)", // white
          foreground: "var(--color-card-foreground)", // slate-800
        },
        success: {
          DEFAULT: "var(--color-success)", // emerald-600
          foreground: "var(--color-success-foreground)", // white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // amber-600
          foreground: "var(--color-warning-foreground)", // white
        },
        error: {
          DEFAULT: "var(--color-error)", // red-600
          foreground: "var(--color-error-foreground)", // white
        },
        brand: {
          primary: "var(--color-brand-primary)", // Deep Clinical Blue
          secondary: "var(--color-brand-secondary)", // Calming Teal
          accent: "var(--color-brand-accent)", // Warm Amber
          success: "var(--color-brand-success)", // Healthcare Green
        },
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Source Sans 3", "sans-serif"],
        accent: ["JetBrains Mono", "monospace"],
        sans: ["Source Sans 3", "sans-serif"],
      },
      fontSize: {
        "responsive-sm": "clamp(0.875rem, 2vw, 1rem)",
        "responsive-base": "clamp(1rem, 2.5vw, 1.125rem)",
        "responsive-lg": "clamp(1.125rem, 3vw, 1.5rem)",
        "responsive-xl": "clamp(1.5rem, 4vw, 2rem)",
      },
      spacing: {
        "clinical-xs": "var(--spacing-xs)", // 8px
        "clinical-sm": "var(--spacing-sm)", // 12px
        "clinical-md": "var(--spacing-md)", // 16px
        "clinical-lg": "var(--spacing-lg)", // 24px
        "clinical-xl": "var(--spacing-xl)", // 32px
        "clinical-2xl": "var(--spacing-2xl)", // 48px
      },
      borderRadius: {
        lg: "var(--radius-lg)", // 8px
        md: "var(--radius-md)", // 6px
        sm: "var(--radius-sm)", // 4px
        xl: "var(--radius-xl)", // 12px
      },
      boxShadow: {
        "clinical-sm": "var(--shadow-sm)",
        "clinical-md": "var(--shadow-md)",
        "clinical-lg": "var(--shadow-lg)",
        "clinical-xl": "var(--shadow-xl)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        clinical: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        slideOut: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-out": "slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
