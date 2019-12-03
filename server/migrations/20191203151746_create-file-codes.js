import { addDefaultColumns } from '../src/dbUtil';

exports.up = async function(knex) {
  await knex.schema.createTable('file_codes', table => {
    table.increments();
    table.string('code');
    table.string('expire_at');
    addDefaultColumns(knex, table);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('file_codes');
};
