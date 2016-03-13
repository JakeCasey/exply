var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
 name: String,
 rooms: Array
});


mongoose.model('Category', CategorySchema);