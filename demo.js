/* global $, Gauge */
$(document).ready(function () {
	'use strict';

	var baseFreq = 440;
	var currentNoteIndex = 57; // A4
	var isRefSoundPlaying = false;
	var isMicrophoneInUse = false;
	var frameId,
		freqTable,
		gauge,
		micStream,
		notesArray,
		audioContext,
		sourceAudioNode,
		analyserAudioNode;
	var	pitches = {
			'A0'  : 27.5000,
			'A#0' : 29.1352,
			'Bb0' : 29.1352,
			'B0'  : 30.8677,
			'B#0'  : 32.7032,
			'Cb1'  : 30.8677,
			'C1'  : 32.7032,
			'C#1' : 34.6478,
			'Db1' : 34.6478,
			'D1'  : 36.7081,
			'D#1' : 38.8909,
			'Eb1' : 38.8909,
			'E1'  : 41.2034,
			'Fb1'  : 41.2034,
			'E#1'  : 43.6535,
			'F1'  : 43.6535,
			'F#1' : 46.2493,
			'Gb1' : 46.2493,
			'G1'  : 48.9994,
			'G#1' : 51.9131,
			'Ab1' : 51.9131,
			'A1'  : 55.0000,
			'A#1' : 58.2705,
			'Bb1' : 58.2705,
			'B1'  : 61.7354,
			'Cb2'  : 61.7354,
			'B#1'  : 65.4064,
			'C2'  : 65.4064,
			'C#2' : 69.2957,
			'Db2' : 69.2957,
			'D2'  : 73.4162,
			'D#2' : 77.7817,
			'Eb2' : 77.7817,
			'E2'  : 82.4069,
			'Fb2'  : 82.4069,
			'E#2'  : 87.3071,
			'F2'  : 87.3071,
			'F#2' : 92.4986,
			'Gb2' : 92.4986,
			'G2'  : 97.9989,
			'G#2' : 103.826,
			'Ab2' : 103.826,
			'A2'  : 110.000,
			'A#2' : 116.541,
			'Bb2' : 116.541,
			'B2'  : 123.471,
			'Cb3'  : 123.471,
			'B#2'  : 130.813,
			'C3'  : 130.813,
			'C#3' : 138.591,
			'Db3' : 138.591,
			'D3'  : 146.832,
			'D#3' : 155.563,
			'Eb3' : 155.563,
			'E3'  : 164.814,
			'Fb3'  : 164.814,
			'E#3'  : 174.614,
			'F3'  : 174.614,
			'F#3' : 184.997,
			'Gb3' : 184.997,
			'G3'  : 195.998,
			'G#3' : 207.652,
			'Ab3' : 207.652,
			'A3'  : 220.000,
			'A#3' : 233.082,
			'Bb3' : 233.082,
			'B3'  : 246.942,
			'Cb4'  : 246.942,
			'B#3'  : 261.626,
			'C4'  : 261.626,
			'C#4' : 277.183,
			'Db4' : 277.183,
			'D4'  : 293.665,
			'D#4' : 311.127,
			'Eb4' : 311.127,
			'E4'  : 329.628,
			'Fb4'  : 329.628,
			'E#4'  : 349.228,
			'F4'  : 349.228,
			'F#4' : 369.994,
			'Gb4' : 369.994,
			'G4'  : 391.995,
			'G#4' : 415.305,
			'Ab4' : 415.305,
			'A4'  : 440.000,
			'A#4' : 466.164,
			'Bb4' : 466.164,
			'B4'  : 493.883,
			'Cb5'  : 493.883,
			'B#4'  : 523.251,
			'C5'  : 523.251,
			'C#5' : 554.365,
			'Db5' : 554.365,
			'D5'  : 587.330,
			'D#5' : 622.254,
			'Eb5' : 622.254,
			'E5'  : 659.255,
			'Fb5'  : 659.255,
			'E#5'  : 698.456,
			'F5'  : 698.456,
			'F#5' : 739.989,
			'Gb5' : 739.989,
			'G5'  : 783.991,
			'G#5' : 830.609,
			'Ab5' : 830.609,
			'A5'  : 880.000,
			'A#5' : 932.328,
			'Bb5' : 932.328,
			'B5'  : 987.767,
			'Cb6'  : 987.767,
			'B#5'  : 1046.50,
			'C6'  : 1046.50,
			'C#6' : 1108.73,
			'Db6' : 1108.73,
			'D6'  : 1174.66,
			'D#6' : 1244.51,
			'Eb6' : 1244.51,
			'Fb6'  : 1318.51,
			'E6'  : 1318.51,
			'E#6'  : 1396.91,
			'F6'  : 1396.91,
			'F#6' : 1479.98,
			'Gb6' : 1479.98,
			'G6'  : 1567.98,
			'G#6' : 1661.22,
			'Ab6' : 1661.22,
			'A6'  : 1760.00,
			'A#6' : 1864.66,
			'Bb6' : 1864.66,
			'B6'  : 1975.53,
			'Cb7'  : 1975.53,
			'B#6'  : 2093.00,
			'C7'  : 2093.00,
			'C#7' : 2217.46,
			'Db7' : 2217.46,
			'D7'  : 2349.32,
			'D#7' : 2489.02,
			'Eb7' : 2489.02,
			'E7'  : 2637.02,
			'Fb7'  : 2637.02,
			'E#7'  : 2793.83,
			'F7'  : 2793.83,
			'F#7' : 2959.96,
			'Gb7' : 2959.96,
			'G7'  : 3135.96,
			'G#7' : 3322.44,
			'Ab7' : 3322.44,
			'A7'  : 3520.00,
			'A#7' : 3729.31,
			'Bb7' : 3729.31,
			'B7'  : 3951.07,
			'Cb8' : 3951.07,
			'B#7'  : 4186.01,
			'C8'  : 4186.01
		};
	
	
	var pitchesArray = [ // Just an array of note names. This can be useful for mapping MIDI data to notes.
			'C0',
			'C#0',
			'D0',
			'D#0',
			'E0',
			'F0',
			'F#0',
			'G0',
			'G#0',
			'A0',
			'A#0',
			'B0',
			'C1',
			'C#1',
			'D1',
			'D#1',
			'E1',
			'F1',
			'F#1',
			'G1',
			'G#1',
			'A1',
			'A#1',
			'B1',
			'C2',
			'C#2',
			'D2',
			'D#2',
			'E2',
			'F2',
			'F#2',
			'G2',
			'G#2',
			'A2',
			'A#2',
			'B2',
			'C3',
			'C#3',
			'D3',
			'D#3',
			'E3',
			'F3',
			'F#3',
			'G3',
			'G#3',
			'A3',
			'A#3',
			'B3',
			'C4',
			'C#4',
			'D4',
			'D#4',
			'E4',
			'F4',
			'F#4',
			'G4',
			'G#4',
			'A4',
			'A#4',
			'B4',
			'C5',
			'C#5',
			'D5',
			'D#5',
			'E5',
			'F5',
			'F#5',
			'G5',
			'G#5',
			'A5',
			'A#5',
			'B5',
			'C6',
			'C#6',
			'D6',
			'D#6',
			'E6',
			'F6',
			'F#6',
			'G6',
			'G#6',
			'A6',
			'A#6',
			'B6',
			'C7',
			'C#7',
			'D7',
			'D#7',
			'E7',
			'F7',
			'F#7',
			'G7',
			'G#7',
			'A7',
			'A#7',
			'B7',
			'C8'
		];

	var isAudioContextSupported = function () {
		// This feature is still prefixed in Safari
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if (window.AudioContext) {
			return true;
		}
		else {
			return false;
		}
	};

	var reportError = function (message) {
		$('#errorMessage').html(message).show();
	};

	var init = function () {
		//sfreqTable = notes;

		$('.tuner__options').toggle(false);

		var gaugeCanvas = $('#gaugeCanvas')[0];
		gauge = new Gauge(gaugeCanvas).setOptions({
			strokeColor: '#dedede',
			pointer: {
				length: 0.8,
				strokeWidth: 0.035
			},
			angle: 0,
			lineWidth: 0.30,
			fontSize: 30,
			limitMax: true
		});
		gauge.maxValue = 100;

		// This gauge control does not look good in all browsers if set to 0 from the beginning.
		// Setting it to 1 and then to 0 solves this.
		gauge.set(1);
		gauge.set(0);

		if (isAudioContextSupported()) {
			audioContext = new window.AudioContext();
		}
		else {
			reportError('AudioContext is not supported in this browser');
		}
	};

	var noteFromPitch = function(frequency) {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
    }

	var updatePitch = function (pitch) {
		$('#pitch').text(pitch + ' Hz');
	};

	var updateNote = function (note) {
		$('#note').text(note);
	};

	var updateCents = function (cents) {
		if (!isNaN(cents)) {
			gauge.set(cents + 50);
			$('#cents').text(cents);
		} else {
			gauge.set(-50);
			$('#cents').text('--');
		}
		
	};

	var isGetUserMediaSupported = function () {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia) {
			return true;
		}

		return false;
	};

	var findFundamentalFreq = function (buf, sampleRate) {
		var MIN_SAMPLES = 4;    // corresponds to an 11kHz signal
        var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
        var SIZE = 1000;
        var best_offset = -1;
        var best_correlation = 0;
        var rms = 0;
        var foundGoodCorrelation = false;

        if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
            return -1;  // Not enough data

        for ( var i = 0; i < SIZE; i++ ) {
            var val = ( buf[i] - 128 ) / 128;
            rms += val * val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01)
            return -1;

        var lastCorrelation=1;
        for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
            var correlation = 0;

            for (var i=0; i<SIZE; i++) {
                correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
            }
            correlation = 1 - (correlation/SIZE);
            if ((correlation>0.9) && (correlation > lastCorrelation))
                foundGoodCorrelation = true;
            else if (foundGoodCorrelation) {
                // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                return sampleRate/best_offset;
            }
            lastCorrelation = correlation;
            if (correlation > best_correlation) {
                best_correlation = correlation;
                best_offset = offset;
            }
        }
        if (best_correlation > 0.01) {
            // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
            return sampleRate/best_offset;
        }
        return -1;
    //  var best_frequency = sampleRate/best_offset;
	};

	var findClosestNote = function (freq, notes) {
		// Use binary search to find the closest note
		var low = -1;
		var high = notes.length;
		while (high - low > 1) {
			var pivot = Math.round((low + high) / 2);
			if (notes[pivot].frequency <= freq) {
				low = pivot;
			} else {
				high = pivot;
			}
		}

		if (Math.abs(notes[high].frequency - freq) <= Math.abs(notes[low].frequency - freq)) {
			// notes[high] is closer to the frequency we found
			return notes[high];
		}

		return notes[low];
	};

	var findCentsOffPitch = function (freq, refFreq) {
		// We need to find how far freq is from baseFreq in cents
		var log2 = Math.log(2);
		var multiplicativeFactor = freq / refFreq;

		// We use Math.floor to get the integer part and ignore decimals
		var cents = Math.floor(1200 * (Math.log(multiplicativeFactor) / log2));
		return cents;
	};

	var detectPitch = function () {
		var buffer = new Uint8Array(analyserAudioNode.fftSize);
		analyserAudioNode.getByteTimeDomainData(buffer);

		var fundamentalFreq = findFundamentalFreq(buffer, audioContext.sampleRate);

		if ( fundamentalFreq !== -1 && fundamentalFreq !== 11025 && fundamentalFreq !== 12000 ) {
            var pitch = fundamentalFreq;
            var floorPitch = Math.floor(pitch) ;
            var note = noteFromPitch(pitch);
			var noteName = pitchesArray[note - 12];
			var cents = findCentsOffPitch(pitch, pitches[noteName]);
			updateCents(cents);
			updateNote(noteName);
			console.log(cents);
        }

		frameId = window.requestAnimationFrame(detectPitch);
	};

	var streamReceived = function (stream) {
		micStream = stream;

		analyserAudioNode = audioContext.createAnalyser();
		analyserAudioNode.fftSize = 2048;

		sourceAudioNode = audioContext.createMediaStreamSource(micStream);
		sourceAudioNode.connect(analyserAudioNode);

		detectPitch();
	};

	var turnOffReferenceSound = function () {
		sourceAudioNode.stop();
		sourceAudioNode = null;
		updatePitch('--');
		updateNote('--');
		$('#referenceOptions').toggle(false);
		isRefSoundPlaying = false;
	};

	var turnOffMicrophone = function () {
		if (sourceAudioNode && sourceAudioNode.mediaStream && sourceAudioNode.mediaStream.stop) {
			sourceAudioNode.mediaStream.stop();
		}
		sourceAudioNode = null;
		updatePitch('--');
		updateNote('--');
		updateCents(-50);
		$('#microphoneOptions').toggle(false);
		analyserAudioNode = null;
		window.cancelAnimationFrame(frameId);
		isMicrophoneInUse = false;
	};

	var toggleMicrophone = function () {
		if (isRefSoundPlaying) {
			turnOffReferenceSound();
		}

		if (!isMicrophoneInUse) {
			$('#microphoneOptions').toggle(true);

			if (isGetUserMediaSupported()) {
				//notesArray = freqTable[baseFreq.toString()];

				var getUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ?
					navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) :
					function (constraints) {
						return new Promise(function (resolve, reject) {
							navigator.getUserMedia(constraints, resolve, reject);
						});
					};

				getUserMedia({audio: true}).then(streamReceived).catch(reportError);
				updatePitch(baseFreq);
				isMicrophoneInUse = true;
			}
			else {
				reportError('It looks like this browser does not support getUserMedia. ' +
				'Check <a href="http://caniuse.com/#feat=stream">http://caniuse.com/#feat=stream</a> for more info.');
			}
		}
		else {
			turnOffMicrophone();
		}
	};

	var changeBaseFreq = function (delta) {
		var newBaseFreq = baseFreq + delta;
		if (newBaseFreq >= 432 && newBaseFreq <= 446) {
			baseFreq = newBaseFreq;
			notesArray = freqTable[baseFreq.toString()];
			updatePitch(baseFreq);

			if (isRefSoundPlaying) {
				// Only change the frequency if we are playing a reference sound, since
				// sourceAudioNode will be an instance of OscillatorNode
				var newNoteFreq = notesArray[currentNoteIndex].frequency;
				sourceAudioNode.frequency.value = newNoteFreq;
			}
		}
	};

	var changeReferenceSoundNote = function (delta) {
		if (isRefSoundPlaying) {
			var newNoteIndex = currentNoteIndex + delta;
			if (newNoteIndex >= 0 && newNoteIndex < notesArray.length) {
				currentNoteIndex = newNoteIndex;
				var newNoteFreq = notesArray[currentNoteIndex].frequency;
				sourceAudioNode.frequency.value = newNoteFreq;
				// In this case we haven't changed the base frequency, so we just need to update the note on screen
				updateNote(notesArray[currentNoteIndex].note);
			}
		}
	};

	var baseFreqChangeHandler = function (event) {
		changeBaseFreq(event.data);
	};

	var referenceSoundNoteHandler = function (event) {
		changeReferenceSoundNote(event.data);
	};

	$('#micButton').click(toggleMicrophone);
	$('.minusFreq').click(-2, baseFreqChangeHandler);
	$('.plusFreq').click(2, baseFreqChangeHandler);
	$('#minusRefNote').click(-1, referenceSoundNoteHandler);
	$('#plusRefNote').click(1, referenceSoundNoteHandler);

	init();
});