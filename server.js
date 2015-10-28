var server 	= require('http').createServer(handler),
	io 		= require('socket.io').listen(server),
	fs 		= require('fs'),
	path 	= require('path'),
	url 	= require('url'),
	set 	= require('./settings');

(function(path,host,host){

server.listen(port, host);
console.log("-> "+host+":"+port);
console.log("path-> "+ path);

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
			if( (/ENOENT/).test(err.message) ) return sendError(req,res,404);
			else return sendError(req,res,500);
		}
		if(!stats.isDirectory())
			return sendFile(req,res,filePath);
	});
}

function sendFile(req, res, filePath)
{
	var file = fs.createReadStream(filePath);
	file.on("readble", function(){
		res.writeHead(200,{"Content-Type":set.mime[path.extname(filePath)] || "text/plain"});
	}).on("data", function(data){
		res.write(data);
	}).on("error", function(err){
		sendError(req,res,500);
	})
}

function sentFile2(req,res,filePath)
{
	switch(path.extname(filePath))
	{
		case ".css": break;
		case ".js" : break;
		default:break;
	}
}

function sendError(req,res,statusCode)
{
	res.writeHead(statusCode, {"Content-Type":"text/html"});
	res.write("<!DOCTYPE html><html><head></head>"+set.message[statusCode]+"<body></body></html>")
	res.end();
}

})( process.argv[2]||"./", process.argv[3]||set.port, process.argv[4]||set.host );


