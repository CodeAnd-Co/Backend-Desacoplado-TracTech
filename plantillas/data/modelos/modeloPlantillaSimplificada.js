//RF34 Usuario guarda plantilla de reporte - Modelo Simplificado

const conexion = require('../../../util/servicios/bd.js');

/**
 * Modelo simplificado para plantillas de reporte
 * Estructura: { idPlantilla, nombre, json }
 * donde json contiene toda la estructura completa de la plantilla
 */
class PlantillaSimplificada {
  /**
   * Constructor de la clase PlantillaSimplificada
   * @param {Object} props - Propiedades de la plantilla
   * @param {number|null} props.idPlantilla - ID de la plantilla (null para nuevas)
   * @param {string} props.nombre - Nombre de la plantilla
   * @param {Object|string} props.json - Estructura completa de la plantilla como JSON
   */
  constructor({ idPlantilla = null, nombre, json }) {
    this.idPlantilla = idPlantilla;
    this.nombre = nombre;
    // Si json viene como string, lo parseamos; si ya es objeto, lo dejamos como está
    this.json = typeof json === 'string' ? JSON.parse(json) : json;
  }

  /**
   * Inserta una nueva plantilla simplificada en la base de datos
   * @param {Object} plantilla - Datos de la plantilla
   * @param {string} plantilla.nombre - Nombre de la plantilla
   * @param {Object} plantilla.json - Estructura completa de la plantilla
   * @returns {Promise<number>} insertId
   */
  static async insertarPlantilla({ nombre, json }) {
    const sql = `
      INSERT INTO plantilla_simplificada
        (nombre, json)
      VALUES (?, ?)
    `;
    
    // Convertir el JSON a string para almacenamiento
    const jsonString = typeof json === 'object' ? JSON.stringify(json) : json;
    
    const vals = [nombre, jsonString];
    
    return new Promise((resolver, rechazar) => {
      conexion.query(sql, vals, (error, resultado) => {
        if (error) {
          return rechazar(error);
        }
        resolver(resultado.insertId);
      });
    });
  }

  /**
   * Obtiene una plantilla por su ID
   * @param {number} idPlantilla - ID de la plantilla
   * @returns {Promise<PlantillaSimplificada|null>}
   */
  static async obtenerPorId(idPlantilla) {
    const sql = `
      SELECT idPlantilla, nombre, json
      FROM plantilla_simplificada
      WHERE idPlantilla = ?
    `;
    
    return new Promise((resolver, rechazar) => {
      conexion.query(sql, [idPlantilla], (error, resultado) => {
        if (error) {
          return rechazar(error);
        }
        
        if (resultado.length === 0) {
          return resolver(null);
        }
        
        const plantilla = resultado[0];
        resolver(new PlantillaSimplificada({
          idPlantilla: plantilla.idPlantilla,
          nombre: plantilla.nombre,
          json: plantilla.json
        }));
      });
    });
  }

  /**
   * Obtiene todas las plantillas simplificadas
   * @returns {Promise<PlantillaSimplificada[]>}
   */
  static async obtenerTodas() {
    const sql = `
      SELECT idPlantilla, nombre, json
      FROM plantilla_simplificada
      ORDER BY nombre ASC
    `;
    
    return new Promise((resolver, rechazar) => {
      conexion.query(sql, [], (error, resultado) => {
        if (error) {
          return rechazar(error);
        }
        
        const plantillas = resultado.map(row => new PlantillaSimplificada({
          idPlantilla: row.idPlantilla,
          nombre: row.nombre,
          json: row.json
        }));
        
        resolver(plantillas);
      });
    });
  }

  /**
   * Actualiza una plantilla existente
   * @param {number} idPlantilla - ID de la plantilla
   * @param {Object} datos - Nuevos datos
   * @param {string} datos.nombre - Nuevo nombre
   * @param {Object} datos.json - Nueva estructura JSON
   * @returns {Promise<boolean>}
   */
  static async actualizar(idPlantilla, { nombre, json }) {
    const sql = `
      UPDATE plantilla_simplificada
      SET nombre = ?, json = ?
      WHERE idPlantilla = ?
    `;
    
    const jsonString = typeof json === 'object' ? JSON.stringify(json) : json;
    const vals = [nombre, jsonString, idPlantilla];
    
    return new Promise((resolver, rechazar) => {
      conexion.query(sql, vals, (error, resultado) => {
        if (error) {
          return rechazar(error);
        }
        resolver(resultado.affectedRows > 0);
      });
    });
  }

  /**
   * Elimina una plantilla por su ID
   * @param {number} idPlantilla - ID de la plantilla
   * @returns {Promise<boolean>}
   */
  static async eliminar(idPlantilla) {
    const sql = `
      DELETE FROM plantilla_simplificada
      WHERE idPlantilla = ?
    `;
    
    return new Promise((resolver, rechazar) => {
      conexion.query(sql, [idPlantilla], (error, resultado) => {
        if (error) {
          return rechazar(error);
        }
        resolver(resultado.affectedRows > 0);
      });
    });
  }

  /**
   * Busca plantillas por nombre (búsqueda parcial)
   * @param {string} termino - Término de búsqueda
   * @returns {Promise<PlantillaSimplificada[]>}
   */
  static async buscarPorNombre(termino) {
    const sql = `
      SELECT idPlantilla, nombre, json
      FROM plantilla_simplificada
      WHERE nombre LIKE ?
      ORDER BY nombre ASC
    `;
    
    return new Promise((resolver, rechazar) => {
      conexion.query(sql, [`%${termino}%`], (error, resultado) => {
        if (error) {
          return rechazar(error);
        }
        
        const plantillas = resultado.map(row => new PlantillaSimplificada({
          idPlantilla: row.idPlantilla,
          nombre: row.nombre,
          json: row.json
        }));
        
        resolver(plantillas);
      });
    });
  }

  /**
   * Obtiene estadísticas básicas de las plantillas
   * @returns {Promise<Object>}
   */
  static async obtenerEstadisticas() {
    const sql = `
      SELECT 
        COUNT(*) as totalPlantillas,
        AVG(CHAR_LENGTH(json)) as promedioTamanoJson,
        MAX(CHAR_LENGTH(json)) as maxTamanoJson,
        MIN(CHAR_LENGTH(json)) as minTamanoJson
      FROM plantilla_simplificada
    `;
    
    return new Promise((resolver, rechazar) => {
      conexion.query(sql, [], (error, resultado) => {
        if (error) {
          return rechazar(error);
        }
        
        resolver(resultado[0]);
      });
    });
  }

  /**
   * Convierte la instancia a un objeto plano
   * @returns {Object}
   */
  toObject() {
    return {
      idPlantilla: this.idPlantilla,
      nombre: this.nombre,
      json: this.json
    };
  }

  /**
   * Convierte la instancia a JSON string
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify(this.toObject());
  }
}

module.exports = PlantillaSimplificada;
