var InitiativeUpdater = function (dispatcher) {
	var updateUrl = '/initiative/order';

	var processUpdate = function(data) { 
		dispatcher.Publish('initiativeOrderUpdated', data);
	};

	var update = function() {
		$.get(updateUrl, processUpdate);
	};

	this.Start = function() {
		window.setInterval(update, 1000);
	};

	update();
};

$(function() { 
	var dispatcher = new Dispatcher();
	var gui = new Gui(dispatcher);
	new InitiativeUpdater(dispatcher).Start();
});