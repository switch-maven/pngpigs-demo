const { assets, events } = require('../seed-data')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  var seedAssets = knex('assets')
    .del()
    .then(function () {
      console.log('seed assets')

      return knex('assets').insert(assets)
    })

  var seedEvents = knex('events')
    .del()
    .then(function () {
      console.log('seed events')

      return knex('events').insert(events)
    })

  return Promise.all([seedAssets, seedEvents])
}
