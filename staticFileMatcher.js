var fs = require('fs');
var hh = require('./httpHelper.js');
var immutable = require('immutable');

var types = immutable.List.of(
	{ extension: '.html', contentType: 'text/html', isBinary: false },
	{ extension: '.js', contentType: 'application/javascript', isBinary: false },
	{ extension: '.css', contentType: 'text/css', isBinary: false },
	{ extension: '.png', contentType: 'image/html', isBinary: true }
);

var readFile = function(fileName) {
	var fullPath = __dirname + '\\' + fileName;
	console.log('Reading ' + fullPath);
	return fs.readFileSync(fullPath);
};

exports.StaticFileMatcher = function() {
	this.MatchRequest = function(request) {
		var matched = types
			.filter(function(type) { return hh.StringContains(request.url, type.extension); })
			.first();

		if (matched) {
			console.log('static file: ' + matched);

			return new hh.MatchedResult(function(response) {
				response.writeHead(200, {contentType: matched.contentType});
				response.end(readFile(request.url));
			});
		} else {
			return new hh.NoMatchResult();
		}
	};
};