var server 	= require('http').createServer(handler),
	io 		= require('socket.io').listen(server),
	fs 		= require('fs'),
	path 	= require('path'),
	url 	= require('url'),
	set 	= require('./settings');

server.listen(set.port, set.host);
console.log("-> "+set.host+":"+set.port);

function handler(req,res)
{	
	var filePath;
	var pathName = url.parse(req.url).pathname;

	if(req.method === "GET")
		filePath = path.join(root, pathName);
	else
		return sendError(req,res,501);
		
	fs.stat(filePath, function(err, stats){
		if(err)
		{
			if((/ENOENT/).test(err.message))return sendError(req,res,404);
			else return sendError(req,res,500);
		}
		if(!stats.isDirectory())
			return sendFile(req,res,filePath);
	});

}

var message = {
200: "OK",
404: "Not Found",
500: "Internal Server Error",
501: "Note Implemented"
}

var mime = {
".html": "text/html",
".css" : "text/css",
".js"  : "application/javascript",
".png" : "image/png",
".jpg" : "image/jpeg",
".gif" : "image/gif",
".txt" : "text/plain"
}

function sendFile(req, res, filePath)
{
	var file = fs.createReadStream(filePath);
	file.on("readble", function(){
		res.writeHead(200,{"Content-Type":mime[path.extname(filePath)] || "text/plain"});
	}).on("data", function(data){
		res.write(data);
	}).on("error", function(err){
		sendError(req,res,500);
	})
}

function sendError(req,res,statusCode)
{
	res.writeHead(statusCode, {"Content-Type":"text/html"});
	res.write("<!DOCTYPE html><html><head></head>"+message[statusCode]+"<body></body></html>")
	res.end();
}




