//Pruebas para el Sistema de Plantillas Simplificado

const request = require('supertest');
const app = require('../../app'); // Asumiendo que tienes un app.js en la raíz

describe('Sistema de Plantillas Simplificado', () => {
  
  describe('POST /api/plantillas/simplificadas', () => {
    
    it('debería guardar una plantilla válida', async () => {
      const plantillaValida = {
        nombre: 'Plantilla de Prueba',
        json: {
          datos: [
            {
              tipo: 'grafica',
              id: 'grafica1',
              configuracion: {
                tipo: 'line',
                titulo: 'Gráfica de Prueba'
              }
            }
          ],
          configuracion: {
            titulo: 'Reporte de Prueba'
          }
        }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantillaValida)
        .expect(201);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.idPlantilla).toBeDefined();
      expect(response.body.datos.nombre).toBe('Plantilla de Prueba');
      expect(response.body.datos.estadisticas).toBeDefined();
    });

    it('debería fallar si falta el nombre', async () => {
      const plantillaSinNombre = {
        json: {
          datos: [{ tipo: 'grafica', id: 'grafica1' }]
        }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantillaSinNombre)
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('NOMBRE_REQUERIDO');
    });

    it('debería fallar si falta el JSON', async () => {
      const plantillaSinJson = {
        nombre: 'Plantilla Sin JSON'
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantillaSinJson)
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('JSON_REQUERIDO');
    });

    it('debería validar estructura JSON inválida', async () => {
      const plantillaInvalida = {
        nombre: 'Plantilla Inválida',
        json: {
          datos: [
            {
              // Falta tipo
              id: 'elemento1'
            }
          ]
        }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantillaInvalida)
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('ESTRUCTURA_INVALIDA');
      expect(response.body.errores).toContain('Elemento en posición 0 no tiene tipo definido');
    });
  });

  describe('GET /api/plantillas/simplificadas', () => {
    
    it('debería obtener todas las plantillas', async () => {
      const response = await request(app)
        .get('/api/plantillas/simplificadas')
        .expect(200);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos).toBeInstanceOf(Array);
      expect(response.body.total).toBeDefined();
      expect(response.body.estadisticasGenerales).toBeDefined();
    });
  });

  describe('GET /api/plantillas/simplificadas/:id', () => {
    
    let idPlantillaPrueba;

    beforeAll(async () => {
      // Crear una plantilla para las pruebas
      const plantilla = {
        nombre: 'Plantilla para Pruebas GET',
        json: {
          datos: [{ tipo: 'texto', id: 'texto1', contenido: 'Prueba' }],
          configuracion: { titulo: 'Prueba' }
        }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantilla);

      idPlantillaPrueba = response.body.datos.idPlantilla;
    });

    it('debería obtener una plantilla por ID', async () => {
      const response = await request(app)
        .get(`/api/plantillas/simplificadas/${idPlantillaPrueba}`)
        .expect(200);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.idPlantilla).toBe(idPlantillaPrueba);
      expect(response.body.datos.nombre).toBe('Plantilla para Pruebas GET');
      expect(response.body.estadisticas).toBeDefined();
    });

    it('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .get('/api/plantillas/simplificadas/abc')
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('ID_INVALIDO');
    });

    it('debería fallar con ID no encontrado', async () => {
      const response = await request(app)
        .get('/api/plantillas/simplificadas/99999')
        .expect(404);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('PLANTILLA_NO_ENCONTRADA');
    });
  });

  describe('PUT /api/plantillas/simplificadas/:id', () => {
    
    let idPlantillaPrueba;

    beforeAll(async () => {
      const plantilla = {
        nombre: 'Plantilla para Actualizar',
        json: {
          datos: [{ tipo: 'grafica', id: 'grafica1' }],
          configuracion: { titulo: 'Original' }
        }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantilla);

      idPlantillaPrueba = response.body.datos.idPlantilla;
    });

    it('debería actualizar una plantilla existente', async () => {
      const datosActualizados = {
        nombre: 'Plantilla Actualizada',
        json: {
          datos: [{ tipo: 'grafica', id: 'grafica1' }],
          configuracion: { titulo: 'Actualizado' }
        }
      };

      const response = await request(app)
        .put(`/api/plantillas/simplificadas/${idPlantillaPrueba}`)
        .send(datosActualizados)
        .expect(200);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.nombre).toBe('Plantilla Actualizada');
    });

    it('debería fallar al actualizar con datos inválidos', async () => {
      const datosInvalidos = {
        nombre: '',
        json: {}
      };

      const response = await request(app)
        .put(`/api/plantillas/simplificadas/${idPlantillaPrueba}`)
        .send(datosInvalidos)
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('NOMBRE_REQUERIDO');
    });
  });

  describe('DELETE /api/plantillas/simplificadas/:id', () => {
    
    let idPlantillaPrueba;

    beforeAll(async () => {
      const plantilla = {
        nombre: 'Plantilla para Eliminar',
        json: {
          datos: [{ tipo: 'texto', id: 'texto1' }],
          configuracion: { titulo: 'Para Eliminar' }
        }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantilla);

      idPlantillaPrueba = response.body.datos.idPlantilla;
    });

    it('debería eliminar una plantilla existente', async () => {
      const response = await request(app)
        .delete(`/api/plantillas/simplificadas/${idPlantillaPrueba}`)
        .expect(200);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.idPlantilla).toBe(idPlantillaPrueba);
    });

    it('debería fallar al eliminar plantilla no existente', async () => {
      const response = await request(app)
        .delete('/api/plantillas/simplificadas/99999')
        .expect(404);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('PLANTILLA_NO_ENCONTRADA');
    });
  });

  describe('GET /api/plantillas/simplificadas/buscar', () => {
    
    beforeAll(async () => {
      // Crear varias plantillas para probar búsqueda
      const plantillas = [
        {
          nombre: 'Reporte de Ventas',
          json: { datos: [], configuracion: { titulo: 'Ventas' } }
        },
        {
          nombre: 'Dashboard Operativo',
          json: { datos: [], configuracion: { titulo: 'Operativo' } }
        },
        {
          nombre: 'Análisis de Ventas',
          json: { datos: [], configuracion: { titulo: 'Análisis' } }
        }
      ];

      for (const plantilla of plantillas) {
        await request(app)
          .post('/api/plantillas/simplificadas')
          .send(plantilla);
      }
    });

    it('debería buscar plantillas por término', async () => {
      const response = await request(app)
        .get('/api/plantillas/simplificadas/buscar?termino=ventas')
        .expect(200);

      expect(response.body.exito).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
      expect(response.body.terminoBusqueda).toBe('ventas');
      
      // Verificar que los resultados contienen el término
      response.body.datos.forEach(plantilla => {
        expect(plantilla.nombre.toLowerCase()).toContain('ventas');
      });
    });

    it('debería fallar sin término de búsqueda', async () => {
      const response = await request(app)
        .get('/api/plantillas/simplificadas/buscar')
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('TERMINO_REQUERIDO');
    });
  });

  describe('POST /api/plantillas/simplificadas/:id/duplicar', () => {
    
    let idPlantillaPrueba;

    beforeAll(async () => {
      const plantilla = {
        nombre: 'Plantilla para Duplicar',
        json: {
          datos: [{ tipo: 'grafica', id: 'grafica1' }],
          configuracion: { titulo: 'Original' }
        }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas')
        .send(plantilla);

      idPlantillaPrueba = response.body.datos.idPlantilla;
    });

    it('debería duplicar una plantilla existente', async () => {
      const response = await request(app)
        .post(`/api/plantillas/simplificadas/${idPlantillaPrueba}/duplicar`)
        .send({ nuevoNombre: 'Plantilla Duplicada' })
        .expect(201);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.idPlantillaOriginal).toBe(idPlantillaPrueba);
      expect(response.body.datos.idPlantillaNueva).toBeDefined();
      expect(response.body.datos.nuevoNombre).toBe('Plantilla Duplicada');
    });

    it('debería fallar sin nuevo nombre', async () => {
      const response = await request(app)
        .post(`/api/plantillas/simplificadas/${idPlantillaPrueba}/duplicar`)
        .send({})
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('NOMBRE_REQUERIDO');
    });
  });

  describe('POST /api/plantillas/simplificadas/validar', () => {
    
    it('debería validar estructura JSON válida', async () => {
      const jsonValido = {
        datos: [
          {
            tipo: 'grafica',
            id: 'grafica1',
            configuracion: { titulo: 'Gráfica Válida' }
          }
        ],
        configuracion: { titulo: 'Plantilla Válida' }
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas/validar')
        .send({ json: jsonValido })
        .expect(200);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.valida).toBe(true);
      expect(response.body.datos.estadisticas).toBeDefined();
    });

    it('debería detectar estructura JSON inválida', async () => {
      const jsonInvalido = {
        datos: [
          {
            // Falta tipo
            id: 'elemento1'
          }
        ]
      };

      const response = await request(app)
        .post('/api/plantillas/simplificadas/validar')
        .send({ json: jsonInvalido })
        .expect(200);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.valida).toBe(false);
      expect(response.body.datos.errores.length).toBeGreaterThan(0);
    });

    it('debería fallar sin JSON', async () => {
      const response = await request(app)
        .post('/api/plantillas/simplificadas/validar')
        .send({})
        .expect(400);

      expect(response.body.exito).toBe(false);
      expect(response.body.codigo).toBe('JSON_REQUERIDO');
    });
  });
});

