js-standardobject
=================

A Prototype JS Object with Simple Event-Driven Functionality

The StandardObject is lightweight, simple, and should be apart of anyones application. It contains the bare-bones functionality for an asynchronous event driven application and doesn't intrude or enforce any style of programming. Even though I created the StandardObject for my own purposes I have not added application-specific functionality to use. The power is in the simplicity and abstraction the class provides. Larger applications become a breeze when events are properly used and reviewing old code is much simple without all the spagetti.

See the examples and try using StandardObject with your next web app!

Basic Usage
-----------

```js
Obj1 = new StandardObject();
Obj2 = new StandardObject();

Obj1.addEventListener("ready", new Callback(Obj2, function()
{
	alert("Obj1 is ready!");
}));

window.setTimeout(function()
{
	Obj1.dispatchEvent("ready");
}, 3000);
```

Asynchronous Image Loading Using Extended Classes
--------------------------

```js
Loader = new ImageLoader();
CanvasD = new CanvasDisplay("mycanvas");

Loader.addEventListener("loaded", new Callback(CanvasD, function(Img)
{
	this.draw(Img)
}));

images = ["images/test.jpg","images/test2.jpg","images/test3.jpg","images/test4.jpg","images/test5.jpg"];

window.setInterval(function()
{
	var img = images[Math.round(Math.random()*(images.length-1))];
	console.log(img);

	Loader.load(img);
}, 1000);
```
