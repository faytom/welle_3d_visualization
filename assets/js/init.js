var WELLE_CONST = Object.freeze({
    //------------MSG_TYPE-------------
	// Get and Get command response
	'MSG_TYPE' : {
		'wGET' : 0x1001,
		'wGET_RESP' : 0x1002,
		// Set and Set command response
		'wSET' : 0x2001,
		'wSET_RESP' : 0x2002,
		// Dataflow Start and response
		'wDATAFLOW' : 0x3001,
		'wDATAFLOW_RESP' : 0x3002,
		// System command and response
		'wSYSCMD' : 0x4001,
		'wSYSCMD_RESP' : 0x4002,
		// reserved for future use
		'wRESERVED' : 0xFFF1,
		'wRESERVED_RESP' : 0xFFF2
	},

	'SYSTEM_PARA' : {
		// GET & SET allowed parameters
		// Refresh rate
		'wREFRESH_RATE' : 0x0001,
		// Base update parameter
		'wPOWER_STABLE_LENGTH' : 0x0002,
		'wPOWER_STABLE_VAR' : 0x0003,
		'wPEAK_STABLE_LENGTH' : 0x0004,
		'wPEAK_STABLE_VAR' : 0x0005,
		// Kalman filter parameter
		'wKALMAN_1D_CV' : 0x0006,
		'wKALMAN_1D_CA' : 0x0007,
		'wKALMAN_2D_CV' : 0x0008,
		'wKALMAN_2D_CA' : 0x0009,
		
		'wKALMAN_1D_P_VAR' : 0x0010,
		'wKALMAN_1D_Q_VAR' : 0x0011,
		'wKALMAN_2D_P_VAR' : 0x0012,
		'wKALMAN_2D_Q_VAR' : 0x0013,
		// PDAF chi dist gamma
		'wCHIDISTGAMMA' :0x0014,
		'wTRACKER_STATE_FRAMES' : 0x0015,
		'wAVERAGE_FILTER_SIZE' :0x0016,
		
		// Signal Threshold
		'wTHRESHOLD' : 0x0017,

		'wXYZ_STABLE_SIZE' : 0x0019,
		'wXYZ_STABLE_VAR' : 0x0020,
		
		//-------GET allowed parameters---------
		'wPULSE_NUMBER' : 0x0018
		//-------GET allowed parameters---------
	},

	'SYSCMD_PARA' : {
		//---------------------------------
		//-----------SYSCMD_PARA-----------
		'wRESET_BOOT' : 0x0001,
		'wRESET_APP' : 0x0002,
		'wRESTART' :0x0004,
		'wRECAL' : 0x0008
		//-----------SYSCMD_PARA-----------
		//---------------------------------
	},

	'DATAFLOW_PARA' : {
		//---------------------------------
		//----------DATAFLOW_PARA----------
		//dataflow control byte
		'wSTART' : 0x1000,
		'wSTOP' : 0x2000,
		'wCONFIG' : 0x4000,
		//dataflow output to device byte
		'wOUTPUT_BLE' : 0x0100,
		'wOUTPUT_USB' : 0x0200,
		//dataflow output type bytes
		'wRAW' : 0x0001,
		'wPEAK_RAW' : 0x0002,
		'wPEAK_FILTERED' : 0x0004,
		'wPOSITION_RAW' : 0x0008,
		'wPOSITION_FILTERED' : 0x0010,
		'wENVELOP' : 0x0020,
		'wOUTPUT_USB_DEFAULT' : 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0200,
		'wOUTPUT_BLE_DEFAULT' : 0x0010 | 0x0100
		//----------DATAFLOW_PARA----------
		//---------------------------------
	},

	'STATUS' : {
		//---------------------------------
		//----------WELLE_STATUS-----------
		'wSUCCES' : 0x0000,
		'wERR' : 0x0001, // General error
		'wERR_INVALID_PARAMETER' : 0x0002,
		'wERR_OUT_OF_RANGE' : 0x0002, 	//A provided parameter value was out of its allowed range.
		'wERR_READONLY_PARAMETER' : 0x0003, 	//General Welle error.
		'wERR_INVALID_DATALENGT' : 0x0004
		//----------WELLE_STATUS-----------
		//---------------------------------
	}
});

