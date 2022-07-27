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
        'bg-sky-300': '#7dd3fc',
      },
      flex: {
        50: '0 0 50%',
        100: '0 0 100%',
      },
    },
  },
  plugins: [],
}
