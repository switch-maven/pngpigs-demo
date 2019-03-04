
const { accounts } = require('../seed-data')

exports.seed = function(knex, Promise) {
  console.log(accounts)
  // Deletes ALL existing entries
  return knex('accounts').del()
    .then(function () {
      // Inserts seed entries
      return knex('accounts').insert(accounts);
    });
};
