# Floaty.js
## By Tyler Zeller

Floaty is a pure JavaScript, mobile friendly library for adding dynamic, floating elements to your webpage. The behavior of the elements that you choose as Floaties is similar to Apple's assistive touch or Facebook's chat head bubbles.
### Demo

View a live demo [here](http://zuuby.io/floaty-demo.html "Floaty Demo"). Works the same on your smartphone or tablet too!

![Floaty Demo Gif](https://github.com/tylermzeller/floaty/blob/master/floatydemo.gif "Floaty Demo Gif")

### Quick Start Guide

To use Floaty.js, include floaty.js and floaty.css in your webpage project.

```
<script type="text/javascript" src="https://raw.githubusercontent.com/tylermzeller/floaty/master/floaty.js"></script>

<link rel="stylesheet" type="text/css" href="https://raw.githubusercontent.com/tylermzeller/floaty/master/floaty.css">
```

Then add a `floaty` class to the elements you wish to become Floaties.

`<div class="floaty"></div>`

Currently the only option to customize the appearance of your Floaty is through CSS.

```
div.floaty {
  width: 50px;
  height: 50px;
  border-radius: 100%; /* circular */
  background-color: pink;
  top: 50%; /* Starting y position */
  left: 0; /* Starting x position */
}
```

I'm working on the ability to add Floaties and customize them through JavaScript instead of manually adding them via HTML/CSS.

That's it! Enjoy and have fun!
