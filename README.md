# Floaty.js

Floaty is a pure JavaScript, mobile friendly library for adding dynamic, floating elements to your webpage. The behavior of the elements that you choose as Floaties is similar to Apple's assistive touch or Facebook's chat head bubbles.
### Demo

![Floaty Demo Gif](https://github.com/tylermzeller/floaty/blob/master/floatydemo.gif "Floaty Demo Gif")

### What's in the Works?
- Documenting API
- Create more complicated examples
- More extensive testing

### What's New?
- New ES6 source code
- Giving users the choice of lifecycle, i.e. when to initialize all Floaties
- Added method for dynamically adding Floaties

### Quick Start Guide

To use Floaty.js, include floaty.js and floaty.css in your webpage project.

```html
<script type="text/javascript" src="https://raw.githubusercontent.com/tylermzeller/floaty/master/floaty.js"></script>
<link rel="stylesheet" type="text/css" href="https://raw.githubusercontent.com/tylermzeller/floaty/master/floaty.css">
```

Then add a `floaty` class to the elements you wish to become Floaties.

`<div class="floaty"></div>`

Currently the only option to customize the appearance of your Floaty is through CSS.

```css
div.floaty {
  width: 50px;
  height: 50px;
  border-radius: 100%; /* circular */
  background-color: pink;
  top: 50%; /* Starting y position */
  left: 0; /* Starting x position */
}
```

In your own script file, choose when to initialize your Floaties. If you wanted to initialize them when the DOM content loads, this is what that would look like:
```javascript
let floatyInit = () => {
  let floaties = Floaty.init()
  // ... use floaties, or don't
  Floaty.addFloaty('new') // you can even add floaties dynamically
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', floatyInit)
} else {
  floatyInit()
}
```

That's it! Enjoy and have fun!
