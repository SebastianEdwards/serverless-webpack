'use strict';
/**
 * Unit tests for packagers/index
 */

const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
const Serverless = require('serverless');

chai.use(require('sinon-chai'));

const expect = chai.expect;

describe('packagers factory', () => {
  let sandbox;
  let serverless;
  let npmMock;
  let baseModule;
  let module;

  before(() => {
    sandbox = sinon.sandbox.create();
    npmMock = {
      hello: 'I am NPM'
    };
    mockery.enable({ useCleanCache: true });
    mockery.registerAllowables([ './index', 'lodash' ]);
    mockery.registerMock('./npm', npmMock);
    baseModule = require('./index');
    Object.freeze(baseModule);
  });

  after(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  beforeEach(() => {
    serverless = new Serverless();
    serverless.cli = {
      log: sandbox.stub(),
      consoleLog: sandbox.stub()
    };

    module = _.assign({
      serverless,
      options: {
        verbose: true
      },
    }, baseModule);
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should throw on unknown packagers', () => {
    expect(() => module.get.call({ serverless }, 'unknown')).to.throw(/Could not find packager/);
  });

  it('should return npm packager', () => {
    const npm = module.get.call(module, 'npm');
    expect(npm).to.deep.equal(npmMock);
  });
});
