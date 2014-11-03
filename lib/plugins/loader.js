var path = require('path');

/**
 * Method to load all plugins
 *
 * @method _pluginLoader
 * @param {PreceptorManager} manager
 * @private
 */
var _pluginLoader = function (manager) {
	var webDriverPath = path.resolve(path.join(__dirname, 'clientDecorator/webDriver'));
	manager.registerClientDecorator('webDriver', webDriverPath);
};

module.exports = _pluginLoader;
