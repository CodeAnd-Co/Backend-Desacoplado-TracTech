//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const Contenido = require('../modelos/modeloContenido');

function insertarContenidoRepositorio(props) {
  return Contenido.insertarContenido(props);    // ← devuelve la promesa, para que `await` funcione
}
module.exports =  {insertarContenidoRepositorio};
