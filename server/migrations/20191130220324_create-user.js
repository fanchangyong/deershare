import { addDefaultColumns } from '../src/dbUtil';

exports.up = async function (knex) {
  await knex.schema.createTable('user', table => {
    table.increments();
    table.string('account');
    table.string('password');
    table.string('is_vip');
    addDefaultColumns(knex, table);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('user');
};
