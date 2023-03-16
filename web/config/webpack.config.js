const configDir = __dirname

module.exports = (config) => {
  // Modify the existing CSS rule to include postcss-loader
  config.module.rules[0].oneOf[5].use.push({
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        config: `${configDir}/postcss.config.js`,
      },
    },
  })

  // Add new rule to handle ReactToastify.css and other CSS files
  config.module.rules[0].oneOf.unshift({
    test: /(ReactToastify\.css|\.css)$/,
    use: [
      'style-loader',
      { loader: 'css-loader', options: { importLoaders: 1 } },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: `${configDir}/postcss.config.js`,
          },
        },
      },
    ],
  })

  return config
}
