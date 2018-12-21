const { accounts, assets } = require('../../tmp/fake-data')

function getAssets (account) {
  return account.asset_ids.map(id => {
    return assets.find(asset => asset.id === id)
  })
}

function getAsset ({ id }) {
  return assets.find(asset => asset.id === id)
}

function getAccounts () {
  const result = accounts.slice()
  result.forEach(acc => {
    acc.assets = getAssets(acc)
  })
  return result
}

function getAccount ({ id }) {
  const account = accounts.find(acc => acc.id === id)

  account.assets = getAssets(account)

  return account
}

module.exports = {
  getAssets,
  getAsset,
  getAccounts,
  getAccount
}
