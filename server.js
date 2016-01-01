var http = require('http');
var rq = require('./requestContext.js');
var immutable = require('immutable');

var parsePostData = function(postData) { 
	var result = {};

	immutable
		.fromJS(postData.split('&'))
		.forEach(function(kvp) {
			var parts = kvp.split('=');
			result[parts[0]] = parts[1];
		});

	return result;
};

var parseAndProcess = function(request, response) {
	try {
		console.log('request for ' + request.url);

		if (request.method == 'POST') {
			var gatheredData = '';
			request.on('data', function(chunk) {
				gatheredData += chunk.toString();
			});

			request.on('end', function() {
				console.log('Gathered post data: ' + gatheredData);
				request.postData = parsePostData(gatheredData);
				rq.processRequest(request, response);
			});
		} else {
			rq.processRequest(request, response);
		}
	} catch(error) {
		console.log(error);
		response.writeHead(500, {'Content-Type': 'text/plain'});
		response.end(error);
	}
};

http.createServer(parseAndProcess).listen(80);

console.log('Server running');