
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let youtubeReadyCallback = [];
let youtubeIsReady = false;

/**
 * This function is called by the YouTube Iframe API when it is ready
 */
function onYouTubeIframeAPIReady() {
  youtubeIsReady = true;

  while (youtubeReadyCallback.length > 0) {
    youtubeReadyCallback.shift()();
  }
}

/**
 * Adds an event listener that will be called when the YouTube Iframe API is ready
 * 
 * @param {Function} onReady 
 */
function addYouTubeReadyListener(onReady) {
  if (youtubeIsReady) {
    return onReady();
  }

  youtubeReadyCallback.push(onReady);
}

/**
 * Represents a youtube player with special synchronization
 * 
 * https://developers.google.com/youtube/iframe_api_reference
 */
class Player {

  /**
   * Constructs a new player instance
   * 
   * @param {string} elemId The element ID to create the player
   */
  constructor(elemId) {
    this._elementId = elemId;
    this._bufferMilliseconds = 5000; // The minimum time to wait to buffer in milliseconds

    this._syncTimeout = undefined; // The synchronization timeout reference
    this._startTime = 0; // The start unix timestamp of the current video
    this._videoId = undefined; // The current video identification

    this._isPaused = false; // Whether the player is paused
    this._isRemotePaused = false; // Whether the player is paused by the server
    this._inInitialSync = false; // Whether the player is syncing for the first time after loading a video
  }

  /**
   * Calculates the time in milliseconds to pause to buffer
   * 
   * @param {number} expectedTime 
   * @param {boolean} isVideoLoaded
   * @returns {number} The number of milliseconds required to buffer
   */
  _getTimeToBuffer(expectedTime, isVideoLoaded) {
    // Calculates the buffered time in milliseconds
    const bufferedTime = isVideoLoaded ? this.player.getVideoLoadedFraction() * this.player.getDuration() * 1000 : 0;

    // Calculates the number of milliseconds to pause to buffer
    let timeToBuffer = bufferedTime > expectedTime + 1000 ? 100 : this._bufferMilliseconds;

    // In case the expected time is negative (the playback should start in the future)
    // We'll extend the time to buffer
    if (expectedTime < 0 && timeToBuffer < -expectedTime) {
      timeToBuffer = -expectedTime;
    }

    return timeToBuffer;
  }

  /**
   * Resynchronizes the player if needed
   * 
   * @param thresholdMs {number} The threshold in milliseconds of difference needed between the actual and expected time
   */
   _resynchronize(thresholdMs) {
    // Prevent resynchronizing if the initial sync is ongoing
    if (this._inInitialSync) {
      return;
    }

    // Prevent resynchronizing if the video is paused remotely
    if (this._isRemotePaused) {
      return;
    }

    // Calculates the expected and current time in milliseconds
    const expectedTime = Date.now() - this._startTime;
    const actualTime = this.player.getCurrentTime() * 1000;

    // Checks if there is no time difference
    if (expectedTime < actualTime + thresholdMs && expectedTime > actualTime - thresholdMs) {
      return;
    }

    const timeToBuffer = this._getTimeToBuffer(expectedTime, true);

    console.log('Syncing video. Expected time:', expectedTime,
      'Actual time:', actualTime,
      'Time diff:', expectedTime - actualTime,
      'Milliseconds to buffer:', timeToBuffer);

    // Calculates the time in seconds to seek
    const playSeconds = (expectedTime + timeToBuffer) / 1000.0;

    // Calculates the unix epoch to play
    const playTime = Date.now() + timeToBuffer;

    this._synchronize(playSeconds, playTime);
  }

  /**
   * Seeks and buffers a video to a specific position and starts playing it in a timestamp
   * 
   * @param {number} startPosition The start position in seconds
   * @param {number} startTimestamp The start timestamp unix epoch
   */
  _synchronize(startPosition, startTimestamp) {
    // Inicia o vídeo e dá pause na posição
    this._isPaused = true;
    this.player.pauseVideo();
    this.player.seekTo(startPosition);

    this._scheduleSync(startTimestamp, () => {
      this._isPaused = false;
      this._inInitialSync = false;

      if (!this._isRemotePaused) {
        this.player.playVideo();
      }
    });
  }

  /**
   * Schedules a synchronization task based on the start timestamp.
   * 
   * @param {number} startTime The timestamp unix epoch
   * @param {Function} onPlay The function that will be called when the time is reached
   */
  _scheduleSync(startTime, onPlay) {
    // In case there is already a schedule sync, we'll stop it
    this._unscheduleSync();

    // The remaining time to start the video from now
    const timeout = startTime - Date.now();

    // If the time is up, we'll start the video immediately
    if (timeout <= 0) {
      return onPlay();
    }

    // We'll schedule a timeout to start the video on the correct time
    this._syncTimeout = setTimeout(() => {
      onPlay();
      this._syncTimeout = undefined;
    }, timeout);
  }

