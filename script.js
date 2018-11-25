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

//Objects put into canvas
var objects = [];

var timer = null; // timer for tap and hold function
//Variable flag to indicate if dragging or not
var isDragging = false;

//Variable flag to indicate if selecting or not
var isSelecting_rectangle = false;
var isSelecting_circle = false;

//Variable flag to indicate clear or not
var is_clear = false;
var is_clear_touches = [];
var startx0_clear;
var startx1_clear;
var startx2_clear;
var starty0_clear;
var starty1_clear;
var starty2_clear;

//variable flag to indicate closing shape toolbox
var is_close_shape_toolbox = false;


// an array of objects that define different rectangles
var rects=[];
var new_rectangle_made = false; //Flag to tell if a new rectangle is made or not
var rect_count = 1; // Count number of rectangles -> is the id of each rectangle
rects.push({id:0,x:35,y:20,width:150,height:175,fill:"No fill",stroke:"black",isDragging:false,isSelected:false, r_value:0, g:0, b:0});
rects.push({id:1,x:75-15,y:50-15,width:100,height:55,fill:"No fill",stroke: "black",isDragging:false,isSelected: false, r_value:0, g:0, b:0});
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
circles.push({id:1, x:110, y:145, r:40, fill: "No fill",stroke: "black", isDragging: false, isSelected: false, rc:0, g:0, b:0});
//var selected_circles = []; //An array of selected circles
var gesture_or_not_circle = false; //Flag to tell if gesture going to start or not


// drag related variables for circles
var dragok_circle = false;
var startX_circle;
var startY_circle;

//Used for resizing gesture for circle
var startX1_circle;
var startY1_circle;

context.lineWidth = 5;
var down = false;
var mode = 'pencil';
var background = 'white';

// an array of objects that define different strokes
var strokes = [];
//Variables for strokes
var startX;
var startY;
var pencilcolor = 'black'; //initial stroke color
var pencil_width = 3; // Variable to keep track of current line width


// an array of objects that define different eraser strokes
var eraser_strokes = [];
//Variables for eraser strokes
var startX_eraser;
var startY_eraser;

//Variables for crop
var crops = [];
var startX_crop;
var startY_crop;
var endX_crop;
var endY_crop;
var crop_count = 0;


//Variables for color slider
//Put information for r, g, and b color sliders
// var r_color_slider=makeRangeControl(50,500,200,25);
// var g_color_slider=makeRangeControl(50,530,200,25);
// var b_color_slider=makeRangeControl(50,560,200,25);
var r_color_slider=makeRangeControl(50,300,200,25, "red");
var g_color_slider=makeRangeControl(50,350,200,25, "green");
var b_color_slider=makeRangeControl(50,400,200,25, "blue");
var r_isDown = false; //Flag variable to check if it is possible to move slider in range slider for color slider
var g_isDown = false; //Flag variable to check if it is possible to move slider in range slider for color slider
var b_isDown = false; //Flag variable to check if it is possible to move slider in range slider for color slider
var c_rect_shape = null; //variable to keep track of selected rectangle for color change with slider
var c_circle_shape = null; //variable to keep track of selected circle for color change with slider

//Variables for pencil-width or size slider
var p_slider = makeRangeControl(50,450,200,25, "black");
var p_isDown = false; //Flag variable to check if it is possible to move slider in range slider for pencil width slider

//Variable to keep track of mode
var curMode = 'pencil'; //Initial is pencil

window.onload=function(){
    init();
};

//Initiate function
function init(){
    make_shape_toolbox();
}

//Function to generate shape toolbox
function make_shape_toolbox(){
    var r = rects[0];
    rect(r.x,r.y,r.width,r.height, r.stroke,"white",r.r_value,r.g,r.b);

    rect(r.x + 130,r.y,20,20, r.stroke,"white",r.r_value,r.g,r.b); //For x button
    context.fillStyle='black';
    context.textAlign='center';
    context.textBaseline='top';
    context.font='20px arial';
    context.fillText("X",r.x+140,r.y);

    r = rects[1];
    rect(r.x,r.y,r.width,r.height, r.stroke,r.fill, r.r_value,r.g,r.b);
    var c = circles[0];
    circle(c.x,c.y,c.r,c.fill,c.stroke, c.rc, c.g, c.b);
}

