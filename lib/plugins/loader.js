var path = require('path');
var utils = require('preceptor-core').utils;

/**
 * Method to load all plugins
 *
 * @method _pluginLoader
 * @param {PreceptorManager} manager
 * @private
 */
var _pluginLoader = function (manager) {

	var pluginPath,
		code;

	pluginPath = path.resolve(path.join(__dirname, 'clientDecorator/webDriver'));
	manager.registerClientDecorator('webDriver', pluginPath);

	pluginPath = path.resolve(path.join(__dirname, 'taskDecorator/multi'));
	code = utils.require(pluginPath);
	manager.registerTaskDecorator('webDriverMulti', code);
};

module.exports = _pluginLoader;
