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
      '10xl': '10rem'
    },
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      // Palette tokens (src/styles.css); class names kept so templates are unchanged.
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
      'cool-gray': {
        50: '#fbfdfe',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cfd8e3',
        400: '#97a6ba',
        500: '#64748b',
        600: '#475569',
        700: '#364152',
        800: '#27303f',
        900: '#1a202e'
      },
      red: {
        50: '#fdf2f2',
        100: '#fde8e8',
        200: '#fbd5d5',
        300: '#f8b4b4',
        400: '#f98080',
        500: '#f05252',
        600: '#e02424',
        700: '#c81e1e',
        800: '#9b1c1c',
        900: '#771d1d'
      },
      orange: {
        50: '#fff8f1',
        100: '#feecdc',
        200: '#fcd9bd',
        300: '#fdba8c',
        400: '#ff8a4c',
        500: '#ff5a1f',
        600: '#d03801',
        700: '#b43403',
        800: '#8a2c0d',
        900: '#771d1d'
      },
      yellow: {
        50: '#fdfdea',
        100: '#fdf6b2',
        200: '#fce96a',
        300: '#faca15',
        400: '#e3a008',
        500: '#c27803',
        600: '#9f580a',
        700: '#8e4b10',
        800: '#723b13',
        900: '#633112'
      },
      green: {
        50: '#f3faf7',
        100: '#def7ec',
        200: '#bcf0da',
        300: '#84e1bc',
        400: '#31c48d',
        500: '#0e9f6e',
        600: '#057a55',
        700: '#046c4e',
        800: '#03543f',
        900: '#014737'
      },
      teal: {
        50: '#edfafa',
        100: '#d5f5f6',
        200: '#afecef',
        300: '#7edce2',
        400: '#16bdca',
        500: '#0694a2',
        600: '#047481',
        700: '#036672',
        800: '#05505c',
        900: '#014451'
      },
      blue: {
        50: '#ebf5ff',
        100: '#e1effe',
        200: '#c3ddfd',
        300: '#a4cafe',
        400: '#76a9fa',
        500: '#3f83f8',
        600: '#1c64f2',
        700: '#1a56db',
        800: '#1e429f',
        900: '#233876'
      },
      indigo: {
        50: '#f0f5ff',
        100: '#e5edff',
        200: '#cddbfe',
        300: '#b4c6fc',
        400: '#8da2fb',
        500: '#6875f5',
        600: '#5850ec',
        700: '#5145cd',
        800: '#42389d',
        900: '#362f78'
      },
      // Palette tokens (src/styles.css); class names kept so templates are unchanged.
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
      pink: {
        50: '#fdf2f8',
        100: '#fce8f3',
        200: '#fad1e8',
        300: '#f8b4d9',
        400: '#f17eb8',
        500: '#e74694',
        600: '#d61f69',
        700: '#bf125d',
        800: '#99154b',
        900: '#751a3d'
      }
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
        sans: ['Inter', 'Montserrat', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
