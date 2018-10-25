

'use strict';

// const videoElement = document.querySelector('#video-stream');

// audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);
let deviceNames = [];
let preferredDevice = null;
// let deviceInfos = navigator.mediaDevices.enumerateDevices();

// gotDevices(deviceInfos);

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    console.log(`"===> the device infoS are: ${JSON.stringify(deviceInfos)}`)

    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        console.log(`"===> the device info is: ${JSON.stringify(deviceInfo)}`)
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
            console.log("==> now appending the vidoeselection of: " + deviceInfo.label)
            deviceNames.push(deviceInfo.label);
            if (!preferredDevice) {
                console.log(`now setting the preffered device to: ${JSON.stringify(deviceInfo)}`)
                preferredDevice = deviceInfo;  // take a camera of some kind
            } else {
                // if (deviceInfo.label === "Back Camera") {
                if (deviceInfo.label.match('[Bb]ack')) {     // regex to match for back/Back camera
                    console.log(`now setting the preffered device to back camera: ${JSON.stringify(deviceInfo)}`)
                    preferredDevice = deviceInfo;  // prefer the back camera!
                }
            }
        }
    }
    // document.getElementById("selection-output").innerHTML = "Device names: " + deviceNames;
    // document.getElementById("preferred-camera").innerHTML = "The preferred camera is: " + preferredDevice.label;

}

const constraints = {
    // video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    video: { deviceId: { exact: undefined } }
};
// first call it to discover all the devices....
navigator.mediaDevices.enumerateDevices().then(devices => {
    gotDevices(devices)
    constraints.video.deviceId.exact = preferredDevice.deviceId;
    console.log(`*** the preferred deviceid now set to: ${constraints.video.deviceId.exact}`)
    return devices;
}).then(stream => {
    // console.log(`*** about to set the stream with: ${constraints.video.deviceId.exact} AND 
    // ${JSON.stringify(stream)}`)
    // navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    //     gotStream(stream)
    // }).then(devices => {
    //     gotDevices(devices)
    //     start()
    // })
}).catch(handleError);
// const constraints = {
//     // video: {deviceId: videoSource ? {exact: videoSource} : undefined}
//     video: { deviceId: { exact: preferredDevice.deviceId } }
// };
// then call it to set the preferred device
// navigator.mediaDevices.enumerateDevices(constraints).then(gotDevices).catch(handleError);

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
    console.log(`=== now setting the window stream to: ${JSON.stringify(stream)}`)
    video.srcObject = stream;
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
    // console.log(`the videoSource is: ${videoSource}`)
    if (preferredDevice) {
        console.log(`the preferred Device id is: ${preferredDevice.deviceId}`)
    }


    // const constraints = {
    //     // video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    //     video: { deviceId: { exact: preferredDevice.deviceId } }
    // };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}


// start();

// Function to send picture to Face++ and retrieve back data on the picture of the person
function callWatsonBackend(img) {
    var API_URL = "http://localhost:3000/";
    // var API_KEY = "paQtvvWUvJ3j0I_ISUA3_eCHhId9iZFl";
    // var API_SECRET = "3lS34CClXxNX3LnlLfaK9Q4uP8lwiTZX";
    // var face_attributes = "gender,age,smiling,eyestatus,emotion,ethnicity";

    console.log("about to make a POST requet to the backend");

    $("#movie-info").empty();
    $.post('/hitwatson', { image: img })
        .then(function (res) {
            console.log("==> the response: " + JSON.stringify(res));
            $("#movie-info").append("This is what we got: ");
            $("#movie-info").append(JSON.stringify(res));
        });
}

var video = document.querySelector('#video-stream'),
    image = document.querySelector('#snap'),
    start_camera = document.querySelector('#start-camera'),
    controls = document.querySelector('.controls'),
    take_photo_btn = document.querySelector('#take-photo'),
    delete_photo_btn = document.querySelector('#delete-photo'),
    download_photo_btn = document.querySelector('#download-photo'),
    error_message = document.querySelector('#error-message');


// Mobile browsers cannot play video without user input,
// so here we're using a button to start it manually.
start_camera.addEventListener("click", function (e) {

    e.preventDefault();

    start();
    // Start video playback manually.
    video.play();
    showVideo();

});


take_photo_btn.addEventListener("click", function (e) {

    e.preventDefault();

    var snap = takeSnapshot();


    // Show image. 
    image.setAttribute('src', snap);
    image.classList.add("visible");

    callWatsonBackend(image.src);

    // Enable delete and save buttons
    delete_photo_btn.classList.remove("disabled");
    download_photo_btn.classList.remove("disabled");

    // Set the href attribute of the download button to the snap url.
    download_photo_btn.href = snap;

    // Pause video playback of stream.
    video.pause();

});

function takeSnapshot() {
    // Here we're using a trick that involves a hidden canvas element.  

    var hidden_canvas = document.querySelector('canvas'),
        context = hidden_canvas.getContext('2d');

    // var width = video.videoWidth = 640,
    //     height = video.videoHeight = 480;
        var width = 640,
        height = 480;

    if (width && height) {

        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(video, 0, 0, width, height);

        // Turn the canvas image into a dataURL that can be used as a src for our photo.
        return hidden_canvas.toDataURL('image/jpeg', 1.0);
    }
}

function displayErrorMessage(error_msg, error) {
    error = error || "";
    if (error) {
        console.log(error);
    }

    error_message.innerText = error_msg;

    hideUI();
    error_message.classList.add("visible");
}

function showVideo() {
    // Display the video stream and the controls.

    hideUI();
    video.classList.add("visible");
    controls.classList.add("visible");
}

function hideUI() {
    // Helper function for clearing the app UI.

    controls.classList.remove("visible");
    start_camera.classList.remove("visible");
    video.classList.remove("visible");
    snap.classList.remove("visible");
    error_message.classList.remove("visible");
}