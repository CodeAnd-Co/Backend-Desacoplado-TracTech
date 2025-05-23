const modelo = require('../modelos/consultaRolesModelo');


function consultarUsuarios() {
    const rolAExcluir = process.env.SU;
    return modelo.consultarUsuarios(rolAExcluir)
        .then(resultados => resultados.map(usuario => new Usuario({
          id: usuario.idUsuario,
          nombre: usuario.Nombre,
          correo: usuario.Correo,
          rol: usuario.Rol,
        })));
  }