var video;
var in_canvas, out_canvas_1, out_canvas_2, out_canvas_3;
var in_context, out_context_1, out_context_2, out_context_3;
var canvas_cantainer;
var showing_canvases = 1;
var initialized = false;
var is_playing = false;
var selected_canvas;
const canvases = document.getElementsByClassName('canvas');
var slider;
var is_slider_open = true;
var slider_width = 0;




document.addEventListener("DOMContentLoaded", function(event) {
  init();
  var elems  = document.querySelectorAll("input[type=range]");
  M.Range.init(elems);
  elems = document.querySelectorAll('select');
  var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'top',
      hoverEnabled: true
    });
});

function init(){
  video = document.querySelector("#videoElement");
  in_canvas = document.getElementById('in_canvas');
  in_context = in_canvas.getContext('2d');

  out_canvas_1 = document.getElementById('out_canvas_1');
  out_context_1 = out_canvas_1.getContext('2d');

  out_canvas_2 = document.getElementById('out_canvas_2');
  out_context_2 = out_canvas_2.getContext('2d');

  out_canvas_3 = document.getElementById('out_canvas_3');
  out_context_3 = out_canvas_3.getContext('2d');

  slider = document.getElementById("slider_container");
  console.log(slider.clientWidth);
  document.getElementById("btn").style.left = slider.clientWidth+ "px";
  slider_width = slider.clientWidth;


  canvas_container = document.getElementsByClassName('canvas_cantainer')
  initialized = true;
  in_canvas.parentNode.style.display = 'block';
  start();


  const canvas_divs = document.getElementsByClassName('canvas_container');

  var ele = document.getElementsByClassName("filter_container")[0];
  ele.addEventListener('click', function(event){
    console.log("I am clicked",event.target);
    if (ele === event.target){
      console.log("unlsect",event.target);
      for (var i = 0; i < canvases.length; i++) {
        canvases[i].parentNode.classList.remove("canvas_container_selected");
      }
      return;
    } 

  }, false);

}

async function open_slider(){
    slider.classList.remove("slider_closed");
    slider.classList.add("slider_open");
    document.getElementById("slider_outer").classList.remove("s0");
    document.getElementById("slider_outer").classList.add("s2");
    while(slider.clientWidth<slider_width){ 
      await sleep(10); 
      document.getElementById("btn").style.left = slider.clientWidth + "px";
    }
    is_slider_open = true;
}

async function close_slider(){
  slider.classList.remove("slider_open");
  slider.classList.add("slider_closed");
  while(slider.clientWidth>0){ 
    await sleep(10); 
    document.getElementById("btn").style.left = slider.clientWidth + "px";
  }
  console.log(slider.clientWidth);
  document.getElementById("slider_outer").classList.remove("s2");
  document.getElementById("slider_outer").classList.add("s0");
  is_slider_open = false;
  
}


async function sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

function slider_control(){
  if(is_slider_open){
    close_slider();
  }else{
    open_slider();
  }
}

function select_canvas(e){
  console.log(e);
  if(e.parentNode.classList.contains("canvas_container_selected")){
    console.log("I am already selected *_*");
    e.parentNode.classList.remove("canvas_container_selected");
    return;
  }
  for (var i = 0; i < canvases.length; i++) {
    canvases[i].parentNode.classList.remove("canvas_container_selected");
  }
  e.parentNode.classList.add("canvas_container_selected");
}

function start(){
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      if(initialized){
        is_playing = true;
        draw(video,in_context,in_canvas.width,in_canvas.height);
        draw(video,out_context_1,out_canvas_1.width,in_canvas.height);
        draw(video,out_context_2,out_canvas_2.width,in_canvas.height);
        draw(video,out_context_3,out_canvas_3.width,in_canvas.height);
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
  draw(video,in_context,in_canvas.width,in_canvas.height);
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

  in_context.fillStyle="blue";
  in_context.fillRect(0, 0, in_canvas.width, in_canvas.height);

}

// function brightness_filter(){
//   if(!is_playing)
//     return;
//   out_context.filter = "brightness(150%)";
//   out_context.drawImage(in_canvas,0,0);
//   setTimeout(brightness_filter,20,in_canvas,out_context,out_canvas.width,out_canvas.height);
// }

// function take_photo(){
//   is_playing = false;
//   // return ctx.getImageData(0,0,c.width,c.height)
// }

// function filter_image(filter,image,var_args) {
//   var args = [this.getPixels(image)];
//   for (var i=2; i<arguments.length; i++) {
//     args.push(arguments[i]);
//   }
//   return filter.apply(null, args);

// }


// function bright_btn(){
//   var bright_bar = document.getElementById("bright_bar");
//   if (bright_bar.style.display == "none") {
//     bright_bar.style.display = "block";
//   } else {
//     bright_bar.style.display = "none";
//   }
//     in_canvas.height = 240;
//     in_canvas.width = 320;
//     out_canvas.style.display = "block";
//     draw(video,out_context,out_canvas.width,out_canvas.height);
//   //   var d = in_context.getImageData(0,0,c.width,c.height).data;
//   //   for (var i=0; i<d.length; i+=4) {
//   //     d[i] += adjustment;
//   //     d[i+1] += adjustment;
//   //     d[i+2] += adjustment;
//   //   }
//   // return pixels;

//   //   draw(video,out_context,out_canvas.width,out_canvas.height);

// }

function add_canvas(){

  if(showing_canvases==1){
    out_canvas_1.parentNode.style.display="block";
    in_canvas.parentNode.classList.remove("m12");
    in_canvas.parentNode.classList.add("m6");
    showing_canvases++;
  }
  else if(showing_canvases==2) {
    out_canvas_2.parentNode.style.display="block"; 
    showing_canvases++;
  }
  else if(showing_canvases==3) {
    out_canvas_3.parentNode.style.display="block"; 
    out_canvas_2.parentNode.classList.remove("m12");
    out_canvas_2.parentNode.classList.add("m6");
    showing_canvases++;

  }
  else{
    M.toast({html: 'no more then four canvases', classes: 'rounded msg-toast'});
    // document.getElementById("add_del_canvas").children[0].innerHTML = "remove";

  }

}


function remove_canvas(){

  if(showing_canvases==4){

    out_canvas_3.parentNode.style.display="none";
    out_canvas_2.parentNode.classList.remove("m6");
    out_canvas_2.parentNode.classList.add("m12");
    showing_canvases--;
    if(selected_canvas=out_canvas_3){
      out_canvas_3.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }
    
  }
  else if(showing_canvases==3) {
    out_canvas_2.parentNode.style.display="none"; 
    showing_canvases--;
    if(selected_canvas=out_canvas_2){
      out_canvas_2.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }
  }
  else if(showing_canvases==2) {
    out_canvas_1.parentNode.style.display="none"; 
    in_canvas.parentNode.classList.remove("m6");
    in_canvas.parentNode.classList.add("m12");
    showing_canvases--;
    if(selected_canvas=out_canvas_1){
      out_canvas_1.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }

  }
  else{
    M.toast({html: 'no less than one canvas', classes: 'rounded msg-toast'});

  }

}
