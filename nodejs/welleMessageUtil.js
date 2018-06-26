var WELLE_CONST = require('./constants.js')

var welleMessageUtil = {};

welleMessageUtil.packRequestData = function(msg_type, param, data)
{
	var len = 6;
	// console.log(data)
	if(typeof(data) == 'object'){
		len = 6 + 4 * data.length;
	}
	else if(typeof(data) == 'number'){
		len = 10;
	} 
	var msgBuf = new Buffer(len+6);
	for(var i = 0; i < 6; i++){
		msgBuf[i] = 0x23;
	}

	msgBuf[6] = (len & 0xFF00)>>8;
	msgBuf[7] = len & 0x00FF;

	msgBuf[8] = (msg_type & 0xFF00)>>8;
	msgBuf[9] = msg_type & 0x00FF;

	msgBuf[10] = (param & 0xFF00)>>8;
	msgBuf[11] = param & 0x00FF;

	if(data){
		if(data.length){
			for(var i = 0; i < data.length; i++){
				msgBuf.writeFloatBE(data[i], 12 + 4*i);
			}
		}
		else{
			msgBuf.writeFloatBE(data, 12);
		}
	}
	
	return msgBuf;
}

welleMessageUtil.decodeMessage = function(msg)
{
	// console.log(msg)
	var decodeMsg = {
		dataLen : 0,
		msg_type: WELLE_CONST.MSG_TYPE.wRESERVED,
		param 	: WELLE_CONST.SYSTEM_PARA.wREFRESH_RATE,
		status 	: WELLE_CONST.STATUS.wERR,
		data 	: [],
		valid 	: false
	}
	var msgLen = (msg[0]<<8) + msg[1];
	if (msgLen == msg.length){
		decodeMsg.valid  = true;
	}
	else{
		return decodeMsg;
	}

	decodeMsg.dataLen  = (msgLen - 8) / 2;
	decodeMsg.msg_type = (msg[2]<<8) + msg[3];
	
	decodeMsg.param    = (msg[4]<<8) + msg[5];
	
	decodeMsg.status   = (msg[6]<<8) + msg[7];
	

	if((decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wDATAFLOW_RESP) && decodeMsg.dataLen){
		var availableData = {
							 'wRAW'					: {flag : WELLE_CONST.DATAFLOW_PARA.wRAW, dataLen: (1360) * 2},
							 'wPEAK_RAW'			: {flag : WELLE_CONST.DATAFLOW_PARA.wPEAK_RAW, dataLen : 2}, 
							 'wPEAK_FILTERED'		: {flag : WELLE_CONST.DATAFLOW_PARA.wPEAK_FILTERED, dataLen : 2}, 
							 'wPOSITION_RAW'		: {flag : WELLE_CONST.DATAFLOW_PARA.wPOSITION_RAW, dataLen : 3}, 
							 'wPOSITION_FILTERED'	: {flag : WELLE_CONST.DATAFLOW_PARA.wPOSITION_FILTERED, dataLen : 3},
							 'wENVELOP'				: {flag : WELLE_CONST.DATAFLOW_PARA.wENVELOP, dataLen : 1200}};
		var msg_index = 8;
		for (type in availableData){
			if(decodeMsg.param & availableData[type].flag){
				var temp = [];
				for(var i = 0; i < availableData[type].dataLen; i++){
					temp[i] = this.convert2Int16(msg, msg_index);
					msg_index += 2;
				}
				decodeMsg.data[type] = temp;
			}
		}
	}
	else if((decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wGET_RESP) && decodeMsg.dataLen){
		//decodeMsg.data = (msg[8]<<8) + msg[9];
		var msg_index = 8;
		var temp = [];
		for(var i = 0; i < decodeMsg.dataLen; i++){
			decodeMsg.data[i] = this.convert2Int16(msg, msg_index);
			msg_index += 2;
		}
	}


	if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wDATAFLOW_RESP){
		for( param in WELLE_CONST.DATAFLOW_PARA){
			if(decodeMsg.param == WELLE_CONST.DATAFLOW_PARA[param]){
				decodeMsg.param = param;
			}
		}
	}
	else if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wGET_RESP || decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wSET_RESP){
		for( param in WELLE_CONST.SYSTEM_PARA){
			if(decodeMsg.param == WELLE_CONST.SYSTEM_PARA[param]){
				decodeMsg.param = param;
			}
		}
	}
	else if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wSYSCMD_RESP){
		for( param in WELLE_CONST.SYSCMD_PARA){
			if(decodeMsg.param == WELLE_CONST.SYSCMD_PARA[param]){
				decodeMsg.param = param;
			}
		}
	}
	
	for( msg_type in WELLE_CONST.MSG_TYPE){
		if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE[msg_type]){
			decodeMsg.msg_type = msg_type;
		}
	}

	for( status in WELLE_CONST.STATUS){
		if(decodeMsg.status == WELLE_CONST.STATUS[status]){
			decodeMsg.status = status;
		}
	}

	return decodeMsg;
}

welleMessageUtil.convert2Int16 = function(msg, index){
	var tempBuf = new Buffer(2);
	tempBuf[0] = msg[index+1];
	tempBuf[1] = msg[index];
	return Number(tempBuf.readInt16LE());
}

module.exports = welleMessageUtil;
