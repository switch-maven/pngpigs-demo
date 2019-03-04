require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const graphqlHandler = require('./graphql')


const Knex = require('knex');
const knexConfig = require('../knexfile');
const { Model } = require('objection');

// Initialize knex.
const knex = Knex(knexConfig.development);
// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

app.use(express.static('public'))

app.use('/graphql', graphqlHandler)

app.get('/', (req, res) => {
  res.send('Oink, Oink... ')
})

app.get('/accounts', async (req, res) => {
  var { Account } = require('./models')
  var accounts = await Account.query()

  res.send(accounts)
})

app.listen(PORT, () => {
  console.log('listening at port:', PORT)
})
