/*global describe, beforeEach, it*/
'use strict';
var assert = require('assert');

describe('bw_labs generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../app');
    assert(app !== undefined);
  });
});


describe('bw_labs:model generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../model');
    assert(app !== undefined);
  });
});


describe('bw_labs:service generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../service');
    assert(app !== undefined);
  });
});

describe('bw_labs:controller generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../controller');
    assert(app !== undefined);
  });
});

describe('bw_labs:migration generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../migration');
    assert(app !== undefined);
  });
});


describe('bw_labs:enableViews generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../enableViews');
    assert(app !== undefined);
  });
});

describe('bw_labs:enableDb generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../enableDb');
    assert(app !== undefined);
  });
});
