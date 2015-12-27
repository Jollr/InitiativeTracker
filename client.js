var InitiativeUpdater = function () {
	var updateUrl = '/initiative/order';

	var processUpdate = function(data) { 
		$('#initiativeOrder').html(data);
		console.log(data);
	};

	var update = function() {
		$.get(updateUrl, processUpdate);
	};

	this.Start = function() {
		window.setInterval(update, 1000);
	};
};

$(function() { 
	window.updater = new InitiativeUpdater();
	updater.Start();
});