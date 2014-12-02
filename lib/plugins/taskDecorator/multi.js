// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var AbstractTaskDecorator = require('preceptor').AbstractTaskDecorator;

var _ = require('underscore');
var utils = require('preceptor-core').utils;

/**
 * @class WebDriverMultiTaskDecorator
 * @extends AbstractTaskDecorator
 * @constructor
 */
var WebDriverMultiTaskDecorator = AbstractTaskDecorator.extend(

	{
		/**
		 * Run the decorator
		 *
		 * @method run
		 * @param {object} taskOptions
		 * @param {int} taskIndex
		 */
		run: function (taskOptions, taskIndex) {
			return this._processTaskOptions(taskOptions);
		},


		/**
		 * Process task-options
		 *
         * @method _processTaskOptions
		 * @param {object} taskOptions
		 * @return {object[]} Options for Tasks
		 * @private
		 */
		_processTaskOptions: function (taskOptions) {

			var result = [taskOptions],
				modified = false;

			if (taskOptions.decorators && _.isArray(taskOptions.decorators)) {
				_.each(taskOptions.decorators, function (decorator, index) {

					var decoratorConfigurationsList;

					if ((decorator.type === 'webDriver') && decorator.configuration) {
						decoratorConfigurationsList = this._processDecoratorConfigurations(decorator.configuration);

						// Reset list, if haven't yet
						if (!modified) {
							modified = true;
							result = [];
						}

						_.each(decoratorConfigurationsList, function (currentDecoratorConfiguration) {

							var currentEntry = utils.deepExtend({}, [taskOptions]);
							currentEntry.decorators[index].configuration = currentDecoratorConfiguration;

							result.push(currentEntry);

						}, this);
					}

				}, this);
			}

			return result;
		},

		/**
		 * Process multiple decorator configurations
		 *
		 * @method _processDecoratorConfigurations
		 * @param {object|object[]} configurations
		 * @return {object[]} Configurations
		 * @private
		 */
		_processDecoratorConfigurations: function (configurations) {
			var result = [];

			if (_.isArray(configurations)) {
				_.each(configurations, function (configuration) {
					result = result.concat(this._processDecoratorConfiguration(configuration));
				}, this);
			} else {
				result = [].concat(this._processDecoratorConfiguration(configurations));
			}

			return result;
		},

		/**
		 * Process single decorator configuration
		 *
		 * @method _processDecoratorConfiguration
		 * @param {object} configuration
		 * @return {object[]} Configurations
		 * @private
		 */
		_processDecoratorConfiguration: function (configuration) {

			var list,
				result = [];

			if (configuration.server) {

				list = this._processDecoratorServers(configuration.server);

				_.each(list, function (entry) {

					var currentEntry = utils.deepExtend({}, [configuration]);
					currentEntry.server = entry;

					result.push(currentEntry);

				}, this);

			} else {
				result = [configuration];
			}

			return result;
		},

		/**
		 * Processes decorator servers
		 *
		 * @method _processDecoratorServers
		 * @param {object|object[]} servers
		 * @return {object[]} Servers
		 * @private
		 */
		_processDecoratorServers: function (servers) {
			var result;

			if (_.isArray(servers)) {
				result = servers;
			} else {
				result = [servers];
			}

			return result;
		}
	});

module.exports = WebDriverMultiTaskDecorator;
