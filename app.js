var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
 
server.listen(3000);
io.on('connection', function (socket) { 
	var redisClient = redis.createClient();
	redisClient.subscribe('display');
	redisClient.subscribe('input');

	redisClient.on('display', function(channel, message) {
		socket.emit(channel, message);
	});

	redisClient.on('input', function(channel, message) {
		socket.emit(channel, message);
	});

	socket.on('display', function(message){
		//TODO: for now, only repeat the message on all channels
		socket.emit('display', {data: {from: 'display', content: message}});
		socket.emit('input', {data: {from: 'display', content: message}});
	});
	socket.on('input', function(message){
		//TODO: for now, only repeat the message on all channels
		socket.emit('display', {data: {from: 'input', content: message}});
		socket.emit('input', {data: {from: 'input', content: message}});
	});

	socket.on('disconnect', function() {
		redisClient.quit();
  });
 
});
