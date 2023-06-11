/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
module.exports = {
  mode: 'jit',
  purge: ['src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        50: '50%',
      },
      maxWidth: {
        '200px': '200px',
        '100px': '100px',
      },
      maxHeight: {
        '200px': '200px',
        '100px': '100px',
      },
      colors: {
        'lightsky-blue': '#00BFFF',
        'sky-300': '#7dd3fc',
      },
      backgroundColor: {
        gainsboro: '#DCDCDC',
        springgreen: '#00FF7F',
      },
      flex: {
        50: '0 0 50%',
        100: '0 0 100%',
      },
      width: {
        200: '200%',
        150: '150%',
      },
      minWidth: {
        '1/2': '50%',
        '3/4': '75%',
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        bounce: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
