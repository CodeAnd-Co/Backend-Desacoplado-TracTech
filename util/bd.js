const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: process.env.ANFITRION_BD, // Dirección del servidor MySQL
  user: process.env.USUARIO_BD,     // Usuario de la base de datos
  password: process.env.CONTRASENA_BD, // Contraseña del usuario
  database: process.env.NOMBRE_BD // Nombre de la base de datos
});

conexion.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = conexion;