// //Variables for sidebar
// var sidebar = document.getElementById('sidebar');
// var sidebarStartX;
// var sidebarEndX;

//Variables to store canvas information
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var BB=canvas.getBoundingClientRect();
var offsetX=BB.left;
var offsetY=BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// an array of objects that define different rectangles
var rects=[];
rects.push({id:1,x:75-15,y:50-15,width:100,height:100,fill:"#444444",isDragging:false});
rects.push({id:2,x:75+125,y:50,width:100,height:100,fill:"#ff550d",isDragging:false});

// drag related variables for rectangle
var dragok_rectangle = false;
var startX_rectangle;
var startY_rectangle;

context.lineWidth = 5;
var down = false;
var mode = 'pencil';
var background = 'white';

window.onload=function(){
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        context.fillStyle=r.fill;
        rect(r.x,r.y,r.width,r.height);
    }
};

//Make rectangle shape function
function rect(x,y,w,h) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.closePath();
    context.fill();
}

// handle touch start events for rectangle
function touchstart_rectangle(e){
    // get the current touch position
    var mx=parseInt(e.touches[0].clientX-offsetX);
    var my=parseInt(e.touches[0].clientY-offsetY);
    console.log('x coordinate of touch ' + mx);
    console.log('y coordinate of touch ' + mx);

    // test each rectangle to see if touch coordinate is inside or not
    dragok_rectangle = false;
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        if(mx>r.x && mx<r.x+r.width && my>r.y && my<r.y+r.height){
            // if yes, set that rects isDragging=true
            console.log('Inside rectangle');
            mode = 'rectangle'
            dragok_rectangle=true;
            r.isDragging=true;
        }
    }
    // save the current mouse position
    startX=mx;
    startY=my;
}

// handle touch end events for rectangle
function touchend_rectangle(e){
    // clear all the dragging flags
    dragok_rectangle = false;
    for(var i=0;i<rects.length;i++){
        rects[i].isDragging=false;
    }
}

//handle touchmove events for rectangle
function touchmove_rectangle(e){
    // if we're dragging a rectangle
    if (dragok_rectangle){
      console.log("Dragging rectangle");
      // get the current mouse position
    var mx=parseInt(e.touches[0].clientX-offsetX);
    var my=parseInt(e.touches[0].clientY-offsetY);

      // calculate the distance the mouse has moved
      // since the last mousemove
      var dx=mx-startX;
      var dy=my-startY;

      // move each rect that isDragging 
      // by the distance the mouse has moved
      // since the last mousemove
      for(var i=0;i<rects.length;i++){
          var r=rects[i];
          if(r.isDragging){
              console.log('id: ' + r.id);
              r.x+=dx;
              r.y+=dy;
          }
      }

      // for(var i=0;i<rects.length;i++){
      //   var r=rects[i];
      //   context.fillStyle=r.fill;
      //   rect(r.x,r.y,r.width,r.height);
      // }

      // reset the starting mouse position for the next mousemove
      startX=mx;
      startY=my;
    }
}

canvas.addEventListener('touchmove', draw);

canvas.addEventListener('touchstart', function(e) {
    // tell the browser we're handling this touch event
    e.preventDefault();
    e.stopPropagation();

    touchstart_rectangle(e);

    if (mode === 'pencil') {
        down = true;
        context.beginPath();
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos =e.touches[0].clientY - canvas.offsetTop;
        context.moveTo(xPos, yPos);
        canvas.addEventListener("touchmove", draw);
    } else if (mode === 'eraser') {
        down = true;
        context.beginPath();
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos =e.touches[0].clientY - canvas.offsetTop;
        context.moveTo(xPos, yPos);
        canvas.addEventListener("touchmove", draw);
    }
});

canvas.addEventListener('touchend', function() {
    // tell the browser we're handling this touch event
    e.preventDefault();
    e.stopPropagation();
    touchend_rectangle(e);
    down = false;
    console.log("REACHED!");
});

function draw(e){
    //Modes
    clearCanvas();
    console.log('mode: ' + mode)
    if (mode === 'eraser') {
        context.strokeStyle = background;
        context.fillStyle = background;
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos =e.touches[0].clientY - canvas.offsetTop;
        if (down == true) {
            context.lineTo(xPos, yPos);
            context.stroke();
        }
    } else {
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos =e.touches[0].clientY - canvas.offsetTop;
        if (down == true) {
            context.lineTo(xPos, yPos);
            context.stroke();
        }
    }

    touchmove_rectangle(e);
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        context.fillStyle=r.fill;
        rect(r.x,r.y,r.width,r.height);
    }

}

function changeColor(color){
    context.strokeStyle = color;
    context.fillStyle = color;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function changeBrushSize(size) {
    context.lineWidth = size;
}

function fillCanvas() {
    background = context.fillStyle;
    console.log(background);
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function changeBrushStyle(brushStyle) {context.lineCap = brushStyle;}

function triggerClick() {document.getElementById('file').click();}

document.getElementById('file').addEventListener('change', function(e) {
    clearCanvas();
    URL = URL || webkitURL;
    var temp = URL.createObjectURL(e.target.files[0]);
    var image = new Image();
    image.src = temp;
    image.addEventListener('load', function() {
        imageWidth = image.naturalWidth;
        imageHeight = image.naturalHeight;
        newImageWidth = imageWidth;
        newImageHeight = imageHeight;
        originalImageRatio = imageWidth / imageHeight;
        if (newImageWidth > newImageHeight && newImageWidth > canvas.width) {
            newImageWidth = canvas.width;
            newImageHeight = canvas.width / originalImageRatio;
        }
        if (newImageHeight > newImageWidth && newImageHeight > canvas.height) {
            newImageHeight = canvas.height;
            newImageWidth = canvas.height * originalImageRatio;
        }
        if (newImageWidth == newImageHeight && newImageHeight > canvas.height) {
            newImageHeight = canvas.height;
            newImageWidth = canvas.height * originalImageRatio;
        }
        context.drawImage(image, 0, 0, newImageWidth, newImageHeight);//last two argument is x y original location where you want to put your img
        URL.revokeObjectURL(temp);// release the reference to this img
    });
});

// function sideBarTouchStart(event) {
//     sidebarStartX = event.touches[0].clientX;
// }
// function sideBarTouchEnd(event) {
//     console.log(event.changedTouches[0].clientX);
//     var changes = event.changedTouches[0].clientX;
//     if (changes < 0) {
//         console.log('hi');
//         sidebar.style.left = '-300px';
//     } else {
//         sidebar.style.left = '0px';
//     }
// }

function changeMode(curMode) {
 mode = curMode;
}