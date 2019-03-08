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
      geora_actor_id: 'ff9ae4a2-eea3-47ab-a10c-5b54e07b7653'
    }
  },

  {
    name: 'Jamie Cerexhe',
    mobile: '+61430443500',
    address: '0x65bDdE6a9D492dD80864Ca7e0c4d7a210fC33F6a',
    // status: 'confirmed',
    device: {"uid":"de2747598655ae3e","model":"SM-G950F","locale":"en_AU","system_name":"Android","system_version":"8.0.0"},
    confirmed_at: new Date(),
    info: {
      geora_actor_id: '8523dc8e-bd0a-45a9-bc1e-8ddab66c1222'
    }
  }
]

const registry = {
  'PNG*': {
    name: 'Pigchain for Papua New Guinea',
    symbol: 'PNG',
    decimals: 16,
    contract: '0x'
  }
}

const assets = [
  {
    account_id: 1,

    uid: 'DEMO:1',

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

    uid: 'DEMO:2',

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
  },
  {
    account_id: 3,

    uid: 'DEMO:3',

    name: 'Pig3',
    image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/1.jpg',
    description:
      '',

    type: 'Pig',

    birth_place: 'Jiwaka-Jimi',
    birth_date: '2018-10-01 00:00:00.000',

    origin: 'Indigenous',
    skin: 'Black',

    weight: 700,
    price: 0,

    diet: ['Potato'],

    weights: [
      { time: 1533045600000, value: 7 },
      { time: 1538316000000, value: 12 },
      { time: 1543582800000, value: 19 },
      { time: 1553822800000, value: 31 }
    ],

    prices: [
      { time: 1533045600000, value: 32.5 },
      { time: 1538316000000, value: 42 },
      { time: 1543582800000, value: 55 },
      { time: 1553822800000, value: 80 }
    ]
  },
  {
    account_id: 3,

    uid: 'DEMO:4',

    name: 'Pig4',
    image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/2.jpg',
    description:
      '',

    type: 'Pig',

    birth_place: 'Jiwaka-Jimi',
    birth_date: '2018-10-01 00:00:00.000',

    origin: 'Indigenous',
    skin: 'Black',

    weight: 550,
    price: 0,

    diet: ['Potato'],

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
    account_id: 3,

    uid: 'DEMO:5',

    name: 'Pig5',
    image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/3.jpg',
    description:
      '',

    type: 'Pig',

    birth_place: 'Jiwaka-Jimi',
    birth_date: '2018-11-01 00:00:00.000',

    origin: 'Indigenous',
    skin: 'Black',

    weight: 900,
    price: 0,

    diet: ['Potato'],

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
    account_id: 3,

    uid: 'DEMO:6',

    name: 'Pig6',
    image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/4.jpg',
    description:
      '',

    type: 'Pig',

    birth_place: 'Jiwaka-Jimi',
    birth_date: '2018-12-01 00:00:00.000',

    origin: 'Indigenous',
    skin: 'Black',

    weight: 600,
    price: 0,

    diet: ['Raw Sweet Potato'],

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
    account_id: 3,

    uid: 'DEMO:7',

    name: 'Pig7',
    image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/3.jpg',
    description:
      '',

    type: 'Pig',

    birth_place: 'Jiwaka-Jimi',
    birth_date: '2018-11-01 00:00:00.000',

    origin: 'Indigenous',
    skin: 'Black',

    weight: 700,
    price: 0,

    diet: ['Potato'],

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
    asset_id: 3,
    account_id: 3,
    name: 'Register',
    type: 'blockchain',

    data: {
      image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/1.jpg',
      location: [58.9546942, 14.8556286],
      weight: 500,
      birth_date: '2018-11-01 00:00:00.000'
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2018-11-01 00:00:00.000'
  },

  {
    asset_id: 3,
    account_id: 3,
    type: 'blockchain',
    name: 'Update',
    data: {
      image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/2.jpg',
      weight: 900
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2018-12-25 00:00:00.000'
  },

  {
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
    asset_id: 3,
    account_id: 3,
    type: 'blockchain',
    name: 'Update',
    data: {
      image: 'https://s3-ap-southeast-1.amazonaws.com/png.switchmaven.com/0x888/demo/3.jpg',
      location: [55.7977312, 11.9881085],
      weight: 1300
    },
    txid: undefined,
    signiture: undefined,
    created_at: '2019-01-01 00:00:00.000'
  },

  {
    asset_id: 1,
    account_id: 1,
    type: 'blockchain',
    name: 'Transfer',
    data: {
      // blockchain
      from: '0xe208bCa65772f8da0bb7D1D4f671440174506855',
      to: '0x44646a5ad31eb79f45C22DbdDeEFfed7BbD2c614',
      token_id: 2, // "PNG:1"

      // database
      from_id: 1,
      to_id: 2,
      price: 126,

      // geora
      geora_from_id: 1,
      geora_to_id: 2,
      geora_asset_id: 1,
      geora_asset_address: "0xbA20D335E5F93C4536c923268B6BE1A0237B9e03",

    },
    txid: undefined,
    signiture: undefined,
    created_at: '2019-01-11 00:00:00.000'
  },

  {
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
      price: 126,

      // geora
      geora_from_id: 1,
      geora_to_id: 2,
      geora_asset_id: 1,
      geora_asset_address: "0xbA20D335E5F93C4536c923268B6BE1A0237B9e03",

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
