// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Base = require('preceptor-core').Base;
var utils = require('preceptor-core').utils;
var Coverage = require('./coverage');
var _ = require('underscore');

var defaultOptions = require('./defaults/containerOptions');

/**
 * @class WebDriverContainer
 * @extends Base
 *
 * @property {object} _options Options supplied when created
 * @property {AbstractClient} _client
 * @property {AbstractServer} _server
 */
var WebDriverContainer = Base.extend(

	/**
	 * Web-driver manager constructor
	 *
	 * @param {AbstractClient} client
	 * @param {AbstractServer} server
	 * @param {object} options
	 * @param {boolean} [options.isolation=false]
	 * @constructor
	 */
	function (client, server, options) {
		this.__super();

		this._client = client;
		this._server = server;
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

			// Augment instance
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
			if (!_.isBoolean(this.inIsolation())) {
				throw new Error('The "isolation" parameter is not a boolean.');
			}
		},

		/**
		 * Augments the web-driver data with default data
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
		 * Is the web-driver in isolation mode?
		 *
		 * @method inIsolation
		 * @return {boolean}
		 */
		inIsolation: function () {
			return this.getOptions().isolation;
		},

		/**
		 * Get coverage object
		 *
		 * @method getCoverage
		 * @return {Coverage}
		 */
		getCoverage: function () {
			return new Coverage(this.getOptions().coverage);
		},


		/**
		 * Gets the client
		 *
		 * @method getClient
		 * @return {AbstractClient}
		 */
		getClient: function () {
			return this._client;
		},

		/**
		 * Gets the server
		 *
		 * @method getServer
		 * @return {AbstractServer}
		 */
		getServer: function () {
			return this._server;
		}
	},

	{
		/**
		 * @property TYPE
		 * @type {string}
		 * @static
		 */
		TYPE: 'WebDriverContainer'
	});

module.exports = WebDriverContainer;
