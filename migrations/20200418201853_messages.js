exports.up = function(knex) {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign("user_id").references('id').inTable("users")
    table.text("user_name").unsigned();
    table.foreign("user_name").references('user_name').inTable("users")
    table.text('image_link').notNullable();
    table.text('caption');
    table.text('hashtag').notNullable();
    table.timestamp('created_at', { precision: 4 }).defaultTo(knex.fn.now(6));

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
