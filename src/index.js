const express = require('express');

const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
  const socketId = socket.id.substring(0, 4);
  console.log(`${socketId} - New client connected`);

  socket.on('join', () => {});

  socket.on('message', () => {});

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
