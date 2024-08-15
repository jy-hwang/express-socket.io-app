const express = require('express');

const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser,
} = require('./utils/users');
const { generateMessage } = require('./utils/message');
const io = new Server(server);

io.on('connection', (socket) => {
  const socketId = socket.id.substring(0, 6);
  console.log(`${socketId} - New client connected`);

  socket.on('join', (options, callback) => {
    console.log('options', options);
    const { error, user } = addUser({ id: socketId, ...options });
    if (error) {
      return callback(error);
    }

    console.log('user : ', user);

    socket.join(user.room);

    socket.emit(
      'message',
      generateMessage('Admin', `${user.room} 방에 오신 것을 환영합니다`)
    );

    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage('Admin', `${user.username} 님이 방에 참여했습니다.`)
      );

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socketId);
    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  socket.on('disconnect', () => {
    console.log(`${socketId} - client Disconnected`);
    const user = removeUser(socketId);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage('Admin', `${user.username} 님이 방을 나갔습니다.`)
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const publicDirectoryPath = path.join(__dirname, '../public/');
app.use(express.static(publicDirectoryPath));

const port = 3500;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
