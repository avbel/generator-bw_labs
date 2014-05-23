/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs');
var generator = require('yeoman-generator');
var yaml = require('js-yaml');
var helpers = generator.test;
var assert = generator.assert;

var run = function (options, prompts, done) {
  helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
    if (err) {
      return done(err);
    }
    var app = helpers.createGenerator('bw_labs:app', [
      '../../app'
    ]);
    helpers.mockPrompt(app, prompts);
    options['skip-install'] = true;
    for(var k in options){
      app.options[k] = options[k];
    }
    app.run({}, done);
  });
};

var runWithPromtsAndOptions = function (options, check, done) {
  run(options, {}, function(err){
    if(err) return done(err);
    check(function(err){
      if(err) return done(err);
      run({}, options, function(err){
        if(err) return done(err);
        check(done);
      });
    });
  });
};

var loadJSON = function(file){
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

describe('bw_labs generator', function () {
  it('creates expected files (db:false, views:false, bower:false, gulp:false)', function (done) {
    var expected = [
      'config/app.yml',
      'package.json',
      'index.js',
      'test/mocha.opts',
      'app',
      'app/controllers',
      'app/middlewares',
      'app/services'
    ];
    runWithPromtsAndOptions({
      'enable-db': false,
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    }, function(cb){
      helpers.assertFile(expected);
      assert.noFile(['bower.json',
      'gulpfile.js', 'app/views', 'assets', 'app/models', 'migrations']);
      cb();
    }, done);
  });

  it('creates expected files (db:true, views:false, bower:false, gulp:false)', function (done) {
    var expected = [
      'config/app.yml',
      'package.json',
      'index.js',
      'test/mocha.opts',
      'app',
      'app/controllers',
      'app/middlewares',
      'app/services',
      'app/models',
      'migrations'
    ];
    runWithPromtsAndOptions({
      'enable-db': true,
      'db-driver': 'mysql',
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    }, function(cb){
      helpers.assertFile(expected);
      assert.noFile(['bower.json',
      'gulpfile.js', 'app/views', 'assets']);
      cb();
    }, done);
  });

  it('creates expected files (db:false, views:true, bower:false, gulp:false)', function (done) {
    var expected = [
      'config/app.yml',
      'package.json',
      'index.js',
      'test/mocha.opts',
      'app',
      'app/controllers',
      'app/middlewares',
      'app/services',
      'app/views'
    ];
    runWithPromtsAndOptions({
      'enable-db': false,
      'enable-views': true,
      'enable-bower': false,
      'enable-gulp': false
    }, function(cb){
      helpers.assertFile(expected);
      assert.noFile(['bower.json',
      'gulpfile.js', 'app/models', 'migrations']);
      var cfg = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config', 'app.yml'), 'utf8'));
      assert(cfg.views.enabled == true);
      cb();
    }, done);
  });

  it('creates expected files (db:false, views:false, bower:true, gulp:false)', function (done) {
    var expected = [
      'config/app.yml',
      'package.json',
      'index.js',
      'test/mocha.opts',
      'app',
      'app/controllers',
      'app/middlewares',
      'app/services',
      'bower.json'
    ];
    runWithPromtsAndOptions({
      'enable-db': false,
      'enable-views': false,
      'enable-bower': true,
      'enable-gulp': false
    }, function(cb){
      helpers.assertFile(expected);
      assert.noFile(['gulpfile.js', 'app/views', 'assets', 'app/models', 'migrations']);
      cb();
    }, done);
  });

  it('creates expected files (db:false, views:false, bower:false, gulp:true)', function (done) {
    var expected = [
      'config/app.yml',
      'package.json',
      'index.js',
      'test/mocha.opts',
      'app',
      'app/controllers',
      'app/middlewares',
      'app/services',
      'gulpfile.js',
      'assets'
    ];
    runWithPromtsAndOptions({
      'enable-db': false,
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': true
    }, function(cb){
      helpers.assertFile(expected);
      assert.noFile(['bower.json', 'app/views', 'app/models', 'migrations']);
      cb();
    }, done);
  });

  it('creates expected files (all: true)', function (done) {
    var expected = [
      'config/app.yml',
      'package.json',
      'bower.json',
      'gulpfile.js',
      'index.js',
      'test/mocha.opts',
      'app',
      'app/controllers',
      'app/middlewares',
      'app/views',
      'app/models',
      'app/services',
      'migrations',
      'assets'
    ];
    runWithPromtsAndOptions({
      'enable-db': true,
      'db-driver': 'mysql',
      'enable-views': true,
      'enable-bower': true,
      'enable-gulp': true
    }, function(cb){
      helpers.assertFile(expected);
      cb();
    }, done);
  });

  it('fill package.json and app.yml with valid data (mysql)', function (done) {
    runWithPromtsAndOptions({
      'enable-db': true,
      'db-driver': 'mysql',
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    }, function(cb){
      var p = loadJSON(path.join(process.cwd(), 'package.json'));
      assert(typeof p.dependencies['bookshelf'] == 'string');
      assert(typeof p.dependencies['knex'] == 'string');
      assert(typeof p.dependencies['mysql'] == 'string');
      assert(typeof p.dependencies['parse-database-url'] == 'string');
      var cfg = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config', 'app.yml'), 'utf8'));
      assert((cfg.connectionString || '').indexOf('mysql://') >= 0);
      cb();
    }, done);
  });

  it('fill package.json and app.yml with valid data (postgres)', function (done) {
    runWithPromtsAndOptions({
      'enable-db': true,
      'db-driver': 'postgres',
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    }, function(cb){
      var p = loadJSON(path.join(process.cwd(), 'package.json'));
      assert(typeof p.dependencies['bookshelf'] == 'string');
      assert(typeof p.dependencies['knex'] == 'string');
      assert(typeof p.dependencies['pg'] == 'string');
      assert(typeof p.dependencies['parse-database-url'] == 'string');
      var cfg = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config', 'app.yml'), 'utf8'));
      assert((cfg.connectionString || '').indexOf('pg://') >= 0);
      cb();
    }, done);
  });

  it('fill package.json and app.yml with valid data (sqlite)', function (done) {
    runWithPromtsAndOptions({
      'enable-db': true,
      'db-driver': 'sqlite',
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    }, function(cb){
      var p = loadJSON(path.join(process.cwd(), 'package.json'));
      assert(typeof p.dependencies['bookshelf'] == 'string');
      assert(typeof p.dependencies['knex'] == 'string');
      assert(typeof p.dependencies['sqlite3'] == 'string');
      assert(typeof p.dependencies['parse-database-url'] == 'string');
      var cfg = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config', 'app.yml'), 'utf8'));
      assert((cfg.connectionString || '').indexOf('sqlite3://') >= 0);
      cb();
    }, done);
  });

  it('fill package.json and app.yml with valid data (mongodb)', function (done) {
    runWithPromtsAndOptions({
      'enable-db': true,
      'db-driver': 'mongodb',
      'enable-views': false,
      'enable-bower': false,
      'enable-gulp': false
    }, function(cb){
      var p = loadJSON(path.join(process.cwd(), 'package.json'));
      assert(typeof p.dependencies['mongoose'] == 'string');
      assert(typeof p.dependencies['mongoose-q'] == 'string');
      assert(typeof p.dependencies['parse-database-url'] == 'string');
      var cfg = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config', 'app.yml'), 'utf8'));
      assert((cfg.connectionString || '').indexOf('mongodb://') >= 0);
      cb();
    }, done);
  });
});
