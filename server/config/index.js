const _ = require('lodash');
const fs = require('fs');
const path = require('path');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const env = process.env.NODE_ENV;

try {
  fs.accessSync(path.join(__dirname, env) + '.js');
} catch (err) {
  throw new Error('指定的 NODE_ENV 缺少相应的配置文件');
}

const baseConfig = require('./base');
const envConfig = require('./' + env);

module.exports = _.merge(baseConfig, envConfig);
