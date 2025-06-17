import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode with class strategy
  darkMode: ['class'],
  // Ensure dark class is always included in build output
  safelist: ['dark'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'sans-serif',
        ],
        heading: [
          'Inter',
          'sans-serif',
        ],
        alt: [
          'Roboto',
          'sans-serif',
        ],
        accent: [
          'Tomorrow',
          'sans-serif',
        ],
        brand: [
          'Changa One',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'gradient-from': 'hsl(var(--gradient-from))',
        'gradient-via': 'hsl(var(--gradient-via))',
        'gradient-to': 'hsl(var(--gradient-to))',
        'primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'popover': {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'card': {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'sidebar': {
          'DEFAULT': 'hsl(var(--sidebar-background))',
          'foreground': 'hsl(var(--sidebar-foreground))',
          'primary': 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          'accent': 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          'border': 'hsl(var(--sidebar-border))',
          'ring': 'hsl(var(--sidebar-ring))',
        },
        'chart': {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--reka-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--reka-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'collapsible-down': {
          from: {
            height: '0px',
          },
          to: {
            height: 'var(--reka-collapsible-content-height)',
          },
        },
        'collapsible-up': {
          from: {
            height: 'var(--reka-collapsible-content-height)',
          },
          to: {
            height: '0px',
          },
        },
        'marquee': {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        'marquee2': {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0%)',
          },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'shake': {
          '0%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
        'marquee': 'marquee 20s linear infinite',
        'marquee2': 'marquee2 20s linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'shake': 'shake 2s ease-in-out infinite',
      },
      transitionDelay: {
        1200: '1200ms',
        1500: '1500ms',
      },
      gridTemplateColumns: {
        'sidebar': '220px minmax(0, 1fr)',
        'sidebar-lg': '240px minmax(0, 1fr)',
      },
    },
  },
  // Define content sources for Tailwind's purge/JIT
  content: [
    './app/**/*.{js,vue,ts}',
  ],
  // Include plugins
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
