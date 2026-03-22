const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {type: String,required: true,trim: true},
  price: {type: Number, required: true},
  pictures: [String], 
  category: String,
  color: String,
  quantity: Number,
  description: String,
}, { 
  timestamps: true 
});

productSchema.index({ quantity: 1, updatedAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
