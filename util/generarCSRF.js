const csrf = require('csurf');

/*
 * Este middleware:
 *   • Genera cookie _csrf
 *   • Adjunta req.csrfToken()           (no verifica el token porque
 *     ignoreMethods incluye POST)       se usa sólo para el login)
 */
const csrfGenerar = csrf({
  cookie: true,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST']
});

/*  Ejecutamos la función devuelta por csurf y,
 *  después, guardamos el token en res.locals por si
 *  se quiere leer en otro punto.
 */
const generarTokenCSRF = (req, res, next) => {
  csrfGenerar(req, res, (err) => {
    if (err) { return next(err); }
    res.locals.tokenCSRF = req.csrfToken();   // ya existe
    next();
  });
};

module.exports = { generarTokenCSRF };