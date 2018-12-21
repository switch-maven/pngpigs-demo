const { accounts, assets } = require('../tmp/fake-data')

/**
 * Query Resolvers
 */
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
  console.log('getAccount')
  const account = accounts.find(acc => acc.id === id)

  account.assets = getAssets(account)

  return account
}

/**
 * Mutation Resolvers
 */
function createAccount ({ name, mobile, address }) {
  let account = accounts.find(acc => acc.name === name && acc.mobile === mobile)

  if (!account) {
    account = { name, mobile, address }
    account.id = `acc-${accounts.length + 1}`
    accounts.push(account)
  }

  return account
}

function registerLivestock ({ accountID, asset }) {
  const account = accounts.find(acc => acc.id === accountID)

  if (!account) {
    throw new Error('Missing account id:', accountID)
  }

  const newSkin = asset.skin
  delete asset.skin

  const newAsset = {
    id: `asset-${account.asset_ids.length + 1}`,
    ...asset
  }

  newAsset.skin = [newSkin]

  account.asset_ids.push(newAsset.id)
  assets.push(newAsset)

  return newAsset
}

const resolver = {
  accounts: getAccounts,
  account: getAccount,
  asset: getAsset,
  createAccount,
  registerLivestock
}

module.exports = resolver
