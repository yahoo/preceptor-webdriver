// Copyright 2014-2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractServer = require('../abstractServer');
var Promise = require('promise');

/**
 * @class ExternalServer
 * @extends AbstractServer
 *
 * @constructor
 */
var ExternalServer = AbstractServer.extend(

	{
		/**
		 * Startup driver
		 *
		 * @method setup
		 * @param {object} capabilities
		 * @return {Promise}
		 */
		setup: function (capabilities) {
			// Do nothing since the driver should be already available from outside
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
			return process.env.SELENIUM_HUB_URL || null;
		},

		/**
		 * Augmenting capabilities supplied to the driver
		 *
		 * @method augmentCapabilities
		 * @param {object} capabilities
		 * @return {object}
		 */
		augmentCapabilities: function (capabilities) {
			return capabilities || {};
		}
	});

module.exports = ExternalServer;
