// import { canvasToBlob } from 'blob-util'
// let butil = require('blob-util');
// var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })

$(document).ready(function () {

    // VARIBALES
    //******************************************************************************************************************
    //******************************************************************************************************************

    // Video camera
    // const constraints = {
    //     video: true
    // };

    // const img = document.querySelector('#screenshot-img');
    // const video = document.querySelector('#screenshot-video');
    // const canvas = document.createElement('canvas');

    // Object vairable to store data to be sent to Firebase
    // var database = Object;

    // Array to hold movies that will be in the survey
    // var movieArray = ["It", "The Hangover", "The Notebook", "Deadpool", "Bad Boys", "Caddyshack", "Die Hard", "Black Panther"];

    // Array index to ensure movies goes in order of the above movieArray
    // var movieArrayIndex = 0;

    // Map will hold all of the movie data from OMDB
    // var movieDataMap = new Map();

    // demographic data
    // var age = 0;
    // var ethnicity = "";
    // var gender = "";
    // var zipcode = "";

    // FUNCTIONS
    //******************************************************************************************************************
    //******************************************************************************************************************

    // Function to initialize connection to Firebase
    // function connectToFB() {
    //     var config = {
    //         apiKey: "AIzaSyADB08nKl5i9oLbYvr1G3NwyJ1LGFw13ME",
    //         authDomain: "fistoffiverating.firebaseapp.com",
    //         databaseURL: "https://fistoffiverating.firebaseio.com",
    //         projectId: "fistoffiverating",
    //         storageBucket: "fistoffiverating.appspot.com",
    //         messagingSenderId: "665383282847"
    //     };

    //     firebase.initializeApp(config);
    //     database = firebase.database();
    // }

    // Function to check if window supports camera functionality
    function hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    // Function for video to determine if video stream works
    function handleSuccess(stream) {
        video.srcObject = stream;
    }

    // Function if video stream fails
    function handleError(error) {
        console.error('Reeeejected!', error);
    }

    function uploadBlobToWatsonBackend(blob) {
        console.log("--- got into the call to uploadBlobToWatsonBackend");
        console.log(`the blob is: ${blob}`)
        // var data = new FormData();
        // data.append('fname', 'image.jpg');
        // data.append('data', blob);
        // console.log(`the data is: ${data}`)


        // $.ajax({
        //     data: data,
        //     type: 'POST',
        //     processData: false,
        //     contentType: false,
        //     dataType: 'binary',
        //     url: '/api/upload'
        // }).done(function (res) {
        //     // Do something with the Blob returned to us from the ajax request
        //     console.log("==> the response to /api/upload: " + JSON.stringify(res));
        // });

        console.log("before upload");
        // var multer  = load('multer')
        // var upload = multer({ dest: 'uploads/' })
        console.log("after upload");
        $.post('/testFormData', { image: blob },
            function (res) {
                console.log("==> the response to /api/upload: " + JSON.stringify(res));
            });
    }

    function uploadFileToWatsonBackend(url) {
        $.post('/api/upload', { image: url })
            .then(function (res) {
                console.log("==> the response to /api/upload: " + JSON.stringify(res));
            });
    }

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



        // $.ajax("/hitwatson", {
        //     type: "POST",
        //     data: JSON.stringify({
        //         image: "whatever"
        //     }),
        //     contentType: "application/json",
        //   }).then(function () {
        //     console.log("This image posted!");
        //   });


        // $.post({
        //     url: '/hitwatson',
        //     // Origin: "http://localhost:3000",
        //     // Access-Control-Allow-Origin: "*",
        //     method: "POST",
        //     data: JSON.stringify({
        //         image: img
        //     }),
        //     contentType: "application/json",
        //     // dataType: 'json',
        //     success: function (result) {
        //         console.log("Success!  The result is:");
        //         console.log(JSON.stringify(result));
        //     },
        //     error: function (error) {
        //         console.log("there was an error! " + JSON.stringify(error));
        //     },
        //     timeout: 10 * 1000
        // });
    }

    // Function to remove information from movie just rated and adds info for the next movie in index.html
    // function movieSurvey() {
    //     // Assign the movie poster URL to vairable imgURL
    //     var imgURL = movieDataMap.get(movieArray[movieArrayIndex]).Poster;
    //     // Assign <img> element to variable movieImg
    //     var movieImg = $("<img>");
    //     // Assign src and alt to the movieImg element
    //     movieImg.attr({
    //         "class": "img-fluid rounded mx-auto d-block",
    //         "id": "movie-poster",
    //         "src": imgURL,
    //         "alt": movieArray[movieArrayIndex] + " Poster",
    //     });
    //     // Append the movie poster into movie-posters div in index.html
    //     $("#movie-posters").append(movieImg);
    //     // Append the movie info into movie-info div in index.html
    //     $("#movie-info").append("<h2>Title</h2>");
    //     $("#movie-info").append("<h4>" + movieDataMap.get(movieArray[movieArrayIndex]).Title + "</h4><br>");
    //     $("#movie-info").append("<h2>Actors/Actresses</h2>");
    //     $("#movie-info").append("<h4>" + movieDataMap.get(movieArray[movieArrayIndex]).Actors + "</h4><br>");
    //     $("#movie-info").append("<h2>Genre</h2>");
    //     $("#movie-info").append("<h4>" + movieDataMap.get(movieArray[movieArrayIndex]).Genre + "</h4><br>");
    // }

    // Function to send data of each rating to Firebase
    function addForMovie(movieTitle, fistOfFiveVote, gender, ethnicity, age, zipcode) {
        database.ref("/").push({
            'movieTitle': movieTitle,
            'fistOfFive': fistOfFiveVote,
            'gender': gender,
            'ethnicity': ethnicity,
            'age': age,
            'zipcode': zipcode
        });
    }

    const videoSelect = document.querySelector('#movie-posters');

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
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
                audioInputSelect.appendChild(option);
            } else if (deviceInfo.kind === 'audiooutput') {
                option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
                audioOutputSelect.appendChild(option);
            } else if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
                videoSelect.appendChild(option);
            } else {
                console.log('Some other kind of source/device: ', deviceInfo);
            }
        }
        selectors.forEach((select, selectorIndex) => {
            if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
                select.value = values[selectorIndex];
            }
        });
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        videoElement.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }


    // References to all the element we will need.
    var video = document.querySelector('#camera-stream'),
        image = document.querySelector('#snap'),
        start_camera = document.querySelector('#start-camera'),
        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo'),
        delete_photo_btn = document.querySelector('#delete-photo'),
        download_photo_btn = document.querySelector('#download-photo'),
        error_message = document.querySelector('#error-message');


    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);


    if (!navigator.getMedia) {
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    }
    else {

        // Request the camera.
        navigator.getMedia(
            {
                video: true
                // video: {facingMode: "environment"}   // use the camera on the back of the phone
            },
            // Success Callback
            function (stream) {

                // Create an object URL for the video stream and
                // set it as src of our HTLM video element.
                video.src = window.URL.createObjectURL(stream);

                // Play the video element to start the stream.
                video.play();
                video.onplay = function () {
                    showVideo();
                };

            },
            // Error Callback
            function (err) {
                displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
            }
        );

    }



    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    start_camera.addEventListener("click", function (e) {

        e.preventDefault();

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


    delete_photo_btn.addEventListener("click", function (e) {

        e.preventDefault();

        // Hide image.
        image.setAttribute('src', "");
        image.classList.remove("visible");

        // Disable delete and save buttons
        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");

        // Resume playback of stream.
        video.play();

    });



    function showVideo() {
        // Display the video stream and the controls.

        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }


    function takeSnapshot() {
        // Here we're using a trick that involves a hidden canvas element.  

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        var width = video.videoWidth = 640,
            height = video.videoHeight = 480;

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


    function hideUI() {
        // Helper function for clearing the app UI.

        controls.classList.remove("visible");
        start_camera.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
        error_message.classList.remove("visible");
    }



    // MAIN PROCESS
    //******************************************************************************************************************
    //******************************************************************************************************************

    // Call function to initialize Firebase
    // connectToFB();

    // // Loop to pull in all info from OMDB for movies in movieArray
    // for (var i = 0; i < movieArray.length; i++) {
    //     var queryURL = "https://www.omdbapi.com/?t=" + movieArray[i] + "&y=&plot=short&apikey=trilogy";

    //     $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     }).then(function (response) {
    //         movieDataMap.set(response.Title, response);
    //     });
    // }

    // Check if window supports camera functionality
    if (hasGetUserMedia()) {
        // Good to go!
    } else {
        alert('getUserMedia() is not supported by your browser');
    }

    // If user clicks on Start Survey button, then execute the below code
    // $("#modalIntializeButton").on('click', function () {
    //     //     //Prevent modal from closing by clicking outside of modal to be coded
    //     e.preventDefault();

    //     // Start video playback manually.
    //     img.play();
    //     showVideo();
    // });

    // If user clicks the Click to Close button, then execute the below code to close window
    $(document).on('click', "#close-window-button", function () {
        // Closes current window
        window.close();
    });
});
