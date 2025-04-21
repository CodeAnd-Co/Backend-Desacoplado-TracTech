const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: process.env.DB_HOST, // Dirección del servidor MySQL
  user: process.env.DB_USER,     // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_NAME // Nombre de la base de datos
});

conexion.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = conexion;