const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumenta el límite de JSON
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Aumenta el límite de URL-encoded

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB', err));

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'du3ooc7oi',
  api_key: '118769113216785',
  api_secret: 'Ew15WPj_3CMsCHialt_9rdqm1cw'
});

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de PlanSeguro');
});

// Rutas
const reportesRoutes = require('./routes/reportes');
app.use('/reportes', reportesRoutes); // Registra las rutas de reportes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
