// Author: Tyler Zeller
const FLOATY_CLASS_NAME = 'floaty';

class Utils {
  static log(message) {
    if (Utils.DEBUG) { console.log(message) }
  }

  static error(message) {
    console.error(`Error: ${message}`)
  }

  static forEach(collection, fn) {
    [].forEach.call(collection, fn)
  }

  static map(collection, fn) {
    return [].map.call(collection, fn)
  }

  static pixelToNum(pixel) {
    let parts = pixel.split('px');
    return parseFloat(parts[0]);
  }

  static pageWidthHeight() {
    return [window.innerWidth, window.innerHeight]
  }

  static pack() {
    let tuple = {}
    Utils.map(arguments, (arg) => {return arg})
    return tuple
  }

  static box(lower, upper) {
    return (x) => { return Math.min(Math.max(x, lower), upper) }
  }
}

Utils.DEBUG = true

class Floaty {
  constructor(element, options) {
    if (!element) {
      Utils.error("Undefined element in BaseFloaty constructor")
      throw "Undefined element in BaseFloaty constructor"
    }

    options = options || {}
    this.element            = element
    this.parent             = options.parent              || this.getBoundingParent()
    this.headerThreshold    = options.headerThreshold     || 0.2
    this.xoffset            = options.xoffset             || Math.round(this.element.clientWidth / 2)
    this.yoffset            = options.yoffset             || Math.round(this.element.clientHeight / 2)

    if (options.dragLocation) { this.setDragLocation(options.dragLocation) }

    let [pw, ph] = this.getParentWidthHeight()
    Utils.log(`[Constructor]: parent=${this.parent}`)
    Utils.log(`[Constructor]: parent width=${pw}`)
    Utils.log(`[Constructor]: parent height=${ph}`)
    Utils.log(`[Constructor]: element width=${this.element.clientWidth}`)
    Utils.log(`[Constructor]: element height=${this.element.clientHeight}`)
    this.widthBox  = Utils.box(0, pw - this.element.clientWidth)
    this.heightBox = Utils.box(0, ph - this.element.clientHeight)

    this.mouseDown    = options.mouseDown   || (()=>{})
    this.mouseOver    = options.mouseOver   || (()=>{})
    this.mouseUp      = options.mouseUp     || (()=>{})
    this.mouseMove    = options.mouseMove   || (()=>{})
    this.mouseLeave   = options.mouseLeave  || (()=>{})
    this.touchStart   = options.touchStart  || (()=>{})
    this.touchEnd     = options.touchEnd    || (()=>{})
    this.touchMove    = options.touchMove   || (()=>{})

    this.snapback     = this.snapback.bind(this)
    this.onMouseOver  = this.onMouseOver.bind(this)
    this.onMouseDown  = this.onMouseDown.bind(this)
    this.onMouseUp    = this.onMouseUp.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseMove  = this.onMouseMove.bind(this)

    this.addEventListener('mouseover', this.onMouseOver)
    this.addEventListener('mouseleave', this.onMouseLeave)
    this.addEventListener('mousedown', this.onMouseDown)
    this.addEventListener('mouseup',   this.onMouseUp)
    this.addEventListener('mousemove', this.onMouseMove)

    this.addEventListener('touchstart', this.onTouchStart, false)
    this.addEventListener('touchend',   this.onTouchEnd, false)
    this.addEventListener('touchmove',  this.onTouchMove, false)
  }

  addEventListener(eventName, fn) {
    this.element.addEventListener(eventName, fn)
  }

  boundingBox(x, y) {
    return [this.widthBox(x), this.heightBox(y)]
  }

  getCoords() {
    return [Utils.pixelToNum(this.element.style.left), Utils.pixelToNum(this.element.style.top)]
  }

  getWidthHeight() {
    return [this.element.clientWidth, this.element.clientHeight]
  }

  // "bounding parent" means parent element with a min(parentWidth, parentHeight) > 0
  // QUESTION: should this be min(parentWidth, parentHeight) > min(this.element.clienthWidth, this.element.clientHeight)?
  getBoundingParent() {
    let pe = this.element.parentElement
    while (Math.min(pe.clientWidth, pe.clientHeight) <= 0) { pe = pe.parentElement }
    return pe
  }

  getParentWidthHeight() {
    if (this.parent === window) { return Utils.pageWidthHeight() }
    return [this.parent.clientWidth, this.parent.clientHeight]
  }

  setXPosition(x) {
    this.element.style.left = x + 'px'
  }

  setYPosition(y) {
    this.element.style.top = y + 'px'
  }

  setPosition(x, y) {
    this.setXPosition(x)
    this.setYPosition(y)
  }

  setDragLocation(dragLocation) {
    for (let part of dragLocation.split(' ')) {
      if (part === 'top')    { this.yoffset = 0 }
      if (part === 'left')   { this.xoffset = 0 }
      if (part === 'bottom') { this.yoffset = this.element.clientHeight }
      if (part === 'right')  { this.xoffset = this.element.clientWidth }
    }
  }

