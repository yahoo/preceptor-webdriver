// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Base = require('preceptor-core').Base;
var utils = require('preceptor-core').utils;
var _ = require('underscore');

var defaultOptions = require('./defaults/coverageOptions');

/**
 * @class Coverage
 * @extends Base
 *
 * @property {object} _options
 */
var Coverage = Base.extend(

	/**
	 * Coverage constructor
	 *
	 * @param {object} options
	 * @constructor
	 */
	function (options) {
		this.__super();

		this._options = utils.deepExtend({}, [ defaultOptions, options || {} ]);
		if (!this._options.excludes) {
			this._options.excludes = ['**/node_modules/**', '**/test/**', '**/tests/**'];
		}

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
			if (!_.isString(this.getCoverageVar())) {
				throw new Error('The "coverageVar" parameter is not an object.');
			}
			if (!_.isArray(this.getExcludes())) {
				throw new Error('The "excludes" parameter is not a string.');
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
		 * Is coverage active?
		 *
		 * @method isActive
		 * @return {string}
		 */
		isActive: function () {
			return !!this.getOptions().active;
		},

		/**
		 * Get coverage variable
		 *
		 * @method getCoverageVar
		 * @return {string}
		 */
		getCoverageVar: function () {
			return this.getOptions().coverageVar;
		},

		/**
		 * Has mapping turned on?
		 *
		 * @method hasMapping
		 * @return {string}
		 */
		hasMapping: function () {
			return !!this.getOptions().mapping;
		},

		/**
		 * Get mapping
		 *
		 * @method getMapping
		 * @return {object[]} Of `{from:<string>, to:<string>}`
		 */
		getMapping: function () {
			return this.getOptions().mapping;
		},

		/**
		 * Get excludes for coverage
		 *
		 * @method getExcludes
		 * @return {string[]}
		 */
		getExcludes: function () {
			return this.getOptions().excludes;
		}
	},

	{
		/**
		 * @property TYPE
		 * @type {string}
		 * @static
		 */
		TYPE: 'Coverage'
	});

module.exports = Coverage;
