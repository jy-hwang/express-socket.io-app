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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector('#sidebar').innerHTML = html;
});
const messages = document.querySelector('#messages');
const messageTemplate = document.querySelector('#message-template').innerHTML;
socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
    //createdAt: message.createdAt,
  });
  messages.insertAdjacentHTML('beforeend', html);
});

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}
