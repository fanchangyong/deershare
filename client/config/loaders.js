const autoprefixer = require('autoprefixer');

exports.babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: false,
  },
};

exports.styleLoader = {
  loader: 'style-loader',
  options: {
  },
};

exports.cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    localsConvention: 'camelCase',
    sourceMap: true,
    modules: {
      mode: 'local',
      localIdentName: '[path][name]---[local]---[hash:base64:5]',
    },
  },
};

exports.postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9',
        ],
        flexbox: 'no-2009',
      }),
    ],
  },
};

exports.stylusLoader = {
  loader: 'stylus-loader',
  options: {
    sourceMap: true,
  },
};
