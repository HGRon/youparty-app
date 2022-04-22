class Home {

    /**
     * Initializes the home screen
     */
    static initialize() {
        // Initialize the player
        Home.player = new Player('video-player');
        Home.isToggleActive = true;

        // Initialize the tabs system
        Home.tabs = document.querySelectorAll('.side-tab');

        // Event listeners
        window.parent.socket.on('room-updated', Home.updateRoom);
        window.parent.socket.on('video-play', Home.playVideo);
        window.parent.socket.on('video-pause', Home.pauseVideo);
        window.parent.socket.on('video-stop', Home.stopVideo);

        // Event to copy room code to the clipboard
        document.querySelector('.floating-code').addEventListener('click', Home.copyRoomCode);

        // Event to navigate between tabs
        const btns = document.querySelectorAll('.video-chat-button');
        btns.forEach(btn => btn.addEventListener('click', () => Home.showSelectedTab(btn, btns)));

        // Event to close and open video chat
        document.querySelector('.video-chat-toggle').addEventListener('click', () => Home.setToggleActive(!Home.isToggleActive));

        // Event to leave the room
        document.querySelector('.quit').addEventListener('click', Home.leaveRoom);

        // Updates the room details based on existing data
        Home.updateRoom(window.parent.room);

        if (window.parent.video) {
            // If there is a video already playing, start with the chat tab
            Home.showSelectedTab(btns[0], btns);
        } else {
            // If there's nothing being played, start with the video tab
            Home.showSelectedTab(btns[1], btns);
        }

        // Plays the currently playing video of the room
        if (window.parent.video) {
            Home.playVideo(window.parent.video);
        }
    }

    /**
     * Called when change tab between video and chat
     * @param {HTMLElement} button The tab button element clicked
     * @param {HTMLElement[]} btns The tab buttons elements list
     */
    static showSelectedTab(button, btns) {
        const className = button.dataset.target;

        btns.forEach(btn => {
            btn.classList.remove('tab-active');
        })

        button.classList.add('tab-active');

        Home.tabs.forEach(tab => {
            if (tab.classList.contains(className)) {
                tab.classList.remove('hide-tab');
            } else {
                tab.classList.add('hide-tab');
            }
        });
    }

    /**
     * Called when the room details are updated
     * @param {any} data The room data
     */
    static updateRoom(data) {
        document.querySelector('.room-code').innerText = data.code;
    }

    /**
     * Called when the video changes
     * @param {any} data
     */
    static playVideo(data) {
        Home.player.play(data.videoId, data.startTime, data.startPosition, data.isPaused);
    }

    /**
     * Called when the video is paused
     * @param {any} data
     */
    static pauseVideo(data) {
        Home.player.pause(data.startPosition);
    }

    /**
     * Called when the video is stopped
     */
    static stopVideo() {
        Home.player.stop();
    }
    
    /**
     * Copy the room code to the clipboard
     */
    static copyRoomCode() {
        navigator.clipboard.writeText(window.parent.room.code)
            .then(() => window.parent.showToast('The room code was copied to the clipboard'));
    }

    /**
     * Change the video chat state
     */
    static setToggleActive(isToggleActive) {
        Home.isToggleActive = isToggleActive;
        
        const videoPlayer = document.getElementById('video-player');
        const videoChatContent = document.getElementById('video-chat');
        const toggleContent = document.getElementById('toggle');

        if (!isToggleActive) {
            videoChatContent.classList.add('hidden-chat');
            videoPlayer.classList.add('extend-video-player');
            toggleContent.classList.add('invert-arrow');
            return;
        }
    
        videoChatContent.classList.remove('hidden-chat');
        videoPlayer.classList.remove('extend-video-player')
        toggleContent.classList.remove('invert-arrow');
    }

    /**
     * Leaves the current room
     */
    static leaveRoom() {
        window.parent.socket.emit('leave-room');
    }

    /**
     * Checks whether the user is in fullscreen
     * @returns {boolean}
     */
    static isFullscreen() {
        return document.fullscreenElement === document.body;
    }

    /**
     * Updates the fullscreen state
     * 
     * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
     * 
     * @param {boolean} isFullscreen 
     * @returns {Promise}
     */
    static setFullscreen(isFullscreen) {
        if (isFullscreen) {
            Home.setToggleActive(false);
            return document.body.requestFullscreen();
        } else {
            Home.setToggleActive(true);
            return document.exitFullscreen();
        }
    }
    
 }

Home.initialize();
