exports.up = function(knex) {
  return knex.schema.createTable('messageInfo', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign("user_id").references('id').inTable("users");
    table.integer('message_id').unsigned();
    table.text('userName');
    table.foreign("message_id").references('id').inTable("messages");
    table.text('comments');
    table.integer('likes');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messageInfo');
};
