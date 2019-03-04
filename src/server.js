require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3000
const graphqlHandler = require('./graphql')


const Knex = require('knex');
const knexConfig = require('../knexfile');
const { Model } = require('objection');

// Initialize knex.
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);
// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

app.use(express.static('public'))

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const fs = require('fs');

app.use('/graphql', graphqlHandler)
app.use(morgan('dev'))

aws.config.update({
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    region: 'ap-southeast-1' // region of your bucket
});

const s3 = new aws.S3();

// keep
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'png.switchmaven.com',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

<<<<<<< HEAD
app.get('/accounts', async (req, res) => {
  var { Account } = require('./models')
  var accounts = await Account.query()

  res.send(accounts)
=======
const singleUpload = upload.single('image')

const saveTemp = function(req, res, next) {
  var fileName = req.headers["file-name"];

  var wstream = fs.createWriteStream("./src/tmp/images/" + fileName);

  req.on('data', function(chunk) {
    wstream.write(chunk);
  });
  req.on('end', function(chunk) {
    wstream.on('finish', function () {
      console.log('file has been written');
    });
    wstream.end();
    console.log('wstream path', wstream.path)
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
    res.end();
  });
  wstream.on('error', function (err) {
    console.log(err);
  });
  return wstream.path;
}

app.post('/image-upload', function(req, res) {
  let filePath = saveTemp(req, res)
  console.log('filePath', filePath)

  const folder = ("images/");
  const file = (`pig-${new Date()}.jpg`);
  const params = {
    Bucket: 'png.switchmaven.com',
    Key: (folder + file),
    ACL: 'public-read',
    Body: filePath
  };
  console.log("Folder name: " + folder);
  console.log("File: " + file);


  s3.putObject(params, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log('s3', data);
    }
  });

  // req.file(filePath).upload(function (err, uploadedFiles) {
  //   if (err) return res.serverError(err);
  //   console.log("uploadedfiles "+ uploadedFiles.length);
  //   return res.json({
  //     message: uploadedFiles.length + ' file(s) uploaded successfully!',
  //     files: uploadedFiles
  //   });
  // });

  // singleUpload(req, res, function(err, some) {
  //   if (err) {
  //     return res.status(422).send({ errors: [{title: 'Image Upload Error', detail: err.message}] });
  //   }
  //
  //   return res.json({ 'imageUrl': req.file.location });
  // });
})

app.get('/', (req, res) => {
  res.send('Oink, Oink... ')
>>>>>>> upload works, needs refactoring
})

app.listen(PORT, () => {
  console.log('listening at port:', PORT)
})
