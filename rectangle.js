//Get details of canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var drag_ok = false; //Boolean to indicate if rectangle can be dragged or not

// an array of objects that define different rectangles
var rects=[];
rects.push({x:75-15,y:50-15,width:30,height:30,fill:"#444444",isDragging:false});
rects.push({x:75-25,y:50-25,width:30,height:30,fill:"#ff550d",isDragging:false});

draw();
//Make rectangle shape function
function rect(x,y,w,h) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.closePath();
    context.fill();
}

// redraw the scene
function draw() {
    clear();
    context.fillStyle = "#FAF7F8";
    //rect(0,0,WIDTH,HEIGHT);
    // redraw each rect in the rects[] array
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        context.fillStyle=r.fill;
        rect(r.x,r.y,r.width,r.height);
    }
}

// handle touch events
function fingerDown(e){

    // tell the browser we're handling this touch event
    e.preventDefault();
    e.stopPropagation();

    // get the current touch position
    var mx=parseInt(e.clientX-offsetX);
    var my=parseInt(e.clientY-offsetY);

    // test each rectangle to see if touch coordinate is inside or not
    drag_ok=false;
    for(var i=0;i<rects.length;i++){
        var r=rects[i];
        if(mx>r.x && mx<r.x+r.width && my>r.y && my<r.y+r.height){
            // if yes, set that rects isDragging=true
            dragok=true;
            r.isDragging=true;
        }
    }
    // save the current mouse position
    startX=mx;
    startY=my;
}

 