var result = (function () {
	var har;

	function checkFeatures () {
		var capable = true;

		capable = capable && !!Date.prototype.toISOString;
		capable = capable && !!performance;
		capable = capable && !!performance.timing;

		return capable;
	}

	function getPageId () {
		if (!window.preceptor_har) {
			window.preceptor_har = performance.timing.requestStart;
		}
		return window.preceptor_har;
	}

	function gatherHAR () {
		var navigationTiming = performance.timing,
			resourceTiming,

			har = {},
			log = {},
			creator = {},
			browser = {},
			pages = [],
			entries = [],

			pageId = getPageId(),
			i, len;

		har.log = log;

		log.version = "1.2";
		log.creator = creator;
		log.browser = browser;
		log.pages = pages;
		log.entries = entries;

		creator.name = "Preceptor-WebDriver";
		creator.version = "0.9.0";
		creator.comment = "by YAHOO!";

		browser.name = navigator.appName || "unknown";
		browser.version = navigator.appVersion || "unknown";
		browser.comment = navigator.userAgent || "";

		pages.push({
			"startedDateTime": (new Date(navigationTiming.requestStart)).toISOString(),
			"id": pageId,
			"title": document.title,
			"pageTimings": {
				"onContentLoad": navigationTiming.domContentLoadedEventStart - navigationTiming.navigationStart,
				"onLoad": navigationTiming.loadEventStart - navigationTiming.navigationStart
			}
		});

		entries.push({
			"pageref": pageId,
			"startedDateTime": (new Date(navigationTiming.requestStart)).toISOString(),
			"time": navigationTiming.loadEventEnd - navigationTiming.navigationStart,
			"request": {
				"method": "GET",
				"url": window.location + "",
				"httpVersion": "HTTP/1.1",
				"cookies": [],
				"headers": [],
				"queryString": [],
				"headerSize": -1,
				"bodySize": -1
			},
			"response": {
				"status": 200,
				"statusText": "OK",
				"httpVersion": "HTTP/1.1",
				"cookies": [],
				"headers": [],
				"content": {},
				"redirectURL": "",
				"headerSize": -1,
				"bodySize": -1
			},
			"timings": {
				"blocked": navigationTiming.domainLookupStart - navigationTiming.navigationStart,
				"dns": navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
				"connect": navigationTiming.connectEnd - navigationTiming.connectStart,
				"send": 0,
				"wait": navigationTiming.responseStart - navigationTiming.requestStart,
				"receive": navigationTiming.responseEnd - navigationTiming.responseStart,
				"ssl": -1,
				"_domLoading": navigationTiming.domComplete - navigationTiming.domLoading,
				"_onLoad": navigationTiming.loadEventEnd - navigationTiming.loadEventStart
			},
			"_entryType": "page",
			"_initiatorType": "user"
		});

		if (performance.getEntriesByType) {
			resourceTiming = performance.getEntriesByType('resource');

			for (i = 0, len = resourceTiming.length; i < len; i++) {

				entries.push({
					"pageref": pageId,
					"startedDateTime": (new Date(navigationTiming.loadEventEnd + resourceTiming[i].fetchStart)).toISOString(),
					"time": resourceTiming[i].duration,
					"request": {
						"method": "GET",
						"url": resourceTiming[i].name,
						"httpVersion": "HTTP/1.1",
						"cookies": [],
						"headers": [],
						"queryString": [],
						"headerSize": -1,
						"bodySize": -1
					},
					"response": {
						"status": 200,
						"statusText": "OK",
						"httpVersion": "HTTP/1.1",
						"cookies": [],
						"headers": [],
						"content": {},
						"redirectURL": "",
						"headerSize": -1,
						"bodySize": -1
					},
					"timings": {
						"blocked": resourceTiming[i].domainLookupStart - resourceTiming[i].fetchStart,
						"dns": resourceTiming[i].domainLookupEnd - resourceTiming[i].domainLookupStart,
						"connect": resourceTiming[i].connectEnd - resourceTiming[i].connectStart,
						"send": 0,
						"wait": resourceTiming[i].responseStart - resourceTiming[i].requestStart,
						"receive": resourceTiming[i].responseEnd - resourceTiming[i].responseStart,
						"ssl": -1
					},
					"_entryType": resourceTiming[i].entryType,
					"_initiatorType": resourceTiming[i].initiatorType
				});
			}
		}
	}

	if (checkFeatures()) {
		har = gatherHAR();

		if (JSON) {
			return JSON.stringify(har);
		} else {
			return har;
		}
	} else {
		return null;
	}

}).apply(null, arguments);

return result;

