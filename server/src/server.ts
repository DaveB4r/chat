import express from 'express'; // framework to build web applications
import http from 'http'; // HTTP protocol
import { Server } from 'socket.io'; // connection stablished to provide communication between channel and server
import { getUsers, userJoin, userLeave } from './utils/user'; // functions to handle users

const app = express(); //we're going to use express to initialize our app

const server = http.createServer(app); // we create us our server with the interface http

const io = new Server(server,{
  cors:{
    origin: 'http://127.0.0.1:5173' // give permissions
  }
});

io.on('connection', (socket) => { // we create the connection
  socket.join('myChat'); // create the room
  // handle connection and users
  socket.on('handle-connection', (username : string) => {
    if(!userJoin(socket.id, username)){
      socket.emit('username-taken'); // we emit the message indicating the username is already taken
    }else{
      socket.emit('username-submitted-successfully'); // the user can be used
      io.to('myChat').emit('get-connected-users', getUsers());
    }
  });
  // to handle the messages to all the user but no our user
  socket.on('message', (message: {message: string; username: string; time: string}) => {
    socket.broadcast.to('myChat').emit('receive-message', message);
  });
  // to disconnect the char
  socket.on('leaveChat', () => {
    userLeave(socket.id);
    io.to('myChat').emit('get-connected-users', getUsers());
  });
});
// we're going to listen on port 3000
server.listen(3000, () => console.log('Server on port', 3000))