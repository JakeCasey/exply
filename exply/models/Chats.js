var mongoose = require('mongoose');

var ChatSchema = mongoose.Schema({
  created: Date,
  content: String,
  username: String,
  room: String
});


mongoose.model('Chat', ChatSchema);