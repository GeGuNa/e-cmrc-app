const express = require('express')
const Product = require('./Product')
const app = express()
const port = 3000


app.use((req,res,next) => {

	console.log(`done deal`)
	
	next();
	
});

app.use('/product', Product)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
