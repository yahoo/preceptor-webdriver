var result = (function (coverageVar) {

	var cov = window[coverageVar] || {};

	window[coverageVar] = {};

	if (JSON) {
		return JSON.stringify(cov);
	} else {
		return cov;
	}

}).apply(null, arguments);

return result;
