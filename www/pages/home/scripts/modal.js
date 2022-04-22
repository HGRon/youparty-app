
class SearchModal {

  /**
   * Initializes the modal component
   */
  static initialize() {
    const modal = document.querySelector('#add-video-modal');
    
    SearchModal.modal = modal;
    SearchModal.list = modal.querySelector('.modal-video-list');

    // Event triggered when the user clicks the add video button
    document.querySelector('.video-tab-button').addEventListener('click', () => SearchModal.setVisible(true));
    
    // Event triggered when the user clicks the close button
    modal.querySelector('.close-modal').addEventListener('click', () => SearchModal.setVisible(false));

    // Event triggered when the user pressed submit on the search form
    modal.querySelector('.modal-search').addEventListener('submit', (e) => SearchModal.onSearch(e));

    // Event triggered when the search results are updated
    window.parent.socket.on('search-results', (results) => SearchModal.updateVideos(results));
  }

  /**
   * Change modal states
   * @param {boolean} isVisible Whether the modal should be visible
   */
  static setVisible(isVisible) {
    if (isVisible) {
      SearchModal.modal.classList.remove('d-none');
    } else {
      SearchModal.modal.classList.add('d-none');
    }
  }

  /**
   * Updates the video list from the search results
   * @param {any[]} results The video list
   */
  static updateVideos(results) {
    const list = SearchModal.list;

    // Clear all children elements
    while (list.lastChild) list.removeChild(list.lastChild);

    results.forEach(result => {
      list.appendChild(SearchModal.createVideoCard(result));
    });

    list.classList.remove('loading');
  }

  /**
   * Creates a video card element
   * @param {any} video The video item
   * @returns {HTMLElement}
   */
  static createVideoCard(video) {
    const card = document.createElement('a');
    card.href = `https://youtu.be/${video.id}`;
    card.className = 'video-item-card';

    card.addEventListener('click', (event) => {
      event.preventDefault();

      window.parent.socket.emit('play-video', video.id);

      SearchModal.setVisible(false);
    });

    const image = document.createElement('div');
    image.className = 'video-item-card-image';
    image.style.backgroundImage = `url('${video.thumbnail.url}')`;
    card.appendChild(image);

    const timestamp = document.createElement('div');
    timestamp.className = 'video-item-card-time';
    timestamp.innerText = formatDuration(video.duration);
    image.appendChild(timestamp);

    const title = document.createElement('div');
    title.className = 'video-item-card-title';
    title.innerText = video.title;
    card.appendChild(title);

    return card;
  }

  /**
   * Triggered when the user searches
   * @param {FormEvent} event The form event
   */
  static onSearch(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const query = form.get('query') || '';

    if (isVideoUrl(query)) {
      window.parent.socket.emit('play-video', query);
      SearchModal.setVisible(false);
      return;
    }

    SearchModal.list.classList.add('loading');

    // Searches
    window.parent.socket.emit('search-videos', query);
  }

}

SearchModal.initialize();