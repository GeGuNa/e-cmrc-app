const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usrdt = Schema({
    name: String,
    surn: String,
    city: String,
    country: String
});

const User = mongoose.model('User', usrdt);
module.exports = User
