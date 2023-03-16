const path = require('path')

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    path.resolve(__dirname, '..', 'src', '**', '!(*.test).js'),
    path.resolve(__dirname, '..', 'src', '**', '*.html'),
  ],
  options: {
    whitelist: ['react-toastify/dist/ReactToastify.css'],
  },
  // This extractor is used for tailwind classes.
  // Read more here: https://tailwindcss.com/docs/controlling-file-size/
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
})

module.exports = {
  plugins: [
    require('tailwindcss')(path.resolve(__dirname, 'tailwind.config.js')),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
}
