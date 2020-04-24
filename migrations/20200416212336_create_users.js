
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.text('user_name').unique().notNullable();
    table.text('first_name').notNullable();
    table.text('last_name').notNullable();
    table.text('email').unique().notNullable();
    table.text('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

};

exports.down = function(knex) {
  return knex.schema.dropTable('users');

};
