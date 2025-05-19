const conexion = require('../../../util/bd.js');

/**
 * Inserta un nuevo registro en plantillareporte
 * y lo vincula a una plantilla (FK IdPlantilla).
 *
 * @param {Object} props
 * @param {number} props.IdPlantilla      — FK a plantilla.IdPlantilla
 * @param {string} props.Nombre
 * @param {string} props.Datos
 * @param {number} props.FrecuenciaEnvio
 * @param {string} props.CorreoDestino
 * @param {string} props.NumeroDestino
 * @returns {Promise<number>} insertId
 */
async function insertarPlantillaReporte({
  IdPlantilla,
  Nombre,
  Datos,
  FrecuenciaEnvio,
  CorreoDestino,
  NumeroDestino
}) {
  const sql = `
    INSERT INTO plantillareporte
      (IdPlantilla, Nombre, Datos, FrecuenciaEnvio, CorreoDestino, NumeroDestino)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const vals = [
    IdPlantilla,
    Nombre,
    Datos,
    FrecuenciaEnvio,
    CorreoDestino,
    NumeroDestino
  ];

  return new Promise((res, rej) => {
    conexion.query(sql, vals, (err, result) => {
      if (err) return rej(err);
      res(result.insertId);
    });
  });
}

module.exports = { insertarPlantillaReporte };
