//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const Texto = require('../modelos/modeloTexto');

async function insertarTextoRepositorio(props) {
  return Texto.insertar(props);
}

module.exports = { insertarTextoRepositorio };