var http = require('http');
var fs = require('fs');
var url = require('url');
var initiativeContext = require('./initiativeContext.js');

var processRequest = function(request, response) {
	try {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('test');
	} catch(error) {
		console.log(error);
		response.writeHead(500, {'Content-Type': 'text/plain'});
		response.end(error);
	}
};

exports.processRequest = function(request, response) {
	processRequest(request, response);
};