const contenido = require('../modelos/modeloContenido.js');

async function insertarContenido({ OrdenContenido, TipoContenido, IdPlantilla }) {
  contenido.insertarContenido({ OrdenContenido, TipoContenido, IdPlantilla });
}

module.exports = { insertarContenido };
