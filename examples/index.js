// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var WebDriverManager = require('../');

var webDriverManager = new WebDriverManager();
var container = webDriverManager.generate({
	"isolation": false,
	"client": {
		"type": "taxi",
		"capabilities": {
			"browserName": "firefox"
		},
		"configuration": {
			"mode": "sync"
		}
	},
	"server": {
		"type": "selenium"
	}
});

console.log("Server Start");
container.getServer().setup().then(function () {
	console.log("Client Start");
	return container.getClient().start();
}).then(function () {
	console.log("Client Stop");
	return container.getClient().stop();
}).then(function () {
	console.log("Server Tear-down");
	return container.getServer().tearDown();
}).then(function () {
	console.log("Done");
}, function (err) {
	console.log(err.stack);
});
