const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017/'; // Asegúrate de tener el nombre de la base de datos
const port = 3000;

async function connectToDatabase() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    return client.db('dbPlanSeguroDB');
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
}

app.get('/', (req, res) => {
  res.send('¡Hola desde el backend!');
});

app.get('/comentarios', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const comentarios = await database.collection('comentariosC').find().toArray();
    res.json(comentarios);
  } catch (err) {
    console.error('Error en la consulta de comentarios:', err);
    res.status(500).json({ message: 'Error al obtener comentarios' });
  } finally {
    const client = new MongoClient(uri);
    await client.connect();
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Rutas para zonas
app.get('/zonas', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const zonas = await database.collection('zonasC').find().toArray();
      res.json(zonas);
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.get('/zonas/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const zona = await database.collection('zonasC').findOne({ _id: new ObjectId(req.params.id) });
      if (!zona) {
        return res.status(404).json({ message: 'Zona no encontrada' });
      }
      res.json(zona);
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.post('/zonas', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const result = await database.collection('zonasC').insertOne(req.body);
      res.status(201).json(result.ops[0]);
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.patch('/zonas/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      await database.collection('zonasC').updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
      const zonaActualizada = await database.collection('zonasC').findOne({ _id: new ObjectId(req.params.id) });
      res.json(zonaActualizada);
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.delete('/zonas/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      await database.collection('zonasC').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: 'Zona eliminada' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  // Rutas para incidentes
  app.get('/incidentes', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const incidentes = await database.collection('incidentesC').find().toArray();
      res.json(incidentes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.get('/incidentes/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const incidente = await database.collection('incidentesC').findOne({ _id: new ObjectId(req.params.id) });
      if (!incidente) {
        return res.status(404).json({ message: 'Incidente no encontrado' });
      }
      res.json(incidente);
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.post('/incidentes', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const result = await database.collection('incidentesC').insertOne(req.body);
      res.status(201).json(result.ops[0]);
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.patch('/incidentes/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      await database.collection('incidentesC').updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
      const incidenteActualizado = await database.collection('incidentesC').findOne({ _id: new ObjectId(req.params.id) });
      res.json(incidenteActualizado);
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.delete('/incidentes/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      await database.collection('incidentesC').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: 'Incidente eliminado' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  // Rutas para usuarios
  app.get('/usuarios', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const usuarios = await database.collection('usuariosC').find().toArray();
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.get('/usuarios/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const usuario = await database.collection('usuariosC').findOne({ _id: new ObjectId(req.params.id) });
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.post('/usuarios', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const result = await database.collection('usuariosC').insertOne(req.body);
      res.status(201).json(result.ops[0]);
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.patch('/usuarios/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      await database.collection('usuariosC').updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
      const usuarioActualizado = await database.collection('usuariosC').findOne({ _id: new ObjectId(req.params.id) });
      res.json(usuarioActualizado);
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });
  
  app.delete('/usuarios/:id', async (req, res) => {
    try {
      const database = await connectToDatabase();
      await database.collection('usuariosC').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: 'Usuario eliminado' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
  });