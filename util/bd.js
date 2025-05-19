const mysql = require('mysql2');

const conexion = mysql.createPool({
  host: process.env.ANFITRION_BD,
  user: process.env.USUARIO_BD,
  password: process.env.CONTRASENA_BD,
  database: process.env.NOMBRE_BD,
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

conexion.getConnection((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = conexion;