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

// an array of objects that define different strokes
var strokes = [];

// an array of objects that define different eraser strokes
var eraser_strokes = [];

//Variable flag to indicate if dragging or not
var isDragging = false;

//Variable flag to indicate if selecting or not
var isSelecting_rectangle = false;
var isSelecting_circle = false;

// an array of objects that define different rectangles
var rects=[];
var new_rectangle_made = false; //Flag to tell if a new rectangle is made or not
var rect_count = 1; // Count number of rectangles -> is the id of each rectangle
rects.push({id:1,x:75-15,y:50-15,width:150,height:100,fill:"No fill",stroke: "black",isDragging:false,isSelected: false});
//var selected_rects = []; //An array of selected rectangles
var gesture_or_not_rectangle = false; //Flag to tell if gesture going to start or not


// drag related variables for rectangle
var dragok_rectangle = false;
var startX_rectangle;
var startY_rectangle;

//Used for resizing gesture for rectangle
var startX1_rectangle;
var startY1_rectangle;

// an array of objects that defines different circles
var circles = [];
var new_circle_made = false; //Flag to tell if a new circle is made or not
var circle_count = 1;  // Count number of circles -> is the id of each rectangle
circles.push({id:1, x:130, y:220, r:60, fill: "No fill",stroke: "black", isDragging: false, isSelected: false});
//var selected_circles = []; //An array of selected circles
var gesture_or_not_circle = false; //Flag to tell if gesture going to start or not


// drag related variables for circles
var dragok_circle = false;
var startX_circle;
var startY_circle;

context.lineWidth = 5;
var down = false;
var mode = 'pencil';
var background = 'white';

//Variables for strokes
var startX;
var startY;

//Variables for eraser strokes
var startX_eraser;
var startY_eraser;

window.onload=function(){
    init();
};

//Initiate function
function init(){
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        rect(r.x,r.y,r.width,r.height, r.stroke,r.fill);
    }

    for(var i=0; i<circles.length;i++){
        var c=circles[i];
        circle(c.x,c.y,c.r,c.fill,c.stroke);
    }
}

//Make rectangle shape function
function rect(x,y,w,h,stroke,fill) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.lineWidth = 3;
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.stroke();
    context.closePath();
    console.log(fill);
    if(!(fill === "No fill")){
        //console.log("REACHED!");
        context.fill();
    } 
}

