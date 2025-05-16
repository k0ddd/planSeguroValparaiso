const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  tipo: String,
  descripcion: String,
  latitud: Number,
  longitud: Number,
  ubicacion: String,
  fecha: { type: Date, default: Date.now },
  imagen: String, // URL o base64 si más adelante agregas imágenes
  usuarioId: String,
});

module.exports = mongoose.model('Reporte', reporteSchema);
