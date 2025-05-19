const conexion = require('../../../util/bd.js');

async function insertarTexto({ TipoTexto, Alineacion, ContenidoTexto, IdContenido }) {
  const sql = `
    INSERT INTO texto
      (TipoTexto, Alineacion, ContenidoTexto, IdContenido)
    VALUES (?, ?, ?, ?)
  `;
  const vals = [TipoTexto, Alineacion, ContenidoTexto, IdContenido];

  return new Promise((res, rej) => {
    conexion.query(sql, vals, (err, result) => {
      if (err) return rej(err);
      res(result.insertId);
    });
  });
}

module.exports = { insertarTexto };
