var server 	= require('http'),
	io 		= require('socket.io'),
	fs 		= require('fs'),
	path 	= require('path'),
	url 	= require('url'),
	set 	= require('./settings');


	function handler(req,res)
	{	
		var filePath;
		var pathName = url.parse(req.url).pathname;


		if(req.method === "GET")
			filePath = path.join(set.root, pathName);
		else
			return sendError(req,res,501);

		fs.stat(filePath, function(err, stats){

			console.log("error",err);
			
			if(err)
			{
				if( (/ENOENT/).test(err.message) ) return sendError(req,res,404);
				else return sendError(req,res,500);
			}
			if(!stats.isDirectory())
				return sendFile(req,res,filePath);
		});

		console.log(req.method,filePath);
	}

	  function sendFile(req, res, filePath) {

	    var file = fs.createReadStream(filePath);
	    file.on("readable", function() {
	      res.writeHead(200, {"Content-Type":set.mime[path.extname(filePath)] || "text/plain"});
	    });

	    file.on("data", function(data) {
	      res.write(data);
	      console.log(res);
	    });

	    file.on("close", function() {
	      res.end();
	      console.log("<- " + set.message[200] + ": " + req.method + " " + req.url);
	    });

	    file.on("error", function(err) {
	      sendError(req, res, 500);
	    });
	  }

	function sendError(req,res,statusCode)
	{
		res.writeHead(statusCode, {"Content-Type":"text/html"});
		res.write("<!DOCTYPE html><html><head></head>"+set.message[statusCode]+"<body></body></html>")
		res.end();
	}

(function(port,host){
	server.listen(port, host);
	console.log("-> "+host+":"+port);
})( process.argv[3]||set.port, process.argv[4]||set.host );


