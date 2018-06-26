var serialport = require('serialport');

var SERIALCOMMAND = {
    // TRANSFER_DISABLE :  [0x23,0x23,0x02,0x00,0x00,0x00,0x00],
    // RAWDATA_ENABLE :    [0x23,0x23,0x02,0x00,0x00,0x00,0x01],
    // MISCDATA_ENABLE :   [0x23,0x23,0x02,0x00,0x00,0x00,0x02],
    // SYS_RECALIBRATE :   [0x23,0x23,0x03,0x00,0x00,0x00,0x01]
    DATAFLOW_DISABLE :  [0x23,0x23,0x23,0x23,0x23,0x23,0x00,0x06,0x30,0x01,0x20,0x00],
    RAWDATA_CONFIG :    [0x23,0x23,0x23,0x23,0x23,0x23,0x00,0x06,0x30,0x01,0x42,0x01],
    MISCDATA_CONFIG :   [0x23,0x23,0x23,0x23,0x23,0x23,0x00,0x06,0x30,0x01,0x42,0x3E],
    DATAFLOW_ENABLE :   [0x23,0x23,0x23,0x23,0x23,0x23,0x00,0x06,0x30,0x01,0x10,0x00],
    SYS_RECALIBRATE :   [0x23,0x23,0x23,0x23,0x23,0x23,0x00,0x06,0x40,0x01,0x00,0x08]
};

function serialread (io, decoder){
	this.io = io;
	this.decoder = decoder;
	this.reconnectTask = null;
    this.connectedPort = null;
}

serialread.prototype.updateDecoder = function(decoder){
	this.decoder = decoder;
}

serialread.prototype.getSerialPort = function(){
	var self = this;
	serialport.list(function (err, ports) {
        for (var i = 0; i < ports.length; i++) {
            var port = ports[i];
            var portManufacturer = port.manufacturer;
            var portName = port.comName;
            // console.log(JSON.stringify(port))
            // TODO: Add Window version of ST USB Identifier
            if ((portName.indexOf("usbmodem") >= 0 && portManufacturer.indexOf("STMicroelectronics") >= 0 )) {
                var myPort = new serialport(portName, {
                    baudrate: 230400 * 2,
                    buffersize: 4096 * 10
                });
                self.connectedPort = myPort;
                self.callbackSerialPort(myPort);
                return;
            }
        }
    });
}

serialread.prototype.callbackSerialPort = function(serialPort){
	var self = this;
	console.log('Serial Port: ' + serialPort.options.baudRate);

    clearInterval(this.reconnectTask);
    this.reconnectTask = null;

    serialPort.on('data', function(data) {
        // console.log(data);
        self.decoder.decode(data);
    });

    serialPort.on('open', showPortOpen);
    serialPort.on('close', showPortClose);
    serialPort.on('error', showError);

    // setInterval(serialConnectiviyTask, 3000);
    
    function showPortOpen() {
        console.log('port open. Data rate: ' + serialPort.options.baudRate);
        self.io.sockets.emit('serialport', { event: "port open", error: 0, baudRate: serialPort.options.baudRate });
        serialPort.flush(function() {
            console.log('Port flushed!');
        });
        setTimeout(function(){
            self.startDataFlow();
        }, 500);
        
    }

    function showPortClose() {
        self.connectedPort = null;
        console.log('port closed.');
        self.io.sockets.emit('serialport', { event: "port close", error: 0 });
        dataBuf = [];
        self.decoder.clear();
        serialPortSearching();
    }

    function showError(error) {
        self.connectedPort = null;
        console.log('Serial port error: ' + error);
        self.io.sockets.emit('serialport', { event: "port error", error: error });
        self.decoder.clear();
        serialPortSearching();
    }

    function serialPortSearching(){
        if (!self.reconnectTask) {
            self.reconnectTask = setInterval(function() {
                self.getSerialPort();
                console.log("Search COM Ports");
            }, 3000);
        }
    }

    function serialConnectiviyTask(){
        var event = self.connectedPort ? "port open" : "port close";
        self.io.sockets.emit('serialport', {event:event, error:0});
    }

    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.on('data', function(key) {
        if (key === '\u0003' || key === '0') {

            serialPort.write(new Buffer(SERIALCOMMAND.DATAFLOW_DISABLE), function() {
                serialPort.drain(function() {
                    console.log(SERIALCOMMAND.DATAFLOW_DISABLE);
                    console.log('Stop sending data!');
                    setTimeout(function(){
                        process.exit();
                        }, 1000); 
                });
            });
            
        }
        else if(key === 'r'){
            serialPort.write(new Buffer(SERIALCOMMAND.SYS_RECALIBRATE), function() {
                serialPort.drain(function() {
                    console.log(SERIALCOMMAND.SYS_RECALIBRATE);
                    console.log('System Recalibrating');
                });
            });
        }
        else if(key == 'd'){
            setTimeout(function(){
                serialPort.write(new Buffer(SERIALCOMMAND.RAWDATA_CONFIG), function() {
                        console.log(new Buffer(SERIALCOMMAND.RAWDATA_CONFIG));
                        console.log('Start sending data!');
                });
            }, 500)
        }
        else if(key == 'm'){
            setTimeout(function(){
                serialPort.write(new Buffer(SERIALCOMMAND.MISCDATA_CONFIG), function() {
                        console.log(new Buffer(SERIALCOMMAND.MISCDATA_CONFIG));
                        console.log('Start sending data!');
                });
            }, 500)
        }
    })
}

serialread.prototype.write = function(data){
    if(this.connectedPort){
        this.decoder.clear();
        this.connectedPort.write(data, function(){
            console.log('writing: ', data);
        })
    }
    else{
        console.log('No available port');
    }
}

serialread.prototype.startDataFlow = function(){
    var self = this;
    self.write(new Buffer(SERIALCOMMAND.MISCDATA_CONFIG));
    setTimeout(function(){
        self.write(new Buffer(SERIALCOMMAND.DATAFLOW_ENABLE));
        console.log('Start sending data!');
    }, 500);
}

serialread.prototype.run = function(){
	var self = this;
	if(!this.reconnectTask) {
		this.reconnectTask = setInterval(function(){
			self.getSerialPort();
			console.log("Search COM Ports");
		}, 3000);
	}
}

module.exports =  serialread;
