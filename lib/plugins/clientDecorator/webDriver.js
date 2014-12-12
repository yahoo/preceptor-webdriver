// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var WebDriverManager = require('../../../');
var AbstractClientDecorator = require('preceptor').AbstractClientDecorator;
var Promise = require('promise');
var utils = require('preceptor-core').utils;
var istanbul = require('istanbul');
var minimatch = require('minimatch');
var _ = require('underscore');

/**
 * @class WebDriverClientDecorator
 * @extends AbstractClientDecorator
 *
 * @constructor
 *
 * @property {Driver} _instance
 * @property {WebDriverManager} _webDriverManager
 * @property {WebDriverContainer} _webDriverContainer
 */
var WebDriverClientDecorator = AbstractClientDecorator.extend(

	{
		/**
		 * Initializes the instance
		 *
		 * @method initialize
		 */
		initialize: function () {
			this.getOptions().configuration = utils.deepExtend({}, [
				{
					"isolation": false,
					"client": {},
					"server": {}
				},
				this.getConfiguration()
			]);

			this.__super();

			this._webDriverManager = new WebDriverManager();
		},


		/**
		 * Setup of web-driver
		 *
		 * @method _setup
		 * @return {Promise}
		 * @private
		 */
		_setup: function () {

			var webDriverContainer,
				server,
				client;

			webDriverContainer = this.getWebDriverManager().generate(this.getConfiguration());
			server = webDriverContainer.getServer();
			client = webDriverContainer.getClient();

			this._webDriverContainer = webDriverContainer;

			return server.setup(client.getCapabilities()).then(function () {
				return client.start();

			}).then(function () {

				var capabilities = client.getCapabilities(),
					id = [];

				if (capabilities.browserName) {
					id.push(capabilities.browserName);
				}
				if (capabilities.version) {
					id.push(capabilities.version);
				}

				global.PRECEPTOR_WEBDRIVER = {
					"driver": client.getInstance(),
					"browserName": capabilities.browserName,
					"browserVersion": capabilities.version,
					"browser": id.join('_'),
					"clientName": client.getType(),
					"serverName": server.getType(),
					"collectCoverage": this.collectCoverage.bind(this)
				};
			}.bind(this));
		},

		/**
		 * Tear-down of web-driver
		 *
		 * @method _tearDown
		 * @return {Promise}
		 * @private
		 */
		_tearDown: function () {
			var webDriverContainer = this._webDriverContainer;

			return this.collectCoverage().then(function () {
				return webDriverContainer.getClient().stop().then(function () {
					return webDriverContainer.getServer().tearDown();
				});

			}).then(function () {
				delete global.PRECEPTOR_WEBDRIVER;
			});
		},

		/**
		 * Collects the coverage-report when requested
		 *
		 * @returns {Promise}
		 */
		collectCoverage: function () {

			var coverageVar,
				coverageObj;

			// Should remote coverage be retrieved?
			coverageObj = this._webDriverContainer.getCoverage();

			if (coverageObj.isActive()) {

				// Load remote coverage
				coverageVar = coverageObj.getCoverageVar();
				return this._webDriverContainer.getClient().loadCoverage(coverageVar).then(function (coverage) {

					var collector, excludes;

					// Filter coverage
					excludes = coverageObj.getExcludes();
					if (excludes && (excludes.length !== 0)) {
						coverage = this._filterCoverage(coverage, excludes);
					}

					// Mapping
					if (coverageObj.hasMapping()) {
						coverage = this._mapCoverage(coverage, coverageObj.getMapping());
					}

					// Combine local and remote coverage
					collector = new istanbul.Collector();
					collector.add(global.__preceptorCoverage__ || {});
					collector.add(coverage);

					// Set new Preceptor coverage
					global.__preceptorCoverage__ = collector.getFinalCoverage() || {};

				}.bind(this));

			} else {
				return Promise.resolve();
			}
		},

		/**
		 * Filters the coverage report according to excludes
		 *
		 * @param {object} coverage
		 * @param {string[]} excludes
		 * @returns {object}
		 * @private
		 */
		_filterCoverage: function (coverage, excludes) {
			var keys = _.keys(coverage),
				result = {};

			_.each(keys, function (key) {
				var allowed = true;

				_.each(excludes, function (exclude) {
					allowed = allowed && !minimatch(key, exclude);
				});

				if (allowed) {
					result[key] = coverage[key];
				}
			});

			return result;
		},

		/**
		 * Maps coverage paths to a new path
		 *
		 * @param {object} coverage
		 * @param {object[]} mappingList
		 * @returns {object}
		 * @private
		 */
		_mapCoverage: function (coverage, mappingList) {
			var keys = _.keys(coverage),
				result = {};

			_.each(keys, function (key) {
				var path = key;

				// Update paths
				_.each(mappingList, function (mapping) {
					path = path.replace(new RegExp(mapping.from), mapping.to);
				});

				// Copy coverage
				result[path] = coverage[key];

				// Replace path in child
				if (result[path].path) {
					result[path].path = path;
				}
			});

			return result;
		},


		/**
		 * Gets the web-driver manager
		 *
		 * @method getWebDriverManager
		 * @return {WebDriverManager}
		 */
		getWebDriverManager: function () {
			return this._webDriverManager;
		},


		/**
		 * Should tests be run in isolation?
		 *
		 * @method inIsolation
		 * @return {boolean}
		 */
		inIsolation: function () {
			return this.getConfiguration().isolation;
		},


		/**
		 * Processes the begin of the testing environment
		 *
		 * @method processBefore
		 * @return {Promise}
		 */
		processBefore: function () {
			if (!this.inIsolation()) {
				return this._setup();
			} else {
				return Promise.resolve();
			}
		},

		/**
		 * Processes the end of the testing environment
		 *
		 * @method processAfter
		 * @return {Promise}
		 */
		processAfter: function () {
			if (!this.inIsolation()) {
				return this._tearDown();
			} else {
				return Promise.resolve();
			}
		},

		/**
		 * Processes the beginning of a test
		 *
		 * @method processBeforeTest
		 * @return {Promise}
		 */
		processBeforeTest: function () {
			if (this.inIsolation()) {
				return this._setup();
			} else {
				return Promise.resolve();
			}
		},

		/**
		 * Processes the ending of a test
		 *
		 * @method processAfterTest
		 * @return {Promise}
		 */
		processAfterTest: function () {
			if (this.inIsolation()) {
				return this._tearDown();
			} else {
				return Promise.resolve();
			}
		}
	});

module.exports = WebDriverClientDecorator;
