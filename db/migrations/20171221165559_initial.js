exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('email');
      table.string('preferredLocation');
    }),

    knex.schema.createTable('bands', (table) => {
      table.increments('id').primary();
      table.string('bandName');
    }),

    knex.schema.createTable('venues', (table) => {
      table.increments('id').primary();
      table.string('venuesName');
    }),

    knex.schema.createTable('bands_users', (table) => {
      table.increments('id').primary();
      table.integer('bandId')
        .unsigned()
        .references('bands.id')
        .onDelete('CASCADE');
      table.integer('usersId')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE');
    }),

    knex.schema.createTable('users_venues', (table) => {
      table.increments('id').primary();
      table.integer('venueId')
        .unsigned()
        .references('venues.id')
        .onDelete('CASCADE');
      table.integer('usersId')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE');
    })


  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('bands_users'),
    knex.schema.dropTable('users_venues'),
    knex.schema.dropTable('venues'),
    knex.schema.dropTable('bands'),
    knex.schema.dropTable('users')

  ]);
};
