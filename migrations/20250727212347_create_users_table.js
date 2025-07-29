/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id') // auto-incrementing primary key
    table.string('username').notNullable()
    table.string('email').unique().notNullable()
    table.string('password').notNullable()
    table.timestamps(true, true) // created_at and updated_at
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
