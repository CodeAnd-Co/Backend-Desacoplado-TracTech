const conexion = require('../../../util/bd.js');

async function insertarGrafica({ NombreGrafica, TipoGrafica, Parametros, IdContenido }) {
  const sql = `
    INSERT INTO grafica
      (NombreGrafica, TipoGrafica, Parametros, IdContenido)
    VALUES (?, ?, ?, ?)
  `;
  const vals = [NombreGrafica, TipoGrafica, JSON.stringify(Parametros), IdContenido];

  return new Promise((res, rej) => {
    conexion.query(sql, vals, (err, result) => {
      if (err) return rej(err);
      res(result.insertId);
    });
  });
}

module.exports = { insertarGrafica };
