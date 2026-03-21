const express = require('express')
const Product = require('./pages/Product')
const Mongo = require("./db/mongo.js")
const User = require("./db/User.js")

const app = express()
const port = 3000



function PgFrAutohrized (req, res, next) {
  console.log('I come here')
  next()
}

async function main (){

await Mongo()

//await User.create({name: 'zz', surn:'Bbb', city: 'batumi'})
    
   
app.use((req,res,next) => {

	console.log(`done deal`)
	
	next();
	
});




const MiscPages = await require('./pages/misc')

app.use('/product', Product)
app.use('/pages', MiscPages)




app.get('/auth', PgFrAutohrized, (req, res) => {
  console.log('I dont come here')
  res.send('Hello authorized!')
})

app.get('/', async(req, res) => {

const qzuq = await User.insertOne({name: 'Nukri11', surn:'Brdze3213'})
console.log("User created", qzuq);



  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





}


main()
