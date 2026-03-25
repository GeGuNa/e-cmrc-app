const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
  },
  payment: {
    transactionId: String,
    status: String,
    amount: Number,
    processedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: Date
});

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
