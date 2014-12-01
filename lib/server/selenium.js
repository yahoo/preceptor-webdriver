// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractServer = require('../abstractServer');

var path = require('path');
var os = require('os');
var fs = require('fs');
var child_process = require('child_process');
var _ = require('underscore');

var Promise = require('promise');
var selenium = require('selenium-server-standalone-jar');

/**
 * @class SeleniumServer
 * @extends AbstractServer
 *
 * @param {object} [options]
 * @param {string} [options.javaPath]
 * @param {int} [options.port=9517]
 * @param {string} [options.logPath]
 * @constructor
 *
 * @property {Process} _childProcess
 */
var SeleniumServer = AbstractServer.extend(

	{
		/**
		 * Initializes the instance
		 *
		 * @method initialize
		 */
		initialize: function () {
			this.__super();

			this._childProcess = null;

			this.getConfiguration().javaPath = this.getJavaPath() || this._findJava();
			this.getConfiguration().port = this.getPort() || 9518;
			this.getConfiguration().logPath = this.getLogPath() || path.join(os.tmpdir(), 'preceptor_selenium.log');
		},

		/**
		 * Finds an installed java instance
		 *
		 * @method _findJava
		 * @return {string}
		 * @private
		 */
		_findJava: function () {

			var javaPath = '',
				javaHome = process.env.JAVA_HOME;

			if (javaHome) {
				javaPath = path.resolve(path.join(javaHome, 'bin', 'java'));
			}

			if (!fs.existsSync(javaPath)) {
				javaPath = '/usr/bin/java';
			}

			if (!fs.existsSync(javaPath)) {
				throw new Error('Cannot find the java binary. Please set the JAVA_HOME environment variable, or install java into /usr/bin/java.');
			}

			return javaPath;
		},


		/**
		 * Gets the path to the java binary
		 *
		 * @method getJavaPath
		 * @return {string}
		 */
		getJavaPath: function () {
			return this.getConfiguration().javaPath;
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
		 * Gets the path to the log file
		 *
		 * @method getLogPath
		 * @return {string}
		 */
		getLogPath: function () {
			return this.getConfiguration().logPath;
		},

		/**
		 * Gets the additional params
		 *
		 * @method getParams
		 * @return {string[]}
		 */
		getParams: function () {
			return this.getConfiguration().params;
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
				var javaPath = this.getJavaPath(),
					seleniumPath = selenium.path,
					additionalParams = this.getParams(),
					params = ["-jar", seleniumPath, "-port", this.getPort(), "-log", this.getLogPath()];

				if (additionalParams) {
					if (_.isArray(additionalParams)) {
						params = params.concat(additionalParams);
					} else {
						throw new Error('Parameter list is not an array.');
					}
				}

				this._childProcess = child_process.execFile(javaPath, params);
			}

			return new Promise(function (resolve, reject) {
				setTimeout(function () { //TODO: Use wait for server
					resolve();
				}, 5000);
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

			return new Promise(function (resolve, reject) {
				setTimeout(function () { //TODO: Use wait for server
					resolve();
				}, 2000);
			});
		},


		/**
		 * Gets the url to the web-driver instance
		 *
		 * @method getUrl
		 * @return {string}
		 */
		getUrl: function () {
			return "http://127.0.0.1:" + this.getPort() + "/wd/hub";
		},

		/**
		 * Augmenting capabilities supplied to the driver
		 *
		 * @method augmentCapabilities
		 * @param {object} capabilities
		 * @return {object}
		 */
		augmentCapabilities: function (capabilities) {
			return capabilities;
		}
	});

module.exports = SeleniumServer;
