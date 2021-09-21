const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    profileImage: String,
    username: String
  }
})

module.exports = mongoose.model('Comment', commentSchema);