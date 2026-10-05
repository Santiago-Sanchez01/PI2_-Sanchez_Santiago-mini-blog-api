const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'MiniBlog API is running'
  });
});

module.exports = app;