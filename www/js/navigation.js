const iframe = document.getElementById('main-frame');
const disconnectedPage = document.getElementById('disconnected-page');
const toasts = document.getElementById('toast-container');

/**
 * Loads a page
 * @param {string} pageName The page name
 */
function loadPage(pageName) {
  // Clears all handlers considered as temporary to prevent memory leaks
  if (window.socket)
    window.socket.clearTemporaryHandlers();

  // Loads the page into the iframe
  iframe.src = 'pages/' + pageName + '/' + pageName + '.html';

  iframe.style.display = 'block';
  disconnectedPage.style.display = 'none';

  window.currentPage = pageName;
}

/**
 * Shows the disconnected page
 * @param {string} title The title of the page
 * @param {string} description The description of the page
 * @param {boolean} showReconnectButton Whether to show the reconnect button
 */
function showDisconnected(title, description, showReconnectButton) {
  window.currentPage = 'disconnected';

  iframe.style.display = 'none';
  disconnectedPage.style.display = 'block';

  disconnectedPage.querySelector('h2').innerText = title;
  disconnectedPage.querySelector('p').innerText = description;
  disconnectedPage.querySelector('button').display = showReconnectButton ? 'block' : 'none';
}

/**
 * Displays a toast for a short amount of time
 * @param {string} description The toast message
 */
function showToast(description) {
  const toast = document.createElement('div');

  toast.classList.add('toast');
  toast.classList.add('visible');
  toast.innerText = description;
  
  toasts.appendChild(toast);
  console.log(description);

  // Schedule removing the toast after at least one animation frame
  // So toasts that have been added while the user is out of the tab are kept
  requestAnimationFrame(() => {
    setTimeout(() => toast.classList.remove('visible'), 5000);
    setTimeout(() => toast.remove(), 5500);
  });
}
