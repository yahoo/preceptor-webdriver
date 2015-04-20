var WebDriverMultiTaskDecorator = require('../lib/plugins/taskDecorator/multi');

var sinon = require('sinon');
var expect = require('chai').expect;

beforeEach(function () {
	this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
	this.sandbox.restore();
});

describe('Preceptor-WebDriver', function () {

	describe('Plugins', function () {

		describe('Task-Decorator', function () {

			describe('Multi-Decorator', function () {

				beforeEach(function () {
					this.instance = new WebDriverMultiTaskDecorator();
				});

				describe('run', function () {

					beforeEach(function () {
						this.stub = this.sandbox.stub(this.instance, "_processTaskOptions", function (options) {
							return options;
						});
					});

					it('should return object given', function () {
						var options = {},
							result;

						result = this.instance.run(options, 3);

						expect(result).to.be.equal(options);
					});

					it('should call _processTaskOptions', function () {
						var options = {},
							result;

						result = this.instance.run(options, 3);

						expect(this.stub.calledOnce).to.be.true;
					});
				});

				describe('_processTaskOptions', function () {

					describe('single', function () {

						beforeEach(function () {
							this.stub = this.sandbox.stub(this.instance, "_processDecoratorConfigurations", function (options) {
								return [options];
							});
						});

						it('should not process tasks without decorator', function () {

							var options,
								result;

							options = {
								"type": "mocha"
							};
							result = this.instance._processTaskOptions(options);

							expect(result).to.be.deep.equal([options]);
							expect(this.stub.called).to.be.false;
						});

						it('should not process tasks with faulty decorator', function () {

							var options,
								result;

							options = {
								"type": "mocha",
								"decorators": {
									"type": "webDriver"
								}
							};
							result = this.instance._processTaskOptions(options);

							expect(result).to.be.deep.equal([options]);
							expect(this.stub.called).to.be.false;
						});

						it('should not process tasks without WebDriver decorator', function () {

							var options,
								result;

							options = {
								"type": "mocha",
								"decorators": [{
									"type": "unknown"
								},{
									"type": "anotherUnknown"
								}]
							};
							result = this.instance._processTaskOptions(options);

							expect(result).to.be.deep.equal([options]);
							expect(this.stub.called).to.be.false;
						});

						it('should not process tasks with WebDriver decorator but without configuration', function () {

							var options,
								result;

							options = {
								"type": "mocha",
								"decorators": [{
									"type": "webDriver"
								}]
							};
							result = this.instance._processTaskOptions(options);

							expect(result).to.be.deep.equal([options]);
							expect(this.stub.called).to.be.false;
						});

						it('should process single tasks', function () {

							var options,
								result;

							options = {
								"type": "mocha",
								"decorators": [{
									"type": "webDriver",
									"configuration": {
										"data": 1
									}
								}]
							};
							result = this.instance._processTaskOptions(options);

							expect(result[0]).to.be.deep.equal(options);
							expect(this.stub.calledOnce).to.be.true;
						});

						it('should process single tasks and create copy of source', function () {

							var options,
								result;

							options = {
								"type": "mocha",
								"decorators": [{
									"type": "webDriver",
									"configuration": {
										"data": 1
									}
								}],
								"data": 21
							};
							result = this.instance._processTaskOptions(options);
							options.data = 23;

							expect(result[0].data).to.be.deep.equal(21);
							expect(this.stub.calledOnce).to.be.true;
						});
					});

					describe('multi', function () {

						beforeEach(function () {
							this.stub = this.sandbox.stub(this.instance, "_processDecoratorConfigurations", function (options) {
								return options;
							});
						});

						it('should process tasks with multiple configurations', function () {

							var options,
								result;

							options = {
								"type": "mocha",
								"decorators": [{
									"type": "webDriver",
									"configuration": [
										{
											"data": 1
										},
										{
											"data": 2
										}
									]
								}],
								"data": 22
							};
							result = this.instance._processTaskOptions(options);
							options.data = 24;

							expect(result.length).to.be.deep.equal(2);

							expect(result[0].data).to.be.deep.equal(22);
							expect(result[0].decorators[0].configuration.data).to.be.equal(1);

							expect(result[1].data).to.be.deep.equal(22);
							expect(result[1].decorators[0].configuration.data).to.be.equal(2);

							expect(this.stub.calledOnce).to.be.true;
						});
					});
				});

				describe('_processDecoratorConfigurations', function () {

					beforeEach(function () {
						this.stub = this.sandbox.stub(this.instance, "_processDecoratorConfiguration", function (options) {
							return [options, options];
						});
					});

					it('should process single configuration with multiple results', function () {
						var result,
							options;

						options = {
							"client": {
								"type": "taxi"
							},
							"coverage": {
								"mapping": {}
							}
						};

						result = this.instance._processDecoratorConfigurations(options);

						expect(result.length).to.be.equal(2);
						expect(result[0]).to.be.deep.equal(options);
						expect(result[1]).to.be.deep.equal(options);
						expect(this.stub.calledOnce).to.be.true;
					});

					it('should process multiple configurations with multiple results', function () {
						var result,
							options;

						options = [{
							"client": {
								"type": "taxi"
							},
							"coverage": {
								"mapping": {}
							}
						},{
							"client": {
								"type": "wd"
							},
							"coverage": {
								"mapping": {}
							}
						}];

						result = this.instance._processDecoratorConfigurations(options);

						expect(result.length).to.be.equal(4);
						expect(result[0]).to.be.deep.equal(options[0]);
						expect(result[1]).to.be.deep.equal(options[0]);
						expect(result[2]).to.be.deep.equal(options[1]);
						expect(result[3]).to.be.deep.equal(options[1]);
						expect(this.stub.calledTwice).to.be.true;
					});
				});

				describe('_processDecoratorConfiguration', function () {

					describe('single', function () {

						beforeEach(function () {
							this.stub = this.sandbox.stub(this.instance, "_processDecoratorServers", function (options) {
								return [options];
							});
						});

						it('should ignore configuration without server', function () {
							var result,
								options;

							options = {
								"client": {
									"type": "taxi"
								},
								"coverage": {
									"mapping": {}
								}
							};

							result = this.instance._processDecoratorConfiguration(options);

							expect(result).to.be.deep.equal([options]);
							expect(this.stub.called).to.be.false;
						});

						it('should process single server', function () {
							var result,
								options;

							options = {
								"client": {
									"type": "taxi"
								},
								"server": {
									"type": "selenium"
								},
								"coverage": {
									"mapping": {}
								}
							};

							result = this.instance._processDecoratorConfiguration(options);

							expect(this.stub.calledOnce).to.be.true;
							expect(result).to.be.deep.equal([options]);
						});
					});

					describe('multi', function () {

						beforeEach(function () {
							this.stub = this.sandbox.stub(this.instance, "_processDecoratorServers", function (options) {
								return options;
							});
						});

						it('should process multiple servers', function () {
							var result,
								options;

							options = {
								"client": {
									"type": "taxi"
								},
								"server": [
									{
										"type": "selenium"
									},
									{
										"type": "phantomjs"
									}
								],
								"coverage": {
									"mapping": {}
								}
							};

							result = this.instance._processDecoratorConfiguration(options);

							expect(result.length).to.be.equal(2);
							expect(this.stub.calledOnce).to.be.true;

							expect(result[0]).to.be.deep.equal({
								"client": {
									"type": "taxi"
								},
								"server": {
									"type": "selenium"
								},
								"coverage": {
									"mapping": {}
								}
							});

							expect(result[1]).to.be.deep.equal({
								"client": {
									"type": "taxi"
								},
								"server": {
									"type": "phantomjs"
								},
								"coverage": {
									"mapping": {}
								}
							});
						});
					});
				});

				describe('_processDecoratorServers', function () {

					it('should return single server as array', function () {

						var result,
							options;

						options = {
							"type": "selenium"
						};
						result = this.instance._processDecoratorServers(options);

						expect(result).to.be.deep.equal([options]);
					});

					it('should return multiple server as array', function () {

						var result,
							options;

						options = [
							{
								"type": "selenium"
							},
							{
								"type": "phantomjs"
							}
						];
						result = this.instance._processDecoratorServers(options);

						expect(result).to.be.deep.equal(options);
					});
				});
			});
		});
	});
});

