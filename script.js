var sidebar = document.getElementById('sidebar');
var sidebarStartX;
var sidebarEndX;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.lineWidth = 5;
var down = false;
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchstart', function(e) {
    down = true;
    context.beginPath();
    xPos = e.touches[0].clientX - canvas.offsetLeft;
    yPos =e.touches[0].clientY - canvas.offsetTop;
    context.moveTo(xPos, yPos);
    canvas.addEventListener("touchmove", draw);
});
canvas.addEventListener('touchend', function() {
    down = false;
});
function draw(e){
    xPos = e.touches[0].clientX - canvas.offsetLeft;
    yPos =e.touches[0].clientY - canvas.offsetTop;
    if (down == true) {
        context.lineTo(xPos, yPos);
        context.stroke();
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
function fillCanvas() {context.fillRect(0, 0, canvas.width, canvas.height);}
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
function sideBarTouchStart(event) {
    sidebarStartX = event.touches[0].clientX;
}
function sideBarTouchEnd(event) {
    console.log(event.changedTouches[0].clientX);
    var changes = event.changedTouches[0].clientX;
    if (changes < 0) {
        console.log('hi');
        sidebar.style.left = '-300px';
    } else {
        sidebar.style.left = '0px';
    }
}
