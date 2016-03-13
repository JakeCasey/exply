var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var Category = mongoose.model('Category');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/setup', function(req, res, next) {
	console.log('test')
 
 var category = new Category({
  name: 'Science',
  rooms: ['room1', 'room2', 'room3']
 });
  category.save();
  res.send('created');  
});

router.get('/chats', function(req, res) {

     if (req.query.username != null){
      Chat.find({
    'room': req.query.room,
    'username': req.query.username
  }).exec(function(err, msgs) {
    //Send
    res.json(msgs);
  });
}
  //Find
 else { 
  Chat.find({
    'room': req.query.room,
  }).exec(function(err, msgs) {
    //Send
    res.json(msgs);
  });
}
});

router.get('/categories', function(req, res) {

      Category.find({
      
      }).exec(function(err, msgs) {
    //Send
    res.json(msgs);
  });
});







module.exports = router;
