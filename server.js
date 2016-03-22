var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var getTimestamp = function () {
    return moment().valueOf();
};

var getMomentTimestamp = function (inUtc) {
    return moment.utc(inUtc);
};

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');
    
    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);
        message.timestamp = getTimestamp();  
        io.emit('message', message);
    });
    
    var message = {
        name: 'System',
        text: 'Welcome to the chat application!',
        timestamp: getTimestamp()
    };
    socket.emit('message', message);
});

http.listen(PORT, function() {
	console.log('Server started and listening on port ' + PORT + '!');
});
