var video;
var canvas;
var context;
var initialized = false;


document.addEventListener("DOMContentLoaded", function(event) {
  init();
});

function draw(v,c,w,h){
  c.drawImage(v,0,0,w,h);
  setTimeout(draw,20,v,c,w,h);

}

function init(){
  video = document.querySelector("#videoElement");
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  initialized = true;
}

function start(){
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      if(initialized){
        draw(video,context,canvas.width,canvas.height);
      }else{
        alert("Camera is not ready, try again!");
      }
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}
}

function stop() {
  video.srcObject = null;
}

function screenshot(){

}