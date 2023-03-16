const configDir = __dirname

module.exports = (config) => {
  config.module.rules[0].oneOf[5] = {
    test: /\.css$/,
    exclude: /node_modules/,
    sideEffects: true,
    use: [
      'style-loader',
      { loader: 'css-loader', options: { importLoaders: 1 } },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: configDir,
          },
        },
      },
    ],
  }
  // adding another rule for the css files
  config.module.rules[0].oneOf[6] = {
    test: /\.css$/i,
    sideEffects: false,
    include: /node_modules/,
    use: ['style-loader', 'css-loader'],
  }

  return config
}
