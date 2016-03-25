var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));
var clientInfo = {};

//--------------------------
// Helper functions - begin
var getTimestamp = function () {
    return moment().valueOf();
};

var getMomentTimestamp = function (inUtc) {
    return moment.utc(inUtc);
};

var createSystemMessage = function (textMessage) {
    return {
        name: 'System',
        text: textMessage,
        timestamp: getTimestamp()
    };
};
// Helper functions - end
//--------------------------

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');
    socket.emit('message', 
        createSystemMessage('Welcome to the chat application!'));
    
    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', 
            createSystemMessage(req.name + ' has joined!'));
    });
    
    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);
        message.timestamp = getTimestamp();  
        io.to(clientInfo[socket.id].room).emit('message', message);
    });
    
    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];
        
        if(typeof userData !== 'undefined') {
            socket.leave(userData.room);
            socket.broadcast.to(userData.room).emit('message',
                createSystemMessage(userData.name + ' has left!'));
            delete clientInfo[socket.id];
        }
    });
});

http.listen(PORT, function() {
	console.log('Server started and listening on port ' + PORT + '!');
});
