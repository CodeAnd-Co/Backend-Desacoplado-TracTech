const modelo = require('../modelos/consultarRolesModelo');

async function consultarRoles() {
    const datos = await modelo.consultarRoles();
    if (!datos || datos.length === 0) {
        return {
            status: 404,
            mensaje: 'No se encontraron roles',
        };
    }
    return datos;
  }

module.exports = {
    consultarRoles,
};