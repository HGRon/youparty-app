
/**
 * Calculates the color from a connection id
 * @param {string} userId The connection identification 
 * @returns {string} The css HSL color
 */
function getUserColor(userId) {
    let num = 0;

    for(let i = 0; i < userId.length; i++)
        num += userId.charCodeAt(i) * i;

    return `hsl(${num % 360}, 68%, 54%)`;
}

/**
 * Parses a duration in the format of 00:00:00 or 00:00 or 00 into seconds
 * @param {string} str The formatted duration
 * @returns {number} The duration in seconds
 */
function parseDuration(str) {
    const durationRegex = /^(?:(?:(\d+):)?(\d+):)?(\d+)$/m;

    const match = durationRegex.exec(str);

    if (!match) return undefined;

    const nums = match.map(n => n ? parseInt(n) : 0);

    return nums[1] * 3600 + nums[2] * 60 + nums[3];
}

/**
 * Formats a duration in seconds to 00:00:00 or 00:00
 * @param {number} duration The duration in seconds
 * @returns {string} The formatted duration
 */
function formatDuration(duration) {
    const hh = parseInt(duration / 3600);
    const mm = parseInt(duration / 60) % 60;
    const ss = parseInt(duration) % 60;

    let output = '';

    if (hh >= 1)
        output += hh.toFixed(0).padStart(2, '0') + ':';

    output += mm.toFixed(0).padStart(2, '0') + ':';
    output += ss.toFixed(0).padStart(2, '0');

    return output;
}

/**
 * Checks whether the string is a YouTube URL
 * 
 * @param {string} url 
 * @returns {boolean} Whether the string is a video URL
 */
 function isVideoUrl(url) {
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-z-A-Z0-9-_]+)/;

    return urlRegex.test(url);
}
