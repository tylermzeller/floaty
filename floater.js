var mouse_over = false;
var mouse_clicked = false;
var snapback_interval = null;
var x = 0, y = 0;
var prevX, prevY;

document.addEventListener('DOMContentLoaded', function(e) {
   var floater = document.getElementById('floater');
   updatePosition(floater);

   floater.addEventListener('mouseover', function(e){
     mouse_over = true;
     console.log('over');
   });

   floater.addEventListener('mousedown', function(e){
     mouse_clicked = true;

     addClass(floater, 'active');

     console.log('down');
   });

   floater.addEventListener('mouseup', function(e){
     mouse_clicked = false;
     console.log('up');

     removeClass(floater, 'active');

    var direction = calcMinDirection(this);
    snapback_interval = setInterval(snapback, 10, this, direction);
   });

   floater.addEventListener('mouseout', function(e){
   });

   floater.addEventListener('mousemove', function(e){
     e.preventDefault();
     if (mouse_clicked){
       floater.style.left = e.clientX - (floater.clientWidth / 2) + 'px';
       floater.style.top = e.clientY - (floater.clientHeight / 2) + 'px';

       updatePosition(floater);
     }
   });
});

function snapback(element, direction){

  var left = pixelToInt(element.style.left);
  var top = pixelToInt(element.style.top);
  var bottom = window.innerHeight - pixelToInt(element.style.top);
  var right = window.innerWidth - pixelToInt(element.style.left);

  var floaty_width = element.clientWidth;
  var floaty_height = element.clientHeight;

  if ((left <= 0.5) || (top <= 0.5) || (top + 50 >= window.innerHeight - 1) || (left + 50 >= window.innerWidth - 1) || mouse_clicked){
    clearInterval(snapback_interval);
    console.log('clear');
  }

  if (direction == 'left'){
    x -= x / 10;
    element.style.left = x + 'px';
  }

  if (direction == 'right') {
    x += (window.innerWidth - 50 - x) / 10;
    element.style.left = x + 'px';
  }

  if (direction == 'top') {
    y -= y / 10;
    element.style.top = y + 'px';
  }

  if (direction == 'bottom'){
    y += (window.innerHeight - 50 - y) / 10;
    element.style.top = y + 'px';
  }
}

function calcMinDirection(element) {
  var min = pixelToInt(element.style.left);
  var min_dir = 'left';

  if (window.innerWidth - pixelToInt(element.style.left) < min) {
    min = window.innerWidth - pixelToInt(element.style.left);
    min_dir = 'right';
  }

  if (pixelToInt(element.style.top) < 50){
    min_dir = 'top';
  }

  if (window.innerHeight - pixelToInt(element.style.top) < 100) {
    min_dir = 'bottom';
  }

  return min_dir;
}

function pixelToInt(measurement){
  var strings = measurement.split('px');
  return parseInt(strings[0]);
}

function updatePosition(element){
  prevX = x;
  prevY = y;
  x = pixelToInt(element.style.left);
  y = pixelToInt(element.style.top);
}

function addClass(element, classname){
  element.className += ' ' + classname;
}

function removeClass(element, classname) {
  var re = new RegExp('(?:^|\\s)' + classname + '(?!\\S)', 'g');
  element.className = element.className.replace( re , '' );
}
