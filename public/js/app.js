var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room') || 'Default';
var socket = io();

console.log(name + ' wants to join ' + room); 

$('.room-title').text(room);

socket.on('connect', function () {
    console.log('Connected to socket.io server!');
    
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = $('.messages');
    
    console.log('New message: ');
    console.log(message.text);
    
    $messages.append('<p><strong>' + message.name + ' ' + 
                     momentTimestamp.local().format('h:mm a') + '</strong></p>');
    $messages.append('<p>' + message.text + '</p>');
});

// Handles submitting of new message
var $form = $('#message-form');

$form.on('submit', function (event) {
    event.preventDefault();
    
    var $message = $form.find('input[name=message]');
    
    socket.emit('message', {
        name: name,
        text: $message.val() 
    });
    
    $message.val('');
});

// Get query string variable value
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, ' '));
        }
    }
    
    return undefined;
}
