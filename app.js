var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
 
server.listen(3000);
io.on('connection', function (socket) { 
	var redisClient = redis.createClient();
	redisClient.subscribe('display');
	redisClient.subscribe('remote-control');

	redisClient.on('display', function(channel, message) {
		socket.emit(channel, message);
	});

	redisClient.on('remote-control', function(channel, message) {
		socket.emit(channel, message);
	});

	socket.on('display', function(message){
		//TODO: for now send to all channels
		io.emit('remote-control', {data: {from: message.sender, content: message.content}});
		io.emit('display', {data: {from: message.sender, content: message.content}});
	});
	socket.on('remote-control', function(message){
		//TODO: for now send to all channels
		io.emit('remote-control', {data: {from: message.sender, content: message.content}});
		io.emit('display', {data: {from: message.sender, content: message.content}});
	});

	socket.on('disconnect', function() {
		redisClient.quit();
  });
 
});
