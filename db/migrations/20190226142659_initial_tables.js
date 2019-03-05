exports.up = function (knex, Promise) {
  var accounts = knex.schema.createTable('accounts', function (table) {
    table.increments()
    table.string('name').notNullable()
    table.string('address').notNullable()
    table.string('mobile').notNullable()

    table.json('device').defaultTo('{}')
    table.json('info').defaultTo('{}')

    table.string('code')
    table.timestamp('confirmed_at')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  var assets = knex.schema.createTable('assets', function (table) {
    table.increments()

    table.integer('account_id').unsigned()

    table.string('uid').notNullable()
    table.string('type').notNullable()
    table.string('name')
    table.string('image')
    table.string('description')

    table.string('gender')
    table.string('origin')
    table.string('breed')
    table.string('skin')

    table.specificType('diet', 'text ARRAY')
    table.specificType('medications', 'text ARRAY')

    table.json('location').defaultTo([])

    table.float('weight')
    table.float('price')

    table.string('status')

    table.string('birth_place')
    table.timestamp('birth_date')

    table.string('death_place')
    table.timestamp('death_date')

    // Caches
    table.json('prices').defaultTo([])
    table.json('weights').defaultTo([])

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  var events = knex.schema.createTable('events', function (table) {
    table.increments()

    table.integer('account_id').unsigned() // .references('accounts.id');
    table.integer('asset_id').unsigned() // .references('assets.id');

    table.string('name').notNullable()
    table.string('type')

    table.json('data')

    table.string('txid')
    table.string('signiture')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  return Promise.all([accounts, assets, events])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('events'),
    knex.schema.dropTable('assets'),
    knex.schema.dropTable('accounts')
  ])
}
