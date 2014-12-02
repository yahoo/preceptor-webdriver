var path = require('path');

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
	code = require(pluginPath);
	manager.registerTaskDecorator('webDriverMulti', code);
};

module.exports = _pluginLoader;
