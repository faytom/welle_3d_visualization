//button state
var ENABLE = 1,
  	TOUCHED = 2,
  	RELEASED = 3,
  	DISABLE = 4,
  	DISPLAY = 5;

function buttonRect(translate, position, width, height, parentState, displayState, nextFunc, obj, text, toggleButton){
	this.translate = translate;
	this.position = position;
	this.width = width;
	this.height = height;
	this.state = DISABLE;
	this.parentState = parentState;
	this.displayState = displayState;
	this.nextFunc = nextFunc;
	this.obj = obj;
	this.text = text;
	this.toggleButton = toggleButton;
}

buttonRect.prototype.draw = function(){
	push();
	translate(this.translate.x, this.translate.y);
	if(this.toggleButton == null || this.toggleButton == undefined){
		if(this.state === ENABLE || this.state === RELEASED || this.state === DISPLAY){
			this.drawButton();
		}
		else if(this.state === TOUCHED){
			this.drawTouchedButton();
		}
	}
	else{
		if((this.state === ENABLE || this.state === RELEASED || this.state === DISPLAY) && !this.toggleButton){
			this.drawButton();
		}
		else if(this.state === TOUCHED){
			this.drawTouchedButton();
		}
		else if(this.toggleButton){
			this.drawToggleButton();
		}
	}
	pop();
}

buttonRect.prototype.testTouch = function(touchPosition){
	if(this.state === ENABLE){
		if(abs(touchPosition.x - this.position.x - this.translate.x) <= this.width/2 && abs(touchPosition.y - this.position.y - this.translate.y) <= this.height/2 ){
			this.touched();
			return true;
		}
	}
	else{
		return false;
	}
}

buttonRect.prototype.enable = function(){
	this.state = ENABLE;
}

buttonRect.prototype.touched = function(){
	if(this.state === ENABLE){
		this.state = TOUCHED;
		console.log("button touched")
	}
}

buttonRect.prototype.released = function(){
	if(this.state === TOUCHED){
		this.state = RELEASED;

		if(this.toggleButton != null || this.toggleButton != undefined){
			this.toggleButton = this.toggleButton ? false : true;
		}

		console.log("button released")
		this.nextFunc.call(this.obj);
	}
}

buttonRect.prototype.disable = function(){
	this.state = DISABLE;
}

buttonRect.prototype.display = function(){
	this.state = DISPLAY;
}

buttonRect.prototype.drawButton = function(){
	noStroke();
    rectMode(CENTER);
    fill(233);
    rect(this.position.x, this.position.y, this.width, this.height, 20);
    this.drawText();
}

buttonRect.prototype.drawTouchedButton = function(){
	noStroke();
    rectMode(CENTER);
    fill(90, 74, 132);
    rect(this.position.x, this.position.y, this.width, this.height, 20);
    this.drawDownText();
}

buttonRect.prototype.drawToggleButton = function(){
	noStroke();
    rectMode(CENTER);
    fill(100, 100, 135);
    rect(this.position.x, this.position.y, this.width, this.height, 20);
    this.drawDownText();
}

buttonRect.prototype.drawText = function(){
	displayText(this.text, this.position.x, this.position.y, app.radarWidth*0.02 > 10 ? app.radarWidth*0.02 : 10,
		(this.state === DISPLAY) ? color(200, 200, 200) : color(90, 74, 132), resource.myFont, CENTER, CENTER);
}

buttonRect.prototype.drawDownText = function(){
	displayText(this.text, this.position.x, this.position.y, app.radarWidth*0.02 > 10 ? app.radarWidth*0.02 : 10, color(233), resource.myFont, CENTER , CENTER);
}


