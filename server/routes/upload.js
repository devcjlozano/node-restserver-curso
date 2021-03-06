const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path')


// default options
app.use(fileUpload({ useTempFiles: true }))

app.put('/upload/:tipo/:id', (req, res) => {
  const tipo = req.params.tipo
  const id = req.params.id

  if(!req.files) {
    return res.status(400)
      .json({
        ok:false, error: {
        message: 'No se ha seleccionado ningún archivo'
      }})
  }

  //Valida tipo
  const tiposValidos = ['productos', 'usuarios']
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      message: `Los tipos permitidos son ${tiposValidos.join(', ')}`,
    })  
  }
  const archivo = req.files.archivo
  const nombreCortado = archivo.name.split('.')
  const extension = nombreCortado[nombreCortado.length - 1]

  // Extensiones permitidas
  const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg' ]
  
  if(extensionesValidas.indexOf(extension) <0 ) {
    return res.status(400).json({
      ok: false,
      message: `Las extensiones permitidas son ${extensionesValidas.join(', ')}`,
      ext: extension
    })
  }
    
  // Cambiar nombre al archivo
  let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extension }`

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if(err) {
      return res.status(500)
        .json({
          ok: false,
          err
        })    
    }
  
    // Aquí, imagen cargada

    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo)
    } else {
      imagenProducto(id, res, nombreArchivo)
    }
    
  })
})

function imagenUsuario(id, res, nombreArchivo) {
   Usuario.findById(id, (err, usuarioDB) => {
     if (err) {
      borraArchivo(nombreArchivo, 'usuarios')
       return res.status(500).json({
         ok: false,
         err
       })
     }
     if (!usuarioDB) {
      borraArchivo(usuarioDB.img, 'usuarios')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      })
     }

     borraArchivo(usuarioDB.img, 'usuarios')

     usuarioDB.img = nombreArchivo
     usuarioDB.save((err, usuarioGuardado) => {
       res.json({
         ok: true,
         usuario: usuarioGuardado,
         img: nombreArchivo
       })
     })
   })
}

function imagenProducto(id, res, nombreArchivo ) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
     borraArchivo(nombreArchivo, 'productos')
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
     borraArchivo(productoDB.img, 'productos')
     return res.status(400).json({
       ok: false,
       err: {
         message: 'producto no existe'
       }
     })
    }

    borraArchivo(productoDB.img, 'productos')

    productoDB.img = nombreArchivo
    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    })
  })
}

function borraArchivo(nombreImagen, tipo) {
  const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
     if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen)
    }
}

module.exports = app
