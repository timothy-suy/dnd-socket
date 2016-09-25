var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
 
server.listen(3000);
io.on('connection', function (socket) { 
	var redisClient = redis.createClient();
	redisClient.subscribe('display');
	redisClient.subscribe('remote-control');

	redisClient.on('remote-control', function(channel, message) {
		socket.emit(channel, message);
	});

	socket.on('display', function(message){
		if (message.hasOwnAttribute('command')) {
			//TODO
		}
	});
	socket.on('remote-control', function(message){
		// if (message.hasOwnAttribute('command')) {
			//TODO: just send through for now
			io.emit('display', message);
		// }
	});

	socket.on('disconnect', function() {
		redisClient.quit();
  });
 
});