//Test
//Make rectangle shape function
function rect(x,y,w,h,stroke,fill,r,g,b) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.lineWidth = 3;
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.stroke();
    context.closePath();
    if(!(fill === "No fill")){
        if(fill === "Change in rgb value"){
            context.fillStyle = 'rgb(' + r +',' + g + ',' + b + ')';
            context.fill();
        } else {
            context.fill();
        }
    } 
}

//Make circle shape function
function circle(x,y,r,fill,stroke,rc,g,b){
    var startingAngle = 0;
    var endAngle = 2 * Math.PI;
    context.beginPath();
    context.arc(x, y, r, startingAngle, endAngle);
    context.fillStyle = fill;
    context.lineWidth = 3;
    if(!(fill === "No fill")){
        if(fill === "Change in rgb value"){
            context.fillStyle = 'rgb(' + rc +',' + g + ',' + b + ')';
            context.fill();
        } else{
            context.fill();
        }
    } 
    context.strokeStyle = stroke;
    context.stroke();
}

//Make range slider function
function makeRangeControl(x,y,width,height,fill){
    var range={x:x,y:y,width:width,height:height, fill:fill};
    range.x1=range.x+range.width;
    range.y1=range.y;
    range.pct=0;
    return(range);
}

//Draw color range slider
function drawColorRangeControl(range,value){
    // clear the range control area
    range.pct = value/255;
    // bar
    context.lineWidth=6;
    context.lineCap='round';
    context.beginPath();
    context.moveTo(range.x,range.y);
    context.lineTo(range.x1,range.y);
    context.strokeStyle=range.fill;
    context.stroke();
    // thumb
    context.beginPath();
    var thumbX=range.x+range.width*range.pct;
    context.moveTo(thumbX,range.y-range.height/2);
    context.lineTo(thumbX,range.y+range.height/2);
    context.strokeStyle='rgba(255,0,0,0.25)';
    context.stroke();
    // legend
    context.fillStyle='black';
    context.textAlign='center';
    context.textBaseline='top';
    context.font='10px arial';
    context.fillText(parseInt(range.pct*255),range.x+range.width/2,range.y-range.height/2-2);
}

//Draw pencil range slider
function drawPencilRangeControl(range,value){
    // clear the range control area
    range.pct = value/40;
    // bar
    context.lineWidth=6;
    context.lineCap='round';
    context.beginPath();
    context.moveTo(range.x,range.y);
    context.lineTo(range.x1,range.y);
    context.strokeStyle=range.fill;
    context.stroke();
    // thumb
    context.beginPath();
    var thumbX=range.x+range.width*range.pct;
    context.moveTo(thumbX,range.y-range.height/2);
    context.lineTo(thumbX,range.y+range.height/2);
    context.strokeStyle='rgba(255,0,0,0.25)';
    context.stroke();
    // legend
    context.fillStyle='black';
    context.textAlign='center';
    context.textBaseline='top';
    context.font='10px arial';
    context.fillText(parseInt(range.pct*40),range.x+range.width/2,range.y-range.height/2-2);
}

//Clear color slider function
function clearColorRangeControl(range){
    context.clearRect(range.x-12.5,range.y-range.height/2-15,range.width+25,range.height+20);
}

//handle touch start events for pencil width range slider
function touchstart_pencilSlider(e){
    var mx=0;
    var my=0;
    if(e.touches.length == 2){
        mx=parseInt(e.touches[1].clientX-offsetX);
        my=parseInt(e.touches[1].clientY-offsetY);
        if(mx>p_slider.x && mx<p_slider.x+p_slider.width && my>p_slider.y-p_slider.height/2 && my<p_slider.y+p_slider.height/2){
            p_isDown = true;
            mode = 'pencil slider';
        } 
    }
}

//handle touch start events for color range slider
function touchstart_colorSlider(e){
    var mx=0;
    var my=0;
    if(e.touches.length == 2){
        mx=parseInt(e.touches[1].clientX-offsetX);
        my=parseInt(e.touches[1].clientY-offsetY);
        if(mx>r_color_slider.x && mx<r_color_slider.x+r_color_slider.width && my>r_color_slider.y-r_color_slider.height/2 && my<r_color_slider.y+r_color_slider.height/2){
            r_isDown = true;
            mode = 'red color slider';
        } 
        else if (mx>g_color_slider.x && mx<g_color_slider.x+g_color_slider.width && my>g_color_slider.y-g_color_slider.height/2 && my<g_color_slider.y+g_color_slider.height/2){
            g_isDown = true;
            mode = 'green color slider';
        }
        else if (mx>b_color_slider.x && mx<b_color_slider.x+b_color_slider.width && my>b_color_slider.y-b_color_slider.height/2 && my<b_color_slider.y+b_color_slider.height/2){
            b_isDown = true;
            mode = 'blue color slider';
        }
    } 
}

