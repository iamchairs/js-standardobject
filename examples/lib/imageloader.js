function ImageLoader(){}

ImageLoader.prototype = new StandardObject();
ImageLoader.prototype.image = "";
ImageLoader.prototype.ImageObj = null;

ImageLoader.prototype.load = function(str)
{
	this.image = str;

	var that = this;
	this.ImageObj = new Image();
	this.ImageObj.onload = function()
	{
		that.dispatchEvent("loaded", this);
	}
	this.ImageObj.src = str;
}