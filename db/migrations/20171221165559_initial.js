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

    knex.schema.createTable('shows', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('apiKey');
      table.string('venue');
      table.string('date');
      table.string('latitude');
      table.string('longitude');
      table.string('description');
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

    knex.schema.createTable('users_shows', (table) => {
      table.increments('id').primary();
      table.integer('showId')
        .unsigned()
        .references('shows.id')
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
    knex.schema.dropTable('venues_shows'),
    knex.schema.dropTable('bands'),
    knex.schema.dropTable('users')

  ]);
};
