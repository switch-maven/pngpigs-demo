const express_graphql = require('express-graphql')
const { importSchema } = require('graphql-import')
const { buildSchema } = require('graphql')
const path = require('path')
const API = require('../api')

const schema = importSchema(path.join(__dirname, './schema.graphql'))

module.exports = express_graphql({
  schema: buildSchema(schema),
  rootValue: {
    assets: API.assets,
    asset: API.asset,
    account: API.account,
    accounts: API.accounts,
    createAccount: API.createAccount,
    verifyAccount: API.verifyAccount
  },
  graphiql: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack ? error.stack.split('\n') : [],
    path: error.path
  })
})
