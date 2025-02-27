// Create an instance of the Web Audio API's AudioContext
const audioContext = new AudioContext();

/**
 * The oscillator node that generates sound.
 * It is initially null and will be created when the oscillator starts.
 * @type {OscillatorNode | null}
 */
let oscillator = null;

/**
 * GainNode to control the volume of the oscillator.
 * Connected to the AudioContext destination (speakers).
 * @type {GainNode}
 */
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);
gainNode.gain.value = 0.5; // Default volume level (50%)

/**
 * Boolean flag to track whether the oscillator is currently playing.
 * @type {boolean}
 */
let isPlaying = false;

/**
 * Toggles the oscillator on and off when the button is clicked.
 */
const toggleOscillator = function () {
  if (isPlaying) {
    if (oscillator) {
      oscillator.stop(); // Stop the oscillator
      oscillator.disconnect(); // Disconnect it from the gain node
      oscillator = null; // Reset oscillator
    }
    isPlaying = false;
    document.getElementById("toggle").textContent = "Play"; // Update button text
  } else {
    oscillator = audioContext.createOscillator(); // Create a new oscillator
    oscillator.type = document.getElementById("waveform").value; // Set waveform type
    oscillator.frequency.value = 440; // Default frequency (A4)
    oscillator.connect(gainNode); // Connect oscillator to gain
    oscillator.start(); // Start the oscillator
    isPlaying = true;
    document.getElementById("toggle").textContent = "Stop"; // Update button text
  }
};

/**
 * Updates the gain (volume) of the oscillator when the slider is moved.
 */
const updateGain = function () {
  let sliderValue = parseFloat(document.getElementById("gain").value); // Get the slider value (in dB)
  gainNode.gain.linearRampToValueAtTime(
    dbtoa(sliderValue),
    audioContext.currentTime + 0.05
  );
};

/**
 * Updates the oscillator's waveform type when the dropdown menu is changed.
 */
const updateWaveform = function (event) {
  if (isPlaying && oscillator) {
    oscillator.type = event.target.value; // Change oscillator waveform
  }
};

/**
 * Converts a decibel (dB) value to a linear amplitude scale.
 *
 * The formula used is:
 * `amplitude = 10^(dB / 20)`
 */
const dbtoa = function (db) {
  return Math.pow(10, db / 20); // Convert dB to linear amplitude
};

// Attach event listeners to UI elements
document.getElementById("toggle").addEventListener("click", toggleOscillator);
document.getElementById("gain").addEventListener("input", updateGain);
document.getElementById("waveform").addEventListener("change", updateWaveform);
