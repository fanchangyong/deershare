
exports.up = async function(knex) {
  await knex.schema.createTable('feedbacks', table => {
    table.increments();
    table.string('contact').comment('手机号或邮箱');
    table.text('content', 'mediumtext').comment('留言内容');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('feedbacks');
};
