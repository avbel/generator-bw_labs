/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs');
var generator = require('yeoman-generator');
var yaml = require('js-yaml');
var helpers = generator.test;
var assert = generator.assert;

var run = function (done) {
  helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
    if (err) {
      return done(err);
    }
    var app = helpers.createGenerator('bw_labs:app', [
      '../../app'
    ]);
    app.options['skip-install'] = true;
    var opts = {
      'enable-db': false,
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    };
    for(var k in opts){
      app.options[k] = opts[k];
    }
    app.run({}, function(err){
      if(err) return done(err);
      var g = helpers.createGenerator('bw_labs:enableViews', [
        '../../enableViews'
      ]);
      g.options['skip-install'] = true;
      g.run({}, done);
    });
  });
};

var loadJSON = function(file){
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};


describe('bw_labs:enableViews generator', function () {
  it('fills package.json and app.yml with valid data', function (done) {
    run(function(){
      var p = loadJSON(path.join(process.cwd(), 'package.json'));
      assert(typeof p.dependencies['co-render'] == 'string');
      var cfg = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config', 'app.yml'), 'utf8'));
      assert(cfg.views.enabled);
      done();
    });
  });
});
