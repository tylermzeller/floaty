var floaty = floaty || {};

floaty.addFloaty = function(id, options){
  if (id) {
    var target = document.getElementById(id);
    target.className += ' floaty';
    this.makeFloaty(target, options);
  } else {
    var elemDiv = document.createElement('div');
    elemDiv.className += ' floaty';
    document.body.appendChild(elemDiv);
    this.makeFloaty(elemDiv, options);
  }
};

floaty.makeFloaty = function(element, options){
  var floater = new floaty.floaty(element);

  if (options){
    if (options.onTouchStart){
      floater.onTouchStart = options.onTouchStart;
    }
    if (options.onTouchEnd){
      floater.onTouchEnd = options.onTouchEnd;
    }
    if (options.onTouchMove){
      floater.onTouchMove = options.onTouchMove;
    }
    if (options.onMouseOver){
      floater.onMouseOver = options.onMouseOver;
    }
    if (options.onMouseDown){
      floater.onMouseDown = options.onMouseDown;
    }
    if (options.onMouseUp){
      floater.onMouseUp = options.onMouseUp;
    }
    if (options.onMouseMove){
      floater.onMouseMove = options.onMouseMove;
    }
    if (options.onActivate){
      floater.onActivate = options.onActivate;
    }
  }

  // floater.element.style.top = (Math.floor((Math.random() * 10) + 1) * 50) + 'px';
  // var r = Math.floor((Math.random() * 255) + 1);
  // var g = Math.floor((Math.random() * 255) + 1);
  // var b = Math.floor((Math.random() * 255) + 1);
  // floater.element.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';

  floater.addEventListener('mouseover', floaty.makeMouseoverCallback(floater)); // END floater.addEventListener

  floater.addEventListener('mousedown', floaty.makeMousedownCallback(floater)); // END floater.addEventListener

  floater.addEventListener('touchstart', floaty.makeTouchstartCallback(floater), false); // END floater.addEventListener

  floater.addEventListener('mouseup', floaty.makeMouseupCallback(floater)); // END floater.addEventListener

  floater.addEventListener('touchend', floaty.makeTouchEndCallback(floater), false); // END floater.addEventListener

  floater.addEventListener('mousemove', floaty.makeMousemoveCallback(floater)); // END floater.addEventListener

  floater.addEventListener('touchmove', floaty.makeTouchmoveCallback(floater), false); // END floater.addEventListener
};

floaty.pixelToInt = function(measurement){
  var strings = measurement.split('px');
  return parseFloat(strings[0]);
};

floaty.makeMouseoverCallback = function(floater){
  return function(){
    floater.mouse_over = true;
    floater.onMouseOver(floater);
  };
};

floaty.makeMousedownCallback = function(floater){
  return function(){
    floater.mouse_clicked = true;
    floater.activate = true;
    floater.addClass('active');
    floater.onMouseDown(floater);
  };
};

floaty.makeTouchstartCallback = function(floater){
  return function(){
    floater.mouse_clicked = true;
    floater.activate = true;
    floater.addClass('active');
    floater.onTouchStart(floater);
  };
};

floaty.makeMouseupCallback = function(floater){
  return function(){
    floater.mouse_clicked = false;
    floater.removeClass('active');
    if (floater.activate) {
      floater.onActivate(floater);
      this.activate = false;
    } else {
      var direction = floater.calcMinDirection();
      floater.snapback_interval = setInterval(floater.snapback, 10, floater, direction);
    }
    floater.onMouseUp(floater);
  };
};

floaty.makeTouchEndCallback = function(floater) {
  return function() {
    floater.mouse_clicked = false;
    floater.removeClass('active');
    if (floater.activate) {
      floater.onActivate(floater);
      this.activate = false;
    } else {
      var direction = floater.calcMinDirection();
      floater.snapback_interval = setInterval(floater.snapback, 10, floater, direction);
    }
    floater.onTouchEnd(floater);
  };
};

floaty.makeMousemoveCallback = function(floater){
  return function(e){
    e.preventDefault();
    if (floater.mouse_clicked) {
      floater.updatePosition(e.clientX, e.clientY);
      floater.activate = false;
    }
    floater.onMouseMove(floater);
  };
};

floaty.makeTouchmoveCallback = function(floater){
  return function(e){
    e.preventDefault();
    if (floater.mouse_clicked) {
      floater.updatePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      floater.activate = false;
    }
    floater.onTouchMove(floater);
  };
};

floaty.floaty = function(dom_object){
  this.element = dom_object;
  this.mouse_over = false;
  this.mouse_click = false;
  this.activate = false;
  this.snapback_interval = null;
};

floaty.floaty.prototype.onActivate = function(){};

floaty.floaty.prototype.onTouchStart = function(){};
floaty.floaty.prototype.onTouchEnd = function(){};
floaty.floaty.prototype.onTouchMove = function(){};

floaty.floaty.prototype.onMouseDown = function(){};
floaty.floaty.prototype.onMouseUp = function(){};
floaty.floaty.prototype.onMouseMove = function(){};
floaty.floaty.prototype.onMouseOver = function(){};

floaty.floaty.prototype.updatePosition = function(mouseX, mouseY) {
  this.element.style.left = mouseX - (this.element.clientWidth / 2) + 'px';

  var height = this.element.clientHeight;

  this.element.style.top = mouseY - (height / 2) + 'px';
};

floaty.floaty.prototype.addEventListener = function(eventName, callback){
  this.element.addEventListener(eventName, callback);
};

floaty.floaty.prototype.removeClass = function(classname){
  var re = new RegExp('(?:^|\\s)' + classname + '(?!\\S)', 'g');
  this.element.className = this.element.className.replace( re , '' );
};

floaty.floaty.prototype.hasClass = function(classname) {
  var re = new RegExp('(?:^|\\s)' + classname + '(?!\\S)', 'g');
  return this.element.className.match(re) != null;
};

floaty.floaty.prototype.addClass = function(classname) {
  this.element.className += ' ' + classname;
};

floaty.floaty.prototype.calcMinDirection = function(){
  var height = this.element.clientHeight;

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

  if (window.innerHeight - y < height + 50) {
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
  var floaties = document.getElementsByClassName('floaty');

  for (var i = 0; i < floaties.length; i++){
    floaty.makeFloaty(floaties.item(i));
  } // END for loop

}); // END document.addEventListener
