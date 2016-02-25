//socket io stuff
module.exports = function(io){

var usernames = {};

var permanentLog = [];

var tempLog = [];

var rooms = [

{'lobby':['lobby']},
{'math': ['math1','math2','math3','math4']}, 
{'history': ['history1','history2','history3','history4']},
{'science': ['science1','science2','science3','science4']}, 
{'programming': ['programming1','programming2','programming3','programming4']}

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
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    var key = socket.username;
    var obj = {}
    obj[key] = data;
    tempLog.push(obj);
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
    // Not sure, need to fix how users update in UI.
    //io.sockets.emit('updateusers', usernames);
  });


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
     // When the chatroom is empty'd, take the temporary log and push it to console for now.
    // Later this will push to db.
    if(Object.keys(usernames).length === 0) {
        permanentLog.push(tempLog);
        //console.log(permanentLog)
          };
  });
});
};

