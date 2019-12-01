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
    singleton: true,
  },
};

exports.cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
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
          'not id < 9',
        ],
        flexbox: 'no-2009',
      }),
    ],
  },
};

exports.stylusLoader = {
  loader: 'sstylus-loader',
  options: {
    sourceMap: true,
  },
};
