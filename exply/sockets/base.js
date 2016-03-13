module.exports = function(io){



var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var Category = mongoose.model('Category');
var usernames = {};
var http = require('http');
var Category = mongoose.model('Category');


var rooms = [

// {'lobby':['lobby']},
// {'math': ['math1','math2','math3','math4']}, 
// {'history': ['history1','history2','history3','history4']},
// {'science': ['science1','science2','science3','science4']}, 
// {'programming': ['programming1','programming2','programming3','programming4']}

]


io.sockets.on('connection', function (socket) {

  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // store the username in the socket session for this client
    socket.username = username;
    // store the room name in the socket session for this client
    socket.room = 'lobby';
    //store the category in the scket session for this client
    socket.category = 'lobby';
    // add the client's username to the global list
    usernames[username] = username;
    // send client to lobby
    socket.join('lobby');
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected to lobby');
    // echo to room 1 that a person has connected to their room
    socket.broadcast.to('lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
    socket.emit('updaterooms', rooms, 'lobby', socket.category);

  });

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {

  //currently the db is written to every time a user sends a message.
  //this needs to be batched into larger groups using http://stackoverflow.com/questions/16726330/mongoose-mongodb-batch-insert?

    var newMsg = new Chat({
      username: socket.username,
      content: data,
      room: socket.room,
      created: new Date()
    });

    //Save it to database
    newMsg.save(function(err, msg){
            //Send message to those connected in the room
          io.sockets.in(socket.room).emit('updatechat', socket.username, data);
        });

    //console.log(tempLog);
  });

  socket.on('switchRoom', function(newroom){


    // leave the current room (stored in session)
    socket.leave(socket.room);
    // join new room, received as function parameter
    socket.join(newroom);
    socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
    // sent message to OLD room
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
    // update socket session room title
    socket.room = newroom;
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
    socket.emit('updaterooms', rooms, newroom, socket.category);


// This function grabs the ID of the sockets in the room, then pushes them into the sockets array
// which is then displayed to the user whilst in a room. Updates on user entry/leave, via 'updateusers'
   function roomSockets(roomId) {
    var clients = io.nsps['/'].adapter.rooms[roomId].sockets,
        sockets = [];
    for (var clientId in clients) sockets.push(io.sockets.connected[clientId].username);
    return sockets;
}
console.log(roomSockets(socket.room))
var usernames = roomSockets(socket.room)
    io.sockets.emit('updateusers', usernames);
  });

//use this to distinguish between catagory and lobbies
  socket.on('switchCategory', function(newCategory){
    if(newCategory == 'lobby'){
      socket.emit('updaterooms', rooms, 'lobby', newCategory);
      socket.emit('updatechat', 'SERVER', 'you have connected to lobby');

    }
    else {
    socket.category = newCategory;
    socket.emit('updaterooms', rooms, socket.room, newCategory);
  }
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    socket.leave(socket.room);

    
  });
});
};
