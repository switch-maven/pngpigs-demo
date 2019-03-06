require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3000
const graphqlHandler = require('./graphql')

const Knex = require('knex')
const knexConfig = require('../knexfile')
const { Model } = require('objection')

const fileType = require('file-type')

const { Asset } = require('./models')

const aws = require('aws-sdk')
const fs = require('fs')

// Initialize knex.
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])
// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex)

app.use(express.static('public'))

// const multer = require('multer')
// const multerS3 = require('multer-s3')

app.use('/graphql', graphqlHandler)
app.use(morgan('dev'))

aws.config.update({
  accessKeyId: 'AKIAICV47PH6NAPWUQUA',
  secretAccessKey: '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',
  region: 'ap-southeast-1'
})

const s3 = new aws.S3()

const bucketName = 'png.switchmaven.com'

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: bucketName,
//     acl: 'public-read',
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname })
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// })

app.get('/accounts', async (req, res) => {
  var { Account } = require('./models')
  var accounts = await Account.query()

  res.send(accounts)
})

// const singleUpload = upload.single('image')

const getFilePath = function ({ asset_id, event_id }) {
  const eventID = event_id || 1

  return `${asset_id}/${eventID}/`
}

const saveTemp = function (req, res, next) {
  const fileName = req.headers['file-name']
  const filePath = getFilePath(req.query || {})
  const tmpPath = `./tmp/${filePath}`

  fs.mkdirSync(tmpPath, { recursive: true })

  const wstream = fs.createWriteStream(tmpPath + fileName)

  return new Promise((resolve, reject) => {
    req.on('data', function (chunk) {
      wstream.write(chunk)
    })

    req.on('end', function (chunk) {
      wstream.on('finish', function () {
        console.log('wstream path', wstream.path)
        resolve({ filePath, tmpName: fileName })
      })

      console.log('file has been written')
      wstream.end()
    })

    wstream.on('error', function (err) {
      console.log(err)
      reject()
    })
  })
}

// NOTE: add :event_id into image path
app.post('/image-upload', function (req, res) {
  console.log('query', req.query)

  return saveTemp(req, res)
    .then(({ filePath, tmpName }) => {
      const tmpPath = `./tmp/${filePath}`
      const file = fs.readFileSync(tmpPath + tmpName)
      const type = fileType(file)

      const base64 = new Buffer(file).toString('base64')
      const base64Data = new Buffer(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      )

      const fileName = `pig-${Date.now()}.${type.ext}`
      const params = {
        Bucket: bucketName,
        Key: filePath + fileName,
        ACL: 'public-read',
        Body: base64Data,
        ContentType: type.mime
      }

      console.log('size', fs.statSync(tmpPath).size)
      console.log('Folder name: ' + filePath)
      console.log('File: ' + fileName)

      s3.putObject(params, function (err, data) {
        if (err) {
          console.log('Error: ', err)
        } else {
          console.log('s3', data)
        }
      })
      const s3URL = `https://s3-ap-southeast-1.amazonaws.com/${bucketName}/${filePath}${fileName}`
      console.log('found at', s3URL)

      Asset.query()
        .update({ image: s3URL })
        .where('id', req.query.asset_id)
        .then(asset => {
          console.log('updated asset image path', asset)

          res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
          res.end()

          fs.unlink(tmpPath + tmpName, (err) => {
            if (err) { console.log(err) }
            console.log('deleted file:', tmpPath + tmpName)
          })
        })
    })
    .catch(console.error)
})

app.get('/', (req, res) => {
  res.send('Oink, Oink... ')
})

app.listen(PORT, () => {
  console.log('listening at port:', PORT)
})
