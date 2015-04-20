// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Base = require('preceptor-core').Base;
var path = require('path');
var _ = require('underscore');

var AbstractClient = require('./abstractClient');
var AbstractServer = require('./abstractServer');

var WebDriverContainer = require('./container');

/**
 * @class WebDriverManager
 * @extends Base
 *
 * @property {object} _options Options supplied when created
 * @property {object} _clientList Registered clients
 * @property {object} _serverList Registered servers
 */
var WebDriverManager = Base.extend(

	/**
	 * Web-driver manager constructor
	 *
	 * @param {object} [options]
	 * @constructor
	 */
	function (options) {
		this.__super();

		this._options = options || {};

		this._clientList = {};
		this._serverList = {};

		this.initialize();
	},

	{
		/**
		 * Initializes the instance
		 *
		 * @method initialize
		 */
		initialize: function () {

			// Initialize registry
			this._initializeClientRegistry();
			this._initializeServerRegistry();
		},

		/**
		 * Initializes the client registry
		 *
		 * @method _initializeClientRegistry
		 * @private
		 */
		_initializeClientRegistry: function () {
			var defaultElements = [
				{ name: 'cabbie', fileName: 'cabbie' },
				{ name: 'taxi', fileName: 'taxi' },
				{ name: 'external', fileName: 'external' }
			];

			_.each(defaultElements, function (entry) {
				entry.path = path.join(__dirname, 'client', entry.fileName);
				entry.fn = require(entry.path);
			}, this);

			this.registerClientRange(defaultElements);
		},

		/**
		 * Initializes the server registry
		 *
		 * @method _initializeServerRegistry
		 * @private
		 */
		_initializeServerRegistry: function () {
			var defaultElements = [
				{ name: 'browserStack', fileName: 'browserStack' },
				{ name: 'chromeDriver', fileName: 'chromeDriver' },
				{ name: 'external', fileName: 'external' },
				{ name: 'ghostDriver', fileName: 'ghostDriver' },
				{ name: 'sauceLabs', fileName: 'sauceLabs' },
				{ name: 'selenium', fileName: 'selenium' }
			];

			_.each(defaultElements, function (entry) {
				entry.path = path.join(__dirname, 'server', entry.fileName);
				entry.fn = require(entry.path);
			}, this);

			this.registerServerRange(defaultElements);
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
		 * Gets a dictionary of registered clients
		 *
		 * @method getClientList
		 * @return {object}
		 */
		getClientList: function () {
			return this._clientList;
		},

		/**
		 * Checks if a client is registered
		 *
		 * @method hasClient
		 * @param {string} name
		 * @return {boolean}
		 */
		hasClient: function (name) {
			return !!this._clientList[name];
		},

		/**
		 * Gets a specific registered client
		 *
		 * @method getClient
		 * @param {string} name
		 * @return {function}
		 */
		getClient: function (name) {
			return this._clientList[name];
		},

		/**
		 * Registers a client
		 *
		 * @method registerClient
		 * @param {string} name
		 * @param {function} contr
		 */
		registerClient: function (name, contr) {
			this._clientList[name] = contr;
		},

		/**
		 * Registers a list of clients
		 *
		 * @method registerClientRange
		 * @param {object[]} list Of `{ name: <string>, fn: <function> }`
		 */
		registerClientRange: function (list) {

			_.each(list, function (entry) {
				this.registerClient(entry.name, entry.fn);
			}, this);
		},


		/**
		 * Gets a dictionary of registered server
		 *
		 * @method getServerList
		 * @return {object}
		 */
		getServerList: function () {
			return this._serverList;
		},

		/**
		 * Checks if a server is registered
		 *
		 * @method hasServer
		 * @param {string} name
		 * @return {boolean}
		 */
		hasServer: function (name) {
			return !!this._serverList[name];
		},

		/**
		 * Gets a specific registered server
		 *
		 * @method getServer
		 * @param {string} name
		 * @return {function}
		 */
		getServer: function (name) {
			return this._serverList[name];
		},

		/**
		 * Registers a server
		 *
		 * @method registerServer
		 * @param {string} name
		 * @param {function} contr
		 */
		registerServer: function (name, contr) {
			this._serverList[name] = contr;
		},

		/**
		 * Registers a list of servers
		 *
		 * @method registerServerRange
		 * @param {object[]} list Of `{ name: <string>, fn: <function> }`
		 */
		registerServerRange: function (list) {

			_.each(list, function (entry) {
				this.registerServer(entry.name, entry.fn);
			}, this);
		},


		/**
		 * Generates a server and client, hooking everything up
		 *
		 * @method generate
		 * @param {object} options
		 * @param {object} options.client
		 * @param {string} [options.client.url]
		 * @param {object} [options.client.capabilities]
		 * @param {object} options.server
		 * @return {WebDriverContainer}
		 */
		generate: function (options) {

			var clientOptions = options.client || {},
				serverOptions = options.server || {},
				plugins = options.plugins || [],
				ClientClass,
				ServerClass,
				clientInstance,
				serverInstance;

			// Load custom plugins
			_.each(plugins, function (pluginPath) {
				var Plugin = require(pluginPath);

				if (Plugin.loader && _.isFunction(Plugin.loader)) {
					Plugin.loader(this);
				} else {
					throw new Error("The plugin " + pluginPath + " doesn't have a loader.");
				}
			}, this);

			// Make sure that the options are consistent
			if (_.isString(clientOptions)) {
				clientOptions = { type: clientOptions };
			}
			if (_.isString(serverOptions)) {
				serverOptions = { type: serverOptions };
			}

			// Create server
			ServerClass = this.getServer(serverOptions.type || "external");
			serverInstance = new ServerClass(serverOptions);

			// Fill server information
			if (!clientOptions.url) {
				clientOptions.url = serverInstance.getUrl() || "http://127.0.0.1:4444/wd/hub";
			}
			clientOptions.capabilities = serverInstance.augmentCapabilities(clientOptions.capabilities || {});

			// Create client
			ClientClass = this.getClient(clientOptions.type || "external");
			clientInstance = new ClientClass(clientOptions);

			// Return a container with all the information
			return new WebDriverContainer(clientInstance, serverInstance, options);
		}
	},

	{
		/**
		 * @property TYPE
		 * @type {string}
		 * @static
		 */
		TYPE: 'WebDriverManager'
	});

// Make abstract classes available to external project

/**
 * @property AbstractClient
 * @type {AbstractClient}
 * @static
 */
WebDriverManager.AbstractClient = AbstractClient;

/**
 * @property AbstractServer
 * @type {AbstractServer}
 * @static
 */
WebDriverManager.AbstractServer = AbstractServer;

/**
 * @property version
 * @type {string}
 * @static
 */
WebDriverManager.version = require('../package.json').version;

/**
 * @property loader
 * @type {function}
 * @static
 */
WebDriverManager.loader = require('./plugins/loader');

module.exports = WebDriverManager;
