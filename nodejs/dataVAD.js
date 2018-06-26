var recognizer = require('./recognizer.js');
var GestureControlApp = require('./GestureControlApp.js');

function dataVAD(actionDataRecognizer, gestureMapping, gestureStartedCallback, coordinateDisplayCallback, callbackObj, io){
	this.collectionTask = null;
	this.IgnoreStartingFramesTask = null;
	this.actionDataRecognizer = actionDataRecognizer || recognizer;
	this.gestureMapping = gestureMapping || null;
	this.gestureStartedCallback = gestureStartedCallback || null;
	this.coordinateDisplayCallback = coordinateDisplayCallback || null;
	this.callbackObj = callbackObj || null;
	this.io = io;
	this.gestureStarted = false;
	this.detectPause = false;
	this.VADSTATE = {
		NORMAL : 0,
		ROTATE : 1
	}

	this.settings = {
		verticalThres : 80,
	    horizontalThres : 50,
	    angle_buf_max_length : 5,
	    rotateThres : 6,
	    min_action_length : 50,
	    max_action_length : 300,
	    static_buf_length : 20, 
	    ignoreFrames : 2,
	    rangeX : {min : -100, max : 100},
	    rangeY : {min : -260, max : -80},
	    checkLength : 15
	};

	this.state = this.VADSTATE.NORMAL;
	
	this.preData = [];
	this.angle_buffer = [];
	this.dataCollection = [];
	this.gestureOrigin = [];
	this.pointsArray = [];
	this.angleSum = 0;
	this.IgnoreFrameCount = 0;
	this.distanceMoved = 0;
}

dataVAD.prototype.detectMotion = function(coor){
    if(this.checkIgnoreFramesDone(coor) && this.checkWithinRange(coor)){
    	if(!this.preData.length){
    		this.preData = coor;
    	}
    	this.io.sockets.emit('s', {data_type: 'position_filtered', data : coor});
    	this.coordinateDisplayCallback && this.coordinateDisplayCallback.bind(this.callbackObj)(coor);
    	this.distanceMoved += Math.sqrt(Math.pow(coor[0] - this.preData[0], 2) + Math.pow(coor[1] - this.preData[1], 2))
    	console.log('Distance Moved, ', this.distanceMoved);
        // this.stateHandler(coor);
		if(this.state == this.VADSTATE.NORMAL){
			this.clearCollectionTask();
			this.dataCollection.push(coor);
			this.setCollectionTimeoutTask(this.dtwRecognizor);
		}
		else if(this.state == this.VADSTATE.ROTATE){
			this.clearRotationTask();
			this.processRotationData(coor);
			this.setRotationTask();
		}

		this.preData = coor;
    }
}

dataVAD.prototype.detectWriting = function(coor){
  //   if(this.checkIgnoreFramesDone()){
  //   	this.clearCollectionTask();
		// this.dataCollection.push(coor);
		// this.setCollectionTimeoutTask(app.algorithm ? this.nnRecognizor : this.oneDollarRecognizor);
  //   }
}

dataVAD.prototype.checkIgnoreFramesDone = function(coor){
	this.clearResetIgnoreStartingFramesTask();
    this.resetIgnoreStartingFramesTask();
    if (this.IgnoreFrameCount < this.settings.ignoreFrames && this.checkWithinRange(coor)) {
    	this.IgnoreFrameCount++;
    	if(this.IgnoreFrameCount == this.settings.ignoreFrames ){
    			this.gestureStarted = true;
    			console.log('gesture started')
    			this.io.sockets.emit('status', {success:true, message: 'Gesture Start', error: 0});
    			this.gestureStartedCallback && this.gestureStartedCallback.bind(this.callbackObj)(coor);
    	}
    	return false;
    }
    else {
    	if(this.gestureStarted = true && this.dataCollection.length > 30 && this.distanceMoved >= 100){
    		if(this.checkCoorStable(this.dataCollection) < 40){
    			this.gestureStarted = false;
    			this.detectPause = true;
    			return false;
    		}
    	}
    	return true;
    }
}

