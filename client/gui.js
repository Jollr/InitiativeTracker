var Gui = function(dispatcher) {
	var config = new Config();
	var lastInitativeOrder = '';

	var showCorrectElements = function (updateContext) {
		if (!config.IsAdmin()) {
			$('.adminForms').hide();
			
		} else {
			$('.adminForms').show();
		}

		if (!config.IsAdmin() && updateContext.myCharIsFirst) {
			$('.playerForms').show();
		} else {
			$('.playerForms').hide();
		}

		if (!updateContext.myCharIsPresent || config.IsAdmin()) {
			$('#addRollForm').show();
		} else {
			$('#addRollForm').hide();
		}

		$('#charNameBox').val(config.GetCharacterName());
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
			className = 'label label-success';
			updateContext.myCharIsFirst = updateContext.myCharName == initiativeRoll.name;
		} 

		if (updateContext.myCharName == initiativeRoll.name) {
			if (!updateContext.isFirst) {
				className = 'label label-primary';
			}
			updateContext.myCharIsPresent = true;
		}

		var genAdminButtons = function() {
			if (!config.IsAdmin()) {
				return '';
			}
			//<button type="button" class="btn btn-lg btn-danger">Danger</button>

			/*<form method='POST' action='/initiative/startDelay'>
				<input class="btn btn-danger" type='submit' value='Delay'/>
			</form>*/
			return "<form method='POST' action='/initiative/remove'>" +
				"<input type='hidden' value='" + initiativeRoll.name + "' name='characterName' />" +
				"<input class='btn btn-danger' type='submit' value='X'/>" +
			"</form>";
		};

		return '<h2 class="initiativeRoll">'
			+ '<span class="' + className + '">' + initiativeRoll.name + ': ' + initiativeRoll.roll + '</span>'
			+ genAdminButtons()
			+ '</h2>';
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
			myCharIsFirst: false
		};

		var order = updatedOrder.split('],')[0].replace('{order: [', '').split('},{');
		//var delayed = updatedOrder.split('],')[1]...;

		var updatedHtml = Immutable.fromJS(order)
			.map(function(str) {return str.replace('{', '').replace('}', '')})
			.map(parseRow)
			.map(function(row) {return genHtml(row, updateContext);})
			.reduce(function(row1, row2) {return row1 + row2;});
			
		$('#initiativeOrder').html(updatedHtml);
		showCorrectElements(updateContext);
	};

	$('#addRollForm').submit(function() {
		var charName = $('#charNameBox').val();
		if (!config.IsAdmin()) {
			config.SetCharacterName(charName);
		}
	});

	showCorrectElements({});
	dispatcher.Subscribe('initiativeOrderUpdated', updateInitiative);
};