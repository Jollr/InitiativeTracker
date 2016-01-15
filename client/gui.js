var Gui = function(dispatcher) {
	var config = new Config();
	var lastInitativeOrder = '';

	var showCorrectElements = function (updateContext) {
		if (!config.IsAdmin()) {
			$('.adminForms').hide();
			
		} else {
			$('.adminForms').show();
		}

		if (!config.IsAdmin() && updateContext.myCharIsFirst && !updateContext.myCharIsDelaying) {
			$('.startDelayForm').show();
		} else {
			$('.startDelayForm').hide();
		}

		if ((!updateContext.myCharIsPresent && !updateContext.myCharIsDelaying) || config.IsAdmin()) {
			$('#addRollForm').show();
		} else {
			$('#addRollForm').hide();
		}

		if (updateContext.myCharIsDelaying) {
			$('.stopDelayForm').show();
		} else {
			$('.stopDelayForm').hide();
		}

		$('.charNameBox').val(updateContext.myCharName);
	};
	
	var parseRow = function(row) {
		if (row == '') return undefined;
		var result = {};

		Immutable
			.fromJS(row.split(','))
			.map(function(kvp) { return kvp.split(':'); })
			.forEach(function(parts) {result[parts[0].substring(1)] = parts[1].substring(1);})
		return result;
	};

	var genHtml = function(initiativeRoll, updateContext) {
		if (!initiativeRoll) return '';
		
		var className = 'label label-default';

		if (updateContext.isFirst) {
			updateContext.isFirst = false;
			updateContext.myCharIsFirst = updateContext.myCharName == initiativeRoll.name;
		}

		if (updateContext.myCharName == initiativeRoll.name) {
			className = 'label label-success';
			updateContext.myCharIsPresent = true;
		}

		var genAdminButtons = function() {
			if (!config.IsAdmin()) {
				return '';
			}

			var removeForm = "<form method='POST' action='/initiative/remove' class='adminCharButton'>" +
					"<input type='hidden' value='" + initiativeRoll.name + "' name='characterName' />" +
					"<input class='btn btn-danger' type='submit' value='X'/>" +
				"</form>";

			var toTopForm = "<form method='POST' action='/initiative/triggerReadyAction' class='adminCharButton'>" +
					"<input type='hidden' value='" + initiativeRoll.name + "' name='characterName' />" +
					"<input class='btn btn-primary' type='submit' value='&uarr;' />" +
				"</form>";

			return removeForm + toTopForm;
		};

		return '<h2 class="initiativeRoll">'
			+ '<span class="' + className + '">' + initiativeRoll.name + ' (' + initiativeRoll.roll + ')' + '</span>'
			+ genAdminButtons()
			+ '</h2>';
	};

	var processDelayQueue = function(order, updateContext) {
		updateContext.myCharIsDelaying = 
			!config.IsAdmin() && 
			updateContext.myCharName &&
			order.filter(function(roll) {return roll.name == updateContext.myCharName;}).first();
	};

	var updateInitiative = function(updatedOrder) {
		if (lastInitativeOrder == updatedOrder) {
			return;
		} else {
			lastInitativeOrder = updatedOrder;
		}

		var updateContext = { 
			isFirst: true, 
			myCharName: config.GetCharacterName(),
			myCharIsPresent : false,
			myCharIsFirst: false,
			myCharIsDelaying: false
		};

		var order = Immutable.fromJS(updatedOrder.split('],')[0].replace('{order: [', '').split('},{'));
		var delayed = Immutable.fromJS(updatedOrder.split('],')[1].replace('delayed: [', '').replace(']}', '').split('},{'))
			.map(function(str) {return str.replace('{', '').replace('}', '')})
			.map(parseRow);
		if (delayed.first()) {
			processDelayQueue(delayed, updateContext);
		}

		var updatedHtml = order
			.map(function(str) {return str.replace('{', '').replace('}', '')})
			.map(parseRow)
			.map(function(row) {return genHtml(row, updateContext);})
			.reduce(function(row1, row2) {return row1 + row2;});
			
		$('#initiativeOrder').html(updatedHtml);
		showCorrectElements(updateContext);
	};

	$('#addRollForm').submit(function() {
		var charName = $('#submittedCharName').val();
		if (!config.IsAdmin()) {
			config.SetCharacterName(charName);
		}
	});

	showCorrectElements({});
	dispatcher.Subscribe('initiativeOrderUpdated', updateInitiative);
};