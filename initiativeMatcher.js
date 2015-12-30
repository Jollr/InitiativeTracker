var immutable = require('immutable');
var initiativeContext = require('./initiativeContext.js');
var hh = require('./httpHelper.js');

var postRedirectGet = function(response) { hh.Redirect(response, '/'); };

var subMatchers = immutable.List.of(
	{	
		url: 'order', 
		method: 'GET', 
		result: function(request, response) {
			return function(response) {
				response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
				response.setHeader('Pragma', 'no-cache');
				response.setHeader('Expires', 0);
				response.writeHead(200, {contentType: 'text/html'});
				response.end(initiativeContext.Order());
			};
		}
	}, 
	{
		url: 'add', 
		method: 'POST', 
		result: function(request, response) {
			return function(response) {
				
				if (Number.parseInt(request.postData.initiativeRoll)) {
					var addedRoll = new initiativeContext.InitiativeRolledEvent(request.postData.characterName, request.postData.initiativeRoll);
					initiativeContext.AddEvent(addedRoll);
				}
				
				postRedirectGet(response);
			};
		}
	},
	{
		url: 'startCombat',
		method: 'POST',
		result: function(request, response) {
			return function(response) {
				initiativeContext.AddEvent(new initiativeContext.CombatStartedEvent());
				postRedirectGet(response);
			};
		}
	},
	{
		url: 'undo',
		method: 'POST',
		result: function(request, response) {
			return function(response) {
				initiativeContext.Undo();
				postRedirectGet(response);
			}
		}
	},
	{
		url: 'next',
		method: 'POST',
		result: function(request, response) {
			return function(response) {
				initiativeContext.AddEvent(new initiativeContext.EndOfTurnEvent());
				postRedirectGet(response);
			}
		}
	}
);

exports.InitiativeMatcher = function () {
	var matchUrl = '/initiative/';

	this.MatchRequest = function(request) {
		if (!request.url.startsWith(matchUrl)) {
			return new hh.NoMatchResult();
		}

		var subUrl = request.url.replace(matchUrl, '');

		var matcher = subMatchers
			.filter(function(candidate) { return candidate.url == subUrl && candidate.method == request.method; })
			.first();

		if (matcher) {
			return new hh.MatchedResult(matcher.result(request));
		} else {
			return new hh.NoMatchResult();
		}
	};
};