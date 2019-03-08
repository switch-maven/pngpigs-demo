

const AssetAttribute = require('./attributes')

const Geora = {
  //
  // get account_id () {
  //   return this._account_id
  // }
  // set account_id (id) {
  //   return this._account_id = id
  // }

  api: "http://178.128.82.131:3000/graphql",

  /* Read / Query */

  // Ethereum name or address 0x0000
  account(id) {
    let query = `
    query ($id: String!) {
      actor(id:$id) {
        id, name, address
      }
    }
    `
    return this.query(query, { id })
  },

  // Asset Id = Symbol:token_id
  // PNG:1
  // CK:1
  // LAND:123456
  asset(id) {
    let query = `

    `

  },

  /* Mutate/transactional */


  /*
    async createAccount ({ name, mobile, device }) {

    @return Account
  */
  createAccount({ name }) {
    let query = `
      mutation ($name:String!) {
        createActor(name: $name) {
        	id,
          name,
          currencyBalances{symbol, balance},
          history {type,timestamp},
          subaddresses {address, assetClass}
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.query(query, { name: name })
        .then((res) => {
          let account = res.data.createActor
          console.log(res)
          // set account id to upate request header
          this.account_id = account.id

          this.account(account.id).then((res) => {
            account.address = res.data.actor.address
            resolve(account)
          }).catch(e => reject(e))

          console.dir(res)
        })
        .catch((e) => {
          reject(e)
          console.error(e)
        })
    })
  },

  confirmAccount() {},

  // Livestock
  //   async register ({ account_id, asset }) {
  // account_id: goera_id
  register({ account_id, asset }) {
    if (account_id)
      this.account_id = account_id

    let query = `
      mutation ($input: PrivateAssetInput!) {
      	createAsset (input: $input) {
        	version, class, systemNonce, claims { address, label, value }, pastEvents {type, timestamp }, address
      	}
      }
    `
    let registration = {
      "class": "PIG",
      "claims": [
        {
          "label": "Registration",
          "value": Object.keys(asset).length,
          "evidence": {
            "label": "attributes",
            "data": JSON.stringify(asset),
            "private": false
          }
        },
        { "label": "weight", "value": asset.weight },
        { "label": "birth_date", "value": parseInt(Date.parse(asset.birth_date) / 1000) }
      ]
    }
    return this.query(query, { input: registration })
  },

  // asset_id
  //
  update({ account_id, asset_id, asset }) {
    if (account_id)
      this.account_id = account_id

    let query = `
      mutation ($weight: PrivateClaimInput!, $update: PrivateClaimInput!) {
        updateWeight: createClaim(input: $weight) {
          address, label, value, asset
        }

        updateAttribute: createClaim(input: $update) {
          address, label, value, asset
        }
      }
    `
    let weight = {
      "label": "weight", "value": asset.weight,
      "assetClass": "PIG",
      "assetVersion": asset_id,
      "evidence": []
    }

    let update = {
      "label": "Update",
      "value": Object.keys(asset).length,
      "assetClass": "PIG",
      "assetVersion": asset_id,
      "evidence": [{
        "label": "attributes",
        "data": JSON.stringify(asset),
        "private": false
      }]
    }

    return this.query(query, { weight, update }).then((res) => {
      console.dir(res)

      return res.data.updateAttribute
    })
  },

  // $from_id: geora actor id of seller
  // $to_id: geora actor id of buyer
  // {
  //   "data": {
  //     "createAtomicSwap": {
  //       "swapAddress": "0xFD5A37c5DB50Ef2ae1e7e0Fe1588C2ca0c7eE830",
  //       "buyer": {
  //         "address": "0x9C505ea8B5Df6c0399a150d9A61957e41fD7F999"
  //       },
  //       "seller": {
  //         "name": "Joe Farmer",
  //         "address": "0x39Fff7e241cc778Ea80dbf0a431c4C49990e6c08"
  //       },
  //       "buyerApproved": false,
  //       "sellerApproved": false
  //     }
  //   }
  // }
  transfer({ asset_id, from_id, to_id, price, currency }) {
    this.account_id = from_id

    let query = `
      mutation ($from_id: ActorRef!, $to_id: ActorRef!, $asset_id: Int!) {
        transfer: createAtomicSwap (
          input: {
            seller: $from_id
            buyer: $to_id
            assets: [{ class: "PIG", version: $asset_id }]
            tokens: []
            tokenAmounts: []
          }
      ) {
      	buyer {
          ... on KnownActor { name, address }
          ... on UnknownActor { address}
        }
      	seller {
      		... on KnownActor { name, address }
      		... on UnknownActor { address }
        }
        swapAddress, buyerApproved, sellerApproved
      	}
      }
    `

    let approveQuery = `
      mutation ($swapAddress: Address!) {
        approveSwap(swapAddress: $swapAddress ) {
          swapAddress, buyerApproved, sellerApproved
        }
      }
    `
    return new Promise((resolve, reject) => {
      this.query(query, { from_id, to_id, asset_id }).then((res) => {
        console.log("transfer(swap)", res)

        if (res.data.transfer) {
          let { swapAddress } = res.data.transfer

          this.query(approveQuery, { swapAddress }).then((res) => {
            console.log("transfer(approve", res)
            resolve(res)
          })
        }
      })
    })
  },

  confirmTransfer({ asset_address, from_id, to_id, price, currency }) {
    let query = `
      mutation (){
        mutation ($swapAddress: Address!) {
          approveSwap(swapAddress: $swapAddress ) {
            swapAddress, buyerApproved, sellerApproved
          }
        }
      }
    `

    this.query(query, { swapAddress: asset_address })
  },

  // Post QraphQL query
  query(query, variables = undefined, params = undefined, headers = undefined) {
    const request = require('request-promise-native')

    var body = { query }
    if (variables) {
      body.variables = variables
    }

    var headers = { "geora-key": "demosecretkey" }

    if (this.account_id) {
      headers['geora-actor'] = this.account_id
    }

    let options = {
      method: "POST",
      url: this.api,
      json: true,
      headers: headers,
      body: body
    }
    return request(options)
  }
}

module.exports = Geora
//
// ;(async () => {
//
//   // console.log(AssetAttribute)
//   // Geora.createAccount({ name: "Taylor luk" }).then(console.dir)
// })()
