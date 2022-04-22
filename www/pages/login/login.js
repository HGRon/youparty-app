
class Login {

  /**
   * Initializes the login screen
   */
  static initialize() {
    Login.isCreateRoom = false;

    document.getElementById('open-create-room').addEventListener('click', e => Login.openRoomDetails(e, true));
    document.getElementById('open-join-room').addEventListener('click', e => Login.openRoomDetails(e, false));
    document.getElementById('open-menu').addEventListener('click', e => Login.openMenu(e));
    document.getElementById('login-card-form').addEventListener('submit', e => Login.onSubmit(e));

    Login.changeStep('step-menu');
  }

  /**
   * Changes the current step in the login form
   * @param {string} stepId 
   */
  static changeStep(stepId) {
    document.querySelectorAll('.login-card-step').forEach(step => {
      if (step.id === stepId) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    })
  }

  /**
   * Navigates back to the menu step
   * 
   * @param {MouseEvent} event The event
   */
  static openMenu(event) {
    event.preventDefault();

    Login.changeStep('step-menu');
  }

  /**
   * Navigates to the room details step
   * 
   * @param {MouseEvent} event The event
   * @param {boolean} isCreate Whether this step is to create a room
   */
  static openRoomDetails(event, isCreate) {
    event.preventDefault();

    Login.isCreateRoom = isCreate;

    Login.changeStep('step-room-details');

    const title = isCreate ? 'Create Room' : 'Join a Room';
    const codeDisplay = isCreate ? 'none' : 'block';
    const nickname = localStorage.getItem('youparty_nickname') || '';

    document.querySelector('#step-room-details .login-card-title').innerText = title;
    document.querySelector('#step-room-details .input-code').style.display = codeDisplay;
    document.querySelector('#step-room-details .input-username').value = nickname;
  }

  /**
   * Submits the details step
   * 
   * @param {SubmitEvent} event 
   */
  static onSubmit(event) {
    event.preventDefault();

    const usernameInput = document.querySelector('.input-username');
    const codeInput = document.querySelector('.input-code');

    const username = usernameInput.value;
    const code = codeInput.value;

    if (!username) {
      usernameInput.classList.add('error');
    } else {
      usernameInput.classList.remove('error');
    }

    if (!code) {
      codeInput.classList.add('error');
    } else {
      codeInput.classList.remove('error');
    }

    if (!username) {
      return window.parent.showToast('Please, fill the username');
    }

    localStorage.setItem('youparty_nickname', username);

    if (Login.isCreateRoom) {
      return window.parent.socket.emit('create-room', username);
    }

    if (!code) {
      return window.parent.showToast('Please, fill the room code');
    }

    window.parent.socket.emit('join-room', username, code);
  }

}

Login.initialize();