//function to update new r g b values according to color slider value
function update_color_value(r,g,b){
    if(c_circle_shape != null){
        for(var i = 0;i < circles.length; i++){
            var c = circles[i];
            if(c.id === c_circle_shape.id){
                c.rc = r;
                c.g = g;
                c.b = b;
                c.fill = "Change in rgb value";
            }
        }
    } else if (c_rect_shape != null){
        for(var i = 0;i < rects.length; i++){
            var rec = rects[i];
            if(rec.id === c_rect_shape.id){
                console.log("REACHED HERE!!");
                rec.r_value = r;
                rec.g = g;
                rec.b = b;
                rec.fill = "Change in rgb value";
            }
        }
    }
}

//function to update new width value according to pencil width slider value
function update_pencil_value(new_width){
    pencil_width = new_width;
}

//handle touch move events for pencil width range slider
function touchmove_pencilSlider(e){
    if(p_isDown){
        touchX=parseInt(e.touches[1].clientX-offsetX);
        touchY=parseInt(e.touches[1].clientY-offsetY);

        // set new thumb & redraw
        p_slider.pct=Math.max(0,Math.min(1,(touchX-p_slider.x)/p_slider.width));
        var new_width= p_slider.pct*40;
        context.clearRect(p_slider.x-12.5,p_slider.y-p_slider.height/2-15,p_slider.width+25,p_slider.height+20);
        drawPencilRangeControl(p_slider, new_width);
        update_pencil_value(new_width);
    }
}

//handle touch move events for color range slider
function touchmove_colorSlider(e){
    if(r_isDown || g_isDown || b_isDown){
        touchX=parseInt(e.touches[1].clientX-offsetX);
        touchY=parseInt(e.touches[1].clientY-offsetY);

        // set new thumb & redraw
        var new_r =r_color_slider.pct*255;
        var new_g =g_color_slider.pct*255;
        var new_b =b_color_slider.pct*255;
        if(r_isDown){
            r_color_slider.pct=Math.max(0,Math.min(1,(touchX-r_color_slider.x)/r_color_slider.width));
            new_r = r_color_slider.pct*255;
            context.clearRect(r_color_slider.x-12.5,r_color_slider.y-r_color_slider.height/2-15,r_color_slider.width+25,r_color_slider.height+20);
            drawColorRangeControl(r_color_slider, new_r);
            drawColorRangeControl(g_color_slider, new_g);
            drawColorRangeControl(b_color_slider, new_b);
        } else if (g_isDown){
            g_color_slider.pct=Math.max(0,Math.min(1,(touchX-g_color_slider.x)/g_color_slider.width));
            new_g = g_color_slider.pct*255;
            context.clearRect(g_color_slider.x-12.5,g_color_slider.y-g_color_slider.height/2-15,g_color_slider.width+25,g_color_slider.height+20);
            drawColorRangeControl(r_color_slider, new_r);
            drawColorRangeControl(g_color_slider, new_g);
            drawColorRangeControl(b_color_slider, new_b);
        } else if (b_isDown){
            b_color_slider.pct=Math.max(0,Math.min(1,(touchX-b_color_slider.x)/b_color_slider.width));
            new_b=b_color_slider.pct*255;
            context.clearRect(b_color_slider.x-12.5,b_color_slider.y-b_color_slider.height/2-15,b_color_slider.width+25,b_color_slider.height+20);
            drawColorRangeControl(r_color_slider, new_r);
            drawColorRangeControl(g_color_slider, new_g);
            drawColorRangeControl(b_color_slider, new_b);
        }
        update_color_value(new_r,new_g,new_b);
    }
}

//handle touch end events for color range slider
function touchend_colorSlider(e){
    r_isDown = false;
    g_isDown = false;
    b_isDown = false;
    if(e.touches.length === 0) {
        c_circle_shape = null;
        c_rect_shape = null;
    }
}

//handle touch end events for pencil range slider
function touchend_pencilSlider(e){
    p_isDown = false;
}

