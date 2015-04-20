Preceptor-WebDriver (Plugin)
============================

Preceptor client-decorator plugin to inject WebDriver (Selenium) code into testing clients, simpifying the test setup and tear-down for Selenium tests by configuring it in one centralized configuration file. 

[![Build Status](https://secure.travis-ci.org/yahoo/preceptor-webdriver.png)](http://travis-ci.org/yahoo/preceptor-webdriver)
[![npm version](https://badge.fury.io/js/preceptor-webdriver.svg)](http://badge.fury.io/js/preceptor-webdriver)

[![NPM](https://nodei.co/npm/preceptor-webdriver.png?downloads=true)](https://nodei.co/npm/preceptor-webdriver/)


[API-Documentation](http://yahoo.github.io/preceptor-webdriver/docs/)

[Coverage Report](http://yahoo.github.io/preceptor-webdriver/coverage/lcov-report/)


**Table of Contents**
* [Installation](#installation)
* [Usage](#usage)
* [Client-API](#client-api)
* [Services](#services)
    * [WebDriver - Client-Decorator](#webdriver---client-decorator)
        * [Configuration](#configuration)
        * [WebDriver Clients](#webdriver-clients)
            * [Configuration](#configuration-1)
            * [Taxi](#taxi)
            * [Cabbie](#cabbie)
            * [External](#external)
        * [WebDriver Servers](#webdriver-servers)
            * [Configuration](#configuration-3)
            * [BrowserStack](#browserstack)
            * [ChromeDriver](#chromedriver)
            * [External](#external-1)
            * [GhostDriver](#ghostdriver)
            * [SauceLabs](#saucelabs)
            * [Selenium Stand-Alone](#selenium)
        * [Coverage](#coverage)
* [Plugins](#plugins)
    * [Client-Plugin](#client-plugin)
    * [Server-Plugin](#server-plugin)
    * [Example](#example-3)
* [API-Documentation](#api-documentation)
* [Tests](#tests)
* [Third-party libraries](#third-party-libraries)
* [License](#license)


##Installation

Install this module with the following command:
```shell
npm install preceptor-webdriver
```

Add the module to your ```package.json``` dependencies:
```shell
npm install --save preceptor-webdriver
```
Add the module to your ```package.json``` dev-dependencies:
```shell
npm install --save-dev preceptor-webdriver
```

##Usage

In your Preceptor configuration, add this plugin package-name to the ```plugins``` list in the global configurations section. Preceptor will automatically load and initialize the plugin, and this plugin will be from then on available to all tasks.

```javascript
{
	// ...
	plugins: ['preceptor-webdriver']
	// ...
}
```

Afterwards, the Web-Driver client-decorator plugin can be configured:
```javascript
{ // Preceptor task configuration
	"type": "mocha",
  
	// ...
  
	"decorator": [
		{
			"type": "webDriver", // Id of this module when registered in Preceptor
      
			"configuration": {
				"isolation": true, // Runs in isolation mode
  	  	
				"client": { // Client configuration
					"type": "taxi",
					"configuration": {
						"mode": "sync"
					},
					"capabilities": {
						"browserName": "firefox"
					}
				},
  	  	
				"server": { // Server configuration
					"type": "selenium"
				}
			}
		}
	],
  
	// ...
}
```

##Client-API

Preceptor-WebDriver injects an object (```PRECEPTOR_WEBDRIVER```) into the gloabl scope that holds WebDriver instance information.

* ```PRECEPTOR_WEBDRIVER.driver``` - WebDriver client instance (i.e. Taxi/Cabbie driver instance)
* ```PRECEPTOR_WEBDRIVER.browserName``` - Name of the current browser. This is retrieved from the Selenium capabilities object when connecting to the Selenium server.
* ```PRECEPTOR_WEBDRIVER.browserVersion``` - Version of the current browser. This is retrieved from the Selenium capabilities object when connecting to the Selenium server.
* ```PRECEPTOR_WEBDRIVER.browser``` - Browser identifier that combines multiple infos about the browser, including name and version.
* ```PRECEPTOR_WEBDRIVER.clientName``` - Name of the WebDriver client. (i.e. Taxi)
* ```PRECEPTOR_WEBDRIVER.serverName``` - Name of the WebDriver server. (i.e. SauceLabs)
* ```PRECEPTOR_WEBDRIVER.collectCoverage``` - Function that should be triggered when Preceptor should collect coverage reports. Call this before you move from one page to another to avoid loosing coverage data. Integrate this into the navigation APIs of the client to gather the data before a page is refreshed.

###Examples

To get the driver, simply use the driver given in the global obejct:

```javascript
var driver = PRECEPTOR_WEBDRIVER.driver;

var browser = driver.browser();
var activeWindow = browser.activeWindow();
var submitButton = activeWindow.getElement('#submit_button')

submitButton.mouse().click();
```

Usually, you can easily integrate the coverage collection into the clients:

```javascript
var driver = PRECEPTOR_WEBDRIVER.driver;

var browser = driver.browser();
var activeWindow = browser.activeWindow();
var navigator = activeWindow.navigator();

var previousNavigateTo = navigator.navigateTo;
navigator.navigateTo = function () {
	PRECEPTOR_WEBDRIVER.collectCoverage();
	return previousNavigateTo.apply(this, arguments);
};

```

##Services

This plugin provides the following services for Preceptor:
* ```webDriver``` (ClientDecorator) - Adds a  client-decorator to Preceptor that can inject WebDriver code into Preceptor clients

###WebDriver - Client-Decorator
The WebDriver client-decorator is loaded for each Preceptor task and executes code at different stages of a tests testing lifecycle. See the Preceptor project page for more information about the testing lifecycle.
This module has its own plugin management, providing different clients and servers for the Selenium testing infrastructure. 

####Configuration
The Web-Driver client-decorator has the following configuration options:
* ```isolation``` {boolean} - If set, the Web-Driver client and server will run in Isolation-mode, meaning that every test will run in its own browser instance instead of sharing the browser session with multiple test (default: false). When isolation mode is turned on, the test will take significantly longer, but they will be more independent from each other.
* ```coverage``` {object} - Coverage configuration. See below for more information.
* ```client``` {object} - Client configuration object. See below for more information on how to configure the client.
* ```server``` {object} - Server configuration object. See below for more information on how to configure the server.

#####Example

You need the ```taxi``` page to be installed for running this example.

```javascript
"configuration": {
	"isolation": true,
	"server": {
		"type": "selenium",
		"configuration": {
			"port": "4444"
		},
		"timeOut": 10000
	},
	"client": {
		"type": "taxi",
		"configuration": {
			"mode": "sync",
			"debug": true
		},
		"capabilities": {
			"browserName": "firefox",
      
			"acceptSslCerts": true,
			"cssSelectorsEnabled": true,
			"javascriptEnabled": true,
			"takesScreenshot": true,
			"handlesAlerts": true,
			"unexpectedAlertBehavior": 'accept'
		},
		"url": "http://127.0.0.1:4444/wd/hub"
	}
}
```

####WebDriver Clients
Following clients are included with this module:
* ```taxi``` - Modern web-driver client that supports synchronous and asynchronous Selenium testing
* ```cabbie``` - Simple web-driver client that supports synchronous and asynchronous Selenium testing
* ```external``` - A placeholder plugin that lets the testing-framework use its own web-driver client without interfering with other already existing and possibly loaded WebDriver clients.

Any additional Web-Driver clients can be added by importing them through the Preceptor plugin manager. See the Plugin section below for more information.

#####Configuration
Every Web-Driver client has configuration options that are the same across all Web-Driver clients. These options are:
* ```type``` {string} - Name of client-plugin (default: external)
* ```configuration``` {object} - Client specific configuration. All the additional configuration options supplied below should be defined in this object.
* ```capabilities``` {object} - Capabilities required by the client. These are the standard Selenium capabilities that the client requests from the server.
* ```url``` {string} - Url of the Selenium server. This may be automatically pre-filled by the selected server plugin.

######Example
```javascript
"client": {
	"type": "taxi",
	"configuration": {
		"mode": "sync",
		"debug": true
	},
	"capabilities": {
		"browserName": "firefox",
      
		"acceptSslCerts": true,
		"cssSelectorsEnabled": true,
		"javascriptEnabled": true,
		"takesScreenshot": true,
		"handlesAlerts": true,
		"unexpectedAlertBehavior": 'accept'
	},
	"url": "http://127.0.0.1:4444/wd/hub"
}
```

#####Taxi
Taxi is a modern Selenium client that supports synchronous and asynchronous testing. For more information, visit the project page at: https://github.com/preceptorjs/taxi

######Configuration
The web-driver client plugin exposes the following configuration options in the Preceptor client-decorator configuration:
* ```mode``` {string} - Type of execution mode. Following types are supported: 'sync', 'async'
* ```debug``` {boolean} - Turns the debug-mode on, printing out every low-level method executed. (default: false)
* ```httpDebug``` {boolean} Turns the HTTP debug-mode on, printing out every request and response to the WebDriver server. For this option to work, ```debug``` must also be turned on. (default: false)

#####Cabbie
Cabbie is a lightweight Selenium client that supports synchronous and asynchronous testing. For more information, visit the project page at: https://github.com/ForbesLindesay/cabbie

######Configuration
The web-driver client plugin exposes the following configuration options in the Preceptor client-decorator configuration:
* ```mode``` {string} - Type of execution mode. Following types are supported: 'sync', 'async'
* ```debug``` {boolean} - Turns the debug-mode on, printing out every low-level method executed. (default: false)
* ```httpDebug``` {boolean} Turns the HTTP debug-mode on, printing out every request and response to the WebDriver server. For this option to work, ```debug``` must also be turned on. (default: false)

#####External
This is a placeholder plugin for the Web-Driver client that will not do anything; it is just there to satisfy the client-decorators need to have a client select. This client should be used if the Preceptor testing client supplies its own Web-Driver client.

####WebDriver Servers
Following servers are included in this module:
* ```browserStack``` - Uses the Browser-Stack cloud services as a Selenium server
* ```chromeDriver``` - Starts the ChromeDriver locally to execute tests in the local Chrome browser
* ```external``` - A placeholder plugin that lets the testing-framework use its own Web-Driver server
* ```ghostDriver``` - Starts ghost-driver on top of PhantomJs to execute tests headlessly on PhantomJs, running it on the local machine
* ```sauceLabs``` - Uses the SauceLabs cloud services as a Selenium server
* ```selenium``` - Starts the Selenium stand-alone server locally to run any hub connected browsers

Any additional Web-Driver servers can be added by importing them through the Preceptor plugin manager. See the Plugin section below for more information.

#####Configuration
Every Web-Driver server has configuration options that are the same across all Web-Driver servers. These options are:
* ```type``` {string} - Name of server-plugin (default: external)
* ```configuration``` {object} - Server specific configuration. All the additional configuration options supplied below should be defined in this object.
* ```timeOut``` {int} - Timeout for the server to start up. (default: 15000 ms)

######Example
```javascript
"server": {
	"type": "selenium",
	"configuration": {
		"port": "4444"
	},
	"timeOut": 10000
}
```

#####BrowserStack
The ```browserStack``` server plugin will provision a Web-Driver server in the Browser-Stack cloud and will make it available to be used by the Preceptor client thorugh an url.

######Configuration
For this plugin to work, it needs to supply the following configuration options:
* ```user``` {string} - User to be used to access the cloud services
* ```accessKey``` {string} - Access-key for the user to access the cloud services

#####ChromeDriver
The ChromeDriver will be started locally, connecting Preceptor clients with the local instance of the Chrome browser. There is no need for a Selenium hub when using this plugin since the ChromeDriver will function as a hub on its own.
This server plugin does not add any configuration options. This server uses port '9515' for Selenium communication.

######Modules required
For this plugin to work, you need to add the following modules to your package.json:
* ```chromedriver``` - Module supplying the Chrome-Driver binary

#####External
This is a placeholder plugin for the web-driver server; it doesn't start or stop any server. However, it provides the client with a url to connect to. The plugin first checks if an environment variable with the name ```SELENIUM_HUB_URL``` is available and uses that, otherwise it will use ```http://127.0.0.1:4444/wd/hub``` as default since it is the default address for a locally running Selenium stand-alone server.
This server plugin does not add any configuration options.

#####GhostDriver
The GhostDriver plugin will start and stop PhantomJs with GhostDriver listening on a given port. It will also automatically set the ```browserName``` option in the client capabilities to ```phantomjs``` if none was given. The server-url will always be set to ```http://127.0.0.1:<port>/```.

######Configuration
* ```port``` {int} - Port on which GhostDriver should listen on (default: 9517)

######Modules required
For this plugin to work, you need to add the following modules to your package.json:
* ```phantomjs``` - Module supplying the PhantomJs binary

#####SauceLabs
The ```sauceLabs``` server plugin will provision a Web-Driver server in the SauceLabs cloud and will make it available to be used by the Preceptor client through an url.

######Configuration
For this plugin to work, it needs to supply the following configuration options:
* ```user``` {string} - User to be used to access the cloud services
* ```accessKey``` {string} - Access-key for the user to access the cloud services

#####Selenium
The ```selenium``` server plugin will start and stop the Selenium stand-alone server on the local machine.

######Configuration
* ```javaPath``` {string} - (optional) Path to the java binary to run the jar file. Should no ```javaPath``` be supplied, then the plugin will try to determine the path using the ```JAVA_HOME``` environment variable or will use ```/usr/bin/java``` as default path.
* ```port``` {int} - Port on which the Selenium stand-alone server should listen on (default: 9518)

######Modules required
For this plugin to work, you need to add the following modules to your package.json:
* ```selenium-server-standalone-jar``` - Module supplying the Selenium stand-alone jar file

####Coverage
The Web-Driver decorator supports coverage reporting, supplying the coverage data to Preceptor and merging the coverage reports from client and server.

#####Configuration
The following configuration options are available for code-coverage that is accessible through the decorator configuration as ```coverage```:
* ```active``` {boolean} - Actives the coverage collection and merging (default: false)
* ```coverageVar``` {string} - Coverage variable in the browser that should be used to collect the coverage-data (default: "__coverage__")
* ```mapping``` {object[]} - List of path-mapping for client/server mapping. The objects consist of the ```from``` and ```to```property, describing the from-to of mapping.
* ```excludes``` {string[]} - List of paths to exclude (default: ['**/node_modules/**', '**/test/**', '**/tests/**'])

##Plugins
It is possible to add your own client- or server-plugin to this WebDriver module by using the ```AbstractClient``` or ```AbstractServer``` objects which are made available by this module. Afterwards, the plugin needs to be added to the ```plugins``` list in the global configuration section of the Preceptor configuration file. See the Preceptor project for more information on how to register a Preceptor plugin.

The following API's are available for server and client plugins (see API documentation for more information):
###Client-Plugin
* ```WebDriverManager.AbstractClient``` - Abstract object, implementing common functionality for WebDriver clients.
* ```manager.getClientList()``` - Gets a dictionary of available client plugins
* ```manager.hasClient()``` - Checks existence of a client plugin
* ```manager.getClient()``` - Gets a specific client plugin by name
* ```manager.registerClient()``` - Registers a new client plugin

###Server-Plugin
* ```WebDriverManager.AbstractServer``` - Abstract object, implementing common functionality for WebDriver servers.
* ```manager.getServerList()``` - Gets a dictionary of available server plugins
* ```manager.hasServer()``` - Checks existence of a server plugin
* ```manager.getServer()``` - Gets a specific server plugin by name
* ```manager.registerServer()``` - Registers a new server plugin

###Example
```javascript
{
	// ...
	plugins: ['preceptor-webdriver', 'preceptor-webdriver-custom']
	// ...
}
```
Make sure that this module is listed before your plugin module so that the WebDriver plugin is already registered when your plugin should be registered.

##API-Documentation

Generate the documentation with following command:
```shell
npm run docs
```
The documentation will be generated in the ```docs``` folder of the module root.

##Tests

Run the tests with the following command:
```shell
npm run test
```
The code-coverage will be written to the ```coverage``` folder in the module root.

##Third-party libraries

The following third-party libraries are used by this module:

###Dependencies
* promise: https://github.com/then/promise
* preceptor: https://github.com/yahoo/preceptor
* preceptor-core: https://github.com/yahoo/preceptor-core
* underscore: http://underscorejs.org
* minimatch: https://github.com/isaacs/minimatch
* selenium-server-standalone-jar: https://github.com/adamhooper/selenium-server-standalone-jar

###Dev-Dependencies
* taxi: https://github.com/preceptorjs/taxi
* chai: http://chaijs.com
* istanbul: https://github.com/gotwarlost/istanbul
* mocha: https://github.com/visionmedia/mocha
* yuidocjs: https://github.com/yui/yuidoc
* sinon: http://sinonjs.org

###Optional-Dependecies:
* taxi: https://github.com/preceptorjs/taxi
* cabbie-alpha: https://github.com/ForbesLindesay/cabbie / https://github.com/marcelerz/cabbie
* chromedriver: https://github.com/giggio/node-chromedriver
* phantomjs: https://github.com/Obvious/phantomjs

##License

The MIT License

Copyright 2014 Yahoo Inc.
