var Config = function() {
	var KeyValuePair = function(key, value) {
		this.Key = key;
		this.Value = value;
	};

	var readCookie = function() {
		return Immutable
			.fromJS(document.cookie.split('&'))
			.filter(function(kvp) { return kvp.indexOf('=') > -1;})
			.map(function(kvp) {
				var key = kvp.split('=')[0];
				var value = kvp.split('=')[1];
				return new KeyValuePair(key, value);
			});
	};

	var parseCookie = function(options) {
		document.cookie = options
			.map(function(kvp) { return kvp.Key + '=' + kvp.Value; })
			.reduce(function(x1, x2) {return x1 + '&' + x2});
	};

	var getByKey = function(pairs, key) {
		return pairs.filter(function(kvp) {return kvp.Key == key;}).first();
	};

	var getValueByKey = function(pairs, key) {
		var kvp = getByKey(pairs, key);
		if (kvp) {
			return kvp.Value;
		}
	};

	var addOrSetValue = function(pairs, key, value) {
		var option = getByKey(pairs, key);
		if (option) {
			option.Value = value;
		} else {
			current = current.push(new KeyValuePair(key, value));
		}

		parseCookie(current);
	};

	var removeOptionIfExists = function(pairs, key) {
		parseCookie(pairs.filter(function(kvp) {return kvp.Key != key;}));
	};

	this.GetCharacterName = function() {
		return getValueByKey(readCookie(), 'charName');
	};

	this.PickCharacterName = function(charName) {
		addOrSetValue(readCookie(), 'charName', charName);
	};

	this.IsAdmin = function() {
		return getValueByKey(readCookie(), 'isAdmin');
	};

	this.MakeAdmin = function() {
		removeOptionIfExists('charName');
		addOrSetValue(readCookie(), 'isAdmin', true);
	};
};