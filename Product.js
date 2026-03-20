const express = require('express')
const app = express.Router()


app.get('/', (req, res) => {
  res.send('Product page');
});

app.get('/:id', (req, res) => {
  res.send(` Product id ${req.params.id}`);
});


module.exports = app;
