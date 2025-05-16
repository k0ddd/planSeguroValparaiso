const bcrypt = require('bcryptjs');

const contrasenaProporcionada = '123456';

// Generar un nuevo hash
bcrypt.hash(contrasenaProporcionada, 10, (err, hashGenerado) => {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Hash generado manualmente:', hashGenerado);

    // Comparar la contraseña con el nuevo hash
    bcrypt.compare(contrasenaProporcionada, hashGenerado, (err, result) => {
      if (err) {
        console.error('Error al comparar:', err);
      } else {
        console.log('¿Contraseña válida con el nuevo hash?:', result);
      }
    });
  }
});