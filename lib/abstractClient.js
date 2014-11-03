// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Base = require('preceptor-core').Base;
var utils = require('preceptor-core').utils;
var _ = require('underscore');
var path = require('path');
var fs = require('fs');

var defaultOptions = require('./defaults/clientOptions');

/**
 * @class AbstractClient
 * @extends Base
 *
 * @property {object} _options
 * @property {*} _instance
 */
var AbstractClient = Base.extend(

	/**
	 * Web-driver client constructor
	 *
	 * @param {object} options
	 * @constructor
	 */
	function (options) {
		this.__super();

		this._options = utils.deepExtend({}, [ defaultOptions, options || {} ]);
		this._instance = null;

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
			if (!_.isObject(this.getCapabilities())) {
				throw new Error('The "capabilities" parameter is not an object.');
			}
			if (!_.isString(this.getUrl())) {
				throw new Error('The "url" parameter is not a string.');
			}
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
		 * Gets the client-driver instance
		 *
		 * @method getInstance
		 * @return {*}
		 */
		getInstance: function () {
			return this._instance;
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
		 * Gets the url of the server
		 *
		 * @method getUrl
		 * @return {string}
		 */
		getUrl: function () {
			return this.getOptions().url;
		},

		/**
		 * Sets the url of the server
		 *
		 * @method setUrl
		 * @param {string} url
		 */
		setUrl: function (url) {
			this.getOptions().url = url;
		},


		/**
		 * Gets the capabilities
		 *
		 * @method getCapabilities
		 * @return {object}
		 */
		getCapabilities: function () {
			return this.getOptions().capabilities;
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
		 * Starts the client
		 *
		 * @method start
		 * @return {Promise}
		 */
		start: function () {
			throw new Error('Unimplemented web-driver client function "start".');
		},

		/**
		 * Stops the client
		 *
		 * @method stop
		 * @return {Promise}
		 */
		stop: function () {
			throw new Error('Unimplemented web-driver client function "stop".');
		},


		/**
		 * Load the coverage through the Selenium client
		 *
		 * @method loadCoverage
		 * @param {string} coverageVar
		 * @return {Promise} With {object}
		 */
		loadCoverage: function (coverageVar) {
			return Promise.resolve({});
		},


		/**
		 * Retrieves the coverage script for gather coverage data
		 *
		 * @method _coverageScript
		 * @return {string}
		 * @private
		 */
		_coverageScript: function () {
			return fs.readFileSync(path.join(__dirname, 'scripts', 'coverage.js')).toString('utf-8');
		}
	},

	{
		/**
		 * @property TYPE
		 * @type {string}
		 * @static
		 */
		TYPE: 'AbstractClient'
	});

module.exports = AbstractClient;
