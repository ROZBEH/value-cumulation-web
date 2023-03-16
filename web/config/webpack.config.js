const configDir = __dirname

module.exports = (config) => {
  config.module.rules[0].oneOf.unshift({
    test: /(ReactToastify\.css|\.css)$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: configDir,
          },
        },
      },
    ],
  })

  return config
}
