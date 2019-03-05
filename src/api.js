// const { accounts, assets, events } = require('../db/seed-data')

const { Account, Asset } = require('./models')

const HDKey = require('ethereumjs-wallet/hdkey')

const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

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
  async account ({ id, device_id }) {
    const scope = Account.query().eager({ assets: true })
    let result

    if (device_id) {
      result = (await scope.whereRaw('device->>? = ?', ['uid', device_id]))[0]
    } else if (id.toString().includes('0x')) {
      result = (await scope.where({ address: id }))[0]
    } else {
      result = await scope.findById(id)
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
    let symbol
    const scope = Asset.query().eager({ events: true })
    if (id.includes(':')) {
      [symbol, id] = id.split(':')
    }

    return scope.findById(id).then(a => {
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
    var mobileNumber = n => phoneUtil.format(phoneUtil.parse(n), PNF.E164)

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

        const updateAccount = a => {
          const address = API.wallet(a.id).getChecksumAddressString()

          account.address = address
          account.id = a.id

          return Account.query()
            .update({ address: address })
            .where('id', a.id)
            .then(() => {
              resolve(account)
            })
        }

        account.address = account.address || '0x0'
        account.code = Math.floor(Math.random() * 900000) + 100000
        // account.status = 'new'

        if (existing) {
          console.log(
            'Update existing account to current device',
            existing,
            device
          )
          updateAccount(existing)
        } else {
          console.log('Create new account and bind to device', existing, device)
          Account.query()
            .insert(account)
            .then(updateAccount)
        }

        // accounts.push(account)
      } else {
        // existing account
        console.log('existing account looks ok')
        resolve(existing)
      }
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

  // Livestock
  register (address, registration) {},

  update (address, assetId, updatable) {
    // authorize user
    // find asset by assetId
    // handle image processing if applicable
    // persist to db
    // handle errors
  },

  transfer (address) {},

  confirmTransfer () {},

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
