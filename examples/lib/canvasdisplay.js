function CanvasDisplay(id)
{
	this.DOM = document.getElementById(id);
}

CanvasDisplay.prototype = new StandardObject();
CanvasDisplay.prototype.DOM = null;

CanvasDisplay.prototype.draw = function(Img)
{
	var ctx = this.getContext();
	ctx.drawImage(Img, 0, 0);
}

CanvasDisplay.prototype.getContext = function()
{
	return this.DOM.getContext("2d");
}