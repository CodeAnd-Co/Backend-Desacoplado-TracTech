// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40
// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

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