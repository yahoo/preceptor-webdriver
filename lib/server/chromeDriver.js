// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractServer = require('../abstractServer');
var Promise = require('promise');

/**
 * @class ChromeDriverServer
 * @extends AbstractServer
 *
 * @constructor
 *
 * @property {boolean} _started
 * @property {object} _chromeDriver
 */
var ChromeDriverServer = AbstractServer.extend(

	{
		/**
		 * Initializes the instance
		 *
		 * @method initialize
		 */
		initialize: function () {
			this.__super();

			this._chromeDriver = require('chromedriver');
			this._started = false;
		},


		/**
		 * Gets the name of the web-driver
		 *
		 * @method getName
		 * @return {string}
		 */
		getName: function () {
			return "chrome-driver";
		},


		/**
		 * Startup driver
		 *
		 * @method setup
		 * @param {object} capabilities
		 * @return {Promise}
		 */
		setup: function (capabilities) {
			if (!this._started) {
				this._chromeDriver.start();
				this._started = true;
			}
			return this._waitForServer();
		},

		/**
		 * Shutdown driver
		 *
		 * @method tearDown
		 * @return {Promise}
		 */
		tearDown: function () {
			if (this._started) {
				this._chromeDriver.stop();
				this._started = false;
			}
			return Promise.resolve();
		},


		/**
		 * Gets the url to the web-driver instance
		 *
		 * @method getUrl
		 * @return {string}
		 */
		getUrl: function () {
			return "http://127.0.0.1:9515/";
		},

		/**
		 * Augmenting capabilities supplied to the driver
		 *
		 * @method augmentCapabilities
		 * @param {object} capabilities
		 * @return {object}
		 */
		augmentCapabilities: function (capabilities) {

			if (!capabilities.browserName) {
				capabilities.browserName = "chrome";
			}

			return capabilities;
		}
	});

module.exports = ChromeDriverServer;
