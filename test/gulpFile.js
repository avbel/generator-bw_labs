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
      'enable-gulp': false,
      'simple-gulp': false
    };
    for(var k in opts){
      app.options[k] = opts[k];
    }
    app.run({}, function(err){
      if(err) return done(err);
      var g = helpers.createGenerator('bw_labs:gulpFile', [
        '../../gulpFile'
      ]);
      g.options['skip-install'] = true;
      helpers.mockPrompt(g, {
        features: ['concat', 'bower']
      });
      g.run({}, done);
    });
  });
};

var loadJSON = function(file){
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};


describe('bw_labs:gulpFile generator', function () {
  it('creates right gulpfile.js', function (done) {
    run(function(err){
      debugger;
      if(err) return done(err);
      var p = loadJSON(path.join(process.cwd(), 'package.json'));
      assert(typeof p.devDependencies['gulp'] == 'string');
      assert(typeof p.devDependencies['gulp-concat'] == 'string');
      assert(typeof p.devDependencies['gulp-bower'] == 'string');
      assert(p.devDependencies['supervisor'] == null);
      helpers.assertFile('gulpfile.js');
      var content = fs.readFileSync('gulpfile.js', 'utf8');
      assert(content.indexOf('bower') >= 0);
      assert(content.indexOf('concat') >= 0);
      done();
    });
  });
});
