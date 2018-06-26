var wellMsgUtil = require('./welleMessageUtil.js');
var WELLE_CONST = require('./constants.js');
var VAD         = require('./dataVAD.js');

var defaultSettings = {
	ignoreFrames : 4,
    int16Bytes : 2,
	float32Bytes : 4, 
    headerLen : 6,
    reservedLen : 6, 
    peakRawLen : 2,
    peakFilteredLen : 2,
    posRawLen : 3,
	posFilteredLen : 3,
	signalLen : 1200, 
	dataHeader : 35
}

var defaultConfig = {
	controllerMode : 'DYNAMIC',
	appControl : 'NONE'
}

var DECODERSTATE = {
    unknown : -1,
    header : 0,
    reserved : 1,
    peak_raw : 2,
    peak_filtered : 3,
    position_raw : 4,
    position_filtered : 5,
    envelop : 6,
    dataLength : 7,
    message : 8
};

function decoder(config, settings, io, callback){
	this.config = config || defaultConfig;
	this.settings = settings || defaultSettings;
    this.state = DECODERSTATE.header;
	this.callback = callback;
	this.io = io;
	this.index = null;
	this.IgnoreStartingFramesTask = null;
    this.byteCount = 0;
	this.reservedData = [];
	this.bufferData = [];
	this.preData = [];
	this.buf = new Buffer(4);
	this.IgnoreFrameCount = 0;
    this.messageLen = 0;
    this.deviceMode = 'TRACKING';
    this.dataVAD = new VAD(null, null, null, null, null, io);
}

decoder.prototype.updateCoorProcessor = function(callback){
	this.callback = callback;
}

decoder.prototype.updateDeviceMode = function(deviceMode){
    this.deviceMode  = deviceMode;
}

decoder.prototype.updateConfig = function(config){
	this.config = config;
}

decoder.prototype.stopDataflow = function(){
    return this.packRequestData({msg_type : WELLE_CONST.MSG_TYPE.wDATAFLOW, para : WELLE_CONST.DATAFLOW_PARA.wSTOP, data : undefined});
}

decoder.prototype.packRequestData = function(data){
    return wellMsgUtil.packRequestData(data.msg_type, data.para, data.data);
}

decoder.prototype.decode = function(data){
    // console.log(data)
    for(var i = 0; i < data.length; i++){
        var dataByte = data[i];
        if(this.state == DECODERSTATE.header){
            this.decodeHeader(dataByte);
        }
        else if(this.state == DECODERSTATE.dataLength){
            this.decodeDataLength(dataByte);
        }
        else if(this.state == DECODERSTATE.message){
            this.decodeDataMessage(dataByte);
        }
    }
}

decoder.prototype.clear = function(){
    this.state == DECODERSTATE.header;
    this.byteCount = 0;
    this.resetBuffer();
}

decoder.prototype.resetBuffer = function(){
    this.bufferData = [];
}

decoder.prototype.decodeHeader = function(dataByte){
    if(dataByte == this.settings.dataHeader){
        this.byteCount++;
        if(this.byteCount == this.settings.headerLen) {
            this.byteCount = 0;
            this.resetBuffer();
            //this.state = DECODERSTATE.reserved;
            this.state = DECODERSTATE.dataLength;
        }
    }    
}

decoder.prototype.decodeDataLength = function(dataByte){
    this.bufferData.push(dataByte);
    this.byteCount++;
    if(this.byteCount == 2){
        this.messageLen = (this.bufferData[1] << 8) + this.bufferData[0] - 2;
        this.byteCount = 0;
        this.state = DECODERSTATE.message;
    }
}

decoder.prototype.decodeDataMessage = function(dataByte){
    this.bufferData.push(dataByte);
    this.byteCount++;
    if(this.byteCount == this.messageLen){
        var message = wellMsgUtil.decodeMessage(this.reverseByte(this.bufferData));
        // console.log(message)
        if(!message.dataLen || message.msg_type == 'wGET_RESP'){
            console.log(message)
            this.io.sockets.emit('resp', message)
        }
        if(message.data.wPOSITION_FILTERED){
            // console.log(message.data.wPOSITION_FILTERED)
            if(this.deviceMode == 'TRACKING'){
                if(message.data.wPOSITION_FILTERED[0] != 0 || message.data.wPOSITION_FILTERED[1] != 0 ){
                    this.io.sockets.emit('s', {data_type: 'position_filtered', data : message.data.wPOSITION_FILTERED});
                }
            }
            else if(this.deviceMode == 'RECOGNIZING'){
                if((message.data.wPOSITION_FILTERED[0] != 0 || message.data.wPOSITION_FILTERED[1] != 0) && !this.dataVAD.detectPause){
                    this.dataVAD.detectMotion(message.data.wPOSITION_FILTERED);
                }
                else if(message.data.wPOSITION_FILTERED[0] == 0 && message.data.wPOSITION_FILTERED[1] == 0 && this.dataVAD.detectPause){
                    this.dataVAD.detectPause = false;
                }
            }
        }
        if(message.data.wENVELOP){
            this.io.sockets.emit('s', {data_type: 'envelope', data: message.data.wENVELOP});
        }
        if(message.data.wRAW){
            this.io.sockets.emit('s', {data_type: 'raw', data: message.data.wRAW});
        }

        this.byteCount = 0;
        this.bufferData = [];
        this.state = DECODERSTATE.header;
    }
}

decoder.prototype.reverseByte = function(data){
    var data_copy = [];
    for(i = 0; i < data.length; i+=2){
        data_copy[i] = data[i+1];
        data_copy[i+1] = data[i];
    }
    return data_copy;
}

decoder.prototype.processCoordinate = function(coordinates, preData){
	(this.callback.process.bind(this.callback) || function(){console.log('no callback function')})(coordinates, preData);
}

module.exports = decoder;