var SYSTEM_CONFIG = {
	'wREFRESH_RATE' : 60,
	'wKALMAN_1D_CV' : 0,
	'wKALMAN_2D_CV' : 0,
	'wKALMAN_1D_P_VAR' : 1000,
	'wKALMAN_1D_Q_VAR' : 2000,
	'wKALMAN_2D_P_VAR' : 1000,
	'wKALMAN_2D_Q_VAR' : 2000,
	'wCHIDISTGAMMA' : 3,
	'wAVERAGE_FILTER_SIZE' : 20,
	'wTRACKER_STATE_FRAMES' : [5,7],
	'wXYZ_STABLE_SIZE' : 4,
	'wXYZ_STABLE_VAR' : 20
};

var SYSTEM_CONFIG_CUR = {
	'wREFRESH_RATE' : 60,
	'wKALMAN_1D_CV' : 0,
	'wKALMAN_2D_CV' : 0,
	'wKALMAN_1D_P_VAR' : 1000,
	'wKALMAN_1D_Q_VAR' : 2000,
	'wKALMAN_2D_P_VAR' : 1000,
	'wKALMAN_2D_Q_VAR' : 2000,
	'wCHIDISTGAMMA' : 3,
	'wAVERAGE_FILTER_SIZE' : 20,
	'wTRACKER_STATE_FRAMES' : [5,7],
	'wXYZ_STABLE_SIZE' : 4,
	'wXYZ_STABLE_VAR' : 20
};

var socket = io()

function sendRequestData(msg_type, para, data){
	socket.emit('req', {msg_type : msg_type, para : para, data : data});
}

function setLEDFastBlink(){
	sendRequestData(0x2001, 0x00FF, 3);
}

function setLEDSlowBlink(){
	sendRequestData(0x2001, 0x00FF, 2);
}

function setLEDOn(){
	sendRequestData(0x2001, 0x00FF, 1);
}

function setLEDOff(){
	sendRequestData(0x2001, 0x00FF, 0);
}

