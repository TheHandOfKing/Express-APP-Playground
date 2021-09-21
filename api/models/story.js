const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    profileImage: String,
    username: String
  },
  duration: {
    type: Number,
    default: 24
  },
  archived: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Story', storySchema);