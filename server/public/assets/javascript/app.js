

'use strict';

const videoElement = document.querySelector('video');
const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#audioOutput');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);
let deviceNames = [];
let preferredDevice = null;

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    console.log(`"===> the device info is: ${JSON.stringify(deviceInfo)}`)
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      console.log("==> now appending the vidoeselection of: " + deviceInfo.label)
      videoSelect.appendChild(option);
      deviceNames.push(deviceInfo.label);
      if (!preferredDevice) {
          console.log(`now setting the preffered device to: ${JSON.stringify(deviceInfo)}`)
          preferredDevice = deviceInfo;  // take a camera of some kind
      } else { 
          if (deviceInfo.label === "Back Camera") {
            console.log(`now setting the preffered device to back camera: ${JSON.stringify(deviceInfo)}`)
            preferredDevice = deviceInfo;  // prefer the back camera!
          }
      }
    } 
    const option2 = document.createElement('option');
    option2.value = "option" + i;
    videoSelect.appendChild(option2);
  }
  document.getElementById("selection-output").innerHTML = "Device names: " + deviceNames;
  document.getElementById("preferred-camera").innerHTML = "The preferred camera is: " + preferredDevice.label;

  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
      .then(() => {
        console.log(`Success, audio output device attached: ${sinkId}`);
      })
      .catch(error => {
        let errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
        }
        console.error(errorMessage);
        // Jump back to first output device in the list as it's the default.
        audioOutputSelect.selectedIndex = 0;
      });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

// function changeAudioDestination() {
//   const audioDestination = audioOutputSelect.value;
//   attachSinkId(videoElement, audioDestination);
// }

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoSelect.value;
  console.log(`the video name is: ${JSON.stringify(videoSelect[2])}`)
  console.log(`videoselect value is: ${videoSelect.value}`)
  console.log(`the videoSource is: ${videoSource}`)
  if (preferredDevice) {
    console.log(`the preferred Device id is: ${preferredDevice.deviceId}`)
  }


  const constraints = {
    // video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    video: {deviceId: {exact: preferredDevice.deviceId}}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

videoSelect.onchange = start;

start();