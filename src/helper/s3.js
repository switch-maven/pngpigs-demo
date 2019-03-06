const bucketName = 'png.switchmaven.com'

const AssetHost =
  process.env.ASSET_HOST || 'https://s3-ap-southeast-1.amazonaws.com'
const AssetAddr = '0x888'
const AssetPath = process.env.ASSET_PATH || `${bucketName}/${AssetAddr}`

const imagePath = function (args) {
  const { asset_id, event_id, file_ext } = args || {}

  const eventId = event_id || 1
  const fileExt = file_ext || 'jpg'

  return `${asset_id}/${eventId}.${fileExt}`
}

const imageUrl = function (args) {
  return `${AssetHost}/${AssetPath}/${imagePath(args)}`
}

module.exports = {
  bucketName,
  imagePath,
  imageUrl,
  AssetPath,
  AssetAddr
}
