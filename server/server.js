require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

//parse aplication/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

app.use(require('./routes/index'))

app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto: ', process.env.PORT)
})

mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true}, (err, resp) => {
  if(err) throw err
    console.log('Base de datos ONLINE')
})