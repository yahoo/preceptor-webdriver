// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractServer = require('../abstractServer');
var Promise = require('promise');

/**
 * @class BrowserStackServer
 * @extends AbstractServer
 *
 * @constructor
 */
var BrowserStackServer = AbstractServer.extend(

	{
		/**
		 * Gets the user for browser-stack
		 *
		 * @method getUser
		 * @return {string}
		 */
		getUser: function () {
			return this.getConfiguration().user;
		},

		/**
		 * Gets the access-key for browser-stack
		 *
		 * @method getAccessKey
		 * @return {string}
		 */
		getAccessKey: function () {
			return this.getConfiguration().accessKey;
		},


		/**
		 * Startup driver
		 *
		 * @method setup
		 * @param {object} capabilities
		 * @return {Promise}
		 */
		setup: function (capabilities) {
			return Promise.resolve();
		},

		/**
		 * Shutdown driver
		 *
		 * @method tearDown
		 * @return {Promise}
		 */
		tearDown: function () {
			return Promise.resolve();
		},


		/**
		 * Gets the url to the web-driver instance
		 *
		 * @method getUrl
		 * @return {string}
		 */
		getUrl: function () {
			return "http://hub.browserstack.com/wd/hub";
		},

		/**
		 * Augmenting capabilities supplied to the driver
		 *
		 * @method augmentCapabilities
		 * @param {object} capabilities
		 * @return {object}
		 */
		augmentCapabilities: function (capabilities) {

			capabilities["browserstack.user"] = this.getUser();
			capabilities["browserstack.key"] = this.getAccessKey();

			return capabilities;
		}
	});

module.exports = BrowserStackServer;
