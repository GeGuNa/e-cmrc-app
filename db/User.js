const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usrdt = Schema({
    name: String,
    surn: String,
    city: String,
    country: String,
    username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  }, password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false 
  },  displayName: {
    type: String,
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  }, avatar: {
    type: String,
    default: '/images/avatars/default.png'
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\+\(\)]{8,}$/, 'Please provide a valid phone number']
  },role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'support'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned', 'pending_verification'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },  
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
});

const User = mongoose.model('User', usrdt);
module.exports = User
