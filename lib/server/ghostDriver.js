// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractServer = require('../abstractServer');
var Promise = require('promise');
var child_process = require('child_process');

/**
 * @class GhostDriverServer
 * @extends AbstractServer
 *
 * @constructor
 * @param {object} [options]
 * @param {int} [options.port=9516]
 *
 * @property {Process} _childProcess
 * @property {object} _phantomJs
 */
var GhostDriverServer = AbstractServer.extend(

	{
		/**
		 * Initializes the instance
		 *
		 * @method initialize
		 */
		initialize: function () {
			this.__super();

			this._phantomJs = require('phantomjs');
			this._childProcess = null;

			this.getConfiguration().port = this.getPort() || 9517;
		},


		/**
		 * Gets the port of the server
		 *
		 * @method getPort
		 * @return {int}
		 */
		getPort: function () {
			return this.getConfiguration().port;
		},


		/**
		 * Startup driver
		 *
		 * @method setup
		 * @param {object} capabilities
		 * @return {Promise}
		 */
		setup: function (capabilities) {

			if (!this._childProcess) {
				this._childProcess = child_process.execFile(this._phantomJs.path, ["--webdriver=" + this.getPort()]);
			}

			return new Promise(function (resolve, reject) {
				setTimeout(function () {
					resolve();
				}, 3000);
			});
		},

		/**
		 * Shutdown driver
		 *
		 * @method tearDown
		 * @return {Promise}
		 */
		tearDown: function () {

			if (this._childProcess) {
				this._childProcess.kill();
				this._childProcess = null;
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
			return "http://127.0.0.1:" + this.getPort() + "/";
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
				capabilities.browserName = "phantomjs";
			}

			return capabilities;
		}
	});

module.exports = GhostDriverServer;
