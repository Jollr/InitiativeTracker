var Gui = function(dispatcher) {
	var config = new Config();
	if (!config.IsAdmin()) {
		$('#adminForms').hide();
	}

	var parseRow = function(row) {
		var result = {};

		Immutable
			.fromJS(row.split(','))
			.map(function(kvp) { return kvp.split(':'); })
			.forEach(function(parts) {result[parts[0].substring(1)] = parts[1].substring(1);})
		return result;
	};

	var genHtml = function(initiativeRoll) {
		return '<li>' 
			+ '<h2>'
			+ '<span class="label label-default">' + initiativeRoll.name + ': ' + initiativeRoll.roll + '</span>'
			+ '</h2>'
			+ '</li>';
	};

	var updateInitiative = function(updatedOrder) {
		var updatedHtml = Immutable.fromJS(
			updatedOrder
				.replace('[', '')
				.replace(']', '')
				.split('},{'))
			.map(function(str) {return str.replace('{', '').replace('}', '')})
			.map(parseRow)
			.map(genHtml)
			.reduce(function(row1, row2) {return row1 + row2;});
			
		$('#initiativeOrder').html('<ul>' + updatedHtml + '</ul>');
	};

	dispatcher.Subscribe('initiativeOrderUpdated', updateInitiative);
};