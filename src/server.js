require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const graphqlHandler = require('./graphql')

app.use('/graphql', graphqlHandler)

app.get('/', (req, res) => {
  res.send('Oink, Oink... ')
})

app.listen(PORT, () => {
  console.log('listening at port:', PORT)
})
