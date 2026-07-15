import tailwindcssAnimate from 'tailwindcss-animate';

import { colors as tokens } from './src/design-tokens/colors';
import typographyPlugin from './src/design-tokens/typography-plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      // Additive: mirrors breakpoints.wide (1440px). Lets future code use `wide:`
      // instead of the literal `min-[1440px]:` arbitrary variant. Positioned by
      // min-width so Tailwind orders it between xl and 2xl. Does not alter the
      // existing sm/md/lg/xl/2xl values.
      wide: '1440px',
      '2xl': '1536px',
    },
    extend: {
      // Mirrors src/design-tokens/typography.ts → fontFamily. Keep in sync.
      // Enables `font-primary` / `font-secondary` to replace `font-['Gilroy']`.
      fontFamily: {
        primary: ['Gilroy', 'system-ui', 'sans-serif'],
        secondary: ['"TT Norms Pro"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // `--primary` is aligned to the brand token #4E2FD2 in globals.css.
        // `<alpha-value>` lets opacity modifiers (e.g. `bg-primary/5`) resolve.
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Design-token bridge — values single-sourced from
        // src/design-tokens/colors.ts. Role-based utilities (e.g. `bg-canvas`,
        // `text-ink-secondary`) replace inline arbitrary hex in components.
        canvas: tokens.background.canvas,
        surface: {
          DEFAULT: tokens.background.surface,
          hover: tokens.background.surfaceHover,
          expanded: tokens.background.expandedStep,
        },
        ink: {
          DEFAULT: tokens.text.primary,
          secondary: tokens.text.secondary,
          heading: tokens.text.heading,
          eyebrow: tokens.text.eyebrow,
          black: tokens.base.black,
        },
        sale: tokens.status.error,
        swatch: tokens.border.swatch,
        track: tokens.border.loaderTrack,
        shimmer: {
          from: tokens.background.shimmerFrom,
          to: tokens.background.shimmerTo,
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // ChatGPT-style loader: a soft gradient that flows across the frame.
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.25s ease-out',
        'accordion-up': 'accordion-up 0.25s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        'gradient-flow': 'gradient-flow 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate, typographyPlugin],
};
