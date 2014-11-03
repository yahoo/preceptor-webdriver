// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Base = require('preceptor-core').Base;
var utils = require('preceptor-core').utils;
var _ = require('underscore');
var Promise = require('promise');

var defaultOptions = require('./defaults/serverOptions');

/**
 * @class AbstractServer
 * @extends Base
 *
 * @property {object} _options
 */
var AbstractServer = Base.extend(

	/**
	 * Web-driver server constructor
	 *
	 * @param {object} options
	 * @param {int} [options.timeOut=15000]
	 * @constructor
	 */
	function (options) {
		this.__super();

		this._options = utils.deepExtend({}, [ defaultOptions, options || {} ]);

		this.initialize();
	},

	{
		/**
		 * Initializes the instance
		 *
		 * @method initialize
		 */
		initialize: function () {

			// Make sure the configuration has the correct structure
			this.validate();

			// Augment options with outside data
			this.augment();
		},


		/**
		 * Validates the data given
		 *
		 * @method validate
		 */
		validate: function () {
			if (!_.isObject(this.getOptions())) {
				throw new Error('The options parameter is not an object.');
			}
			if (!_.isObject(this.getConfiguration())) {
				throw new Error('The "configuration" parameter is not an object.');
			}
			if (!_.isString(this.getType())) {
				throw new Error('The "type" parameter is not a string.');
			}
			//TODO: Timeout
		},

		/**
		 * Augments the data with default values
		 *
		 * @method augment
		 */
		augment: function () {
			// Nothing yet
		},


		/**
		 * Gets the options
		 *
		 * @method getOptions
		 * @return {object}
		 */
		getOptions: function () {
			return this._options;
		},

		/**
		 * Gets the type of server
		 *
		 * @method getType
		 * @return {string}
		 */
		getType: function () {
			return this.getOptions().type;
		},

		/**
		 * Gets the server configuration
		 *
		 * @method getConfiguration
		 * @return {object}
		 */
		getConfiguration: function () {
			return this.getOptions().configuration;
		},

		/**
		 * Gets the timeout in milliseconds
		 *
		 * @method getTimeOut
		 * @return {int}
		 */
		getTimeOut: function () {
			return this.getOptions().timeOut;
		},


		/**
		 * Startup driver
		 *
		 * @method setup
		 * @param {object} capabilities
		 * @return {Promise}
		 */
		setup: function (capabilities) {
			throw new Error('Unimplemented web-driver server function "setup".');
		},

		/**
		 * Shutdown driver
		 *
		 * @method tearDown
		 * @return {Promise}
		 */
		tearDown: function () {
			throw new Error('Unimplemented web-driver server function "tearDown".');
		},


		/**
		 * Gets the url to the web-driver instance
		 *
		 * @method getUrl
		 * @return {string}
		 */
		getUrl: function () {
			throw new Error('Unimplemented web-driver server function "getUrl".');
		},

		/**
		 * Augmenting capabilities supplied to the driver
		 *
		 * @method augmentCapabilities
		 * @param {object} capabilities
		 * @return {object}
		 */
		augmentCapabilities: function (capabilities) {
			throw new Error('Unimplemented web-driver server function "augmentCapabilities".');
		},


		/**
		 * Wait for the server to be available
		 *
		 * @method _waitForServer
		 * @return {Promise}
		 * @private
		 */
		_waitForServer: function () {

			return new Promise(function (resolve, reject) {

				resolve();

//				//TODO: Doesn't work
//				var retryFn,
//					checkFn,
//					retryCounter = +(new Date()),
//					url = this.getUrl(),
//					timeOut = this.getTimeOut();
//
//				checkFn = function () {
//
//					request.get(url, function (error, response) {
//
//						if (!error && (Math.floor(response.statusCode / 100) === 2)) {
//							resolve();
//
//						} else {
//							if ((+(new Date()) - retryCounter) > timeOut) {
//								reject(new Error('Server startup timed-out. Could not connect to the server.'));
//							}
//							retryFn();
//						}
//					});
//				};
//
//				retryFn = function () {
//					retryCounter++;
//					setTimeout(checkFn, 500);
//				};
//
//				checkFn();

			}.bind(this));
		}
	},

	{
		/**
		 * @property TYPE
		 * @type {string}
		 * @static
		 */
		TYPE: 'AbstractServer'
	});

module.exports = AbstractServer;
