const accounts = [
  {
    id: 1,
    name: 'Taylor Luk',
    mobile: '+61415882430',
    address: '0xe208bCa65772f8da0bb7D1D4f671440174506855',
    status: 'confirmed',
    asset_ids: ['asset-1', 'asset-2'],

    credentials: {
      geora_id: "8b58349d-57de-4406-acc3-bd7c32936a7d"
    }
  },

  {
    id: 2,
    name: 'Mark guo',
    mobile: '+61422416086‬',
    address: "0x44646a5ad31eb79f45C22DbdDeEFfed7BbD2c614",
    status: 'confirmed',
    asset_ids: ['asset-3']
  }
]

const registry = {
  'PNG:*': {
    name: "Pigchain for Puapa New Guini",
    symbol: 'PNG',
    decimals: 16,
    contract: '0x',
  }
}

const assets = [
  {
    account_id: 1,

    id: 1,
    uid: "PNG:1",

    name: 'piggy 1',
    image: 'piggy.jpg',
    description: 'description 1',

    type: 'Pig',

    birth_place: 'city 1',
    birth_date: 1545194130934,

    origin: 'country 1',
    parents: [],

    skin: ['black'],
    diet: ['potato'],
    vaccination: ['v-1', 'v-2'],
    weight: 120,
    price: 1000
  },

  {
    account_id: 1,

    id: 2,
    name: 'piggy 2',
    image: 'piggy.jpg',
    description: 'description 2',

    uid: 'PNG:2',

    type: 'Pig',
    birth_place: 'city 2',
    birth_date: 1545194130934,
    origin: 'country 2',
    parents: [],
    skin: ['black'],
    diet: ['potato'],
    vaccination: ['v-1', 'v-2'],
    weight: 120,
    price: 1000
  },

  {
    account_id: 1,

    id: 3,
    name: 'piggy 3',
    image: 'piggy.jpg',
    description: 'description 3',

    uid: 'PNG:3',

    type: 'Pig',

    birth_place: 'city 3',
    birth_date: 1545194130934,
    origin: 'country 3',
    parents: [],
    skin: ['black'],
    diet: ['potato'],
    vaccination: ['v-1', 'v-2'],
    weight: 120,
    price: 1000
  }
]

module.exports = {
  accounts,
  assets
}
