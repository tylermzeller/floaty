var floaty = floaty || {};

floaty.pixelToInt = function(measurement){
  var strings = measurement.split('px');
  return parseFloat(strings[0]);
}

floaty.floaty = function(dom_object){
  this.element = dom_object;
  this.mouse_over = false;
  this.mouse_click = false;
  this.snapback_interval = null;
}

floaty.floaty.prototype.updatePosition = function(mouseX, mouseY) {
  this.element.style.left = mouseX - (this.element.clientWidth / 2) + 'px';
  this.element.style.top = mouseY - (this.element.clientHeight / 2) + 'px';
}

floaty.floaty.prototype.addEventListener = function(eventName, callback){
  this.element.addEventListener(eventName, callback);
}

floaty.floaty.prototype.removeClass = function(classname){
  var re = new RegExp('(?:^|\\s)' + classname + '(?!\\S)', 'g');
  this.element.className = this.element.className.replace( re , '' );
}

floaty.floaty.prototype.addClass = function(classname) {
  this.element.className += ' ' + classname;
}

floaty.floaty.prototype.calcMinDirection = function(){
  var x = floaty.pixelToInt(this.element.style.left);
  var y = floaty.pixelToInt(this.element.style.top);

  var min = x;
  var min_dir = 'left';

  if (window.innerWidth - x < min) {
    min = window.innerWidth - x;
    min_dir = 'right';
  }

  if (y < 50){
    min_dir = 'top';
  }

  if (window.innerHeight - y < 100) {
    min_dir = 'bottom';
  }

  return min_dir;
}

floaty.floaty.prototype.snapback = function(floater, direction) {
  var x = floaty.pixelToInt(floater.element.style.left);
  var y = floaty.pixelToInt(floater.element.style.top);

  var width = floater.element.clientWidth;
  var height = floater.element.clientHeight;

  if ((x <= 0.5 && x >= -0.5)
  || (y <= 0.5 && y >= -0.5)
  || (y + height >= window.innerHeight - 0.5 && y + height <= window.innerHeight + 0.5)
  || (x + width >= window.innerWidth - 0.5 && x + width <= window.innerWidth + 0.5)
  || floater.mouse_clicked){
    clearInterval(floater.snapback_interval);
  }

  if (direction == 'left'){
    x -= x / 10;
    floater.element.style.left = x + 'px';
  }

  if (direction == 'right') {
    x -= (x + width - window.innerWidth) / 10;
    floater.element.style.left = x + 'px';
  }

  if (direction == 'top') {
    y -= y / 10;
    floater.element.style.top = y + 'px';
  }

  if (direction == 'bottom'){
    y -= (y + height - window.innerHeight) / 10;
    floater.element.style.top = y + 'px';
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
   var floater = new floaty.floaty(document.getElementById('floaty'));

   floater.addEventListener('mouseover', function(e){
     floater.mouse_over = true;
   });

   floater.addEventListener('mousedown', function(e){
     floater.mouse_clicked = true;
     floater.addClass('active');
   });

   floater.addEventListener('mouseup', function(e){
     floater.mouse_clicked = false;
     floater.removeClass('active');
     var direction = floater.calcMinDirection();
     floater.snapback_interval = setInterval(floater.snapback, 10, floater, direction);
   });

  //  floater.addEventListener('mouseout', function(e){
  //  });

   floater.addEventListener('mousemove', function(e){
     e.preventDefault();
     if (floater.mouse_clicked) {
       floater.updatePosition(e.clientX, e.clientY);
     }
   });
});
