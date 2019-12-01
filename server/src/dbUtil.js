export function addDefaultColumns (knex, table) {
  table.datetime('created_at').defaultTo(knex.fn.now());
  table.datetime('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
}
