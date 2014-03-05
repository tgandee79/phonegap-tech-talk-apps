/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var encodingType;
var canvas = $('canvas')[0];
var ctx = canvas.getContext('2d');
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        encodingType=navigator.camera.EncodingType;
        app.receivedEvent('deviceready');
        app.setupButtons();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        $('#deviceready').remove();

        console.log('Received Event: ' + id);
    },
    setupButtons: function(){
        $("#captureImageBtn").on('click', function(event){
            capturePhoto();
        });
        $("#captureEditImageBtn").on('click', function(event){
            capturePhotoEdit();
        });
        $("#libraryImageBtn").on('click', function(event){
            getPhoto(pictureSource.PHOTOLIBRARY);
        });
        $("#albumImageBtn").on('click', function(event){
            AlbumPhoto(pictureSource.SAVEDPHOTOALBUM);
        });
        $("#clearCanvas").on('click', function(event){
            clearCanvas();
        });
    }
};

var addPhotoSuccess = function(data){
    setTimeout(function() {
        alert('add success');
    }, 0);
    $('.app').hide();
    $('#imgInput').removeClass('hidden');
    $('#canvasButtons').removeClass('hidden');
    renderImageFromData(data);
};
var addPhotoFail = function(msg){
    setTimeout(function() {
        alert(msg);
    }, 0);
};
var renderImageFromData = function(imgData){
    ctx.putImageData(imgData,0,0,0,0,320,500);
};

var clearCanvas = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  $('.app').show();
  $('#imgInput').addClass('hidden');
  $('#canvasButtons').addClass('hidden');
};

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // // Uncomment to view the base64-encoded image data
    // // console.log(imageData);

    // // Get image handle
    // //
    // var smallImage = document.getElementById('smallImage');

    // // Unhide image elements
    // //
    // smallImage.style.display = 'block';

    // // Show the captured photo
    // // The inline CSS rules are used to resize the image
    // //
    // smallImage.src = "data:image/jpeg;base64," + imageData;

    $('.app').hide();
    $('#imgInput').removeClass('hidden');
    $('#canvasButtons').removeClass('hidden');
    addToCanvas(imageData);
}
function onPhotoURLSuccess(imageURI) {

    $('.app').hide();
    $('#imgInput').removeClass('hidden');
    $('#canvasButtons').removeClass('hidden');
    addToCanvas(imageURI);
}
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoURLSuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI, EncodingType: encodingType.PNG, targetWidth: 320,
  targetHeight: 500});
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.DATA_URL, EncodingType: encodingType.PNG });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}

function addToCanvas(imgURL) {
    var $img = $('<img/>');
    $img.attr('src', imgURL);
    $img.css({position: 'absolute', left: '0px', top: '-99999em', maxWidth: 'none', width: 'auto', height: 'auto', 'z-index':'99'});
    $img.on('load', function() {
        alert('load image');
        ctx.width  = $img.width();
        ctx.height = $img.height();
        ctx.drawImage($img[0], 0, 0);
        sigInitialize();
        // var dataUri = canvas.toDataURL('image/png');
        // $mealImg.attr('src', 'data:image/png;base64,' + imageDataUri);
    });
    $img.on('error', function() {
        console.log('Couldnt convert photo to data URI');
    });
    $('body').append($img);
}




function getPosition(mouseEvent, canvas) {
    var x, y;
    if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
        x = mouseEvent.pageX;
        y = mouseEvent.pageY;
    } else {
        x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return { X: x - canvas.offsetLeft, Y: y - canvas.offsetTop };
}

function sigInitialize() {
 // get references to the canvas element as well as the 2D drawing context

 ctx.strokeStyle = 'Black';

 // This will be defined on a TOUCH device such as iPad or Android, etc.
 var is_touch_device = 'ontouchstart' in document.documentElement;

 if (is_touch_device) {
    // create a drawer which tracks touch movements
    var drawer = {
       isDrawing: false,
       touchstart: function (coors) {
          ctx.beginPath();
          ctx.moveTo(coors.x, coors.y);
          this.isDrawing = true;
       },
       touchmove: function (coors) {
          if (this.isDrawing) {
             ctx.lineTo(coors.x, coors.y);
             ctx.stroke();
          }
       },
       touchend: function (coors) {
          if (this.isDrawing) {
             this.touchmove(coors);
             this.isDrawing = false;
          }
       }
    };

    // create a function to pass touch events and coordinates to drawer
    function draw(event) {

       // get the touch coordinates.  Using the first touch in case of multi-touch
       var coors = {
          x: event.targetTouches[0].pageX,
          y: event.targetTouches[0].pageY
       };

       // Now we need to get the offset of the canvas location
       var obj = canvas;

       if (obj.offsetParent) {
          // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
          do {
             coors.x -= obj.offsetLeft;
             coors.y -= obj.offsetTop;
          }
          // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
          // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
          while ((obj = obj.offsetParent) != null);
       }

       // pass the coordinates to the appropriate handler
       drawer[event.type](coors);
    }

    // attach the touchstart, touchmove, touchend event listeners.
    canvas.addEventListener('touchstart', draw, false);
    canvas.addEventListener('touchmove', draw, false);
    canvas.addEventListener('touchend', draw, false);

    // prevent elastic scrolling
    canvas.addEventListener('touchmove', function (event) {
       event.preventDefault();
    }, false);
 }
 else {

    // start drawing when the mousedown event fires, and attach handlers to
    // draw a line to wherever the mouse moves to
    $("#canvasSignature").mousedown(function (mouseEvent) {
       var position = getPosition(mouseEvent, canvas);

       context.moveTo(position.X, position.Y);
       context.beginPath();

       // attach event handlers
       $(this).mousemove(function (mouseEvent) {
          drawLine(mouseEvent, canvas, context);
       }).mouseup(function (mouseEvent) {
          finishDrawing(mouseEvent, canvas, context);
       }).mouseout(function (mouseEvent) {
          finishDrawing(mouseEvent, canvas, context);
       });
    });

 }
}

// draws a line to the x and y coordinates of the mouse event inside
// the specified element using the specified context
function drawLine(mouseEvent, canvas, context) {

 var position = getPosition(mouseEvent, canvas);

 context.lineTo(position.X, position.Y);
 context.stroke();
}

// draws a line from the last coordiantes in the path to the finishing
// coordinates and unbind any event handlers which need to be preceded
// by the mouse down event
function finishDrawing(mouseEvent, canvas, context) {
 // draw the line to the finishing coordinates
 drawLine(mouseEvent, canvas, context);

 context.closePath();

 // unbind any events which could draw
 $(canvas).unbind("mousemove")
             .unbind("mouseup")
             .unbind("mouseout");
}


