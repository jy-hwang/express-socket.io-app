const socket = io();

const query = new URLSearchParams(location.search);
// '?username=Jackie&room=secretRoom'

const username = query.get('username');

const room = query.get('room');

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
