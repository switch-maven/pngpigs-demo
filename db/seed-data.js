const accounts = [
  {
    name: 'Taylor Luk',
    mobile: '+61415882430',
    address: '0xe208bCa65772f8da0bb7D1D4f671440174506855',
    // status: 'confirmed',
    device: {},
    info: {
      geora_actor_id: '8b58349d-57de-4406-acc3-bd7c32936a7d'
    }
  },

  {
    name: 'Mark guo',
    mobile: '+61422416086',
    address: '0x44646a5ad31eb79f45C22DbdDeEFfed7BbD2c614',
    // status: 'confirmed',
    device: {},
    info: {
      geora_actor_id: '8b58349d-57de-4406-acc3-bd7c32936a7d'
    }
  },

  {
    name: 'Jamie Cerexhe',
    mobile: '+61430443500',
    address: '0x65bDdE6a9D492dD80864Ca7e0c4d7a210fC33F6a',
    // status: 'confirmed',
    device: {},
    info: {
      geora_actor_id: '8b58349d-57de-4406-acc3-bd7c32936a7d'
    }
  }
]

const registry = {
  'PNG:*': {
    name: 'Pigchain for Puapa New Guini',
    symbol: 'PNG',
    decimals: 16,
    contract: '0x'
  }
}

const assets = [
  {
    account_id: 1,

    uid: 'PNG:1',

    name: 'KNORRIG',
    image: 'http://localhost:3000/0x888/1/1.jpg',
    description:
      'Oink, Oink, KNORRIG Soft toy Pig from Sweden is the Genesis Pig from Sweden',

    type: 'Pig',

    birth_place: 'Sweden',
    birth_date: '2018-12-01 00:00:00.000',

    origin: 'Sweden',
    breed: 'Soft toy',
    // parents: [],

    skin: 'Pink',

    weight: 0.3,
    price: 5,

    diet: ['mashed potato'],
    medications: ['test', 'test2'],
    weights: [
      { time: 1533045600000, value: 6 },
      { time: 1538316000000, value: 12 },
      { time: 1543582800000, value: 19 },
      { time: 1519822800000, value: 31 }
    ],

    prices: [
      { time: 1533045600000, value: 32.5 },
      { time: 1538316000000, value: 42 },
      { time: 1543582800000, value: 55 },
      { time: 1519822800000, value: 80 }
    ]
  },

  {
    account_id: 2,

    uid: 'PNG:2',

    name: 'KELGRIS',
    image: 'http://localhost:3000/0x888/2/1.jpg',
    description:
      'good at hugging, comforting and listening and are fond of play and mischief',

    type: 'Pig',

    birth_place: 'Sweden',
    birth_date: '2018-11-01 00:00:00.000',

    origin: 'country 2',
    skin: 'black',

    weight: 120,
    price: 1000,

    diet: ['potato'],

    weights: [
      { time: 1533045600000, value: 6 },
      { time: 1538316000000, value: 12 },
      { time: 1543582800000, value: 19 },
      { time: 1519822800000, value: 31 }
    ],

    prices: [
      { time: 1533045600000, value: 32.5 },
      { time: 1538316000000, value: 42 },
      { time: 1543582800000, value: 55 },
      { time: 1519822800000, value: 80 }
    ]
  }
]

/*

  Register
  Update(/w incident)

  // 721
  Approval
  ApprovalForAll
  Transfer

*/
var events = [
  {
    id: 1,
    asset_id: 1,
    account_id: 1,
    name: 'Register',
    type: 'blockchain',

    data: {
      image: 'http://localhost:3000/0x888/1/1.jpg',
      locatoin: [58.9546942, 14.8556286],
      weight: 2000,
      birth_date: '2018-11-01 00:00:00.000'
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2018-11-01 00:00:00.000'
  },

  {
    id: 2,
    asset_id: 1,
    account_id: 1,
    type: 'blockchain',
    name: 'Update',
    data: {
      image: 'http://localhost:3000/0x888/1/2.jpg',
      weight: 4500
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2018-12-25 00:00:00.000'
  },

  {
    id: 3,
    asset_id: 2,
    account_id: 2,
    type: 'blockchain',
    name: 'Register',
    data: {
      image: 'http://localhost:3000/0x888/2/1.jpg',
      location: [55.7977312, 11.9881085],
      birth_date: '2018-12-01 00:00:00.000',
      weight: 2000
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2018-12-01 00:00:00.000'
  },

  {
    id: 4,
    asset_id: 2,
    account_id: 2,
    type: 'blockchain',
    name: 'Update',
    data: {
      image: 'http://localhost:3000/0x888/2/2.jpg',
      location: [55.7977312, 11.9881085],
      weight: 3000
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2019-01-01 00:00:00.000'
  },

  {
    id: 5,
    asset_id: 1,
    account_id: 1,
    type: 'blockchain',
    name: 'Transfer',
    data: {
      // blockchain
      from: '0xe208bCa65772f8da0bb7D1D4f671440174506855',
      to: '0x44646a5ad31eb79f45C22DbdDeEFfed7BbD2c614',
      token_id: 1,

      // database
      from_id: 1,
      to_id: 2,

      // merge assets
      location: [55.7977312, 11.9881085],
      price: 126
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2019-01-11 00:00:00.000'
  },

  {
    id: 6,
    asset_id: 2,
    account_id: 2,
    type: 'blockchain',
    name: 'Transfer',
    data: {
      // blockchain
      from: '0x44646a5ad31eb79f45C22DbdDeEFfed7BbD2c614',
      to: '0xe208bCa65772f8da0bb7D1D4f671440174506855',
      token_id: 2,

      // database
      from_id: 2,
      to_id: 1,

      // merge assets
      location: [55.7977312, 11.9881085],
      price: 126
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2019-01-12 00:00:00.000'
  }
]

module.exports = {
  accounts,
  assets,
  events
}
