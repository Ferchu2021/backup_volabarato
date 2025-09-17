const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
  if(!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const joiSchema = Joi.object({
  usuario: Joi.string().min(4).max(30).required(),
  password: Joi.string().min(6).required()
});

module.exports = { User: mongoose.model('User', userSchema), joiSchema };