//Make circle shape function
function circle(x,y,r,fill,stroke){
    console.log(fill);
    var startingAngle = 0;
    var endAngle = 2 * Math.PI;
    context.beginPath();
    context.arc(x, y, r, startingAngle, endAngle);
    context.fillStyle = fill;
    context.lineWidth = 3;
    if(!(fill === "No fill")){
        context.fill();
    } 
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

//handle touch start events for circles
function touchstart_circle(e){
    var first = false;//flag variable to check if 1st touch is inside of circle or not
    // get the current touch position
    var mx=parseInt(e.touches[0].clientX-offsetX);
    var my=parseInt(e.touches[0].clientY-offsetY);
    var mx_1 = 0;
    var my_1 = 0;
    console.log('x coordinate of touch ' + mx);
    console.log('y coordinate of touch ' + mx);
    console.log(mode);

    if(e.touches.length === 2){
        mx_1 = parseInt(e.touches[1].clientX-offsetX);
        my_1 = parseInt(e.touches[1].clientY-offsetY);
        console.log('x coordinate of 2nd touch ' + mx_1);
        console.log('y coordinate of 2nd touch ' + my_1);
        console.log(mode);
    }
    //Test each circle to see if touch coordinate is inside or not
    dragok_circle = false;
    for(var i=0;i<circles.length;i++){
        var c=circles[i];
        // subtract the x, y coordinates from the touch position to get coordinates 
        // for the hotspot location and check against the area of the radius
        var areaX = mx - c.x;
        var areaY = my - c.y;
        if(areaX * areaX + areaY * areaY <= c.r * c.r){
            first = true;
            // if yes, set that rects isDragging=true
            console.log('Inside circle');
            mode = 'circle';
            dragok_circle=true;
            c.isDragging=true;

            if(c.isSelected == false){
                c.isSelected = true;
            } else {
                c.isSelected = false;
            }

            //shape at toolbar cannot be selected
            if(c.id == 1){
                c.isSelected = false;
            }

            if(c.id>1){
                timer = setTimeout( make_color_slider_appear, 2000 );
            }
        }

        //Check if 2nd touch inside rectangle or not
        if(e.touches.length === 2 && first == true){
            var areaX = mx_1 - c.x;
            var areaY = my_1 - c.y;
            if(areaX * areaX + areaY * areaY <= c.r * c.r){
                gesture_or_not_circle = true;
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
    var first = false; // Flag variable to indicate if first touch is inside rectangle or not
    var mx=parseInt(e.touches[0].clientX-offsetX);
    var my=parseInt(e.touches[0].clientY-offsetY);
    var mx_1 = 0;
    var my_1 = 0;
    console.log('x coordinate of touch ' + mx);
    console.log('y coordinate of touch ' + my);
    console.log(mode);

    if(e.touches.length === 2){
        mx_1 = parseInt(e.touches[1].clientX-offsetX);
        my_1 = parseInt(e.touches[1].clientY-offsetY);
        console.log('x coordinate of 2nd touch ' + mx_1);
        console.log('y coordinate of 2nd touch ' + my_1);
        console.log(mode);
    }

    // test each rectangle to see if touch coordinate is inside or not
    dragok_rectangle = false;
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        if(mx>r.x && mx<r.x+r.width && my>r.y && my<r.y+r.height){
            first = true;
            // if yes, set that rects isDragging=true
            console.log('Inside rectangle');
            console.log('id: ' + r.id);
            mode = 'rectangle';
            dragok_rectangle=true;
            r.isDragging=true;

            if(r.isSelected == false){
                r.isSelected = true;
            } else{
                console.log("Start deselection!");
                r.isSelected = false;
            }

            //shape at toolbar cannot be selected
            if(r.id == 1){
                r.isSelected = false;
            }
            
            //selected_rects.push(r);
            if(r.id>1){
                timer = setTimeout( make_color_slider_appear, 2000 );
            }
        }

        //Check if 2nd touch inside rectangle or not
        if(e.touches.length === 2 && first == true){
            if(mx_1>r.x && mx_1<r.x+r.width && my_1>r.y && my_1<r.y+r.height){
                gesture_or_not_rectangle = true;
            }
            startX1_rectangle=mx_1;
            startY1_rectangle=my_1;
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

    //Check if selecting or dragging object
    if(!isDragging){
        //Highlight selected objects in blue
        for(var i=0;i<circles.length;i++){
            if(circles[i].id!= 1){
                if(circles[i].isSelected){
                    circles[i].stroke = "blue";
                    isSelecting_circle = true;
                } else {
                    circles[i].stroke = "black";
                }
            }
        }

        if(isSelecting_circle){
            for(var i=0;i<circles.length;i++){
                var c=circles[i];
                circle(c.x,c.y,c.r,c.fill,c.stroke);
            }
        }
    }

    if(isDragging){
        isDragging = false;
    }

    if(gesture_or_not_circle){
        gesture_or_not_circle = false;
    }

    if(!isSelecting_circle){
        context.strokeStyle = 'black';
    }

    for(var i=0;i<circles.length;i++){
        circles[i].isDragging=false;
    }
}

// handle touch end events for rectangle
function touchend_rectangle(e){
    // clear all the dragging flags
    dragok_rectangle = false;
    new_rectangle_made = false;

    //Check if selecting or dragging object
    if(!isDragging){
        //Highlight selected objects in blue
        for(var i=0;i<rects.length;i++){
            if(rects[i].id!= 1){
                if(rects[i].isSelected){
                    rects[i].stroke = "blue";
                    isSelecting_rectangle = true;
                } else{
                    rects[i].stroke = 'black';
                }    
            }
        }

        if(isSelecting_rectangle){
            for(var i=0;i<rects.length;i++){
                var r=rects[i];
                rect(r.x,r.y,r.width,r.height, r.stroke, r.fill); 
            }
        }
    }

    if(isDragging){
        isDragging = false;
    }

    if(gesture_or_not_rectangle){
        gesture_or_not_rectangle = false;
    }

    if(!isSelecting_rectangle){
        context.strokeStyle = 'black';
    }

    for(var i=0;i<rects.length;i++){
        rects[i].isDragging=false;
    }
}

//handle resize gesture for circle
function handle_resize_gesture_circle(mx,my,mx1,my1){
    for(var i=0;i<circles.length;i++){
        var c = circles[i];
        if(c.isDragging){
            if(c.id != 1){
                if(c.x + r < mx || c.x + r < mx1){
                    //window.print("2 touches detected in circle!");
                    c.r += (mx - (c.x+r));
                }
            }
        }
    }
}

//handle touchmove events for circle
function touchmove_circle(e){
    if(dragok_circle){
        console.log("Dragging circle");
        // get the current touch position
        var mx=parseInt(e.touches[0].clientX-offsetX);
        var my=parseInt(e.touches[0].clientY-offsetY);
        var mx_1 = 0;
        var my_1 = 0;

        if(gesture_or_not_circle){
            //window.print("2 touches detected in circle!");
            mx_1 = parseInt(e.touches[1].clientX-offsetX);
            my_1 = parseInt(e.touches[1].clientY-offsetY);
            handle_resize_gesture_circle(mx,my,mx_1,my_1);
        } else {
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
                            circles.push({id:circle_count, x:130, y:220, r:60, fill: "No fill",stroke: "black", isDragging: true, isSelected: false});
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
}

//handle gestures of rectangle resizing
function handle_resize_gesture_rectangle(mx, my, mx1, my1){
    // for(var i=0;i<rects.length;i++){
    //     var r = rects[i];
    //     if(r.isDragging){
    //         if(r.id != 1){
    //             var dx=mx-startX_rectangle;
    //             var dy=my-startY_rectangle;
    //             var dx_1=mx1-startX1_rectangle;
    //             var dy_1=my1-startY1_rectangle;

    //             //Upperleft corner
    //             if(mx < r.x || mx1 < r.x){

    //             }
    //             //Upperright corner
    //             if(mx > r.x + r.width || mx1 > r.x + r.width){

    //             }
    //             //Lowerleft corner
    //             if(mx){

    //             }
    //             //Lowerright corner
    //         }  
    //     }
    // }
}

//handle touchmove events for rectangle
function touchmove_rectangle(e){
    // if we're dragging a rectangle
    if (dragok_rectangle){
        isDragging = true;
        console.log("Dragging rectangle");
        // get the current touch position
        var mx=parseInt(e.touches[0].clientX-offsetX);
        var my=parseInt(e.touches[0].clientY-offsetY);
        var mx_1 = 0;
        var my_1 = 0;

        if(gesture_or_not_rectangle){
            mx_1 = parseInt(e.touches[1].clientX-offsetX);
            my_1 = parseInt(e.touches[1].clientY-offsetY);
            handle_resize_gesture_rectangle(mx,my,mx_1,my_1);
        } else {
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
                            rects.push({id:rect_count,x:75-15,y:50-15,width:150,height:100,fill:"No fill",stroke:"black", isDragging:true, isSelected: false}); 
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

        //Remove all selections for rectangles
        if(isSelecting_rectangle == true){
            isSelecting_rectangle = false;
            for(var i=0; i<rects.length; i++){
                var r = rects[i]
                if(r.isSelected){
                    r.isSelected = false;
                    r.stroke = 'black';
                    rect(r.x,r.y,r.width,r.height, r.stroke, r.fill);
                }
            }
        }

        //Remove all selections for circles
        if(isSelecting_circle == true){
            isSelecting_circle = false;
            for(var i=0; i<circles.length; i++){
                var c = circles[i]
                if(c.isSelected){
                    c.isSelected = false;
                    c.stroke = 'black';
                    circle(c.x,c.y,c.r,c.fill,c.stroke);
                }
            }
        }

        down = true;
        //context.beginPath();
        startX = e.touches[0].clientX - canvas.offsetLeft;
        startY = e.touches[0].clientY - canvas.offsetTop;
        //context.moveTo(xPos, yPos);
        //canvas.addEventListener("touchmove", draw);
    } else if (mode === 'eraser') {
        down = true;
        //context.beginPath();
        startX_eraser = e.touches[0].clientX - canvas.offsetLeft;
        startY_eraser = e.touches[0].clientY - canvas.offsetTop;
        //context.moveTo(xPos, yPos);
        //canvas.addEventListener("touchmove", draw);
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
    mode = "pencil";
    down = false;
});

function draw(e){
    //Modes
    if(dragok_circle || dragok_rectangle){
        clearCanvas();
    }
    console.log('mode: ' + mode)
    if (mode === 'eraser') {
        context.strokeStyle = background;
        context.fillStyle = background;
        if(eraser_strokes.length   >0){
            for(var i=0; i<eraser_strokes.length;i++){
                var s = eraser_strokes[i];
                context.moveTo(s.start_X,s.start_Y);
                context.lineTo(s.end_X,s.end_Y);
                context.stroke();
            }
        }
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos = e.touches[0].clientY - canvas.offsetTop;
        if (down == true) {
            context.moveTo(startX_eraser, startY_eraser);
            context.lineTo(xPos, yPos);
            context.stroke();
            strokes.push({start_X:startX_eraser, start_Y: startY_eraser, end_X: xPos, end_Y: yPos});
            startX_eraser = xPos;
            startY_eraser = yPos;
        }
    } else {
        //Draw all previous strokes
        if(strokes.length>0){
            for(var i=0; i<strokes.length;i++){
                var s = strokes[i];
                context.moveTo(s.start_X,s.start_Y);
                context.lineTo(s.end_X,s.end_Y);
                context.stroke();
            }
        }
        
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos = e.touches[0].clientY - canvas.offsetTop;
        if (down == true) {
            context.moveTo(startX, startY);
            context.lineTo(xPos, yPos);
            context.stroke();
            strokes.push({start_X:startX, start_Y: startY, end_X: xPos, end_Y: yPos});
            startX = xPos;
            startY = yPos;
        }
    }

    //Comment out starting from here
    touchmove_rectangle(e);
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        context.fillStyle=r.fill;
        rect(r.x,r.y,r.width,r.height, r.stroke, r.fill);
    }
    touchmove_circle(e);
    for(var i=0; i<circles.length;i++){
        var c=circles[i];
        circle(c.x,c.y,c.r,c.fill,c.stroke);
    }
    //to here if pencil does not work
}

function changeColor(color){
    //context.strokeStyle = color;

    //Change color of selected objects
    if(isSelecting_rectangle){
        for(var i = 0; i < rects.length;i++){
            var r = rects[i];
            if(r.isSelected){
                r.fill = color;
                rect(r.x,r.y,r.width,r.height, r.stroke, r.fill);
            }
        }
    }
    if(isSelecting_circle){
        for(var i = 0; i < circles.length;i++){
            var c = circles[i];
            if(c.isSelected){
                c.fill = color;
                circle(c.x,c.y,c.r,c.fill,c.stroke);
            }
        }
    }
    //context.fillStyle = color;
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