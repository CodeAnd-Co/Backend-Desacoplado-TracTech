const Texto = require('../modelos/modeloTexto');

async function insertarTextoRepositorio(props) {
  return Texto.insertar(props);
}

module.exports = { insertarTextoRepositorio };