describe('Validaciones de Estructura', () => {
  
  const RepositorioPlantillaSimplificada = require('../data/repositorios/repositorioPlantillaSimplificada');

  describe('calcularEstadisticasJson', () => {
    
    it('debería calcular estadísticas correctamente', () => {
      const json = {
        datos: [
          { tipo: 'grafica', id: 'g1' },
          { tipo: 'texto', id: 't1' },
          { tipo: 'grafica', id: 'g2' }
        ],
        configuracion: { titulo: 'Test' }
      };

      const estadisticas = RepositorioPlantillaSimplificada.calcularEstadisticasJson(json);

      expect(estadisticas.tieneDatos).toBe(true);
      expect(estadisticas.elementosEnDatos).toBe(3);
      expect(estadisticas.tiposElementos.grafica).toBe(2);
      expect(estadisticas.tiposElementos.texto).toBe(1);
      expect(estadisticas.tieneConfiguracion).toBe(true);
    });

    it('debería manejar JSON vacío', () => {
      const json = {};
      const estadisticas = RepositorioPlantillaSimplificada.calcularEstadisticasJson(json);

      expect(estadisticas.tieneDatos).toBe(false);
      expect(estadisticas.elementosEnDatos).toBe(0);
      expect(estadisticas.tiposElementos).toEqual({});
    });
  });

  describe('validarEstructuraPlantilla', () => {
    
    it('debería validar estructura correcta', () => {
      const json = {
        datos: [
          { tipo: 'grafica', id: 'g1' }
        ]
      };

      const validacion = RepositorioPlantillaSimplificada.validarEstructuraPlantilla(json);

      expect(validacion.valida).toBe(true);
      expect(validacion.errores).toEqual([]);
    });

    it('debería detectar elementos sin tipo', () => {
      const json = {
        datos: [
          { id: 'g1' } // Falta tipo
        ]
      };

      const validacion = RepositorioPlantillaSimplificada.validarEstructuraPlantilla(json);

      expect(validacion.valida).toBe(false);
      expect(validacion.errores).toContain('Elemento en posición 0 no tiene tipo definido');
    });

    it('debería generar advertencias para elementos sin ID', () => {
      const json = {
        datos: [
          { tipo: 'grafica' } // Falta ID
        ]
      };

      const validacion = RepositorioPlantillaSimplificada.validarEstructuraPlantilla(json);

      expect(validacion.valida).toBe(true);
      expect(validacion.advertencias).toContain('Elemento en posición 0 no tiene ID definido');
    });
  });
});
