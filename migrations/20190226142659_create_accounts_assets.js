
exports.up = function(knex, Promise) {
  var accounts = knex.schema.createTable('accounts', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.string('mobile').notNullable();

    table.json('device');

    table.string('code')
    table.timestamp('confirmed_at')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  });


  var assets = knex.schema.createTable('assets', function(table) {
    table.increments();

    table.integer('account_id').unsigned().references('accounts.id');

    table.string('uid').notNullable();
    table.string('type').notNullable();
    table.string('name');

    table.string('gender');
    table.string('origin');
    table.string('breed');
    table.string('skin');

    table.float('weight');
    table.float('price');

    table.string('status');

    table.string('birth_place')
    table.timestamp('birth_date');

    table.string('death_place')
    table.timestamp('death_date');

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  });


    var events = knex.schema.createTable('events', function(table) {
      table.increments();

      table.integer('account_id').unsigned().references('accounts.id');
      table.integer('asset_id').unsigned().references('assets.id');

      table.string('type').notNullable();
      table.string('name').notNullable();
      table.string('txid');

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    });

  return Promise.all([accounts, assets])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('accounts'),
    knex.schema.dropTable('assets') ])

};
