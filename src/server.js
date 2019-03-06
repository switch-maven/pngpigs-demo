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

const aws = require('aws-sdk')
const fs = require('fs')

const { imagePath, imageUrl, bucketName, AssetPath, AssetAddr } = require('./helper/s3')

// Initialize knex.
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])
// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex)

app.use(express.static('public'))

app.use('/graphql', graphqlHandler)
app.use(morgan('dev'))

aws.config.update({
  accessKeyId: 'AKIAICV47PH6NAPWUQUA',
  secretAccessKey: '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',
  region: 'ap-southeast-1'
})

const s3 = new aws.S3()

app.get('/accounts', async (req, res) => {
  var { Account } = require('./models')
  var accounts = await Account.query()

  res.send(accounts)
})

const saveTemp = function (req, res, next) {
  const tmpFilename = `${AssetPath}/${imagePath(req.query)}`.replace(/\//g, '-')
  const tmpFilePath = `./tmp/${tmpFilename}`
  const wstream = fs.createWriteStream(tmpFilePath)

  return new Promise((resolve, reject) => {
    req.on('data', function (chunk) {
      wstream.write(chunk)
    })

    req.on('end', function (chunk) {
      wstream.on('finish', function () {
        console.log('wstream path', wstream.path)
        resolve({ tmpFilePath })
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

// TODO: add :event_id into image path
app.post('/image-upload', function (req, res) {
  console.log('query', req.query)

  return saveTemp(req, res)
    .then(({ tmpFilePath }) => {
      const file = fs.readFileSync(tmpFilePath)
      const type = fileType(file)

      const base64 = new Buffer(file).toString('base64')
      const base64Data = new Buffer(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      )

      const params = {
        Bucket: bucketName,
        Key: `${AssetAddr}/${imagePath(req.query)}`,
        ACL: 'public-read',
        Body: base64Data,
        ContentType: type.mime
      }

      s3.putObject(params, function (err, data) {
        if (err) {
          console.log('Error: ', err)
        } else {
          console.log('s3', data)
          console.log('s3 url:', imageUrl(req.query))

          res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
          res.end()

          fs.unlink(tmpFilePath, err => {
            if (err) {
              console.log(err)
            }
            console.log('deleted file:', tmpFilePath)
          })
        }
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
