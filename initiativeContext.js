var immutable = require('immutable');

var state = function() {

	initiativeOrder = [];

	this.Apply = function(event) {
		if (event.eventType == "CombatStarted") {

		} else if (event.eventType == "InitiativeRolled") {
		}
	};
};

exports.CombatStartedEvent = function() {
	this.eventType = "CombatStarted";
};

exports.InitiativeRolledEvent = function(name, initiativeRoll) {
	this.eventType = "InitiativeRolled";
	this.InitiativeRolle = initiativeRoll;
};

exports.Order = function() {
	var order = '<ul>'
	order += '<li>Kras - 14</li>';
	order += '<li>Wanda - 1</li>';
	order += '</ul>';
	return order;
};
