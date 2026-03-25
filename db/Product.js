const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {type: String,required: true,trim: true},
  price: {type: Number, required: true},
  pictures: [String], 
  category: String,
  color: String,
  quantity: Number,
  description: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }  
});

//productSchema.index({ quantity: 1, updatedAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
