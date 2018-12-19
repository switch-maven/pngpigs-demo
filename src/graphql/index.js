const express_graphql = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = require('./schema')
const resolver = require('./resolver')

module.exports = express_graphql({
  schema: buildSchema(schema),
  rootValue: resolver,
  graphiql: true
})
