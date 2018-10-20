/**
* Copyright 2017 IBM Corp. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/

/*jshint node: true*/
/*jshint esversion: 6 */
"use strict";
var bodyParser = require("body-parser");
// var Base64Decode = require('base64-stream').decode;
var { Base64Decode, Base64Encode } = require('base64-stream');
var b64 = require('base64-js');
var multer = require('multer');
var blobUtil = require('blob-util');
var path = require('path');





require("dotenv").config({
    silent: true
});

const uuid = require('uuid');

const os = require('os');
const fs = require("fs");
const VisualRecognitionV3 = require("watson-developer-cloud/visual-recognition/v3");
const express = require("express");
const application = express();
const formidable = require("formidable");

const visual_recognition = new VisualRecognitionV3({
    version: "2018-03-19"
});

application.use(express.static(__dirname + "/public"));

// multer stuff for file uploads from the front end
let upload = multer({ dest: __dirname + '/public/uploads/' });
let type = upload.single('upl');

application.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

application.use(bodyParser.json());

// routes.................begin


function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    // var Base64Decode = require('base64-stream').decode;
    var imgFile = new Base64Decode(base64str);
    console.log('******** File created from base64 encoded string ********' + imgFile);
    return imgFile
}

application.post('/testFormData', upload.array(), function (req, res) {
    console.log("about to call base64str...");
    base64_decode(req.body.image, "image.jpg");
    console.log("finished call to base64str");
    res.end();
    // var base64Data = req.body.image;
    // console.log('writing file...', base64Data);
    // fs.writeFile("/uploads/out.jpg", base64Data, 'base64', function(err) {
    //     if (err) console.log(err);
    //     fs.readFile("/uploads/out.jpg", function(err, data) {
    //         if (err) throw err;
    //         console.log('reading file...', data.toString('base64'));
    //         res.send(data);
    //     });
    // });
});

application.post('/api/upload', type, function (req, res) {
    console.log(req.body.data);
    console.log(req.body.image);
    let dataURL = blobUtil.blobToDataURL.blobToDataURL(req.body.image);
    console.log(`**** the dataURL is: ${dataURL}`)
    // do stuff with file
});

/**
 * Parse a base 64 image and return the extension and buffer
 * @param  {String} imageString The image data as base65 string
 * @return {Object}             { type: String, data: Buffer }
 */
function parseBase64Image(imageString) {
    var matches = imageString.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    var resource = {};

    if (matches.length !== 3) {
        return null;
    }

    resource.type = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    resource.data = new Buffer(matches[2], 'base64');
    return resource;
}


// application.post("/uploadpic", function (req, result) {
application.post("/hitwatson", function (req, result) {
    console.log("===> hit the /hitwatson route");
    // console.log("the request body is: " + JSON.stringify(req.body.image));
    // const form = new formidable.IncomingForm();
    // form.keepExtensions = true;
    // form.parse(req, function (err, fields, files) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(fields);
    // const filePath = JSON.parse(JSON.stringify(files));

    // var imgFile = new Base64Decode(req.body.image);
    // var imgAsString = new Base64Encode(imgFile.read());
    // console.log("the imgAsString after encoding back to string is: " + JSON.stringify(imgAsString));

    // var arr = b64.toByteArray(req.body.image);
    // console.log("-----> imFile is: " + JSON.stringify(arr));

    // var fstream = fs.createReadStream("./fujiapple.jpg");
    // var fstream = fs.createReadStream(req.body.image);
    // console.log("=====> the fstream is: " + JSON.stringify(fstream));

    var params = {
        classifier_ids: ["food"],
        image_file: null
    };
    console.log("about to parse from Watson: ")
    let resource = parseBase64Image(req.body.image)
    // console.log(`the returned object from Winston is: ${JSON.stringify(resource)}`)
    // console.log("os tempdir is: " + os.tmpdir())
    console.log("os tempdir is: " + __dirname__ + "/pics")
    // var temp = path.join(os.tmpdir(), uuid.v1() + '.' + resource.type);
    var temp = path.join(__dirname__ + "/pics", uuid.v1() + '.' + resource.type);
    console.log("temp file is: " + temp)
    fs.writeFileSync(temp, resource.data);
    params.image_file = fs.createReadStream("./almonds.jpg");
    // result.end()

    // const params = {
    //     // image_file: fs.createReadStream(filePath.myPhoto.path),
    //     // image_file: fs.createReadStream("./fujiapple.jpg"),
    //     // image_file: imgFile,
    //     // images_file: req.body.image,
    //     url: req.body.image,
    //     // images_file: fstream,
    //     // image_file: arr,
    //     classifier_ids: ["food"]
    // };
    console.log("====> about to call watson!");
    visual_recognition.classify(params, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("====> " + JSON.stringify(res));
            const labelsvr = JSON.parse(JSON.stringify(res)).images[0].classifiers[0];
            console.log("===> " + JSON.stringify(labelsvr));
            result.send({ data: labelsvr });
        }
    })
    // }
    // });
});

application.get("/", function (req, response) {
    console.log("==> hit the root route!");
    respone.sendFile('index.html');
});

// routes.......................end

const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
application.listen(port, function () {
    console.log("Server running on port: %d", port);
});

// application.post("/hitwatson", function (req, res) {
//     console.log("*********************>>>>>>>>>>>>>>>   hit the post route for /hitwatson with body of: " + JSON.stringify(req.body.image));
//     res.redirect(307, "/");
// });