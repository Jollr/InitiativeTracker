exports.StringContains = function(str, substring) {
	return str.indexOf(substring) > -1;
};

exports.Redirect = function(response, target) {
	response.writeHead(302, { Location: target} );
	response.end();
};

exports.MatchedResult = function(execute) {
	this.Matched = true;
	this.Execute = execute;
};

exports.NoMatchResult = function() {
	this.Matched = false;
	this.Execute = function(response) {};
};