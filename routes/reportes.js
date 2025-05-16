const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // Necesario para convertir el archivo en un stream
const Reporte = require('../backend-models/Reporte');

// Configuración de multer para guardar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET - obtener todos los reportes
router.get('/', async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.status(200).json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los reportes', details: error.message });
  }
});

// POST - crear un nuevo reporte
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { tipo, descripcion, ubicacion, usuarioId } = req.body;

    let imagenUrl = null;

    // Subir la imagen a Cloudinary si se envió
    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            return res.status(500).json({ error: 'Error al subir la imagen', details: error.message });
          }
          imagenUrl = result.secure_url; // URL segura de la imagen

          // Crear un nuevo reporte con la URL de la imagen
          const nuevoReporte = new Reporte({
            tipo,
            descripcion,
            ubicacion,
            imagen: imagenUrl,
            usuarioId,
          });

          nuevoReporte.save()
            .then(() => res.status(201).json({ mensaje: 'Reporte creado con éxito', reporte: nuevoReporte }))
            .catch((saveError) => {
              console.error('Error al guardar el reporte:', saveError);
              res.status(500).json({ error: 'Error al guardar el reporte', details: saveError.message });
            });
        }
      );

      // Convierte el archivo cargado en un stream y pásalo a Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      // Si no se envió una imagen, guarda el reporte sin imagen
      const nuevoReporte = new Reporte({
        tipo,
        descripcion,
        ubicacion,
        usuarioId
      });

      await nuevoReporte.save();
      res.status(201).json({ mensaje: 'Reporte creado con éxito', reporte: nuevoReporte });
    }
  } catch (error) {
    console.error('Error al guardar el reporte:', error);
    res.status(500).json({ error: 'Error al guardar el reporte', details: error.message });
  }
});
// DELETE - eliminar reporte por id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await Reporte.findByIdAndDelete(id);

    if (!resultado) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    res.status(200).json({ mensaje: 'Reporte eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el reporte:', error);
    res.status(500).json({ error: 'Error al eliminar el reporte', details: error.message });
  }
});



module.exports = router;
