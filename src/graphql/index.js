const express_graphql = require('express-graphql')
const { importSchema } = require('graphql-import')
const { buildSchema } = require('graphql')
const path = require('path')

const schema = importSchema(path.join(__dirname, './schema.graphql'))
const resolver = require('./resolvers')

module.exports = express_graphql({
  schema: buildSchema(schema),
  rootValue: resolver,
  graphiql: true
})
