const schema = `
type Query {
  account(id: String!): Account,
  accounts: [Account]
}

type Account {
  id: String,
  name: String,
  mobile: String,
  address: String,
  assets: [LiveStockAsset]
}

type LiveStockAsset {
  id: String,
  name: String,
  image: String,
  description: String

  uid: String,
  type: String,
  birth_place: String,
  birth_date: Int,
  origin: String,
  parents: [LiveStockAsset],
  skin: [String],
  diet: [String]
  vaccination:[String]
  weight: Int,
  price: Int
}
`

module.exports = schema
