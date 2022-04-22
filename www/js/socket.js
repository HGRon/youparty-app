
class SocketConnection {

  constructor() {
    this.socket = io('https://youparty-dev.herokuapp.com');
    this.tempHandlers = [];
  }
  
  /**
   * Gets the connection id
   */
  get id() {
    return this.socket.id;
  }

  /**
   * Adds an event handler to the socket
   * 
   * @param {string} event The event to listen to
   * @param {Function} handler The function that will process the event
   * @param {boolean | undefined} persistent Whether this event handler should remain active through pages
   */
  on(event, handler, persistent) {
    this.socket.on(event, handler);

    if (!persistent) {
      this.tempHandlers.push({ event, handler });
    }
  }

  /**
   * Removes all non-persistent event handlers
   */
  clearTemporaryHandlers() {
    while (this.tempHandlers.length) {
      const data = this.tempHandlers.shift();
      this.socket.off(data.event, data.handler);
    }
  }

  /**
   * Emits an event to the server
   * @param {string} event 
   * @param  {...any} data 
   */
  emit(event, ...data) {
    this.socket.emit(event, ...data);
  }

}
