const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontSize: {
      ...defaultTheme.fontSize,
      // Used by templates but never defined before; rendered at full size.
      '3xs': ['0.625rem', { lineHeight: '0.875rem' }],
      '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      '10xl': '10rem'
    },
    // Every colour is a CSS variable defined in src/styles.css ("R G B", so
    // opacity modifiers work). gray = neutral and purple = brand palette.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'rgb(var(--white) / <alpha-value>)',
      black: 'rgb(var(--black) / <alpha-value>)',
      gray: {
        50: 'rgb(var(--neutral-50) / <alpha-value>)',
        100: 'rgb(var(--neutral-100) / <alpha-value>)',
        200: 'rgb(var(--neutral-200) / <alpha-value>)',
        300: 'rgb(var(--neutral-300) / <alpha-value>)',
        400: 'rgb(var(--neutral-400) / <alpha-value>)',
        500: 'rgb(var(--neutral-500) / <alpha-value>)',
        600: 'rgb(var(--neutral-600) / <alpha-value>)',
        700: 'rgb(var(--neutral-700) / <alpha-value>)',
        800: 'rgb(var(--neutral-800) / <alpha-value>)',
        900: 'rgb(var(--neutral-900) / <alpha-value>)',
      },
      purple: {
        50: 'rgb(var(--brand-50) / <alpha-value>)',
        100: 'rgb(var(--brand-100) / <alpha-value>)',
        200: 'rgb(var(--brand-200) / <alpha-value>)',
        300: 'rgb(var(--brand-300) / <alpha-value>)',
        400: 'rgb(var(--brand-400) / <alpha-value>)',
        500: 'rgb(var(--brand-500) / <alpha-value>)',
        600: 'rgb(var(--brand-600) / <alpha-value>)',
        700: 'rgb(var(--brand-700) / <alpha-value>)',
        800: 'rgb(var(--brand-800) / <alpha-value>)',
        900: 'rgb(var(--brand-900) / <alpha-value>)',
      },
      red: {
        50: 'rgb(var(--red-50) / <alpha-value>)',
        100: 'rgb(var(--red-100) / <alpha-value>)',
        200: 'rgb(var(--red-200) / <alpha-value>)',
        300: 'rgb(var(--red-300) / <alpha-value>)',
        400: 'rgb(var(--red-400) / <alpha-value>)',
        500: 'rgb(var(--red-500) / <alpha-value>)',
        600: 'rgb(var(--red-600) / <alpha-value>)',
        700: 'rgb(var(--red-700) / <alpha-value>)',
        800: 'rgb(var(--red-800) / <alpha-value>)',
        900: 'rgb(var(--red-900) / <alpha-value>)',
      },
      orange: {
        50: 'rgb(var(--orange-50) / <alpha-value>)',
        100: 'rgb(var(--orange-100) / <alpha-value>)',
        200: 'rgb(var(--orange-200) / <alpha-value>)',
        300: 'rgb(var(--orange-300) / <alpha-value>)',
        400: 'rgb(var(--orange-400) / <alpha-value>)',
        500: 'rgb(var(--orange-500) / <alpha-value>)',
        600: 'rgb(var(--orange-600) / <alpha-value>)',
        700: 'rgb(var(--orange-700) / <alpha-value>)',
        800: 'rgb(var(--orange-800) / <alpha-value>)',
        900: 'rgb(var(--orange-900) / <alpha-value>)',
      },
      amber: {
        50: 'rgb(var(--amber-50) / <alpha-value>)',
        100: 'rgb(var(--amber-100) / <alpha-value>)',
        200: 'rgb(var(--amber-200) / <alpha-value>)',
        300: 'rgb(var(--amber-300) / <alpha-value>)',
        400: 'rgb(var(--amber-400) / <alpha-value>)',
        500: 'rgb(var(--amber-500) / <alpha-value>)',
        600: 'rgb(var(--amber-600) / <alpha-value>)',
        700: 'rgb(var(--amber-700) / <alpha-value>)',
        800: 'rgb(var(--amber-800) / <alpha-value>)',
        900: 'rgb(var(--amber-900) / <alpha-value>)',
      },
      yellow: {
        50: 'rgb(var(--yellow-50) / <alpha-value>)',
        100: 'rgb(var(--yellow-100) / <alpha-value>)',
        200: 'rgb(var(--yellow-200) / <alpha-value>)',
        300: 'rgb(var(--yellow-300) / <alpha-value>)',
        400: 'rgb(var(--yellow-400) / <alpha-value>)',
        500: 'rgb(var(--yellow-500) / <alpha-value>)',
        600: 'rgb(var(--yellow-600) / <alpha-value>)',
        700: 'rgb(var(--yellow-700) / <alpha-value>)',
        800: 'rgb(var(--yellow-800) / <alpha-value>)',
        900: 'rgb(var(--yellow-900) / <alpha-value>)',
      },
      green: {
        50: 'rgb(var(--green-50) / <alpha-value>)',
        100: 'rgb(var(--green-100) / <alpha-value>)',
        200: 'rgb(var(--green-200) / <alpha-value>)',
        300: 'rgb(var(--green-300) / <alpha-value>)',
        400: 'rgb(var(--green-400) / <alpha-value>)',
        500: 'rgb(var(--green-500) / <alpha-value>)',
        600: 'rgb(var(--green-600) / <alpha-value>)',
        700: 'rgb(var(--green-700) / <alpha-value>)',
        800: 'rgb(var(--green-800) / <alpha-value>)',
        900: 'rgb(var(--green-900) / <alpha-value>)',
      },
      teal: {
        50: 'rgb(var(--teal-50) / <alpha-value>)',
        100: 'rgb(var(--teal-100) / <alpha-value>)',
        200: 'rgb(var(--teal-200) / <alpha-value>)',
        300: 'rgb(var(--teal-300) / <alpha-value>)',
        400: 'rgb(var(--teal-400) / <alpha-value>)',
        500: 'rgb(var(--teal-500) / <alpha-value>)',
        600: 'rgb(var(--teal-600) / <alpha-value>)',
        700: 'rgb(var(--teal-700) / <alpha-value>)',
        800: 'rgb(var(--teal-800) / <alpha-value>)',
        900: 'rgb(var(--teal-900) / <alpha-value>)',
      },
      blue: {
        50: 'rgb(var(--blue-50) / <alpha-value>)',
        100: 'rgb(var(--blue-100) / <alpha-value>)',
        200: 'rgb(var(--blue-200) / <alpha-value>)',
        300: 'rgb(var(--blue-300) / <alpha-value>)',
        400: 'rgb(var(--blue-400) / <alpha-value>)',
        500: 'rgb(var(--blue-500) / <alpha-value>)',
        600: 'rgb(var(--blue-600) / <alpha-value>)',
        700: 'rgb(var(--blue-700) / <alpha-value>)',
        800: 'rgb(var(--blue-800) / <alpha-value>)',
        900: 'rgb(var(--blue-900) / <alpha-value>)',
      },
      indigo: {
        50: 'rgb(var(--indigo-50) / <alpha-value>)',
        100: 'rgb(var(--indigo-100) / <alpha-value>)',
        200: 'rgb(var(--indigo-200) / <alpha-value>)',
        300: 'rgb(var(--indigo-300) / <alpha-value>)',
        400: 'rgb(var(--indigo-400) / <alpha-value>)',
        500: 'rgb(var(--indigo-500) / <alpha-value>)',
        600: 'rgb(var(--indigo-600) / <alpha-value>)',
        700: 'rgb(var(--indigo-700) / <alpha-value>)',
        800: 'rgb(var(--indigo-800) / <alpha-value>)',
        900: 'rgb(var(--indigo-900) / <alpha-value>)',
      },
    },
    extend: {
      screens: {
        print: { raw: 'print' }
      },
      maxHeight: {
        0: '0',
        xl: '36rem'
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', ...defaultTheme.fontFamily.sans],
        // Odometer digits and licence plates.
        mono: ['"Fira Mono"', ...defaultTheme.fontFamily.mono]
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