// socket.on('resp', function(data){
// 	console.log(data);
// 	document.getElementById("debugmsg").innerHTML = data.msg_type + ' ' + data.param + ' ' + data.status;
// 	if(data.msg_type == 'wGET_RESP'){
// 		switch(data.param){
// 			case 'wREFRESH_RATE':
// 				SYSTEM_CONFIG.wREFRESH_RATE = data.data
// 				document.getElementById("framerate").setAttribute("value", SYSTEM_CONFIG.wREFRESH_RATE);
// 				break;
// 			case 'wKALMAN_1D_CV':
// 				console.log('kalman1d_cv ', data.data);
// 				SYSTEM_CONFIG.wKALMAN_1D_CV = data.data;
// 				if(SYSTEM_CONFIG.wKALMAN_1D_CV[0]){
// 					document.getElementById("kalman1d_cv").checked = true;
// 				}
// 				else{
// 					document.getElementById("kalman1d_ca").checked = true;
// 				}
// 				break;
// 			case 'wKALMAN_2D_CV':
// 				console.log('kalman2d_cv ', data.data);
// 				SYSTEM_CONFIG.wKALMAN_2D_CV = data.data;
// 				if(SYSTEM_CONFIG.wKALMAN_2D_CV[0]){
// 					document.getElementById("kalman2d_cv").checked = true;
// 				}
// 				else{
// 					document.getElementById("kalman2d_ca").checked = true;
// 				}
// 				break;
// 			case 'wKALMAN_1D_P_VAR':
// 				SYSTEM_CONFIG.wKALMAN_1D_P_VAR = data.data
// 				document.getElementById("kalman_1DP").setAttribute("value", SYSTEM_CONFIG.wKALMAN_1D_P_VAR);
// 				break;
// 			case 'wKALMAN_1D_Q_VAR':
// 				SYSTEM_CONFIG.wKALMAN_1D_Q_VAR = data.data
// 				document.getElementById("kalman_1DQ").setAttribute("value", SYSTEM_CONFIG.wKALMAN_1D_Q_VAR);
// 				break;
// 			case 'wKALMAN_2D_P_VAR':
// 				SYSTEM_CONFIG.wKALMAN_2D_P_VAR = data.data;
// 				document.getElementById("kalman_2DP").setAttribute("value", SYSTEM_CONFIG.wKALMAN_2D_P_VAR);
// 				break;
// 			case 'wKALMAN_2D_Q_VAR':
// 				SYSTEM_CONFIG.wKALMAN_2D_Q_VAR = data.data
// 				document.getElementById("kalman_2DQ").setAttribute("value", SYSTEM_CONFIG.wKALMAN_2D_Q_VAR);
// 				break;
// 			case 'wCHIDISTGAMMA':
// 				SYSTEM_CONFIG.wCHIDISTGAMMA = data.data
// 				document.getElementById("chidistgamma").setAttribute("value", SYSTEM_CONFIG.wCHIDISTGAMMA);
// 				break;
// 			case 'wAVERAGE_FILTER_SIZE':
// 				SYSTEM_CONFIG.wAVERAGE_FILTER_SIZE = data.data
// 				document.getElementById("avgsize").setAttribute("value", SYSTEM_CONFIG.wAVERAGE_FILTER_SIZE);
// 				break;
// 			case 'wTRACKER_STATE_FRAMES':
// 				SYSTEM_CONFIG.wTRACKER_STATE_FRAMES[0] = data.data[0];
// 				SYSTEM_CONFIG.wTRACKER_STATE_FRAMES[1] = data.data[1];
// 				document.getElementById("lastinit").setAttribute("value", SYSTEM_CONFIG.wTRACKER_STATE_FRAMES[0]);
// 				document.getElementById("lastpredict").setAttribute("value", SYSTEM_CONFIG.wTRACKER_STATE_FRAMES[1]);
// 				break;
// 			case 'wXYZ_STABLE_SIZE':
// 				SYSTEM_CONFIG.wXYZ_STABLE_SIZE = data.data
// 				document.getElementById("stable_size").setAttribute("value", SYSTEM_CONFIG.wXYZ_STABLE_SIZE);
// 				break;
// 			case 'wXYZ_STABLE_VAR':
// 				SYSTEM_CONFIG.wXYZ_STABLE_VAR = data.data
// 				document.getElementById("stable_var").setAttribute("value", SYSTEM_CONFIG.wXYZ_STABLE_VAR);
// 				break;
// 			default:
// 				break;
// 		}
// 	}
// 	else if(data.msg_type == 'wSET_RESP' && data.status == 'wSUCCES'){
// 		switch(data.param){
// 			case 'wREFRESH_RATE':
// 				SYSTEM_CONFIG.wREFRESH_RATE = SYSTEM_CONFIG_CUR.wREFRESH_RATE;
// 				break;
// 			case 'wKALMAN_1D_CV':
// 				SYSTEM_CONFIG.wKALMAN_1D_CV = SYSTEM_CONFIG_CUR.wKALMAN_1D_CV
// 				break;
// 			case 'wKALMAN_2D_CV':
// 				SYSTEM_CONFIG.wKALMAN_2D_CV = SYSTEM_CONFIG_CUR.wKALMAN_2D_CV
// 				break;
// 			case 'wKALMAN_1D_P_VAR':
// 				SYSTEM_CONFIG.wKALMAN_1D_P_VAR = SYSTEM_CONFIG_CUR.wKALMAN_1D_P_VAR
// 				break;
// 			case 'wKALMAN_1D_Q_VAR':
// 				SYSTEM_CONFIG.wKALMAN_1D_Q_VAR = SYSTEM_CONFIG_CUR.wKALMAN_1D_Q_VAR
// 				break;
// 			case 'wKALMAN_2D_P_VAR':
// 				SYSTEM_CONFIG.wKALMAN_2D_P_VAR = SYSTEM_CONFIG_CUR.wKALMAN_2D_P_VAR
// 				break;
// 			case 'wKALMAN_2D_Q_VAR':
// 				SYSTEM_CONFIG.wKALMAN_2D_Q_VAR = SYSTEM_CONFIG_CUR.wKALMAN_2D_Q_VAR
// 				break;
// 			case 'wCHIDISTGAMMA':
// 				SYSTEM_CONFIG.wCHIDISTGAMMA = SYSTEM_CONFIG_CUR.wCHIDISTGAMMA
// 				break;
// 			case 'wAVERAGE_FILTER_SIZE':
// 				SYSTEM_CONFIG.wAVERAGE_FILTER_SIZE = SYSTEM_CONFIG_CUR.wAVERAGE_FILTER_SIZE
// 				break;
// 			case 'wTRACKER_STATE_FRAMES':
// 				SYSTEM_CONFIG.wTRACKER_STATE_FRAMES[0] = SYSTEM_CONFIG_CUR.wTRACKER_STATE_FRAMES[0]
// 				SYSTEM_CONFIG.wTRACKER_STATE_FRAMES[1] = SYSTEM_CONFIG_CUR.wTRACKER_STATE_FRAMES[1]
// 				break;
// 			case 'wXYZ_STABLE_SIZE':
// 				SYSTEM_CONFIG.wXYZ_STABLE_SIZE = SYSTEM_CONFIG_CUR.wXYZ_STABLE_SIZE
// 				break;
// 			case 'wXYZ_STABLE_VAR':
// 				SYSTEM_CONFIG.wXYZ_STABLE_VAR = SYSTEM_CONFIG_CUR.wXYZ_STABLE_VAR
// 				break;
// 			default:
// 				break;
// 		}
// 	}
// })

