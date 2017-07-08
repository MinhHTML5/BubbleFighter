function Button (path, x, y, w, h, callback, param) {
	var image = new Image();
	image.src = path;
	
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	
	var isClicked = false;
	var lastKnownTouchSize = 0;
	

	this.SetPosition = function (x, y) {
		this.x = x;
		this.y = y;
	}
	
	
	this.Update = function (mouseX, mouseY) {
		var click = false;
		for (var i=0; i<mouseX.length; i++) {
			if (mouseX[i] >= this.x && mouseX[i] <= this.x + this.width
			&&  mouseY[i] >= this.y && mouseY[i] <= this.y + this.height) {
				click = true;
				break;
			}
		}
		if (click) {
			if (isClicked == false) {
				isClicked = true;
			}
		}
		else {
			if (isClicked == true && lastKnownTouchSize != mouseX.length) {
				isClicked = false;
				callback(param);
			}
			else {
				isClicked = false;
			}
		}
		lastKnownTouchSize = mouseX.length;
	}
	
	this.Draw = function() {
		if (isClicked == false) {
			context.drawImage (image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}
		else {
			context.drawImage (image, 0, this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		}
	}
}