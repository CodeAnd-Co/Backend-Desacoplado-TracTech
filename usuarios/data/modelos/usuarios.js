// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

class Usuario {
  constructor({ id, nombre, correo, contrasenia, idRol_FK }) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.contrasenia = contrasenia; 
    this.idRol_FK = idRol_FK;
  }
}

module.exports = { 
  Usuario, 
};