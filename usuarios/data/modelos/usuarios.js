// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

class Usuario {
  constructor({ id, nombre, correo, rol}) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.rol = rol;
  }
}

module.exports = { 
  Usuario, 
};