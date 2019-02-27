const express_graphql = require('express-graphql')
const { importSchema } = require('graphql-import')
const { buildSchema } = require('graphql')
const path = require('path')
const API = require('./api')

const schema = importSchema(path.join(__dirname, './schema.graphql'))

module.exports = express_graphql({
  schema: buildSchema(schema),
  rootValue: {
    asset: API.asset,
    account: API.account,
    createAccount: API.createAccount,
    verifyAccount: API.verifyAccount
  },
  graphiql: true
})
