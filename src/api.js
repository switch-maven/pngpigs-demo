const { accounts, assets, events } = require('../db/seed-data')

const { Account, Asset, Event } = require('./models')

const HDKey = require('ethereumjs-wallet/hdkey')

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const API = {

  // Extended bip32 keys xpub/xprv
  bip32: "xpub661MyMwAqRbcF6fv4aocvHMpGQW9MeyhFfxGyeASvStzBe5Wb7WxS1cE2PmxpcEh8kn2qEJJr2Dgvqevze7bSyfCExrv7jFcyBqoWkwYU3c",

  /* Read / Query */
  accounts() {
    return Account.query()
  },

  //
  // Account id or address 0x0000
  // Account(id: "")
  async account({ id }) {
    let scope = Account.query().eager({ assets: true })
    let result;

    if (id.toString().includes('0x')) {
      result = (await scope.where({ address: id }))[0]
    } else {
      result = await scope.findById(id)
    }

    return result
  },

  assets() {
    console.log("API > Assets", arguments)

    return Asset.query()
  },

  // Asset Id = Symbol:token_id
  // PNG:1
  // CK:1
  // LAND:123456
  asset({ id }) {
    let symbol;
    let scope = Asset.query().eager({events: true});
    if (id.includes(':')) {
      ;[symbol, id] = id.split(':')
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
  async createAccount({ name, mobile, device }) {
    console.log('createAccount', name, mobile, device)
    var mobileNumber = (n) => phoneUtil.format(phoneUtil.parse(n), PNF.E164)

    // parse
    mobile = mobileNumber(mobile)

    let account = (await Account.query().where('mobile', mobile))[0]

    if (!account) {
      account = { name, mobile, device }
      // account.id = accounts.length + 1
      // account.address = this.wallet(account.id).getChecksumAddressString()
      account.address = "0x0"
      account.code = Math.floor(Math.random()*900000) + 100000
      // account.status = 'new'

      return Account.query().insert(account).then(a => {
        return Account.query().update({
          address: API.wallet(a.id).getChecksumAddressString()
        }).where('id', a.id)
      })
      // accounts.push(account)
    }

    return Promise.resolve(account)
  },

  /*
    code: string
  */
  confirmAccount(address, code) {
    let account = accounts.find(a => a.address === address)

    if (account.code == code) {
      account.status = 'confirmed'
      account.confirmed_at = Time.now()
      return Promise.resolve(account)
    } else {
      return Project.reject({ reason: "Invalid verification code"})
    }
  },

  // Livestock
  register(address, registration) {},

  update(address, assetId, updatable) {
    // authorize user
    // find asset by assetId
    // handle image processing if applicable
    // persist to db
    // handle errors
  },

  transfer(address) {},

  confirmTransfer() {},

  // utils
  wallet(index = 0) {
    if (!this._keychain) {
      this._keychain = HDKey.fromExtendedKey(this.bip32)
    }
    return this._keychain.deriveChild(index).getWallet()
  }
}

// let a = API.createAccount('taylor luk', '+61415882430', { uid: "device uuid", model: "iMac", name: "iMac 27"})
// let b = API.createAccount('Mark Guo', '+61422416086‬', { uid: "device uuid", model: "iMac", name: "iMac 27"})
// let c = API.createAccount('Jamie', '+61430443500', { uid: "device uuid", model: "iMac", name: "iMac 27"})
//
// let d = API.createAccount('Ramen', '+61430443501', { uid: "device uuid", model: "Surface", name: "win 10"})
//
// console.log([a, b, c, d])

module.exports = API
