const express = require('express');
const authorsRouter = require('./routes/authors.routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'MiniBlog API is running'
  });
});

app.use('/authors', authorsRouter);

module.exports = app;