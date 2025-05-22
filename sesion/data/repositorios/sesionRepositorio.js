// sesion/data/repositorios/sesionRepositorio.js
const bcrypt = require('bcrypt');
const modelo = require('../modelos/sesionModelo.js');

async function obtenerUsuarioSiValido(correo, contrasenia) {
    const usuarios = await modelo.obtenerUsuarioPorCorreo(correo);
    if (usuarios.length === 0) return null;
    const usuario = usuarios[0];
    const contraseniaValida = await bcrypt.compare(contrasenia, usuario.Contrasenia);
    if (!contraseniaValida) return null;
    return usuario;
}

module.exports = {
    obtenerUsuarioSiValido,
};