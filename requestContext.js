var http = require('http');
var url = require('url');
var immutable = require('immutable');
var hh = require('./httpHelper.js');
var sfm = require('./StaticFileMatcher.js');
var rm = require('./RedirectionMatcher.js');
var im = require('./InitiativeMatcher.js');

var matchers = immutable.List.of(
	new sfm.StaticFileMatcher(),
	new rm.RedirectMatcher(),
	new im.InitiativeMatcher()
);

exports.processRequest = function(request, response) {
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