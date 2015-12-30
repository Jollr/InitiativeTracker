var immutable = require('immutable');

var EventStore = function () {
	var events = new immutable.List();

	this.Add = function(event) {
		events = events.push(event);
	};

	this.Pop = function() {
		events = events.pop();
	};

	this.GetOrder = function() {
		if (!events.first()) {
			return '[]';
		}

		var state = new immutable.List();
		events.forEach(function(event) {state = event.Apply(state);});
		var result = state
			.map(function(x) {return '{ name: ' + x.charName + ', roll: ' + x.roll + '},'; })
			.reduce(function(x1, x2) {return x1 + x2;})
			.slice(0, -1);

		return '[' + result + ']';
	};
};

var eventStore = new EventStore();

exports.InitiativeRolledEvent = function(charName, roll) {
	var charName = charName;
	var roll = roll;

	this.Apply = function(state) {
		return state.push({charName: charName, roll: roll});
	};
};

exports.CombatStartedEvent = function() {
	this.Apply = function(state) {
		return state.sortBy(function (elem) { return elem.roll; }).reverse();
	};
};

exports.EndOfTurnEvent = function () {
	this.Apply = function(state) {
		var first = state.first();
		return state.shift().push(first);
	};
};

exports.Order = function() {
	return eventStore.GetOrder();
};

exports.AddEvent = function(event) {
	eventStore.Add(event);
};

exports.Undo = function() {
	eventStore.Pop();
};