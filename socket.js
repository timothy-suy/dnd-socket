var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');
var redis = new Redis();

//channel to send updates to the view(s)
//api -> display
redis.subscribe('display', function(err, count) {
});

//what to do when receiving a new message: send over appropriate channel
redis.on('message', function(channel, message) {
    console.log(channel + ': ' + message);
    message = JSON.parse(message);
    io.emit(channel + ':' + message.event, message.data);
});

http.listen(3000, function(){
    console.log('Listening on Port 3000');
});