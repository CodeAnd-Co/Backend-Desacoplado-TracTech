const conexion = require('../../../util/bd.js');

/**
 * Model: TextoContenido (hija de contenido)
 */
class TextoContenido {
  constructor({ IdTexto = null, TipoTexto, Alineacion, ContenidoTexto, IdContenido }) {
    this.IdTexto       = IdTexto;
    this.TipoTexto     = TipoTexto;
    this.Alineacion    = Alineacion;
    this.ContenidoTexto= ContenidoTexto;
    this.IdContenido   = IdContenido;
  }

  /**
   * Inserta un nuevo texto
   * @returns {Promise<number>} insertId
   */
  static async insertar(props) {
    const sql = `
      INSERT INTO texto
        (TipoTexto, Alineacion, ContenidoTexto, IdContenido)
      VALUES (?, ?, ?, ?)
    `;
    const vals = [
      props.TipoTexto,
      props.Alineacion,
      props.ContenidoTexto,
      props.IdContenido
    ];
    return new Promise((res, rej) => {
      conexion.query(sql, vals, (err, result) => err ? rej(err) : res(result.insertId));
    });
  }
}

module.exports = TextoContenido;
