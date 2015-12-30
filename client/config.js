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

	this.IsAdmin = function() {
		var option = getByKey(readCookie(), 'isAdmin');
		return option && option.Value;
	};

	this.MakeAdmin = function() {
		var current = readCookie();
		var adminOption = getByKey(current, 'isAdmin');
		if (adminOption) {
			adminOption.Value = true;
		} else {
			current = current.push(new KeyValuePair('isAdmin', true));
		}

		parseCookie(current);
	};
};