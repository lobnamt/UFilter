var video;
var in_canvas, out_canvas_1, out_canvas_2, out_canvas_3, out_canvas_4;
var in_context, out_context_1, out_context_2, out_context_3, out_context_4;
var canvas_cantainer;
var showing_canvases = 1;
var initialized = false;
var is_playing = false;
var selected_canvas;
const canvases = document.getElementsByClassName('canvas');
var slider;
var is_slider_open = true;
var slider_width = 0;
const filters = {
  GRAY: 'gray',
  BLUR: 'blur',
  BandW: 'blackandwhite',
  BILATERAL: 'bilateral',
  MEDIAN_BLUR: 'medianblur',
  THRESHOLD: 'threshold',
  ADAPTIVE_THRESHOLD:'adaptivethreshold'
}

const fparams = {
  KSIZE: "ksize",
  DIAMETER:"diameter",
  SIGMA_COLOR:"sigmacolor",
  SIGMA_SPACE: "sigmaspace",
  THRESH:'thresh',
  BLOCK_SIZE:'blocksize'
}

var filter_params = new Object();
filter_params[fparams.KSIZE] = 3;
filter_params[fparams.DIAMETER]=9;
filter_params[fparams.SIGMA_COLOR]=75;
filter_params[fparams.SIGMA_SPACE]=75;
filter_params[fparams.THRESH]= 100;
filter_params[fparams.BLOCK_SIZE]=10;
// filter_params[c]=2;


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
  // in_canvas = document.getElementById('in_canvas');
  // in_context = in_canvas.getContext('2d');

  in_canvas = document.createElement('canvas');
  in_canvas.id = "in_canvas";
  in_canvas.width = 320;
  in_canvas.height = 240;
  in_context = in_canvas.getContext('2d');

  out_canvas_1 = document.getElementById('out_canvas_1');
  out_context_1 = out_canvas_1.getContext('2d');

  out_canvas_2 = document.getElementById('out_canvas_2');
  out_context_2 = out_canvas_2.getContext('2d');

  out_canvas_3 = document.getElementById('out_canvas_3');
  out_context_3 = out_canvas_3.getContext('2d');

  out_canvas_4 = document.getElementById('out_canvas_4');
  out_context_4 = out_canvas_3.getContext('2d');

  slider = document.getElementById("slider_container");
  console.log(slider.clientWidth);
  document.getElementById("btn").style.left = slider.clientWidth+ "px";
  slider_width = slider.clientWidth;


  canvas_container = document.getElementsByClassName('canvas_cantainer')
  initialized = true;
  out_canvas_1.parentNode.style.display = 'block';
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
    document.getElementsByClassName("slider_icon")[0].classList.remove("closed");
    while(slider.clientWidth<slider_width){ 
      await sleep(10); 
      document.getElementById("btn").style.left = slider.clientWidth + "px";
    }
    is_slider_open = true;
}

async function close_slider(){
  slider.classList.remove("slider_open");
  slider.classList.add("slider_closed");
  document.getElementsByClassName("slider_icon")[0].classList.add("closed");
  while(slider.clientWidth>0){ 
    await sleep(1); 
    document.getElementById("btn").style.left = slider.clientWidth -4 + "px";
  }
  console.log(slider.clientWidth);
  document.getElementById("slider_outer").classList.remove("s2");
  // document.getElementById("slider_outer").classList.add("s0");
  is_slider_open = false;
  // document.getElementsByClassName("filter_container").remove("s10");
  // document.getElementsByClassName("filter_container").classList.add("s12");
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
        // draw(video,out_context_1,out_canvas_1.width,out_canvas_1.height);
        // blur(in_canvas, out_canvas_1)
        // draw(video,out_context_1,out_canvas_1.width,in_canvas.height);
        // apply_filter("in_canvas","out_canvas_1","GreyScale");
        
        apply_filter(in_canvas, out_canvas_1,filter_params)
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
  draw(video,out_context_1,out_canvas_1.width,in_canvas.height);
  draw(video,out_context_2,out_canvas_2.width,in_canvas.height);
  draw(video,out_context_3,out_canvas_3.width,in_canvas.height);
}

function draw(v,c,w,h){
  if(is_playing){
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
  }
}

