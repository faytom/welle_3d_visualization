var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var serialport = require('serialport');

// var nobleble = require('./nodejs/nodeble.js');
// var nobleBLE = new nobleble(null, null, io);
// customized modules
var serialReader = require('./nodejs/serialRead.js');
var serialDecoder = require('./nodejs/serialDecoder.js');

var decoder = new serialDecoder(null, null, io, null);
var serialRead = new serialReader(io, decoder);

// Static
app.use(express.static('assets'))
app.use('/vendor', express.static('node_modules'))

// Router
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

// HTTP Server
server.listen(port, function() {
    console.log('Server listening at port %d', port);
})

// Socket IO
io.on('connection', function(socket) {

    console.log('a user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
        var request = decoder.stopDataflow();
        serialRead.write(request);
    });

    socket.on('config', function(data) {
        console.log('Configuring: ', data);
        decoder.updateDeviceMode(data.deviceMode);
        // nobleBLE.updateDeviceMode(data.deviceMode);
    });

    socket.on('req', function(data){
        var request = decoder.packRequestData(data);
        console.log(request);
        serialRead.write(request);

    })
});

// nobleBLE.onStateChange();
// nobleBLE.discover();

// run serial data reading process
serialRead.run();