  updatePositionOnDrag(x, y) {
    this.setPosition(...this.boundingBox(x - this.xoffset, y - this.yoffset))
  }

  removeClass(classname) {
    if (this.hasClass(classname)) {
      let re = new RegExp('(?:^|\\s)' + classname + '(?!\\S)', 'g')
      this.element.className = this.element.className.replace( re , '' )
    }
  }

  hasClass(classname) {
    let re = new RegExp('(?:^|\\s)' + classname + '(?!\\S)', 'g')
    return this.element.className.match(re) != null
  }

  addClass(classname) {
    if (!this.hasClass(classname)) { this.element.className += ' ' + classname }
  }

  calcMinDirection() {
    let [w, h] = this.getWidthHeight()
    let [x, y] = this.getCoords()
    let [parentWidth, parentHeight] = this.getParentWidthHeight()
    let headerThreshold = parentHeight * this.headerThreshold
    Utils.log("this.element.clientHeight: " + h)
    Utils.log("this.element.style.top|y: " + y)
    Utils.log("parentHeight: " + parentHeight)

    //let min = x
    let min_dir = 'left'

    if (parentWidth - x < x) {
      //min = parentHeight - x
      min_dir = 'right'
    }

    if (y < headerThreshold){ // y < headerThreshold
      min_dir = 'top'
    }

    if (parentHeight - y < h + headerThreshold) { // height + headerThreshold
      min_dir = 'bottom'
    }

    return min_dir
  }

  snapback(direction) {
    let [x, y] = this.getCoords()
    let [w, h] = this.getWidthHeight()
    let [parentWidth, parentHeight] = this.getParentWidthHeight()


    if ((x <= 0.5 && x >= -0.5)
    || (y <= 0.5 && y >= -0.5)
    || (y + h >= parentHeight - 0.5 && y + h <= parentHeight + 0.5)
    || (x + w >= parentWidth - 0.5 && x + w <= parentWidth + 0.5)
    || this.mouse_clicked) {
      clearInterval(this.snapback_interval)
    }

    if (direction == 'left') {
      x -= x / 10;
      this.setXPosition(x)
    }

    if (direction == 'right') {
      x -= (x + w - parentWidth) / 10
      this.setXPosition(x)
    }

    if (direction == 'top') {
      y -= y / 10
      this.setYPosition(y)
    }

    if (direction == 'bottom'){
      y -= (y + h - parentHeight) / 10
      this.setYPosition(y)
    }
  }

  onTouchStart(e) {
    this.mouse_clicked = true
    this.addClass('floaty-touch')
    this.touchStart(e, this)
  }

  onTouchMove (e) {
    e.preventDefault()
    if (this.mouse_clicked) { this.updatePositionOnDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }
    this.touchMove(e, this)
  }

  onTouchEnd  (e) {
    this.mouse_clicked = false;
    this.removeClass('floaty-touch')
    let direction = this.calcMinDirection()
    this.snapback_interval = setInterval(this.snapback, 10, direction)
    this.touchEnd(e, this)
  }

  onMouseOver (e) {
    this.mouse_over = true;
    this.removeClass('floaty-left')
    this.addClass('floaty-over')
    this.mouseOver(e, this)
  }

  onMouseLeave(e) {
    this.mouse_over = false
    this.removeClass('floaty-over')
    this.addClass('floaty-left')
    this.mouseLeave(e, this)
  }

  onMouseDown(e) {
    this.mouse_clicked = true;
    this.removeClass('floaty-up')
    this.addClass('floaty-down')
    this.mouseDown(e, this)
  }

  onMouseMove(e) {
    e.preventDefault()
    if (this.mouse_clicked) { this.updatePositionOnDrag(e.clientX, e.clientY) }
    this.mouseMove(e, this)
  }

  onMouseUp(e) {
    this.mouse_clicked = false
    this.removeClass('floaty-down')
    this.addClass('floaty-up')
    let direction = this.calcMinDirection()
    this.snapback_interval = setInterval(this.snapback, 10, direction)
    this.mouseUp(e, this)
  }

  static init() {
    let floatyElms = document.getElementsByClassName(`${FLOATY_CLASS_NAME}`)
    let callConstructor = (elm) => {return new Floaty(elm)}
    return Utils.map(floatyElms, callConstructor)
  }

  static addFloaty(id, options) {
    if (!id) {
      Utils.error("arg 'id' in 'floaty.addFloaty' must be non-falsey")
      throw "arg 'id' in 'floaty.addFloaty' must be non-falsey"
    }

    options = options || {}

    let parent = options.parent || document.body

    let elem = document.getElementById(id);
    if (!elem) {
      elem = document.createElement('div')
      elem.id = id
      elem.className += ' floaty'
      parent.appendChild(elem);
    } else {
      elem.className += ' floaty'
    }

    return new Floaty(elem, options)
  }
}
