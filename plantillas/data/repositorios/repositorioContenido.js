const Contenido = require('../modelos/modeloContenido');

async function insertarContenidoRepositorio({ OrdenContenido, TipoContenido, IdPlantilla }) {
  Contenido.insertarContenido({ OrdenContenido, TipoContenido, IdPlantilla });
}

module.exports =  {insertarContenidoRepositorio};
