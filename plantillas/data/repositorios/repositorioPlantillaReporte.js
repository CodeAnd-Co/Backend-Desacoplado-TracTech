const conexion = require('../../../util/bd.js');

async function insertarPlantillaReporte({ Nombre, Datos, FrecuenciaEnvio, CorreoDestino, NumeroDestino }) {
  const sql = `
    INSERT INTO plantillareporte
      (Nombre, Datos, FrecuenciaEnvio, CorreoDestino, NumeroDestino)
    VALUES (?, ?, ?, ?, ?)
  `;
  const vals = [Nombre, Datos, FrecuenciaEnvio, CorreoDestino, NumeroDestino];

  return new Promise((res, rej) => {
    conexion.query(sql, vals, (err, result) => {
      if (err) return rej(err);
      res(result.insertId);
    });
  });
}

module.exports = { insertarPlantillaReporte };
