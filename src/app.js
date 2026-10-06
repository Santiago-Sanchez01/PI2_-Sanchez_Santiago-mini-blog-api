const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const authorsRouter = require('./routes/authors.routes');
const postsRouter = require('./routes/posts.routes');

const app = express();

const swaggerDocument = YAML.load(
  path.join(__dirname, '../docs/openapi.yaml')
);


// Middlewares
app.use(express.json());


// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'MiniBlog API is running'
  });
});


// Rutas de la API
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);


// Documentación Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);


module.exports = app;