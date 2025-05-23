const modelo = require('../modelos/crearUsuarioModelo.js');

async function crearUsuarioRepositorio(nombre, correo, contrasenia, idRol) {
    return modelo.crearUsuario(nombre, correo, contrasenia, idRol);
  }

module.exports = {
    crearUsuarioRepositorio,
};