dataVAD.prototype.checkCoorStable = function(coors){
	var meanX = 0, meanY = 0;
	var varX = 0, varY = 0;

	var checkLength = this.settings.checkLength;

	for(var i = coors.length - 1; i > coors.length - checkLength - 1; i--){
		meanX += coors[i][0];
		meanY += coors[i][1];
	}

	meanX /= checkLength;
	meanY /= checkLength;

	for(var i = coors.length - 1; i > coors.length - checkLength - 1; i--){
		varX += (coors[i][0] - meanX) * (coors[i][0] - meanX);
		varY += (coors[i][1] - meanY) * (coors[i][1] - meanY);
	}
	// console.log("VarX, VarY: ", (varX + varY));
	return varX + varY;
}

dataVAD.prototype.checkWithinRange = function(coor){
	var x_min = this.settings.rangeX.min;
	var x_max = this.settings.rangeX.max;
	var y_min = this.settings.rangeY.min;
	var y_max = this.settings.rangeY.max;

	if(coor[0] < x_max && coor[0] > x_min && coor[1] < y_max && coor[1] > y_min){
		return true;
	}
	else{
		return false;
	}
}

dataVAD.prototype.stateHandler = function(coor){
	// vad state handler
	if(this.state == this.VADSTATE.NORMAL){

		if(!this.dataCollection.length){
			this.gestureOrigin = coor;
			this.preData = coor;
		}
		var angle = this.getCoordinateAngleDiff(coor, this.preData);
		this.angleSum += angle;
		// console.log('Angle diff: ' + angle + ' Sum: ' + this.angleSum);
		if(abs(this.angleSum) > 360){
			this.angleSum = 0;
			this.dataCollection = [];
			this.state = this.VADSTATE.ROTATE;
			this.clearCollectionTask();
		}
	}
}

dataVAD.prototype.processRotationData = function(data){
	var angle = this.getCoordinateAngleDiff(data, this.preData);

	if (this.angle_buffer.length < this.settings.angle_buf_max_length) {
        this.angle_buffer.push(angle);
    } else {
        var sum = 0;
        for (var i = 0; i < this.angle_buffer.length; i++) {
            sum += this.angle_buffer[i];
        }
        sum /= this.angle_buffer.length;

        if (sum < -this.settings.rotateThres) {
            console.log('[Gesture]', 'Clockwise');
            self.gestureMapping('Clockwise');
        } else if (sum > this.settings.rotateThres) {
            console.log('[Gesture]', 'Anti-Clockwise');
            self.gestureMapping('Anti-Clockwise');
        }
        this.angle_buffer = [];
    }
}

dataVAD.prototype.getCoordinateAngleDiff = function(data, preData){
	var angle_pre = Math.abs(Math.atan((preData[1] + 160) / preData[0]) * 180 / Math.PI);
    var angle_cur = Math.abs(Math.atan((data[1] + 160) / data[0]) * 180 / Math.PI);

    angle_pre = this.correctAngel(preData, angle_pre);
    angle_cur = this.correctAngel(data, angle_cur);

    var temp_diff = (angle_cur - angle_pre) || 0;

    if (temp_diff > 180) {
        temp_diff = temp_diff - 360;
    } else if (temp_diff < -180) {
        temp_diff = temp_diff + 360;
    }
    return temp_diff
}

dataVAD.prototype.correctAngel = function(data, angle){
	var corrected = angle;
    if (data[0] >= 0 && data[1] >= -160) {
        //1st quadrant
        corrected = angle;
    } else if (data[0] < 0 && data[1] >= -160) {
        //2rd quadrant
        corrected = 180 - angle;
    } else if (data[0] < 0 && data[1] < -160) {
        //3th quadrant
        corrected = 180 + angle;
    } else if (data[0] >= 0 && data[1] < -160) {
        //2nd quadrant
        corrected = 360 - angle;
    }
    return corrected;
}

