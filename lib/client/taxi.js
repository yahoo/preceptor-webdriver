// Copyright 2014-2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractClient = require('../abstractClient');
var Promise = require('promise');
var _ = require('underscore');

/**
 * @class TaxiClient
 * @extends AbstractClient
 *
 * @constructor
 *
 * @property {function} _taxi
 */
var TaxiClient = AbstractClient.extend(

	{
		/**
		 * Initializes the instance
		 *
		 * @method initialize
		 */
		initialize: function () {
			var config;

			this.__super();

			this._taxi = require('taxi');

			config = this.getConfiguration();
			config.mode = this.getMode() || this._taxi.Driver.MODE_SYNC;
			config.debug = this.inDebug() || false;
			config.httpDebug = this.inHttpDebug() || false;
		},


		/**
		 * Gets the mode taxi is run in
		 *
		 * @method getMode
		 * @return {string}
		 */
		getMode: function () {
			return this.getConfiguration().mode;
		},

		/**
		 * Is taxi in debug-mode?
		 *
		 * @method inDebug
		 * @return {boolean}
		 */
		inDebug: function () {
			return this.getConfiguration().debug;
		},

		/**
		 * Is taxi in http debug-mode?
		 *
		 * @method inHttpDebug
		 * @return {boolean}
		 */
		inHttpDebug: function () {
			return this.getConfiguration().httpDebug;
		},


		/**
		 * Starts the client
		 *
		 * @method start
		 * @return {Promise}
		 */
		start: function () {
			if (!this._instance) {
				this._instance = this._taxi(this.getUrl(), this.getCapabilities(), this.getConfiguration());
			}
			return Promise.resolve();
		},

		/**
		 * Stops the client
		 *
		 * @method stop
		 * @return {Promise}
		 */
		stop: function () {
			if (this._instance) {
				this._instance.dispose();
			}
			return Promise.resolve();
		},


		/**
		 * Load the coverage through the Selenium client
		 *
		 * @method loadCoverage
		 * @param {string} coverageVar
		 * @return {Promise} With {object} of coverage
		 */
		loadCoverage: function (coverageVar) {

			var script,
				coverage;

			script = this._coverageScript();
			coverage = this._instance.browser().activeWindow().execute(script, [coverageVar]);

			if (_.isString(coverage)) {
				coverage = JSON.parse(coverage);
			}

			return Promise.resolve(coverage);
		}
	});

module.exports = TaxiClient;
