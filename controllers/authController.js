const Usuario = require('../backend-models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registrar = async (req, res) => {
  try {
    console.log('Datos recibidos en el backend:', req.body);

    const { nombre, correo, contrasena, telefono } = req.body;

    if (!correo) {
      return res.status(400).json({ mensaje: 'El campo correo es obligatorio' });
    }

    // Validar si ya existe un usuario con ese correo
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Crear un nuevo usuario (sin encriptar manualmente la contraseña)
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contrasena, // Pasa la contraseña sin encriptar
      telefono,
    });

    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    console.log('Correo recibido:', correo);
    console.log('Contraseña recibida:', contrasena);

    // Buscar al usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo no registrado' });
    }

    console.log('Contraseña proporcionada:', contrasena);
    console.log('Contraseña almacenada (encriptada):', usuario.contrasena);

    // Comparar la contraseña proporcionada con la almacenada
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    console.log('¿Contraseña válida?:', contrasenaValida);

    if (!contrasenaValida) {
      console.log('La contraseña no coincide');
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '2h' }
    );

    // Responder con el token y los datos del usuario
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};
