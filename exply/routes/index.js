var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/setup', function(req, res, next) {
	console.log('test')
  //Array of chat data. Each object properties must match the schema object properties
  var chatData = [{
    created: new Date(),
    content: 'Hi',
    username: 'Chris',
    room: 'php'
  }, {
    created: new Date(),
    content: 'Hello',
    username: 'Obinna',
    room: 'laravel'
  }, {
    created: new Date(),
    content: 'Ait',
    username: 'Bill',
    room: 'angular'
  }, {
    created: new Date(),
    content: 'Amazing room',
    username: 'Patience',
    room: 'socet.io'
  }];

  //Loop through each of the chat data and insert into the database
  for (var c = 0; c < chatData.length; c++) {
    //Create an instance of the chat model
    var newChat = new Chat(chatData[c]);
    //Call save to insert the chat
    newChat.save(function(err, savedChat) {
      console.log(savedChat);
    });
  }
  //Send a resoponse so the serve would not get stuck
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








module.exports = router;
