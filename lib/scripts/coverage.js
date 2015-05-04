var result = (function () {

	var cov = window['__coverage__'] || {};

	window['__coverage__'] = {};

	if (JSON) {
		return JSON.stringify(cov);
	} else {
		return cov;
	}

}).apply(null, arguments);

return result;
