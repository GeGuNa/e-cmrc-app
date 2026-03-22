const express = require('express')
const app = express.Router()
const Product = require("../db/Product.js")

app.get('/', async(req, res) => {

	/*await Product.create({
		name:"test1",
		price:134.4,
		category:"Furniture",
		description: "ZZZZZZZZZZZZZZZZZ",
		quantity: 15
	})*/
	
	

	
	
	
	const qz = await Product.findById("69bf4d8a3d9886340d357ce6")
console.log(qz)
  res.send('Product page');
});
 
app.get('/:id', (req, res) => {
  res.send(` Product id ${req.params.id}`);
});


module.exports = app;
