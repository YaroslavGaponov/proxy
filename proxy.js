
var http = require("http");
var util = require("util");
var url = require("url");

var server = http.createServer(function (server_req, server_res) {
  console.log(server_req.url);
  
  var options = url.parse(server_req.url);
  options.method = server_req.method;
  options.headers = server_req.headers;
  
  var client = http.request(options, function(client_res) {
    server_res.writeHead(client_res.statusCode, client_res.headers);
    client_res.pipe(server_res);    
  });
  
  server_req.pipe(client);
});

server.listen(8080, "0.0.0.0", function() {
  var addr = server.address();
  util.log(util.format("server is started on %s:%s ...", addr.address, addr.port));
});