const mongoose = require('mongoose');
const Joi = require('joi');

const paqueteSchema = new mongoose.Schema({
  nombre: String,
  destino: String,
  fecha: Date,
  precio: Number,
  descripcion: String,
  activo: { type: Boolean, default: true }
});

const joiSchema = Joi.object({
  nombre: Joi.string().required(),
  destino: Joi.string().required(),
  fecha: Joi.date().required(),
  precio: Joi.number().positive().required(),
  descripcion: Joi.string().optional(),
  activo: Joi.boolean()
});

module.exports = { Paquete: mongoose.model('Paquete', paqueteSchema), joiSchema };
