const { accounts, assets } = require('../../tmp/fake-data')
const { getAsset } = require('./query')

function createAccount ({ name, mobile, address }) {
  let account = accounts.find(
    acc => acc.name === name && acc.mobile === mobile
  )

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

function updateLivestock ({ accountID, updates }) {
  const account = accounts.find(acc => acc.id === accountID)
  if (!account.asset_ids.includes(updates.id)) {
    throw new Error(
      'Unmatched asset id:',
      updates.id,
      'in account id:',
      account.id
    )
  }

  const asset = getAsset(updates)

  updates.weight || (asset.weight = updates.weight)
  ;['diet', 'vaccination'].forEach(field => {
    const value = updates[field]
    if (!value) {
      return
    }

    asset[field] || (asset[field] = [])
    asset[field].includes(value) || asset[field].push(value)
  })

  asset.weight = updates.weight

  return asset
}

module.exports = {
  createAccount,
  registerLivestock,
  updateLivestock
}
