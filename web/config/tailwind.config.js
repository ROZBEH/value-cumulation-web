module.exports = {
  mode: 'jit',
  purge: ['src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
