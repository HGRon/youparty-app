
class Users {

    /**
     * Initializes the user tab
     */
    static initialize() {
        Users.list = document.querySelector('.users-tab-container');

        window.parent.socket.on('room-updated', (data) => Users.updateRoom(data));

        if (window.parent.room) {
            Users.updateRoom(window.parent.room);
        }
    }

    /**
     * Updates the user list
     * @param {any} data The room details
     */
    static updateRoom(data) {
        const list = Users.list;

        // Clear all children elements
        while (list.lastChild) list.removeChild(list.lastChild);

        // Adds all connected users
        data.users.forEach(user => list.appendChild(Users.createUserContainer(user)));

        const me = data.users.find(user => user.id === window.parent.socket.id);

        console.log(me);

        if (me && me.isHost) {
            Users.list.classList.add('is-host');
        } else {
            Users.list.classList.remove('is-host');
        }
    }

    /**
     * Promotes an user into a host
     * @param {any} user The user object
     */
    static promoteUser(user) {
        window.parent.socket.emit('promote-user', user.id);
    }

    /**
     * Kicks an user from the room
     * @param {any} user The user object
     */
    static kickUser(user) {
        window.parent.socket.emit('kick-user', user.id);
    }

    /**
     * Creates a user container element
     * @param {any} user The user object
     * @returns {HTMLElement}
     */
    static createUserContainer(user) {
        const color = getUserColor(user.id);

        const container = document.createElement('div');
        container.className = 'users-tab-container-user';
        container.dataset.id = user.id;
        container.style.setProperty('--color', color);

        const name = document.createElement('div');
        name.className = 'users-tab-container-user-name';
        name.innerText = user.username;
        container.appendChild(name);

        const actions = document.createElement('div');
        actions.className = 'users-tab-container-user-actions';
        container.appendChild(actions);

        const actionHost = document.createElement('div');
        actionHost.className = 'users-tab-container-user-action-icon host';

        if (user.isHost) {
            actionHost.title = 'This user has host privileges';
            actionHost.classList.add('active');
        } else {
            actionHost.title = 'Promote this user into a host';
            actionHost.addEventListener('click', () => Users.promoteUser(user));
        }

        actions.appendChild(actionHost);

        const actionKick = document.createElement('div');
        actionKick.className = 'users-tab-container-user-action-icon kick';
        actionKick.title = 'Kick this user from the room';
        actionKick.addEventListener('click', () => Users.kickUser(user));
        actions.appendChild(actionKick);

        return container;
    }

}

Users.initialize();