function systemRecalibrate(){
	socket.emit('req', {msg_type : WELLE_CONST.MSG_TYPE.wSYSCMD, para : WELLE_CONST.SYSCMD_PARA.wRECAL, data : undefined});
}

function dataflowStart(){
	socket.emit('req', {msg_type : WELLE_CONST.MSG_TYPE.wDATAFLOW, para : WELLE_CONST.DATAFLOW_PARA.wCONFIG | WELLE_CONST.DATAFLOW_PARA.wOUTPUT_USB_DEFAULT , data : undefined});
	
	setTimeout(function(){
		socket.emit('req', {msg_type : WELLE_CONST.MSG_TYPE.wDATAFLOW, para : WELLE_CONST.DATAFLOW_PARA.wSTART, data : undefined});
	},100);
}

function dataflowStop(){
	socket.emit('req', {msg_type : WELLE_CONST.MSG_TYPE.wDATAFLOW, para : WELLE_CONST.DATAFLOW_PARA.wSTOP, data : undefined});
}

function getAllSystemParameters(){
	var parameters_list = [WELLE_CONST.SYSTEM_PARA.wREFRESH_RATE, 
					   WELLE_CONST.SYSTEM_PARA.wKALMAN_1D_CV,
					   WELLE_CONST.SYSTEM_PARA.wKALMAN_2D_CV,
					   WELLE_CONST.SYSTEM_PARA.wKALMAN_1D_P_VAR,
					   WELLE_CONST.SYSTEM_PARA.wKALMAN_1D_Q_VAR,
					   WELLE_CONST.SYSTEM_PARA.wKALMAN_2D_P_VAR,
					   WELLE_CONST.SYSTEM_PARA.wKALMAN_2D_Q_VAR,
					   WELLE_CONST.SYSTEM_PARA.wCHIDISTGAMMA,
					   WELLE_CONST.SYSTEM_PARA.wAVERAGE_FILTER_SIZE,
					   WELLE_CONST.SYSTEM_PARA.wTRACKER_STATE_FRAMES,
					   WELLE_CONST.SYSTEM_PARA.wXYZ_STABLE_SIZE,
					   WELLE_CONST.SYSTEM_PARA.wXYZ_STABLE_VAR];
	var t = 50;
	for(p in parameters_list){
		setTimeoutTask(WELLE_CONST.MSG_TYPE.wGET, parameters_list[p], undefined, t);
		t+=50;
	}
}

