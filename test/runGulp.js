/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs');
var generator = require('yeoman-generator');
var yaml = require('js-yaml');
var helpers = generator.test;
var assert = generator.assert;

var run = function (done) {
  var self = this;
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
      'enable-gulp': true,
      'simple-gulp': true
    };
    for(var k in opts){
      app.options[k] = opts[k];
    }
    app.run({}, function(err){
      if(err) return done(err);
      var g = helpers.createGenerator('bw_labs:runGulp', [
        '../../runGulp'
      ]);
      g.options['skip-install'] = true;
      g.options['skip-run'] = true;
      g.run({}, function(err){
        if(err) return done(err);
        self.commandLine = g.commandLine;
        done();
      });
    });
  });
};

var loadJSON = function(file){
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};


describe('bw_labs:runGulp generator', function () {
  it('run gulp with right arguments', function (done) {
    run.call(this, function(err){
      if(err) return done(err);
      assert(this.commandLine == 'node --harmony /home/user/projects/generator-bw_labs/test/temp/node_modules/.bin/gulp');
      var p = loadJSON(path.join(process.cwd(), 'package.json'));
      assert(typeof p.devDependencies['gulp'] == 'string');
      done();
    }.bind(this));
  });
});
