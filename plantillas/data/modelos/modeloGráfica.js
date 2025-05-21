const conexion = require('../../../util/servicios/bd.js');

/**
 * Model: GraficaContenido (hija de contenido)
 */
class Grafica {
  constructor({ IdGrafica = null, NombreGrafica, TipoGrafica, Parametros, IdContenido }) {
    this.IdGrafica    = IdGrafica;
    this.NombreGrafica= NombreGrafica;
    this.TipoGrafica  = TipoGrafica;
    this.Parametros   = Parametros;
    this.IdContenido  = IdContenido;
  }

  /**
   * Inserta una nueva gráfica
   * @returns {Promise<number>} insertId
   */
  static async insertar(props) {
    const sql = `
      INSERT INTO grafica
        (NombreGrafica, TipoGrafica, Parametros, IdContenido)
      VALUES (?, ?, ?, ?)
    `;
    const vals = [
      props.NombreGrafica,
      props.TipoGrafica,
      JSON.stringify(props.Parametros),
      props.IdContenido
    ];
    return new Promise((res, rej) => {
      conexion.query(sql, vals, (err, result) => err ? rej(err) : res(result.insertId));
    });
  }
}

module.exports = Grafica;
