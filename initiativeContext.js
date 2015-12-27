var immutable = require('immutable');

var EventStore = function () {
	var events = new immutable.List();

	this.Add = function(event) {
		events = events.push(event);
		console.log(event);
	};

	this.GetOrder = function() {
		var state = new immutable.List();
		events.forEach(function(event) {state = event.Apply(state);});
		var result = state
			.map(function(x) {return '<li>' + x.charName + ' - ' + x.roll + '</li>'; })
			.reduce(function(x1, x2) {return x1 + x2;});

		return '<ul>' + result + '</ul>';
	};
};

var eventStore = new EventStore();

exports.InitiativeRolledEvent = function(charName, roll) {
	var charName = charName;
	var roll = roll;

	this.Apply = function(state) {
		console.log('apply');
		return state.push({charName: charName, roll: roll});
	};
};

exports.Order = function() {
	return eventStore.GetOrder();
};

exports.AddEvent = function(event) {
	eventStore.Add(event);
};