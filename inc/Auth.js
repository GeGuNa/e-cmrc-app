const express = require('express')
const Product = require('./pages/Product')
const User = require("./db/User.js")



function PgFrAutohrized (req, res, next) {
  console.log('I come here')
  next()
}
