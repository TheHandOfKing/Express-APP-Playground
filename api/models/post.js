const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: True
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  images: { type: String, required: true },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    createdAt: {
      type: Date,
      default: Date.now()
    },
    body: String
  }],
  location: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    profileImage: String,
    username: String
  }
})

module.exports = mongoose.model('Post', postSchema);