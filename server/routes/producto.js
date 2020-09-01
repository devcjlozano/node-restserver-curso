const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const app = express()
const Producto = require('../models/producto')

// ===============================
// Obtener todos los productos
// ===============================
app.get('/productos', verificaToken, (req, res) => {
  let desde = req.query.desde || 0
  desde = Number(desde)

  Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          err  
        })
      }
      if(!productos) {
        return res.status(404).json({
          ok: false,
          err: {
          message: 'No existen productos'
          } 
        })
      }
      return res.status(200).json({
        ok: true,
        productos
      })    
    })
})


// ===============================
// Obtener un producto por id
// ===============================
app.get('/productos/:id', verificaToken, (req, res) => {
  const productoId = req.params.id
   
  Producto.findById(productoId)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, producto) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          err  
        })
      }
      if(!producto) {
        return res.status(404).json({
          ok: false,
          err: {
          message: 'No existe este producto'
          } 
        })
      }
      return res.status(200).json({
        ok: true,
        producto
      })      
    })
})

// ===============================
// Buscar Productos
// ===============================

app.get('/productos/buscar/:termino', verificaToken, (req ,res) => {
  const termino = req.params.termino

  const regex = new RegExp(termino, 'i')

  Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        productos
      })
    })
})

// ===============================
// Crear un nuevo producto
// ===============================
app.post('/productos', verificaToken, (req, res) => {
  const body = req.body

  const producto = new Producto({
    nombre: body.nombre,
    descripcion: body.descripcion,
    precioUni: body.precioUnitario,
    categoria: body.categoriaId,
    usuario: req.usuario._id
  })

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })  
    }
    res.status(200).json({
      ok: true,
      producto: productoDB
    })
  }) 
})

// ===============================
// Actualizar un producto
// ===============================
app.put('/productos/:id', verificaToken, (req, res) => {
  const body = req.body
  const productoId = req.params.id;

  Producto.findById(productoId, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no existe'
        }
      });
    }
    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUnitario;
    productoDB.categoria = body.categoriaId;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        producto: productoGuardado
      });
    });

  });
})

// ===============================
// Borrar un producto
// ===============================
app.delete('/productos/:id', verificaToken, (req, res) => {
  const id = req.params.id
  const cambiaDisponible = {
    disponible: false
  }

  Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true, useFindAndModify: false }, (err, productoDB) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'producto no encontrado'
        }
      })
    }
    res.json({
      ok: true,
      producto: productoDB
    })
  })
})

module.exports = app