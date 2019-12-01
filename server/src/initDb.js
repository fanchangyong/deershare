const { Model } = require('objection');
const Knex = require('knex');

function initDb () {
  const knexConfig = require('../knexfile');

  const knex = Knex(knexConfig);
  Model.knex(knex);
  return knex;
}

export default initDb;
