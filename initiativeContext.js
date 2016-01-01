var immutable = require('immutable');

var State = function(order, delayed) {
	this.Order = order;
	this.Delayed = delayed;

	this.UpdateOrder = function(updated) {
		return new State(updated, delayed);
	}
};

var EventStore = function () {
	var events = new immutable.List();

	this.Add = function(event) {
		events = events.push(event);
	};

	this.Pop = function() {
		events = events.pop();
	};

	var listToJson = function(list) {
		if (!list.first()) {
			return '[]';
		}

		var serializedObjects = list
			.map(function(x) {return '{ name: ' + x.charName + ', roll: ' + x.roll + '}'; })
			.reduce(function(x1, x2) {return x1 + ',' + x2;});

		return '[' + serializedObjects + ']';
	};

	this.GetOrder = function() {
		var state = new State(new immutable.List(), new immutable.List());
		events.forEach(function(event) {state = event.Apply(state);});

		return '{' +
			'order: ' + listToJson(state.Order) + ',' +
			'delayed: ' + listToJson(state.Delayed) +
			'}';
	};
};

var eventStore = new EventStore();

exports.InitiativeRolledEvent = function(charName, roll) {
	var charName = charName;
	var roll = roll;

	this.Apply = function(state) {
		return state.UpdateOrder(
			state.Order.push({charName: charName, roll: roll})
		);
	};
};

exports.CombatStartedEvent = function() {
	this.Apply = function(state) {
		return state.UpdateOrder(
			state.Order.sortBy(function (elem) { return Number.parseInt(elem.roll); }).reverse()
		);
	};
};

exports.CombatEndedEvent = function() {
	this.Apply = function(state) {
		return new State(new immutable.List(), new immutable.List());
	};
};

exports.EndOfTurnEvent = function () {
	this.Apply = function(state) {
		var first = state.Order.first();
		var updated = state.Order.shift().push(first);
		return state.UpdateOrder(updated);
	};
};

exports.CharacterRemovedFromCombatEvent = function (charName) {
	this.Apply = function(state) {
		return state.UpdateOrder(
			state.Order.filter(function(elem) {return elem.charName != charName;})
		);
	};
};

exports.DelayStartedEvent = function (charName) {
	this.Apply = function(state) {
		var delayingChar = state.Order.filter(function(elem) {return elem.charName == charName;}).first();
		return new State(
			state.Order.filter(function(elem) {return elem.charName != charName;}),
			state.Delayed.push(delayingChar)
		);
	};
};

exports.DelayStoppedEvent = function (charName) {
	this.Apply = function(state) {
		var reenteringChar = state.Delayed.filter(function(elem) {return elem.charName == charName;}).first();
		return new State(
			state.Order.unshift(reenteringChar),
			state.Delayed.filter(function(elem) {return elem.charName != charName;})
		);
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