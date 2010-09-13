var http = require('http'), 
		url = require('url'),
		fs = require('fs'),
		io = require('./vendor/Socket.IO-node/'),
		sys = require('sys'),
	TwitterNode = require('twitter-node').TwitterNode;

	var USERNAME = process.ARGV[2];
	var PASSWORD = process.ARGV[3];
	var KEYWORD  = process.ARGV[4] || "iphone";	  

if (!USERNAME || !PASSWORD)
 return sys.puts("Usage: node server.js <twitter_username> <twitter_password> <keyword>");


var twit = new TwitterNode({
 user: USERNAME, 
 password:  PASSWORD,
});
var broadcast_clients = [];

twit.track(KEYWORD)
var buffer = [];
twit
 .addListener('tweet', function(tweet) {
   for(var i=0; i < broadcast_clients.length; i++) {
		broadcast_clients[i].send({message:[1,"@" + tweet.user.screen_name + ": " + tweet.text]})
	}
 })

 .addListener('end', function(resp) {
   	for(var i=0; i < broadcast_clients.length; i++) {
			broadcast_clients[i].send({message:[1,"wave goodbye... " + resp.statusCod]})
		}
 })
 .stream();
		

server = http.createServer(function(req, res){
	// your normal server code
	var path = url.parse(req.url).pathname;
	switch (path){
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<h1>Welcome. Try the <a href="/twitter.html">chat</a> example.</h1>');
			res.end();
			break;
			
		case '/json.js':
		case '/twitter.html':
			fs.readFile(__dirname + path, function(err, data){
				if (err) return send404(res);
				res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
				res.write(data, 'utf8');
				res.end();
			});
			break;
			
		default: send404(res);
	}
}),

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};

server.listen(8081)
// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server);
		
		
io.on('connection', function(client){
	broadcast_clients.push(client) ;
	client.send({ buffer: buffer });
	
	
	client.on('message', function(message){
		var msg = { message: [client.sessionId, message] };
		buffer.push(msg);
		if (buffer.length > 15) buffer.shift();
		client.broadcast(msg);
	});

	client.on('disconnect', function(){
		broadcast_clients.pop(client);
	
	});
});