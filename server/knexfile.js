// Update with your config settings.

require('@babel/register');
require('regenerator-runtime/runtime');

require('dotenv').config();

const { knexSnakeCaseMappers } = require('objection');

module.exports = {
  client: 'mysql',
  connection: process.env.DATABASE_URL,
  ...knexSnakeCaseMappers(),
};
