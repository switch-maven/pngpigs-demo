const accounts = [
  {
    id: 'acc-1',
    name: 'user 1',
    mobile: 1001,
    address: 'eth address 1',
    asset_ids: ['asset-1', 'asset-2']
  },
  {
    id: 'acc-2',
    name: 'user 2',
    mobile: 1002,
    address: 'address 2',
    asset_ids: ['asset-3']
  },
  {
    id: 'acc-3',
    name: 'user 3',
    mobile: 1003,
    address: 'address 3',
    asset_ids: ['asset-1', 'asset-2', 'asset-3']
  }
]

const assets = [
  {
    id: 'asset-1 uniq token id',
    name: 'piggy 1',
    image: 'piggy.jpg',
    description: 'description 1',

    uid: 'uid-1',
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
    id: 'asset-2',
    name: 'piggy 2',
    image: 'piggy.jpg',
    description: 'description 2',

    uid: 'uid-2',
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
    id: 'asset-3',
    name: 'piggy 3',
    image: 'piggy.jpg',
    description: 'description 3',

    uid: 'uid-3',
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
