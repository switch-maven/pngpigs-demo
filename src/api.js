// const { accounts, assets, events } = require('../db/seed-data')

const { Account, Asset, Event } = require('./models')

const HDKey = require('ethereumjs-wallet/hdkey')

const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

const { imageUrl } = require('./helper/s3')
const Geora = require('./geora')

const API = {
  // Extended bip32 keys xpub/xprv
  bip32:
    'xpub661MyMwAqRbcF6fv4aocvHMpGQW9MeyhFfxGyeASvStzBe5Wb7WxS1cE2PmxpcEh8kn2qEJJr2Dgvqevze7bSyfCExrv7jFcyBqoWkwYU3c',

  /* Read / Query */
  accounts () {
    return Account.query()
  },

  //
  // Account id or address 0x0000
  // Account(id: "")
  async account ({ id, device_id, address }) {
    const scope = Account.query().eager({ assets: true })
    let result

    if (device_id) {
      result = (await scope.whereRaw('device->>? = ?', ['uid', device_id]))[0]
    } else if (address && address.includes('0x')) {
      result = (await scope.where({ address: address }))[0]
    } else {
      result = await scope.findById(+id)
    }

    return result
  },

  assets () {
    console.log('API > Assets', arguments)

    return Asset.query()
  },

  // Asset Id = Symbol:token_id
  // PNG:1
  // CK:1
  // LAND:123456
  asset ({ id }) {
    let scope = Asset.query().eager({ events: true, owner: true })

    if (id.includes(':')) {
      scope = scope.where({ uid: id }).first()
    } else {
      scope = scope.where({ id: id }).first()
    }

    return scope.then(a => {
      a.events || (a.events = [])
      a.events.forEach((e, i) => {
        e.data = JSON.stringify(e.data)
      })
      return a
    })
  },

  /* Mutate/transactional */

  /*
    name: string
    mobile: normalised phone number with country code
    device: {uid, notification_id, }
    createAccount('taylorluk', '+61415882430', {})

    @return Account
  */
  async createAccount ({ name, mobile, device }) {
    const mobileNumber = n => phoneUtil.format(phoneUtil.parse(n), PNF.E164)

    // parse
    mobile = mobileNumber(mobile)

    const existing = (await Account.query().where('mobile', mobile))[0]

    const mismatch =
      existing && existing.device && device.uid !== existing.device.uid

    console.log(
      'createAccount',
      mobile,
      existing && existing.device && existing.device.uid,
      device.uid
    )

    return new Promise((resolve, reject) => {
      if (!existing || mismatch) {
        const account = { name, mobile }
        // account.id = accounts.length + 1
        // account.address = this.wallet(account.id).getChecksumAddressString()

        const createGeora = (account) => {
          return Geora.createAccount(account).then(actor => {
            console.log("Geora: create account")
            account.address = actor.address
            account.info = {
              'geora_actor_id': actor.id,
              'geora_actor_address': actor.address
            }
            console.dir(account)

            return account
          })
        }

        const updateAccount = a => {
          const address = API.wallet(a.id).getChecksumAddressString()

          Object.assign(account, a)

          account.code = Math.floor(Math.random() * 900000) + 100000
          account.address = account.address || address

          return Account.query()
            .update(account)
            .where('id', a.id)
            .then(() => {
              resolve(account)
            })
        }

        // if no address, set default
        account.address = account.address || '0x0'
        // account.status = 'new'

        if (existing) {
          console.log(
            'Update existing account to current device',
            existing,
            account,
            device
          )
          // is existing === account
          updateAccount(existing)
        } else {
          console.log('Create new account and bind to device', existing, device)
          Account.query()
            .insert(account)
            .then(createGeora)
            .then(updateAccount)
        }
      } else {
        // existing account
        console.log('existing account looks ok')
        resolve(existing)
      }
    }).then(account => {
      // on production, if account has code, send code to mobile
      if (process.env.NODE_ENV === 'production' && account.code) {
        // send sms
        Account.sendVerification(account.mobile, account.code)
          .then(res => console.log('plivo res', res))
          .catch(err => console.log('plivo err', err))
      }
      return account
    })
  },

  /*
    code: string
  */
  async verifyAccount ({ id, code, device }) {
    const account = await this.account({ id: id })

    return new Promise((resolve, reject) => {
      if (account.code === code) {
        // Update confirmed at, mark code as null
        Object.assign(account, {
          code: null,
          confirmed_at: new Date(),
          device: device
        })

        const updateConfirmed = Account.query()
          .update(account)
          .where('id', account.id)

        updateConfirmed.then(() => resolve(account))
      } else {
        reject({ reason: 'Invalid verification code' })
      }
    })
  },

  // Livestock related


/*

  core liveasset attributes

  liveasset.attributes = {
    uid:
    weight:
    skin:
    breed:
  }

  registration = {

  }
}
*/

  async register ({ account_id, asset }) {
    const account = await this.account({ id: account_id })
    if (!account) {
      return
    }

    const existing = (await Asset.query().where('uid', asset.uid))[0]


    return new Promise(async (resolve, reject) => {
      if (!existing) {
        asset.account_id = account.id

        console.log('Create new asset')

        if (asset.weight) {
          asset.weights || (asset.weights = [])
          asset.weights.push({
            time: Date.now(),
            value: asset.weight
          })
        }


        asset = await Asset.query().insert(asset)
        const image_url = imageUrl({ asset_id: asset.id })

        asset.image = image_url
        asset = (await Asset.query().update(asset).where({ id: asset.id }).returning('*'))[0]

        // Geora
        Geora.register({
          account_id: account.info['geora_actor_id'],
          asset: asset
        }).then(async (res) => {
          if (res.data.createAsset) {
            console.log(res)
            let { version, systemNonce, address } = res.data.createAsset
            asset.info['geora_asset_id'] = version
            asset.info['geora_asset_version'] = systemNonce
            asset.info['geora_asset_address'] = address

            await Asset.query().update(asset).where({ id: asset.id })
          }
        })

        const event = {
          name: 'Register',
          asset_id: asset.id,
          account_id: asset.account_id,
          data: {
            image: image_url,
            ...asset
          },
          created_at: new Date()
        }

        Event.query()
          .insert(event)
          .then(e => {
            asset.events || (asset.events = [])
            asset.events.push(e)
            resolve(asset)
          })
      } else {
        // existing asset
        console.log('existing asset')
        reject(new Error('existing asset'))
      }
    })
  },

  async update ({ account_id, asset_id, data }) {
    // authorize user
    const account = await this.account({ id: account_id })

    // find asset by assetId
    let asset = await Asset.query().findById(asset_id)

    const incident = data.incident
    delete data.incident

    Object.assign(asset, data)

    if (incident) {
      data.incident = incident
    }

    if (asset.weight) {
      asset.weights || (asset.weights = [])
      asset.weights.push({
        time: Date.now(),
        value: asset.weight
      })
    }

    // Geora
    Geora.update({
      account_id: account.info['geora_actor_id'],
      asset_id: asset.info['geora_asset_id'],
      asset: asset
    }).then(async (result) => {
      console.log(result)

      if (result) {
        console.log(result)
      }
    })


    asset = (await Asset.query()
      .update(asset)
      .where({ id: asset_id })
      .returning('*'))[0]

    let event = {
      name: 'Update',
      asset_id: asset.id,
      account_id: asset.account_id,
      data,
      created_at: new Date()
    }

    event = await Event.query().insert(event)

    const image_url = imageUrl({ asset_id: asset.id, event_id: event.id })
    asset.image = image_url
    asset = (await Asset.query()
      .update(asset)
      .where({ id: asset.id })
      .returning('*'))[0]

    event.data.image = image_url

    return Event.query()
      .update(event)
      .where({ id: event.id })
      .returning('*')
      .then(events => {
        asset.events || (asset.events = [])
        asset.events.push(events[0])

        return asset
      })

    // handle image processing if applicable
    // persist to db
    // handle errors
  },

  /*
    Asset id: PNG:1, 1
    from: from Address
    to: to addrss
  */
  async transfer ({ account_id, asset_id, address, price}) {
    const id = asset_id
    const asset = await this.asset({ id })
    const account = await this.account({ id: account_id })
    const to_account = await this.account({ address: address })

    if (!to_account)
      throw new Error("Transfer to account not found")

    if (!asset)
      throw new Error("Livestock Asset not found")

    if (asset.account_id != account_id )
      throw new Error("Livestock Asset owner mismatch")

    let geora_transfer = {
      asset_id: asset.info['geora_asset_id'],
      from_id: account.info['geora_actor_id'],
      to_id: to_account.info['geora_actor_id'],
      price
    }

    let event = {
      name: 'Transfer',
      asset_id: asset_id,
      account_id: account_id,
      data: {
        // Blockchain
        from: account.address,
        to: to_account.address,
        token_id: +asset_id,

        // db
        from_id: +account_id,
        to_id: +to_account.id,
        price,

        // geora
        geora_from_id: geora_transfer.from_id,
        geora_to_id: geora_transfer.to_id,
        geora_asset_id: geora_transfer.asset_id
      },
      created_at: new Date()
    }

    // tx crticial
    asset.account_id = to_account.id

    await Event.query().insert(event).then((e) => {
      event.id = e.id
    })

    if (price) {
      asset.prices || (asset.prices = [])
      asset.prices.push({
        time: Date.now(),
        value: price
      })
    }

    return Asset.query().update(asset).where({id}).returning('*').first().then((asset) => {

      Geora.transfer(geora_transfer).then((res) => {
        if (res.data.approveSwap) {
          Object.assign(asset.info, {
            geora_swap_address: res.data.approveSwap.swapAddress
          })

          Asset.query().update(asset).where({id}).returning('*').first().then((asset) => {
            console.log("TX: Successful", asset.info)
          })
        }
      })

      asset.events || (asset.events = [])
      event.data = JSON.stringify(event.data)
      asset.events.push(event)

      return asset
    })
  },

  async acceptTransfer ({ account_id, asset_id }) {
    const id = asset_id
    const asset = await this.asset({ id })
    const account = await this.account({ id: account_id })

    // geora
    let swap_address = asset.info['geora_swap_address']

    if (!swap_address)
      throw new Error('Transfer has been already accepted')

    let event = {
      name: 'Accept',
      asset_id: asset_id,
      account_id: account_id,
      data: {
        token_id: +asset_id,

        // geora
        geora_swap_address: swap_address
      },
      created_at: new Date()
    }

    await Event.query().insert(event).then((e) => {
      event.id = e.id
    })

    return new Promise((resolve, reject) => {
      Geora.acceptTransfer({ account_id, swap_address }).then((res) => {
        delete asset.info.geora_swap_address

        Asset.query().update(asset).where({id}).then((a) => {
          asset.events || (asset.events = [])
          event.data = JSON.stringify(event.data)
          asset.events.push(event)

          console.log(asset)
          resolve(asset)
        })
      })
    })
  },

  // utils
  wallet (index = 0) {
    if (!this._keychain) {
      this._keychain = HDKey.fromExtendedKey(this.bip32)
    }
    return this._keychain.deriveChild(index).getWallet()
  }
}

// let a = API.createAccount({ name: 'taylor luk', mobile: '+61415882430', device: { uid: "device uuid", model: "iMac", name: "iMac 27"}})
// const b = API.createAccount({
//   name: 'Mark guo',
//   mobile: '+61422416086',
//   device: {
//     uid: '8196A14F-6FDF-4929-B845-A8DE56801860',
//     model: 'iPhone',
//     locale: 'en_US',
//     system_name: 'iOS',
//     system_version: '12.1'
//   }
// })
// console.log(b)
// let c = API.createAccount({ name: 'Jamie', mobile: '+61430443500', device: { uid: "device uuid", model: "iMac", name: "iMac 27"}})
// //
// let d = API.createAccount({ name: 'Ramen', mobile: '+61402540888', device: { uid: "device uuid", model: "Surface", name: "win 10"}})
//
// console.log([a, b, c, d])

module.exports = API
