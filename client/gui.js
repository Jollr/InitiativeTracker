var Gui = function(dispatcher) {
	var config = new Config();
	if (!config.IsAdmin()) {
		$('#adminForms').hide();
	}

	var updateInitiative = function(updatedOrder) {
		$('#initiativeOrder').html(updatedOrder);
	};

	dispatcher.Subscribe('initiativeOrderUpdated', updateInitiative);
};