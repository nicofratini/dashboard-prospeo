import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,vue,ts}',
  ],
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
