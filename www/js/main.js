// Connects to the websocket server
window.socket = new SocketConnection();

// Loads the initial login page
loadPage('login');

/**
 * Triggered when the server has an error response
 */
window.socket.on('error', (error) => showToast(error), true);

/**
 * Triggered when the user has joined a room
 */
window.socket.on('room-joined', (data) => {
  console.log('Joined room', data.code);
  console.log(data.users);

  window.room = data;

  const user = data.users.find(user => user.id === window.socket.id);

  if (user) {
    showToast('Joined as ' + user.username);
  }

  loadPage('home');
}, true);

/**
 * Triggered when the room info has been updated
 */
window.socket.on('room-updated', (data) => {
  console.log('Room updated', data.code);
  console.log(data);

  const previousData = window.room;

  if (previousData) {
    const oldUsers = previousData.users.filter(u1 => !data.users.find(u2 => u1.id === u2.id));
    const newUsers = data.users.filter(u1 => !previousData.users.find(u2 => u1.id === u2.id));

    oldUsers.forEach(user => showToast(user.username + ' has left the party'));
    newUsers.forEach(user => showToast(user.username + ' has joined the party'));
  }

  window.room = data;
}, true);

/**
 * Triggered when the user has left the room
 */
window.socket.on('room-left', () => {
  console.log('Left the room');

  loadPage('login');

  window.room = undefined;
  window.video = undefined;
}, true);

/**
 * Triggered when a video should start playing
 */
window.socket.on('video-play', (data) => {
  console.log('Video play', data.videoId);
  console.log(data);

  const previousVideo = window.video;

  if (!previousVideo || previousVideo.videoId !== data.videoId) {
    showToast('Now playing ' + data.info.title);
  }

  window.video = data;
}, true);

/**
 * Triggered when the video is paused
 */
window.socket.on('video-pause', (data) => {
  window.video = data;
}, true);

/**
 * Triggered when the video is stopped
 */
window.socket.on('video-stop', () => {
  window.video = undefined;
}, true);

/**
 * Triggered when the connection is estabilished, either for the first time or a reconnection
 */
window.socket.on('connect', () => {
  if (window.currentPage !== 'login') {
    loadPage('login');
  }

  window.room = undefined;
  window.video = undefined;
}, true);

/**
 * Triggered when the user has been disconnected
 */
window.socket.on('disconnect', (reason) => {
  console.log('Disconnected', reason);
  
  if (reason === 'io server disconnect' || reason === 'io client disconnect') {
    showToast('Disconnected');
    showDisconnected("Disconnected", "You've been disconnected from the server.", true);
  } else {
    showToast('Connection Lost');
    showDisconnected("Connection Lost", "The connection to the server has been lost.", false);
  }

  window.room = undefined;
  window.video = undefined;
}, true);

/**
 * Triggered when a connection error occurs
 */
window.socket.on('connect_error', () => {
  if (window.currentPage !== 'disconnected') {
    showToast('Connection Error');
    showDisconnected("Connection Error", "Failed to connect to the server.", false);
  }

  window.room = undefined;
  window.video = undefined;
}, true);
