const express = require('express');

const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const { addUser } = require('./utils/users');
const { generateMessage } = require('./utils/message');
const io = new Server(server);

io.on('connection', (socket) => {
  const socketId = socket.id.substring(0, 4);
  console.log(`${socketId} - New client connected`);

  socket.on('join', (options, callback) => {
    const socketId = socket.id.substring(0, 6);
    const { error, user } = addUser({ id: socketId, ...options });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit(
      'message',
      generateMessage('Admin', `${user.room} 방에 오신 것을 환영합니다`)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage('', `${user.username} 님이 방에 참여했습니다.`)
      );

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on('sendMessage', () => {});

  socket.on('disconnect', () => {
    console.log(`${socketId} - client Disconnected`);
  });
});

const publicDirectoryPath = path.join(__dirname, '../public/');
app.use(express.static(publicDirectoryPath));

const port = 3500;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
