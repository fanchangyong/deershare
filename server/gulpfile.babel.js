/* eslint-disable no-console */

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import webpack from 'webpack';

function envProd(cb) {
  process.env.NODE_ENV = 'production';
  cb();
}

function envDev(cb) {
  process.env.NODE_ENV = 'development';
  cb();
}


function build(cb) {
  const config = require('./config/webpack.config.js');

  webpack(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();
    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    console.log('[webpack]', stats.toString({ colors: true }));
    cb();
  });
}

function server(cb) {
  nodemon({
    script: 'src/index.js',
    ext: 'js,json',
    watch: ['./'],
    delay: 500,
  });
  cb();
}

const dev = gulp.series(envDev, server);

exports.dev = dev;

exports.build = gulp.series(envProd, build);
exports.default = dev;
