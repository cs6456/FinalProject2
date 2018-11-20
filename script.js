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

var colorslider = document.getElementById('colorRange');

var timer = null; // timer for tap and hold function

// an array of objects that define different rectangles
var rects=[];
var new_rectangle_made = false; //Flag to tell if a new rectangle is made or not
var rect_count = 1; // Count number of rectangles -> is the id of each rectangle
rects.push({id:1,x:75-15,y:50-15,width:150,height:100,fill:"#444444",isDragging:false});

// drag related variables for rectangle
var dragok_rectangle = false;
var startX_rectangle;
var startY_rectangle;

// an array of objects that defines different circles
var circles = [];
var new_circle_made = false; //Flag to tell if a new circle is made or not
var circle_count = 1;  // Count number of circles -> is the id of each rectangle
circles.push({id:1, x:130, y:220, r:60, fill: "red",stroke: "black", isDragging: false});

// drag related variables for circles
var dragok_circle = false;
var startX_circle;
var startY_circle;

context.lineWidth = 5;
var down = false;
var mode = 'pencil';
var background = 'white';

window.onload=function(){
    init();
};

//Initiate function
function init(){
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        context.fillStyle=r.fill;
        rect(r.x,r.y,r.width,r.height);
    }

    for(var i=0; i<circles.length;i++){
        var c=circles[i];
        circle(c.x,c.y,c.r,c.fill,c.stroke);
    }
}

//Make rectangle shape function
function rect(x,y,w,h) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.closePath();
    context.fill();
}

//Make circle shape function
function circle(x,y,r,fill,stroke){
    var startingAngle = 0;
    var endAngle = 2 * Math.PI;
    context.beginPath();
    context.arc(x, y, r, startingAngle, endAngle);
    context.fillStyle = fill;
    context.lineWidth = 3;
    context.fill();
    context.strokeStyle = stroke;
    context.stroke();
}

//make range color appear
function make_color_slider_appear(){
    colorslider.style.visibility = "visible";
}

//make range color dissapear
function make_color_slider_dissapear(){
    colorslider.style.visibility = "hidden";
}

// //Add listener for when value in color slider change
// colorslider.addEventListener("change",function(){
//     var r,g,b;
//     if(slider.value<=50){
//         r=255;
//         g=Math.round(255*slider.value/50);
//         b=0;
//     }else{
//         r=Math.round(255*(100-slider.value)/50);
//         g=r;
//         b=Math.round(255*(slider.value-50)/50);
//     }
//     ctx.fillStyle="rgb("+r+","+g+","+b+")";
//     ctx.beginPath();
//     ctx.rect(0,0,100,100);
//     ctx.fill();
//     ctx.restore();
// },false);

//handle touch start events for circles
function touchstart_circle(e){
    // get the current touch position
    var mx=parseInt(e.touches[0].clientX-offsetX);
    var my=parseInt(e.touches[0].clientY-offsetY);
    console.log('x coordinate of touch ' + mx);
    console.log('y coordinate of touch ' + mx);

    //Test each circle to see if touch coordinate is inside or not
    dragok_circle = false;
    for(var i=0;i<circles.length;i++){
        var c=circles[i];
        // subtract the x, y coordinates from the touch position to get coordinates 
        // for the hotspot location and check against the area of the radius
        var areaX = mx - c.x;
        var areaY = my - c.y;
        if(areaX * areaX + areaY * areaY <= c.r * c.r){
            // if yes, set that rects isDragging=true
            console.log('Inside circle');
            mode = 'circle'
            dragok_circle=true;
            c.isDragging=true;

            if(c.id>1){
                timer = setTimeout( make_color_slider_appear, 2000 );
            }
        }
    }

    //Save current touch position
    startX_circle=mx;
    startY_circle=my;
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

            if(r.id>1){
                timer = setTimeout( make_color_slider_appear, 2000 );
            }
        }
    }
    // save the current touch position
    startX_rectangle=mx;
    startY_rectangle=my;
}

