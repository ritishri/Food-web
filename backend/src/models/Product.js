const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  title: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['PIZZA', 'BURGERS', 'SOUTH INDIAN','NORTH INDIAN','SWEETS', 'DRINKS','CAKES','BIRYANI']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isVeg: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);
