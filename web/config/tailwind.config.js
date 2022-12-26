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
    },
  },
  plugins: [],
}
