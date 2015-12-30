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
		if (options.first()) {
			document.cookie = options
				.map(function(kvp) { return kvp.Key + '=' + kvp.Value; })
				.reduce(function(x1, x2) {return x1 + '&' + x2});
		} else {
			document.cookie = '';
		}
	};

	var getByKey = function(pairs, key) {
		return pairs.filter(function(kvp) {return kvp.Key == key;}).first();
	};

	var getValueByKey = function(key) {
		var kvp = getByKey(readCookie(), key);
		if (kvp) {
			return kvp.Value;
		}
	};

	var addOrSetValue = function(key, value) {
		var current = readCookie();
		var option = getByKey(current, key);
		if (option) {
			option.Value = value;
		} else {
			current = current.push(new KeyValuePair(key, value));
		}

		parseCookie(current);
	};

	var removeOptionIfExists = function(key) {
		parseCookie(readCookie().filter(function(kvp) {return kvp.Key != key;}));
	};

	this.GetCharacterName = function() {
		return getValueByKey('charName');
	};

	this.PickCharacterName = function(charName) {
		addOrSetValue('charName', charName);
	};

	this.IsAdmin = function() {
		return getValueByKey('isAdmin');
	};

	this.MakeAdmin = function() {
		removeOptionIfExists('charName');
		addOrSetValue('isAdmin', true);
	};
};