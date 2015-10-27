var server = require('http').createServer(handler),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	set= require('./settings');

server.listen(set.port, set.host);
console.log("-> "+set.host+":"+set.port);

function handler(req,res)
{
	console.log("connection!");
	fs.readFile(__dirname + '/public_html/index.html',function(err,data)
	{
		if(err)
		{
			res.writeHead(500);
			return res.end('Error');
		}
		res.writeHead(200);
		res.write(data);
		res.end();
	});
}

var mime = {
".html": "text/html",
".css" : "text/css",
".js"  : "application/javascript",
".png" : "image/png"
}

