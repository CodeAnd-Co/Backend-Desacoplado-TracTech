// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

class Usuario {
  constructor({ id, nombre, correo}) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
  }
}

module.exports = { 
  Usuario, 
};