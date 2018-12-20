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

function createAsset ({ accountID, asset }) {
  console.log('>>', accountID)
  const account = accounts.find(acc => acc.id === accountID)

  if (!account) {
    throw new Error('Missing account id:', accountID)
  }

  const newAsset = {
    id: (account.asset_ids.length + 1),
    ...asset
  }

  return newAsset
}

const resolver = {
  accounts: getAccounts,
  account: getAccount,
  asset: getAsset,
  createAccount,
  createAsset
}

module.exports = resolver