function setTimeoutTask(msg_type, param, data, t){
	setTimeout(function(){
		sendRequestData(msg_type, param, data);
	}, t);
}

function updateSystemParameters(){
	// SYSTEM_CONFIG_CUR.wREFRESH_RATE = Number(document.getElementById("ex1").value);
	SYSTEM_CONFIG_CUR.wREFRESH_RATE = Number(document.getElementById("framerate").value);
	SYSTEM_CONFIG_CUR.wKALMAN_1D_CV = document.getElementById("kalman1d_cv").checked ? 1 : 0;
	SYSTEM_CONFIG_CUR.wKALMAN_2D_CV = document.getElementById("kalman2d_cv").checked ? 1 : 0;
	SYSTEM_CONFIG_CUR.wKALMAN_1D_P_VAR = Number(document.getElementById("kalman_1DP").value);
	SYSTEM_CONFIG_CUR.wKALMAN_1D_Q_VAR = Number(document.getElementById("kalman_1DQ").value);
	SYSTEM_CONFIG_CUR.wKALMAN_2D_P_VAR = Number(document.getElementById("kalman_2DP").value);
	SYSTEM_CONFIG_CUR.wKALMAN_2D_Q_VAR = Number(document.getElementById("kalman_2DQ").value);
	SYSTEM_CONFIG_CUR.wCHIDISTGAMMA = Number(document.getElementById("chidistgamma").value);
	SYSTEM_CONFIG_CUR.wAVERAGE_FILTER_SIZE = Number(document.getElementById("avgsize").value);
	SYSTEM_CONFIG_CUR.wTRACKER_STATE_FRAMES[0] = Number(document.getElementById("lastinit").value);
	SYSTEM_CONFIG_CUR.wTRACKER_STATE_FRAMES[1] = Number(document.getElementById("lastpredict").value);
	SYSTEM_CONFIG_CUR.wXYZ_STABLE_SIZE = Number(document.getElementById("stable_size").value);
	SYSTEM_CONFIG_CUR.wXYZ_STABLE_VAR = Number(document.getElementById("stable_var").value);

	console.log(SYSTEM_CONFIG_CUR);
	var t = 50;
	for(p in SYSTEM_CONFIG_CUR){
		if(SYSTEM_CONFIG_CUR[p] != SYSTEM_CONFIG[p] && p != 'wTRACKER_STATE_FRAMES'){
			console.log(p + ' is changed');
			setTimeoutTask(WELLE_CONST.MSG_TYPE.wSET, WELLE_CONST.SYSTEM_PARA[p], SYSTEM_CONFIG_CUR[p], t);
			t += 50;
		}
		else if(p == 'wTRACKER_STATE_FRAMES'){
			if((SYSTEM_CONFIG_CUR[p][0] != SYSTEM_CONFIG[p][0]) || (SYSTEM_CONFIG_CUR[p][1] != SYSTEM_CONFIG[p][1])){
				console.log(p + ' is changed');
				setTimeoutTask(WELLE_CONST.MSG_TYPE.wSET, WELLE_CONST.SYSTEM_PARA[p], SYSTEM_CONFIG_CUR[p], t);
				t += 50;
			}
		}
	}
}

