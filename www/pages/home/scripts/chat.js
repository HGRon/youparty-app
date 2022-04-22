const chatContent = document.getElementById('chat-tab-content');

class Chat {

    /**
     * Initializes the chat component
     */
    static initialize() {
        window.parent.socket.on('chat-message', (data) => {
            Chat.addMessage(data.id, data.username, data.message, data.id === window.parent.socket.id);
        });

        document.querySelector('.chat-tab-input').addEventListener('submit', (e) => {
            e.preventDefault();

            const data = new FormData(e.target);
            const message = data.get('message');

            Chat.sendMessage(message);

            e.target.reset();
        });
    }

    /**
     * Adds an chat message to the chat ui
     * @param {string} authorId
     * @param {string} author 
     * @param {string} message 
     * @param {boolean} authorIsMe 
     */
    static addMessage(authorId, author, message, authorIsMe) {
        const color = getUserColor(authorId);

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.style.setProperty('--color', color);

        if (authorIsMe)
            messageDiv.classList.add('message-me');

        // Message author
        const messageAuthorHeading = document.createElement('h4');
        messageAuthorHeading.innerText = author;
        messageDiv.appendChild(messageAuthorHeading);

        // Message content
        const messageContent = document.createTextNode(message);
        messageDiv.appendChild(messageContent);

        const chatHeight = chatContent.scrollHeight - chatContent.clientHeight;
    
        chatContent.appendChild(messageDiv);

        if (chatContent.scrollTop > chatHeight - 50)
            chatContent.scrollBy({ behavior: 'smooth', top: chatContent.scrollHeight - chatContent.clientHeight });
    }

    /**
     * Sends a chat message
     * @param {string} message The message
     */
    static sendMessage(message) {
        console.log(message);
        message = message.trim();

        if (!message) {
            return;
        }

        if (message.startsWith('/')) {
            return this.processCommand(message);
        }

        window.parent.socket.emit('send-message', message);
    }

    /**
     * Processes chat commands
     * @param {string} command The command
     */
    static processCommand(command) {
        const paramsIndex = command.indexOf(' ');
        let label, params;

        if (paramsIndex > 0) {
            label = command.substring(0, paramsIndex);
            params = command.substring(paramsIndex + 1);
        } else {
            label = command;
        }

		if (label === '/play' || label === '/p' || label === '/add') {
			if (params) {
                return window.parent.socket.emit('play-video', params);
			} else if (window.parent.video) {
                return window.parent.socket.emit('resume-video');
			} else {
                return window.parent.showToast('Usage: /play [video url]');
            }
		}

		if (label === '/pause') {
			return window.parent.socket.emit('pause-video');
		}

		if (label === '/resume') {
			return window.parent.socket.emit('resume-video');
		}

        if (label === '/volume') {
            if (params) {
                return Home.player.setVolume(parseFloat(params) / 100.0);
			} else {
                return window.parent.showToast('Usage: /volume <percentage>');
            }
        }

        if (label === '/fullscreen') {
            return Home.setFullscreen(!Home.isFullscreen());
        }

		if (label === '/skip' || label === '/next') {
			return window.parent.socket.emit('skip-video');
		}

        if (label === '/seek') {
            if (!params) {
                return window.parent.showToast('Usage: /seek <timestamp>');
            }

            let position;

            if (params.startsWith('+')) {
                position = Home.player.getPosition() + parseDuration(params.substring(1)) * 1000;
            } else if (params.startsWith('-')) {
                position = Home.player.getPosition() - parseDuration(params.substring(1)) * 1000;
            } else {
                position = parseDuration(params) * 1000;
            }

            if (!isNaN(position)) {
                return window.parent.socket.emit('seek-video', Math.max(position, 0));
            } else {
                return window.parent.showToast('Invalid timestamp. Please format it as 00:00:00');
            }
        }

        if (label === '/kick') {
            if (!params) {
                return showToast('Usage: /kick <username>');
            }

            const user = this.findUserByUsername(params);

            if (user) {
                return window.parent.socket.emit('kick-user', user.id);
            } else {
                return window.parent.showToast('User ' + params + ' was not found.');
            }
		}

        if (label === '/promote') {
            if (!params) {
                showToast('Usage: /promote <username>');
                return;
            }

            const user = this.findUserByUsername(params);

            if (user) {
                return window.parent.socket.emit('promote-user', user.id);
            } else {
                return window.parent.showToast('User ' + params + ' was not found.');
            }
		}

        window.parent.showToast('Unknown command');
    }

    /**
     * Gets an user by username
     * @param {string} username The username 
     * @returns {any}
     */
    static findUserByUsername(username) {
        if (!window.parent.room) {
            return undefined;
        }

        username = username.toLowerCase();

        return window.parent.room.users.find(user => user.username.toLowerCase() === username);
    }

}

Chat.initialize();