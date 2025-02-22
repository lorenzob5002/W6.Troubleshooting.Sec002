// Create an instance of the Web Audio API's AudioContext
const audioContext = new AudioContext();

/**
 * The oscillator node that generates sound.
 * It is initially undefined and will be created when the oscillator starts.
 * @type {OscillatorNode | undefined}
 */
let oscillator;

/**
 * GainNode to control the volume of the oscillator.
 * Connected to the AudioContext destination (speakers).
 * @type {GainNode}
 */
const gainNode = audioContext.createGain();
gainNode.connect();
gainNode.gain.value = 0.0; // Default volume level (50%)

/**
 * Boolean flag to track whether the oscillator is currently playing.
 * @type {boolean}
 */
let isPlaying = false;

/**
 * Toggles the oscillator on and off when the button is clicked.
 * If the oscillator is playing, it stops and disconnects.
 * If it is not playing, it creates a new oscillator, connects it, and starts it.
 */
const toggleOscillator = function() {
    if (isPlaying) {
        oscillator.stop(); // Stop the oscillator
        oscillator.disconnect(); // Disconnect it from the gain node
        isPlaying = false;
        document.getElementById("toggle").textContent = "Play"; // Update button text
    } else {
        oscillator = audioContext.createOscillator(); // Create a new oscillator
        oscillator.type = document.getElementById("waveform").value; // Set waveform type
        oscillator.frequency.value = 440; // Default frequency (A4)
        oscillator.connect(gainNode); // Connect oscillator to gain
        oscillator.start; // Start the oscillator
        isPlaying = true;
        document.getElementById("toggle").textContent = "Stop"; // Update button text
    }
};

/**
 * Updates the gain (volume) of the oscillator when the slider is moved.
 * The slider value, which is in decibels (dB), is converted to a linear amplitude scale
 * using the `dbtoa` function before being applied to the gain node.
 *
 * To avoid abrupt volume changes, the gain value is updated using `linearRampToValueAtTime`,
 * ensuring a smooth transition over 50 milliseconds.
 *
 * @param {Event} event - The input event triggered by the gain slider.
 */
const updateGain = function(event) {
    let sliderValue = document.getElementById("gain").value; // Get the slider value (in dB)
    sliderValue = parseFloat(sliderValue); // Convert string input to a number
    gainNode.gain.linearRampToValueAtTime(dbtoa(sliderValue), audioContext.currentTime + 0.05);
    // Convert dB to amplitude and smoothly update gain over 50ms
};


/**
 * Updates the oscillator's waveform type when the dropdown menu is changed.
 * The waveform type only updates if the oscillator is currently playing.
 * @param {Event} event - The change event from the waveform dropdown.
 */
const updateWaveform = function(event) {
    if (isPlaying) {
        oscillator.type = event.target.value; // Change oscillator waveform
    }
};

/**
 * Converts a decibel (dB) value to a linear amplitude scale.
 *
 * The formula used is:
 * `amplitude = 10^(dB / 20)`
 *
 * @param {number} db - The decibel value to convert.
 * @returns {number} - The corresponding amplitude value in linear scale.
 */
const dbtoa = function(db) {
    return Math.pow(10, db / 20); // Convert dB to linear amplitude
};

// Attach event listeners to UI elements
document.getElementById("toggle").addEventListener("click", toggleOscillator);
document.getElementById("gain").addEventListener("input", updateGain);
document.getElementById("waveform").addEventListener("change", updateWaveform);