// handle touch end events for circle
function touchend_circle(e){
    // clear all the dragging flags
    dragok_circle = false;
    new_circle_made = false;
    for(var i=0;i<circles.length;i++){
        circles[i].isDragging=false;
    }
}

// handle touch end events for rectangle
function touchend_rectangle(e){
    // clear all the dragging flags
    dragok_rectangle = false;
    new_rectangle_made = false;
    for(var i=0;i<rects.length;i++){
        rects[i].isDragging=false;
    }
}

//handle touchmove events for circle
function touchmove_circle(e){
    if(dragok_circle){
        console.log("Dragging circle");
        // get the current touch position
        var mx=parseInt(e.touches[0].clientX-offsetX);
        var my=parseInt(e.touches[0].clientY-offsetY);

        // calculate the distance the touch has moved
        // since the last touchmove
        var dx=mx-startX_circle;
        var dy=my-startY_circle;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for(var i=0;i<circles.length;i++){
            var c=circles[i];
            if(c.isDragging){
            //Check if its the rectangle tool or not
                if(c.id == 1){
                    if(!new_circle_made){
                        circle_count++;
                        circles.push({id:circle_count, x:130, y:220, r:60, fill: "red",stroke: "black", isDragging: true});
                        new_circle_made = true;
                    }
                } else {
                    console.log('id: ' + c.id);
                    c.x+=dx;
                    c.y+=dy;
                } 
            }
        }

        // reset the starting mouse position for the next mousemove
        startX_circle=mx;
        startY_circle=my;
    }
}

//handle touchmove events for rectangle
function touchmove_rectangle(e){
    // if we're dragging a rectangle
    if (dragok_rectangle){
        console.log("Dragging rectangle");
        // get the current touch position
        var mx=parseInt(e.touches[0].clientX-offsetX);
        var my=parseInt(e.touches[0].clientY-offsetY);

        // calculate the distance the touch has moved
        // since the last touchmove
        var dx=mx-startX_rectangle;
        var dy=my-startY_rectangle;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for(var i=0;i<rects.length;i++){
            var r=rects[i];
            if(r.isDragging){
            //Check if its the rectangle tool or not
                if(r.id == 1){
                    if(!new_rectangle_made){
                        rect_count++;
                        rects.push({id:rect_count,x:75-15,y:50-15,width:150,height:100,fill:"#444444",isDragging:true}); 
                        new_rectangle_made = true;
                    }
                } else {
                    console.log('id: ' + r.id);
                    r.x+=dx;
                    r.y+=dy;
                } 
            }
        }

        // reset the starting mouse position for the next mousemove
        startX_rectangle=mx;
        startY_rectangle=my;
    }
}

canvas.addEventListener('touchmove', draw);

canvas.addEventListener('touchstart', function(e) {
    // tell the browser we're handling this touch event
    e.preventDefault();
    e.stopPropagation();

    //Preform touchstart events for rectangle
    touchstart_rectangle(e);
    //Perform touchstart events for circle
    touchstart_circle(e);

    if (mode === 'pencil') {
        down = true;
        context.beginPath();
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos = e.touches[0].clientY - canvas.offsetTop;
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

canvas.addEventListener('touchend', function(e) {
    // tell the browser we're handling this touch event
    e.preventDefault();
    e.stopPropagation();

    //Perform touchend events for rectangle
    touchend_rectangle(e);
    //Perform touchend events for circle
    touchend_circle(e);
    //Make color slider dissapear on not touching
    make_color_slider_dissapear();
    down = false;
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
        yPos = e.touches[0].clientY - canvas.offsetTop;
        if (down == true) {
            context.lineTo(xPos, yPos);
            context.stroke();
        }
    }

    //Comment out starting from here
    touchmove_rectangle(e);
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        context.fillStyle=r.fill;
        rect(r.x,r.y,r.width,r.height);
    }
    touchmove_circle(e);
    for(var i=0; i<circles.length;i++){
        var c=circles[i];
        circle(c.x,c.y,c.r,c.fill,c.stroke);
    }
    //to here if pencil does not work
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