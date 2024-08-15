const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim();
  room = room.trim();
  if (!username || !room) {
    return {
      errorMessage: '사용자 이름과 방이 필요합니다.',
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      errorMessage: '이미 사용중인 이름입니다.',
    };
  }

  // 유저 저장
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const getUsersInRoom = (room) => {
  room = room.trim();

  return users.filter((user) => user.room === room);
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = {
  addUser,
  getUsersInRoom,
  getUser,
};
