/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs');
var generator = require('yeoman-generator');
var yaml = require('js-yaml');
var helpers = generator.test;
var assert = generator.assert;

var run = function (name, done) {
  helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
    if (err) {
      return done(err);
    }
    var app = helpers.createGenerator('bw_labs:app', [
      '../../app'
    ]);
    app.options['skip-install'] = true;
    var opts = {
      'enable-db': true,
      'db-driver': 'mysql',
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    };
    for(var k in opts){
      app.options[k] = opts[k];
    }
    app.run({}, function(err){
      if(err) return done(err);
      var g = helpers.createGenerator('bw_labs:migration', [
        '../../migration'
      ], [name]);
      g.options['skip-install'] = true;
      g.run({}, done);
    });
  });
};


describe('bw_labs:migration generator', function () {
  it('creates valid migration file', function (done) {
    run('test', function(){
      var files = fs.readdirSync('migrations');
      assert(files.length > 0);
      assert(/\d+_test.js$/.test(files[0]));
      done();
    });
  });
});
