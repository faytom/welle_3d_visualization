var noble = require('noble');
var VAD         = require('./dataVAD.js');

//var BT05 = "067a9610f3b6472babfbdf78557fc165";
var BT05 = "d63bd52027e64c71b8816181d5e0833d";
var BT05_service = "fff0";
// var robot = require('robotjs');
// var screenSize = robot.getScreenSize();

// var tempStr = '';

function nobleBle(callback, obj, io){
    this.tempStr = '';
    this.state = null;
    this.callback = callback;
    this.obj = obj;
    this.io = io;
    this.dataVAD = new VAD(null, null, null, null, null, io);
    this.deviceMode = 'TRACKING';
    this.connected = false;
}

nobleBle.prototype.updateDeviceMode = function(deviceMode){
    this.deviceMode  = deviceMode;
}

nobleBle.prototype.onStateChange = function(){
    var self = this;
    noble.on('stateChange', function(state) {
        console.log(state);
        self.state = state;
        if (state === 'poweredOn') {
            noble.startScanning([BT05_service]);
            //noble.startScanning();
            console.log('start scanning');
        } else {
            noble.stopScanning();
        }
    });
}

nobleBle.prototype.connectivityTask = function(){
    var self = this;
    setInterval(function(){
        var event = self.connected ? "connected" : "disconnected";
        self.io.sockets.emit('bleStatus', {event:event, error:0});
    }, 3000);
}

nobleBle.prototype.discover = function(){
    var self = this;
    noble.on('discover', function(peripheral) {

        peripheral.connect(function(error) {
            console.log('connected to peripheral: ' + peripheral.uuid);
            self.connected = true;
            peripheral.discoverAllServicesAndCharacteristics(function(err, services, characteristics) {
                var char_notify = null;
                var char_write = null;

                var i = 0, len = characteristics.length;

                for(; ++i < len;){
                   console.log("++++++++: " + characteristics[i].uuid);
                   if(characteristics[i].uuid == "ffe4")
                   {
                        char_notify = characteristics[i]; 
                   }
                   else if (characteristics[i].uuid == "ffe9")
                   {
                        char_write = characteristics[i];
                   }
                }

                var write_command = new Buffer([0x23,0x23,0x23,0x23,0x23,0x23,0x00,0x06,0x30,0x01,0x10,0x00]);
                var config_ble_output = new Buffer([0x23,0x23,0x23,0x23,0x23,0x23,0x00,0x06,0x30,0x01,0x41,0x08]);

                if(char_write){
                    char_write.write(config_ble_output,function(error){
                        console.log('config ble data flow');
                    });

                    setTimeout(function(){
                    char_write.write(write_command,function(error){
                            console.log('start data flow');
                        });
                    }, 100);

                }
                

                
                if(char_notify){
                    char_notify.notify(true, function(err) {
                        console.log(err);
                    });

                    char_notify.on('data', function(data, isNotification) {
                     
                         self.decodeData(data);
                         
                    });
                }
            });

        });
    });
}

nobleBle.prototype.decodeData = function(data){


    var dataLength = 5;
    var prefix = '!#';
    var prefixLength = prefix.length;

    var ascii_data = data.toString('ascii');
    this.tempStr += ascii_data;

    if(this.tempStr.indexOf(prefix) != -1){
        this.tempStr = this.tempStr.slice(this.tempStr.indexOf(prefix));
        while(this.tempStr.length >= 13){
            var x = Number(this.tempStr.substring(2, 7));
            var y = Number(this.tempStr.substring(8, 13));

            console.log([Number(x), Number(y)]);

            if(this.deviceMode == 'TRACKING'){
                this.io.sockets.emit('s', {data_type: 'position_filtered', data : [x, y]});
            }
            else if(this.deviceMode == 'RECOGNIZING'){
                this.dataVAD.detectMotion([x, y]);
            }

            this.tempStr = this.tempStr.slice(this.tempStr.indexOf(prefix) + 13);
        }
    }
}

module.exports = nobleBle;
// var nobleBLE = new nobleBle();
// nobleBLE.onStateChange();
// nobleBLE.discover();

