const Contenido = require('../modelos/modeloContenido');

function insertarContenidoRepositorio(props) {
  return Contenido.insertarContenido(props);    // ← devuelve la promesa, para que `await` funcione
}
module.exports =  {insertarContenidoRepositorio};
