const express = require('express')
const app = express.Router()


async function kzq () { 

app.get('/', (req, res) => {
  res.send(` pages `);
});

app.get('/about_us', (req, res) => {
  res.send('About us');
});

app.get('/contact_us', (req, res) => {
  res.send(` Contact us`);
});

return app;
}

module.exports = kzq();
