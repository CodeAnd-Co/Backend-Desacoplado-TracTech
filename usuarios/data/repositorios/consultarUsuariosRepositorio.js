const modelo = require('../modelos/consultarUsuariosModelo.js');

function consultarUsuarios() {
    const rolAExcluir = process.env.SU;
    const datos = modelo.consultarUsuarios(rolAExcluir);
    if (!datos || datos.length === 0) {
        return {
            status: 404,
            mensaje: 'No se encontraron usuarios',
        };
    }
    return datos;
  }

module.exports = {
    consultarUsuarios,
};