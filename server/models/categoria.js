const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const categoriaSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    unique: true
  },
  usuario: {
    type: Schema.ObjectId,
    ref: 'Usuario',
    required: [true, 'El id de usuario es necesario']
  }
})
categoriaSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser único'
})
module.exports = mongoose.model('Categoria', categoriaSchema)