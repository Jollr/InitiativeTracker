var immutable = require('immutable');
var hh = require('./httpHelper.js');

exports.RedirectMatcher = function() {
	var aliases = immutable.List.of(
		{from: '/', to: '/index.html'}
	);

	this.MatchRequest = function(request) {
		var matched = aliases
			.filter(function(alias) { return alias.from == request.url; })
			.first();

		if (matched) {
			console.log('redirect: ' + matched);

			return new hh.MatchedResult(function(response) {
				hh.Redirect(response, matched.to);
			});
		} else {
			return new hh.NoMatchResult();
		}
	};
};