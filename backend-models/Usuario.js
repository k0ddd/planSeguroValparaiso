const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define el esquema del usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  telefono: { type: String, required: true },
});

// Middleware para encriptar la contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contrasena')) return next(); // Solo encripta si la contraseña fue modificada

  console.log('Contraseña original antes de encriptar:', this.contrasena);
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  console.log('Contraseña encriptada antes de guardar:', this.contrasena);

  next();
});

// Exporta el modelo
module.exports = mongoose.model('Usuario', usuarioSchema);
