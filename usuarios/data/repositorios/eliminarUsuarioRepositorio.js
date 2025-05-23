const modelo = require('../modelos/eliminarUsuarioModelo.js');

async function eliminarUsuario(id) {
    if (!id) {
        throw new Error('El ID del usuario es requerido');
    }
    return await modelo.eliminarUsuario(id).then(resultado => resultado.affectedRows > 0);
  }

module.exports = {
    eliminarUsuario,
};