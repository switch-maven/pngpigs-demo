const customTypes = require('../custom-types')
const queryResovers = require('./query')
const mutationResolvers = require('./mutation')

const resolver = {
  ...customTypes,
  ...queryResovers,
  ...mutationResolvers
}

module.exports = resolver
