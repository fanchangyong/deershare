const config = {
  env: process.env.NODE_ENV,
  port: 3001,
  publicPath: '',
  morganFormat: 'dev',
  prerender: {
    enabled: true,
    port: 3999,
  },
};

module.exports = config;
