var video;
var canvas;
var context;
var initialized = false;
var is_playing = false;

document.addEventListener("DOMContentLoaded", function(event) {
  init();
  var elems  = document.querySelectorAll("input[type=range]");
  M.Range.init(elems);
  elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

function init(){
  video = document.querySelector("#videoElement");
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  initialized = true;
  start();
}

function start(){
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      if(initialized){
        is_playing = true;
        draw(video,context,canvas.width,canvas.height);
      }else{
        alert("Camera is not ready, try again!");
        is_playing = false;
      }
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}
}

function resume(){
  if(is_playing){
    return;    
  }
  is_playing = true;
  draw(video,context,canvas.width,canvas.height);
}

function draw(v,c,w,h){
  if(is_playing){
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
  }
}

function pause() {
  if(!is_playing){
    return;    
  }
  is_playing = false;

  context.fillStyle="blue";
  context.fillRect(0, 0, canvas.width, canvas.height);

}

function screenshot(){

}