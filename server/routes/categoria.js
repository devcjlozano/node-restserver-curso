const express = require('express')

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

const app = express()

const Categoria = require('../models/categoria')

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({})
   .sort('descripcion')
   .populate('usuario', 'nombre email')
   .exec((err, categorias) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        err  
      })
    }
    if(!categorias) {
      return res.status(404).json({
        ok: false,
        err: {
          message: 'No existen categorias'
        } 
      })
    }
    return res.status(200).json({
      ok: true,
      categorias
    })
  })
})

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
   const categoriaId = req.params.id
   Categoria.findById(categoriaId, (err, categoria) => {
     if(err) {
       return res.status(500).json({
         ok: false,
         err
       })
     }
     if(!categoria) {
        return res.status(404).json({
          ok: false,
          err: {
            message: 'No existe la categoría'
          }
        })
     }
     return res.status(200).json({
        ok: true,
        categoria
     })
   })
})

// ============================
// Crear nueva categoría
// ============================
app.post('/categoria', verificaToken, (req, res) => {
  const body = req.body

  const categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  })

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })  
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      })  
    }
    res.status(200).json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

// ============================
// Actualizar categoría por ID
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
  const categoriaId = req.params.id
  const body = req.body
  
  Categoria.findByIdAndUpdate(categoriaId, { descripcion: body.descripcion }, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, categoriaDB) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

// ============================
// Borrar una categoria por ID
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  const categoriaId = req.params.id
  
  Categoria.findByIdAndRemove(categoriaId, { useFindAndModify: false }, (err, categoriaDB) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      })
    }
    res.json({
      ok: true,
      message: 'Categoria borrada'
    })
  })
  // Solo un administrador puede borrar categorías
})

module.exports = app;