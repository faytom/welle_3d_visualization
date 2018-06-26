module.exports = Object.freeze({
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