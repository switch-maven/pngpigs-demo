const { accounts, assets } = require('../tmp/fake-data')

const HDKey = require('ethereumjs-wallet/hdkey')

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const API = {

  // Extended bip32 keys xpub/xprv
  bip32: "xpub661MyMwAqRbcF6fv4aocvHMpGQW9MeyhFfxGyeASvStzBe5Wb7WxS1cE2PmxpcEh8kn2qEJJr2Dgvqevze7bSyfCExrv7jFcyBqoWkwYU3c",

  /* Read / Query */

  accounts() {
    return accounts
  },

  // Account id or address 0x0000
  account({ id }) {
    return accounts.find(a => a.id == id || a.address == id)
  },

  assets() {
    return assets
  },

  // Asset Id = Symbol:token_id
  // PNG:1
  // CK:1
  // LAND:123456
  asset({ id }) {
    let symbol;

    if (id.includes(':')) {
      ;[symbol, id] = id.split(':')
    }
    let asset = assets.find(a => a.id = id)

    if (asset) {
      return Promise.resolve(asset)
    } else {
      return Promise.reject({ reason: `Can not find asset by ${id}`})
    }
  },

  /* Mutate/transactional */


  /*
    name: string
    mobile: normalised phone number with country code
    device: {uid, notification_id, }
    createAccount('taylorluk', '+61415882430', {})

    @return Account
  */
  createAccount(name, mobile, device) {
    var mobileNumber = (n) => phoneUtil.format(phoneUtil.parse(n), PNF.E164)

    // parse
    mobile = mobileNumber(mobile)
    let account = accounts.find(a => mobileNumber(a.mobile) == mobile)

    if (!account) {
      account = { name, mobile }
      account.id = accounts.length + 1
      account.address = this.wallet(account.id).getChecksumAddressString()
      account.code = Math.floor(Math.random()*900000) + 100000
      account.status = 'new'

      accounts.push(account)
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

  update(address, assetId, updatable) {},

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
