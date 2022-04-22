class Queue {
  static initialize() {
    document.querySelector('#ctrl-minus15').addEventListener('click', () => {
      window.parent.socket.emit('seek-video', Math.max(Home.player.getPosition() - 15000, 0));
    });
    document.querySelector('#ctrl-pause').addEventListener('click', () => {
      window.parent.socket.emit('pause-video');
    });
    document.querySelector('#ctrl-resume').addEventListener('click', () => {
      window.parent.socket.emit('resume-video');
    });
    document.querySelector('#ctrl-plus15').addEventListener('click', () => {
      window.parent.socket.emit('seek-video', Home.player.getPosition() + 15000);
    });
    document.querySelector('#ctrl-skip').addEventListener('click', () => {
      window.parent.socket.emit('skip-video'); 
    });

    Queue.list = document.querySelector('.video-tab-content');
    window.parent.socket.on('room-updated', (data) => Queue.updateQueue(data, window.parent.video));
    window.parent.socket.on('video-play', (video) => Queue.updateQueue(window.parent.room, video));

    if (window.parent.room) {
      Queue.updateQueue(window.parent.room, window.parent.video);
    }
  }

  /**
   * Method to update queue
   *
   * @param roomData Room Information
   */
  static updateQueue(roomData, currentVideo) {
    const me = roomData.users.find(user => user.id === window.parent.socket.id);
    document.querySelector('.video-tab-controls').style.display = me && me.isHost ? 'flex' : 'none';

    const list = Queue.list;
    
    // Clear all children elements
    while (list.lastChild) list.removeChild(list.lastChild);

    // Add currentVideo in playlist element
    if (currentVideo) {
      list.appendChild(this.createVideoMessage(currentVideo, true));
    }

    roomData.playlist.forEach(item => {
      list.appendChild(this.createVideoMessage(item, false));
    });
  }

  /**
   * Method to create a video message component
   *
   * @param item the video information
   * @param isCurrentVideo whether if is the current video
   */
  static createVideoMessage(item, isCurrentVideo) {
    const videoMessage = document.createElement('div');
    videoMessage.className = 'video-message';

    if (isCurrentVideo) {
      videoMessage.classList += ' video-message-selected';
    }

    const title = document.createElement('p');
    title.innerText = item.info.title;
    videoMessage.appendChild(title);

    const url = document.createElement('span');
    url.innerText = `https://https://youtube.com/watch?v=${item.info.id}`;
    videoMessage.appendChild(url);

    const duration = document.createElement('p');
    duration.className = 'video-message-duration';
    duration.innerText = formatDuration(item.info.duration);
    videoMessage.appendChild(duration);

    const image = document.createElement('img');
    image.className = 'video-message-image';
    image.src = item.info.thumbnail.url;
    videoMessage.appendChild(image)
    return videoMessage;
  }
}

Queue.initialize();
