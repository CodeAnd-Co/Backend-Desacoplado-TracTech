/**
 * Clase que representa un Usuario en el sistema
 * @class
 */
class Usuario {
  /**
   * Crea una instancia de Usuario
   * @param {object} props - Propiedades del usuario
   * @param {number} props.id - Identificador único del usuario
   * @param {string} props.nombre - Nombre del usuario
   * @param {string} props.correo - Dirección de correo electrónico del usuario
   */
  constructor({ id, nombre, correo }) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
  }
}

module.exports = { 
  Usuario, 
};