  /**
   * Stops the currently scheduled synchronization task if there is one
   */
  _unscheduleSync() {
    if (this._syncTimeout) {
      clearTimeout(this._syncTimeout);
      this._syncTimeout = undefined;
    }
  }

  /**
   * Loads a YouTube video
   * 
   * @param {string} videoId The YouTube video ID
   * @param {number} startSeconds The position of the video in seconds to start playing from
   * @param {Function} onReady The callback that will be called when the player is ready
   */
  _loadVideo(videoId, startSeconds, onReady) {
    const previousVideoId = this._videoId;

    if (this.player) {

      // The player is already initialized, we'll load a new video directly
      if (previousVideoId !== videoId) {
        this.player.loadVideoById(videoId, startSeconds);
      }
      this._videoId = videoId;
      onReady();
      
    } else {

      // The player has not been initialized yet, we'll create a new instance
      addYouTubeReadyListener(() => {
        this._videoId = videoId;

        this.player = new YT.Player(this._elementId, {
          height: "360",
          width: "640",
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            start: startSeconds,
            // controls: 0,
          },
          events: {
            onReady: onReady,
            onStateChange: (event) => this._onStateChange(event),
            onPlaybackRateChange: (event) => this._onPlaybackRateChange(event),
          },
        });
      });

    }
  }

  /**
   * Loads, buffers and starts playing a video based on the start timestamp
   * 
   * @param {string} videoId The YouTube video identification
   * @param {number} startTime The unix epoch timestamp to start the video
   * @param {number} startPosition The initial video position in milliseconds
   * @param {boolean} isPaused Whether the video is paused
   */
  play(videoId, startTime, startPosition, isPaused) {
    const startTimestamp = startTime - startPosition;

    // O número de segundos para inciar o vídeo
    // O tempo em unix para iniciar o vídeo
    let playSeconds, playTime;
    
    if (!isPaused) {
      const timeToBuffer = this._getTimeToBuffer(Date.now() - startTimestamp, this._videoId === videoId);

      playTime = Date.now() + timeToBuffer;
      playSeconds = (playTime - startTimestamp) / 1000.0;
    } else {
      playTime = startTime;
      playSeconds = startPosition / 1000.0;
    }

    this._startTime = startTimestamp;
    this._isPaused = isPaused;
    this._isRemotePaused = isPaused;
    this._inInitialSync = true;

    this._loadVideo(videoId, playSeconds, () => this._synchronize(playSeconds, playTime));
  }

  /**
   * Retrieves the current player volume
   * @returns {number} The volume percentage, ranging from 0.0 to 1.0
   */
  getVolume() {
    if (!this.player || this.player.isMuted())
      return 0;
    
    return this.player.getVolume() / 100.0;
  }

  /**
   * Updates the player volume
   * @param {number} volume The volume percentage, ranging from 0.0 to 1.0
   */
  setVolume(volume) {
    this.player.setVolume(volume * 100);

    if (volume > 0) {
      this.player.unMute();
    }
  }

  /**
   * Retrieves the video position in milliseconds
   * @returns {number} The position in milliseconds
   */
  getPosition() {
    if (!this.player)
      return 0;

    return this.player.getCurrentTime() * 1000;
  }

  /**
   * Pauses the video, setting the position that is has been paused
   * 
   * @param {number} pausedPosition The video position in milliseconds
   */
  pause(pausedPosition) {
    this._unscheduleSync();

    this._isPaused = true;
    this._isRemotePaused = true;
    this.player.pauseVideo();
    this.player.seekTo(pausedPosition / 1000.0);
  }

  /**
   * Stops the video
   */
  stop() {
    this._unscheduleSync();

    if (this.player) {
      this._isPaused = true;
      this._isRemotePaused = true;
      this.player.stopVideo();
    }
  }

  /**
   * Destroys the player
   */
  destroy() {
    this._unscheduleSync();

    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
  }

  /**
   * Handles the state change event
   * 
   * @param {any} event The event data
   */
  _onStateChange(event) {
    const state = event.data;
    // -1: not started
    // 0: ended
    // 1: playing
    // 2: paused
    // 3: buffering
    // 5: video cued

    console.log('Video State', state);

    const isPaused = this._isPaused || this._isRemotePaused;

    if (state === 2 && !isPaused) { // Paused
      // Forces it to keep playing if the pause action was not intended
      this.player.playVideo();
      this._resynchronize(100);
    }

    if (state === 1 && isPaused) {
      // Forces it to keep paused if the play action was not intended
      this.player.pauseVideo();
    }
    
    if (state === 0) { // Ended
      // Stops the video when it ends
      this.stop();
    }

    if (state === 3) { // Buffering
      this._resynchronize(500); // TODO check whether this can cause issues for slow internet connections
    }
  }

  /**
   * Handles the playback rate change event
   * 
   * @param {any} event The event data
   */
  _onPlaybackRateChange(event) {
    // In case the playback rate is changed to any speed that is not 100%, we'll update it back.
    if (event.data !== 1) {
      this.player.setPlaybackRate(1);
    }
  }

}
