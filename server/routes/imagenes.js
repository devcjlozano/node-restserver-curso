const express = require('express')

const fs = require('fs')
const path = require('path')

const { verificaTokenImg } = require('../middlewares/autenticacion')
const app = express()

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
  const tipo = req.params.tipo
  const img = req.params.img

  const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
  const noImagePath = path.resolve(__dirname, '../assets/default.jpg')
  
  if(fs.existsSync(pathImg)) {
    res.sendFile(pathImg)
  } else {
    res.sendFile(noImagePath)
  }

})


module.exports = app

