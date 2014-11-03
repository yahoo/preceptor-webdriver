// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractClient = require('../abstractClient');
var Promise = require('promise');

/**
 * @class ExternalClient
 * @extends AbstractClient
 *
 * @constructor
 */
var ExternalClient = AbstractClient.extend(

	{
		/**
		 * Starts the client
		 *
		 * @method start
		 * @return {Promise}
		 */
		start: function () {
			return Promise.resolve();
		},

		/**
		 * Stops the client
		 *
		 * @method stop
		 * @return {Promise}
		 */
		stop: function () {
			return Promise.resolve();
		}
	});

module.exports = ExternalClient;
