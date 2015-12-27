var http = require('http');
var fs = require('fs');
var url = require('url');
var immutable = require('immutable');
var initiativeContext = require('./initiativeContext.js');

var stringContains = function(str, substring) {
	return str.indexOf(substring) > -1;
};

var MatchedResult = function(execute) {
	this.Matched = true;
	this.Execute = execute;
};

var NoMatchResult = function() {
	this.Matched = false;
	this.Execute = function(response) {};
};

var RedirectMatcher = function() {
	var aliases = immutable.List.of(
		{from: '/', to: '/index.html'}
	);

	this.MatchRequest = function(request) {
		var matched = aliases
			.filter(function(alias) { return alias.from == request.url; })
			.first();

		if (matched) {
			return new MatchedResult(function(response) {
				response.writeHead(302, { Location: matched.to} );
				response.end();
			});
		} else {
			return new NoMatchResult();
		}
	};
};

var StaticFileMatcher = function() {
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

	this.MatchRequest = function(request) {
		var matched = types
			.filter(function(type) { return stringContains(request.url, type.extension); })
			.first();

		console.log('static file: ' + matched);

		if (!matched) {
			return new MatchedResult(function(response) {
				response.writeHead(200, matched.contentType);
				response.end(readFile(request.url));
			});
		} else {
			return new NoMatchResult();
		}
	};
};

var matchers = immutable.List.of(
	new StaticFileMatcher(),
	new RedirectMatcher()
);

var processRequest = function(request, response) {
	var handler = matchers
					.map(function(matcher) { return matcher.MatchRequest(request); } )
					.filter(function(matchResult) { return matchResult.Matched; })
					.first();
	
	if (handler) {
		console.log(handler);
		handler.Execute(response);
	} else {
		throw 'no matcher found for ' + request.url;
	}
};

exports.processRequest = function(request, response) {
	try {
		console.log('request for ' + request.url);
		processRequest(request, response);
	} catch(error) {
		console.log(error);
		response.writeHead(500, {'Content-Type': 'text/plain'});
		response.end(error);
	}
};