dataVAD.prototype.clearRotationTask = function(){
	if(this.rotationTask != null){
		clearTimeout(this.rotationTask);
		this.rotationTask = null;
	}
}

dataVAD.prototype.setRotationTask = function(){
	var self = this;
	self.rotationTask = setTimeout(function(){
		self.rotationTask = null;
		self.distanceMoved = 0;
		self.angleSum = 0;
		self.preData = [];
		console.log('Rotation Task Timeout Enter NORMAL state');
		self.state = self.VADSTATE.NORMAL;
	}, 1000);
}

dataVAD.prototype.clearCollectionTask = function(){
	if(this.collectionTask != null){
		clearTimeout(this.collectionTask);
		this.collectionTask = null;
	}
};

dataVAD.prototype.setCollectionTimeoutTask = function(recognizeFunc){
	var self = this;
	self.collectionTask = setTimeout(function(){
		self.angleSum = 0;
		self.preData = [];
		self.distanceMoved = 0;
		self.collectionTask = null;
		var out = "";
		for(var i = 0; i < self.dataCollection.length; i++){
			out += self.dataCollection[i][0] + ',' + self.dataCollection[i][1] + ',';
		}
		console.log(out)
		self.pointsArray = self.convertCoordinate2PointArray(self.dataCollection);
		self.io.sockets.emit('coor', self.dataCollection);
		self.gestureStarted = false;
		self.io.sockets.emit('status', {success:true, message: 'Gesture End', error: 0});
		if(self.actionDataRecognizer){
			console.log('clear data collection');
			self.dataCollection = [];
			if(self.pointsArray.length < 5){
				console.log("Not Enough Points")
			}
			else{
				recognizeFunc.bind(self)(self.pointsArray);
			}
		}
	}, 200);
}

dataVAD.prototype.clearResetIgnoreStartingFramesTask = function(){
	 if (this.IgnoreStartingFramesTask != null) {
        clearTimeout(this.IgnoreStartingFramesTask);
        this.IgnoreStartingFramesTask = null;
    };
}

dataVAD.prototype.resetIgnoreStartingFramesTask = function(){
	var self = this;
	if (!this.IgnoreStartingFramesTask) {
        this.IgnoreStartingFramesTask = setTimeout(function() {
            self.IgnoreFrameCount = 0;
        }, 200);
    }
}

dataVAD.prototype.doRecognizing = function(){
	if(app.algorithm){
		this.nnRecognizor(this.pointsArray);
	}
	else{
		this.oneDollarRecognizor(this.pointsArray);
	}
}

dataVAD.prototype.dtwRecognizor = function(pointsArray){
	var recogGes = this.actionDataRecognizer.Recognize(pointsArray);
	this.io.sockets.emit('l', recogGes);
	this.gestureMapping && this.gestureMapping(recogGes);
	GestureControlApp(recogGes);
}

dataVAD.prototype.nnRecognizor = function(pointsArray){
	app.writingRecogFinish = true;
	app.recogLetter = Predict_NN(pointsArray);
}

dataVAD.prototype.oneDollarRecognizor = function(pointsArray){
	app.writingRecogFinish = true;
	// app.recogLetter = OneDollarRecognize(pointsArray);
}

dataVAD.prototype.convertCoordinate2PointArray = function(coordinates) {
    var points = [];
    for (var i = 0; i < coordinates.length; i++) {
            points.push(new Point(coordinates[i][0], coordinates[i][1]));
    }
    return points;
}

dataVAD.prototype.getCoordinateDiff = function(data, preData) {
    return { dx: (data[0] - preData[0]) || 0, dy: (data[1] - preData[1]) || 0 }
}

// constructor
function Point(x, y) {
    this.X = x;
    this.Y = y;
}

// module.exports = new dataVAD();
module.exports = dataVAD;



