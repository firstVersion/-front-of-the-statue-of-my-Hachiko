var server 	= require('http').createServer(handler),
	io 		= require('socket.io').listen(server),
	fs 		= require('fs'),
	path 	= require('path'),
	url 	= require('url'),
	set 	= require('./settings');


	function handler(req,res)
	{	
		var filePath;
		var pathName = url.parse(req.url).pathname;
    console.log(pathName);

		if(req.method === "GET")
			filePath = path.join(set.root, pathName);
		else
			return sendError(req,res,501);

		fs.stat(filePath, function(err, stats)
    {
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

  function sendFile(req, res, filePath) 
  {

	    var stream = fs.createReadStream(filePath);
	    stream.on("readable", function() {
	      res.writeHead(200, {"Content-Type":set.mime[path.extname(filePath)] || "text/plain"});
	    });

	    stream.on("data", function(data) {
	      res.write(data);
	    });

	    stream.on("close", function() {
	      console.log("<- " + set.message[200] + ": " + req.method + " " + req.url);
	    });
	    stream.on("error", function(err) {
	      sendError(req, res, 500);
	    });
      
      stream.on('end', function(){
        res.end();
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



var test = io.of('/test').on('connection',function(socket)
{
  socket.join("member");
  socket.on('emit_from_client',function(data){
    console.log(data.lon);
    socket.broadcast.to("member").emit('emit_from_server',{"lat":data.lat,"lon":data.lon});
  });
});