//make range color sliders appear
function make_color_slider_appear(r,g,b){
    drawColorRangeControl(r_color_slider,r);
    drawColorRangeControl(g_color_slider,g);
    drawColorRangeControl(b_color_slider,b);
}

//make range color sliders dissapear
function make_color_slider_dissapear(){
    clearColorRangeControl(r_color_slider);
    clearColorRangeControl(g_color_slider);
    clearColorRangeControl(b_color_slider);
    redraw();
}

//Make pencil width slider dissapear
function make_pencil_slider_dissapear(){
    clearColorRangeControl(p_slider);
    redraw();
}

//Redraw all old and new stuff function
function redraw(){
    //Redraw background of canvas
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var a=0; a<objects.length; a++){
        if(objects[a].name === 'pencil'){
             //Redraw strokes
            for(var i=0; i<strokes.length;i++){
                var s = strokes[i];
                if(objects[a].id === i){
                    context.beginPath();
                    context.moveTo(s.start_X,s.start_Y);
                    context.lineTo(s.end_X,s.end_Y);
                    context.strokeStyle = s.strokecolor;
                    context.lineWidth = s.line_width;
                    console.log(context.lineWidth);
                    context.stroke();
                }
            }
        } else if (objects[a].name === 'rectangle'){
            //Redraw rectangles
            for(var i=0;i<rects.length;i++){
                var r=rects[i];
                if(objects[a].id === r.id){
                    context.fillStyle=r.fill;
                    rect(r.x,r.y,r.width,r.height, r.stroke, r.fill,r.r_value,r.g,r.b);
                }
            }
        } else if (objects[a].name === 'circle'){
            //Redraw circles
            for(var i=0; i<circles.length;i++){
                var c=circles[i];
                if(objects[a].id === c.id){
                    circle(c.x,c.y,c.r,c.fill,c.stroke, c.rc, c.g, c.b);
                }
            }
        } else if (objects[a].name === 'eraser'){
            //Redraw eraser strokes made
            for(var i=0; i<eraser_strokes.length;i++){
                var s = eraser_strokes[i];
                if(objects[a].id === i){
                    context.strokeStyle = background;
                    context.fillStyle = background;
                    context.beginPath();
                    context.moveTo(s.start_X,s.start_Y);
                    context.lineTo(s.end_X,s.end_Y);
                    context.strokeStyle = s.strokecolor;
                    context.lineWidth = 10;
                    context.stroke();
                }
            }
        } else if (objects[a].name === 'crop'){
            for(var i=0;i<crops.length;i++){
                var r=crops[i];
                if(r.id === objects[a].id){
                    context.beginPath();
                    context.rect(r.x,r.y,r.width,r.height);
                    context.lineWidth = 0;
                    //context.strokeStyle = 'white';
                    context.fillStyle = background;
                    context.fill();
                    context.closePath();
                }   
            }
        } 
    }
    

    //Remake shape toolbox
    if(is_close_shape_toolbox == false){
        make_shape_toolbox();
    }
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

            if(c.id>1 && !(c.fill === 'No fill')){
                timer = setTimeout(function(){
                    c_circle_shape = c;
                    c.isSelected = false;
                    make_color_slider_appear(c.rc,c.g,c.b);
                }, 2000 );
            }
        }

        //Check if 2nd touch inside rectangle or not
        if(e.touches.length === 2 && first == true){
            var areaX = mx_1 - c.x;
            var areaY = my_1 - c.y;
            if(areaX * areaX + areaY * areaY <= c.r * c.r){
                gesture_or_not_circle = true;
                startX1_circle = mx_1;
                startY1_circle = my_1;
            }
        }
    }

    if(first == false){
        if(!(mode==='rectangle')){
            mode = curMode;
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

    if(e.touches.length === 2){
        mx_1 = parseInt(e.touches[1].clientX-offsetX);
        my_1 = parseInt(e.touches[1].clientY-offsetY);
        console.log('x coordinate of 2nd touch ' + mx_1);
        console.log('y coordinate of 2nd touch ' + my_1);
    }

    // test each rectangle to see if touch coordinate is inside or not
    dragok_rectangle = false;
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        var cur_id = r.id;
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
            if(r.id == 1 || r.id == 0){
                r.isSelected = false;
            }
            
            if(r.id>1 && !(r.fill === 'No fill')){
                timer = setTimeout(function(){
                    c_rect_shape = r;
                    console.log("cur_id: " + cur_id);
                    console.log("Make slider appear for: " + r.id);
                    r.isSelected = false;
                    make_color_slider_appear(r.r_value,r.g,r.b);
                }, 2000 );
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

    if(first == false){
        console.log("REACHED!");
        mode = curMode;
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
            redraw();
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
            redraw();
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

        var dx=mx-startX_circle;
        var dy=my-startY_circle;
        var dx_1=mx1-startX1_circle;
        var dy_1=my1-startY1_circle;

        if(c.isDragging){
            if(c.id != 1){
                var areaX = mx - c.x;
                var areaX1 = mx1 - c.x;
                var areaY = my - c.y;
                var areaY1 = my1 - c.y;
                if(areaX * areaX + areaY * areaY > c.r * c.r){
                    c.r += dx;
                }
                else if(areaX1 * areaX1 + areaY1 * areaY1 > c.r * c.r){
                    c.r += dx_1;
                }
                else if(areaX * areaX + areaY * areaY < c.r * c.r){
                    c.r -= dx;
                }
                else if(areaX1 * areaX1 + areaY1 * areaY1 < c.r * c.r){
                    c.r -= dx_1;
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
            mx_1 = parseInt(e.touches[1].clientX-offsetX);
            my_1 = parseInt(e.touches[1].clientY-offsetY);
            handle_resize_gesture_circle(mx,my,mx_1,my_1);
            startX_circle=mx;
            startY_circle=my;
            startX1_circle=mx_1;
            startY1_circle=my_1;
        } else {
            // calculate the distance the touch has moved
            // since the last touchmove
            var dx=mx-startX_circle;
            var dy=my-startY_circle;

            // move each rect that isDragging 
            // by the distance the touch has moved
            // since the last touchmove
            for(var i=0;i<circles.length;i++){
                var c=circles[i];
                if(c.isDragging){
                //Check if its the rectangle tool or not
                    if(c.id == 1){
                        if(!new_circle_made){
                            circle_count++;
                            objects.push({name:'circle', id:circle_count});
                            circles.push({id:circle_count, x:c.x, y:c.y, r:40, fill: "No fill",stroke: "black", isDragging: true, isSelected: false, rc: 0, g:0, b:0});
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
    for(var i=0;i<rects.length;i++){
        var r = rects[i];
        if(r.isDragging){
            if(r.id != 1){
                var dx=mx-startX_rectangle;
                var dy=my-startY_rectangle;
                var dx_1=mx1-startX1_rectangle;
                var dy_1=my1-startY1_rectangle;

                //Old coordinates of rectangle upper left corner
                var old_x = r.x;
                var old_y = r.y;

                //Pinch out gesture (Increase size)
                //Check for x
                //If touch x coordinates are less than x position of rectangle then
                if(mx < r.x){
                    r.x = r.x - (r.x-mx);
                    r.width = r.width + (old_x-mx);
                }
                if(mx1 < r.x){
                    r.x = r.x - (r.x-mx1);
                    r.width = r.width + (old_x-mx1);
                }
                //If touch x coordinates is more than x position + width of rectangle
                if(mx > (r.x + r.width)){
                    r.width = r.width + dx;
                }

                if(mx1 > (r.x + r.width)){
                    r.width = r.width + dx_1;
                }

                //Check for y
                //If touch y coordinates are less than the y position of rectangle then
                if(my < r.y){
                    r.y = r.y - (r.y-my);
                    r.height = r.height + (old_y-my);
                }
                if(my1 < r.y){
                    r.y = r.y - (r.y-my1);
                    r.height = r.height + (old_y-my1);
                }
                //If touch y coordinates is more than y position + height of rectangle
                if(my > (r.y+r.height)){
                    r.height = r.height + dy;
                }
                if(my1 > (r.y+r.height)){
                    r.height = r.height + dy_1;
                }

                //Pinch in gesture (Decrease size)
                //Check for x
                //If touch x coordinates is more than x position of rectangle then
                // if(mx - r.x > 50 || mx1 - r.x > 50){
                //     r.x = r.x + 10;
                //     r.width = r.width - 10;
                // }
                // // if(mx1 - r.x > 50){
                // //     r.x = r.x + (mx1-r.x);
                // //     r.width = r.width - (mx1 - old_x);
                // // }
                // //If touch x coordinates is less than x position + width of rectangle
                // if(r.x+r.width - mx > 50 || r.x+r.width - mx1 > 50){
                //     r.width = r.width - 10;
                // }
                // // if(mx1 < (r.x + r.width)){
                // //     r.width = r.width - dx_1;
                // // }
                // //Check for y
                // //If touch y coordinates is more than the y position of rectangle then
                // if(r.y - my > 50 ||){
                //     r.y = r.y + (my - r.y);
                //     r.height = r.height - (my - old_y);
                // }
                // if(my1 > r.y){
                //     r.y = r.y + (my1 - r.y);
                //     r.height = r.height - (my1 - old_y);
                // }
                // //If touch y coordinates is less than y position + height of rectangle
                // if(my < (r.y + r.height)){
                //     r.height = r.height - dy;
                // }
                // if(my1 < (r.y + r.height)){
                //     r.height = r.height - dy_1;
                // }
            }  
        }
    }
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
            // reset the starting mouse position for the next mousemove
            startX_rectangle=mx;
            startY_rectangle=my;
            startX1_rectangle=mx_1;
            startY1_rectangle=my_1;
        } else {
            // calculate the distance the touch has moved
            // since the last touchmove
            var dx=mx-startX_rectangle;
            var dy=my-startY_rectangle;

            // move each rect that isDragging 
            // by the distance the touch has moved
            // since the last touchmove
            for(var i=0;i<rects.length;i++){
                var r=rects[i];
                if(r.isDragging){
                //Check if its the rectangle tool or not
                    if(r.id == 1){
                        if(!new_rectangle_made){
                            rect_count++;
                            objects.push({name:'rectangle', id:rect_count});
                            rects.push({id:rect_count,x:r.x,y:r.y,width:100,height:55,fill:"No fill",stroke:"black", isDragging:true, isSelected: false, r_value: 0, g:0, b:0}); 
                            new_rectangle_made = true;
                        }
                    } 
                    else if(r.id == 0){
                        if(!new_rectangle_made && !new_circle_made){
                            r.x+=dx;
                            r.y+=dy;
                            r = rects[1];
                            r.x+=dx;
                            r.y+=dy;
                            var c = circles[0];
                            c.x+=dx;
                            c.y+=dy;
                        }
                    }else {
                        console.log('id: ' + r.id);
                        r.x+=dx;
                        r.y+=dy;
                    } 
                }

            }

            // reset the starting touch position for the next touchmove
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
    console.log(mode);
    //Perform touchstart events for circle
    touchstart_circle(e);
    //Perform touchstart events for color slider
    touchstart_colorSlider(e);
    //Perform touchstart events for pencilSlider
    touchstart_pencilSlider(e);

    //Check if touching close button of shape toolbox
    if(is_close_shape_toolbox == false){
        var mx = e.touches[0].clientX - canvas.offsetLeft;
        var my = e.touches[0].clientY - canvas.offsetTop;
        //rect(165,r.y,20,20, r.stroke,"white",r.r_value,r.g,r.b); //For x button
        var r = rects[0];
        if(mx>r.x+130 && mx<r.x+150 && my>r.y && my<r.y+20){
            console.log("Clicked close button");
            is_close_shape_toolbox = true;
        }
    }

    //Detect 3 touches to indicate clear mode start
    if(e.touches.length === 3){
        startx0_clear = e.touches[0].clientX - canvas.offsetLeft;
        starty0_clear = e.touches[0].clientY - canvas.offsetTop;
        startx1_clear = e.touches[1].clientX - canvas.offsetLeft;
        starty1_clear = e.touches[1].clientY - canvas.offsetTop;
        startx2_clear = e.touches[2].clientX - canvas.offsetLeft;
        starty2_clear = e.touches[2].clientY - canvas.offsetTop;
        mode = 'clear';
    }

    if (mode === 'pencil' || mode === 'eraser' || mode === 'crop'){
        //Remove all selections for rectangles
        if(isSelecting_rectangle == true){
            isSelecting_rectangle = false;
            for(var i=0; i<rects.length; i++){
                var r = rects[i]
                if(r.isSelected){
                    r.isSelected = false;
                    r.stroke = 'black';
                    rect(r.x,r.y,r.width,r.height, r.stroke, r.fill,r.r_value,r.g,r.b);
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
                    circle(c.x,c.y,c.r,c.fill,c.stroke, c.rc, c.g, c.b);
                }
            }
        }
    }

    if (mode === 'pencil') {
        timer = setTimeout(function(){
                    drawPencilRangeControl(p_slider, pencil_width);
                }, 2000 );

        down = true;
        startX = e.touches[0].clientX - canvas.offsetLeft;
        startY = e.touches[0].clientY - canvas.offsetTop;
    } else if (mode === 'eraser') {
        down = true;
        startX_eraser = e.touches[0].clientX - canvas.offsetLeft;
        startY_eraser = e.touches[0].clientY - canvas.offsetTop;
    } else if (mode === 'crop'){
        startX_crop = e.touches[0].clientX - canvas.offsetLeft;
        startY_crop = e.touches[0].clientY - canvas.offsetTop;
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
    //Perform touchend events for color slider
    touchend_colorSlider(e);
    //Perform touchend events for pencil slider
    touchend_pencilSlider(e);

    //Make color slider dissapear on not touching
    if(e.touches.length == 0){
         make_color_slider_dissapear();
         make_pencil_slider_dissapear();//Clear pencil range slider
    }

    if(mode === 'crop'){
        crop_count++;
        var crop_width = endX_crop - startX_crop;
        var crop_height = endY_crop - startY_crop;
        objects.push({name:'crop', id:crop_count});
        crops.push({id:crop_count,x:startX_crop-1,y:startY_crop-1,width:crop_width+2,height:crop_height+2,fill:"No fill",stroke:"black"}); 
        redraw();
    }

    down = false;

    if(is_clear == true){
        is_clear = false;
        resetCanvas();
        console.log("After reset canvas: " + context.fillStyle);
        if(context.fillStyle === '#000000'){
            console.log("REACHED HERE!!");
            context.fillStyle = background;
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        is_clear = false;
    }

    clearTimeout(timer);

    if(is_close_shape_toolbox == true){
        //console.log("REACHED HERE!!");
        redraw();
    }

});

function draw(e){
    //Modes

    //Track gesture movement for clearing canvas
    if(mode == 'clear' && e.touches.length === 3){
        var is_clear_1 = false;
        var is_clear_2 = false;
        var is_clear_3 = false;
        var mx0 = parseInt(e.touches[0].clientX-offsetX);
        var mx1 = parseInt(e.touches[1].clientX-offsetX);
        var mx2 = parseInt(e.touches[2].clientX-offsetX);
        var my0 = parseInt(e.touches[0].clientY-offsetY);
        var my1 = parseInt(e.touches[1].clientY-offsetY);
        var my2 = parseInt(e.touches[2].clientY-offsetY);
        if(startx0_clear - mx0 >= 75){
            is_clear_1 = true;
        }
        if(startx1_clear - mx1 >= 75){
            is_clear_2 = true;
        }
        if(startx2_clear - mx2 >= 75){
            is_clear_3 = true;
        }

        if(is_clear_1 == true && is_clear_2 == true && is_clear_3 == true){
            is_clear = true;
        }
    }

    if(dragok_circle || dragok_rectangle || mode === 'crop'){
        clearCanvas();
    }
    redraw();
    console.log('mode: ' + mode)
    if (mode === 'eraser') {
        xPos = e.touches[0].clientX - canvas.offsetLeft;
        yPos = e.touches[0].clientY - canvas.offsetTop;
        if (down == true) {
            objects.push({name:'eraser', id:eraser_strokes.length});
            eraser_strokes.push({start_X:startX_eraser, start_Y: startY_eraser, end_X: xPos, end_Y: yPos});
            startX_eraser = xPos;
            startY_eraser = yPos;
        }
    } else if (mode === 'pencil'){
        var xPos = e.touches[0].clientX - canvas.offsetLeft;
        var yPos = e.touches[0].clientY - canvas.offsetTop;
        if (down == true) {
            objects.push({name:'pencil', id:strokes.length});
            strokes.push({start_X:startX, start_Y: startY, end_X: xPos, end_Y: yPos, strokecolor: pencilcolor, line_width: pencil_width});
            startX = xPos;
            startY = yPos;
        }
    }  else if (mode === 'crop'){
        var mx=parseInt(e.touches[0].clientX-offsetX);
        var my=parseInt(e.touches[0].clientY-offsetY);
        endX_crop = mx;
        endY_crop = my;
        context.beginPath();
        context.rect(startX_crop,startY_crop,(endX_crop - startX_crop),(endY_crop - startY_crop));
        context.lineWidth = 3;
        context.strokeStyle = 'black';
        console.log("REACHED!");
        context.stroke();
        context.closePath();
    }

    touchmove_rectangle(e);
    touchmove_circle(e);
    touchmove_colorSlider(e);
    touchmove_pencilSlider(e);
    clearTimeout(timer);
    //redraw();
}

function changeColor(color){
    //context.strokeStyle = color;
    var red = 0;
    var green = 0;
    var blue = 0;

    if(color==='black'){
        red=0;
        green=0;
        blue=0;
    } else if (color==='white'){
        red=255;
        green=255;
        blue=255;
    } else if (color==='red'){
        red=255;
        green=0;
        blue=0;
    } else if (color==='green'){
        red=0;
        green=255;
        blue=0;
    } else if (color==='blue'){
        red=0;
        green=0;
        blue=255;
    }
    console.log(mode);
    if(mode === 'pencil'){
        console.log("REACHED!");
        pencilcolor = color;
    } else if (mode === 'fill'){
        background = color;
        redraw();
    } else {
         //Change color of selected objects
        if(isSelecting_rectangle){
            for(var i = 0; i < rects.length;i++){
                var r = rects[i];
                if(r.isSelected){
                    r.fill = color;
                    r.r_value = red;
                    r.g = green;
                    r.b = blue;
                }
            }
            redraw();
        }
        if(isSelecting_circle){
            for(var i = 0; i < circles.length;i++){
                var c = circles[i];
                if(c.isSelected){
                    c.fill = color;
                    c.rc = red;
                    c.g = green;
                    c.b = blue;
                }
            }
            redraw();
        }
    }

   
    //context.fillStyle = color;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// function changeBrushSize(size) {
//     context.lineWidth = size;
// }

function resetCanvas() {
    //background = context.fillStyle;
    context.fillStyle = background;
    console.log("In reset canvas: " + context.fillStyle);
    clearCanvas();
    console.log("In clear canvas: " + context.fillStyle);
    reset();
    make_shape_toolbox();
}

//Function to reset all variables to normal
function reset(){
    objects = [];
    timer = null;
    isDragging = false;
    isSelecting_rectangle = false;
    isSelecting_circle = false;
    rects=[];
    new_rectangle_made = false; 
    rect_count = 1; 
    rects.push({id:0,x:35,y:20,width:150,height:175,fill:"No fill",stroke:"black",isDragging:false,isSelected:false, r_value:0, g:0, b:0});
    rects.push({id:1,x:75-15,y:50-15,width:100,height:55,fill:"No fill",stroke: "black",isDragging:false,isSelected: false, r_value:0, g:0, b:0});
    gesture_or_not_rectangle = false; //Flag to tell if gesture going to start or not
    dragok_rectangle = false;
    startX_rectangle = 0;
    startY_rectangle = 0;
    startX1_rectangle = 0;
    startY1_rectangle = 0;
    circles = [];
    new_circle_made = false; //Flag to tell if a new circle is made or not
    circle_count = 1;  // Count number of circles -> is the id of each rectangle
    circles.push({id:1, x:110, y:145, r:40, fill: "No fill",stroke: "black", isDragging: false, isSelected: false, rc:0, g:0, b:0});
    gesture_or_not_circle = false; //Flag to tell if gesture going to start or not
    dragok_circle = false;
    startX_circle = 0;
    startY_circle = 0;
    startX1_circle = 0;
    startY1_circle = 0;
    context.lineWidth = 5;
    down = false;
    mode = 'pencil';
    background = context.background;
    strokes = [];
    startX = 0;
    startY = 0;
    pencilcolor = 'black'; //initial stroke color
    eraser_strokes = [];
    startX_eraser = 0;
    startY_eraser = 0;
    crops = [];
    startX_crop = 0;
    startY_crop = 0;
    endX_crop = 0;
    endY_crop = 0;
    crop_count = 0;
    is_close_shape_toolbox = false;
}

function fillCanvasModeStart(){
    mode = 'fill';
    console.log('Mode change to fill');
}

function eraserModeStart(){
    curMode = 'eraser';
    console.log('Mode change to eraser');
}

function pencilModeStart(){
    curMode = 'pencil';
    console.log('Mode change to pencil');
}

function cropModeStart(){
    curMode = 'crop';
    console.log('Mode change to crop');
}

function makeShapeToolBoxStart(){
    is_close_shape_toolbox = false;
    make_shape_toolbox();
}