function apply_filter(in_canvas_id,out_canvas_id,params){

    let src = cv.imread(in_canvas_id);
    let dst = new cv.Mat();
  
    let filter = filters.ADAPTIVE_THRESHOLD;

  switch(filter){
    case filters.ADAPTIVE_THRESHOLD:{
      let blocksize=params[fparams.BLOCK_SIZE];
      if(blocksize % 2 == 0)
        blocksize = blocksize + 1;
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      // You can try more different parameters
      cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, blocksize, 2);
      cv.imshow(out_canvas_id, dst);
    }break;

    case filters.THRESHOLD:{
      let thresh = params[fparams.THRESH];
      cv.threshold(src, dst, thresh, 200, cv.THRESH_BINARY);
      cv.imshow(out_canvas_id, dst);
    } break;


    case filters.GRAY:{
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      cv.imshow(out_canvas_id, dst);
    } break;

    case filters.BLUR: {
      let ksize = params[fparams.KSIZE];
      if(ksize%2 == 0)
        ksize = ksize + 1;
      let kernel = new cv.Size(ksize, ksize);
      let anchor = new cv.Point(-1, -1);
      cv.blur(src, dst, kernel, anchor, cv.BORDER_DEFAULT);
      cv.imshow(out_canvas_id, dst);
    } break;
    
    // case filter.BandW:
    case filters.Bilateral: {
      let diameter= params[fparams.DIAMETER]
      let sigmacolor=params[fparams.SIGMA_COLOR]
      let sigmaspace=params[fparams.SIGMA_SPACE]
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
      // You can try more different parameters
      cv.bilateralFilter(src, dst, diameter, sigmacolor, sigmaspace, cv.BORDER_DEFAULT);
      cv.imshow(out_canvas_id, dst);
    } break;
    case filters.MEDIAN_BLUR: {
      let ksize = params[fparams.KSIZE];
      if(ksize%2 == 0)
        ksize = ksize + 1;
      let kernel = new cv.Size(ksize, ksize);
      let anchor = new cv.Point(-1, -1);
      cv.medianBlur(src, dst, ksize);
      cv.imshow(out_canvas_id, dst);
    } break;

  }
  src.delete();
  dst.delete();
  setTimeout(apply_filter,20,in_canvas_id,out_canvas_id,params);

}

function pause() {
  if(!is_playing){
    return;    
  }
  is_playing = false;

  in_context.fillStyle="blue";
  in_context.fillRect(0, 0, in_canvas.width, in_canvas.height);

}

function add_canvas(){

  if(showing_canvases==1){
    out_canvas_2.parentNode.style.display="block";
    out_canvas_1.parentNode.classList.remove("m10");
    out_canvas_1.parentNode.classList.add("m5");
    showing_canvases++;
  }
  else if(showing_canvases==2) {
    out_canvas_3.parentNode.style.display="block"; 
    showing_canvases++;
  }
  else if(showing_canvases==3) {
    out_canvas_4.parentNode.style.display="block"; 
    out_canvas_3.parentNode.classList.remove("m10");
    out_canvas_3.parentNode.classList.add("m5");
    showing_canvases++;

  }
  else{
    M.toast({html: 'no more then four canvases', classes: 'rounded msg-toast'});
    // document.getElementById("add_del_canvas").children[0].innerHTML = "remove";

  }

}


function remove_canvas(){

  if(showing_canvases==4){

    out_canvas_4.parentNode.style.display="none";
    out_canvas_3.parentNode.classList.remove("m5");
    out_canvas_3.parentNode.classList.add("m10");
    showing_canvases--;
    if(selected_canvas=out_canvas_2){
      out_canvas_2.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }
    
  }
  else if(showing_canvases==3) {
    out_canvas_3.parentNode.style.display="none"; 
    showing_canvases--;
    if(selected_canvas=out_canvas_3){
      out_canvas_1.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }
  }
  else if(showing_canvases==2) {
    out_canvas_2.parentNode.style.display="none"; 
    out_canvas_1.parentNode.classList.remove("m5");
    out_canvas_1.parentNode.classList.add("m10");
    showing_canvases--;
    if(selected_canvas=out_canvas_2){
      out_canvas_2.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }

  }
  else{
    M.toast({html: 'no less than one canvas', classes: 'rounded msg-toast'});

  }

}
