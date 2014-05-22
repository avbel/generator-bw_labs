'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var drivers = [ 'mongodb', 'mysql', 'postgres', 'sqlite'];
debugger;
var BwLabsGenerator = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);
    this.option('enable-db', {desc: 'Enable database support'});
    this.option('enable-views', {desc: 'Enable views support'});
    this.option('enable-gulp', {desc: 'Enable gulp support'});
    this.option('enable-bower', {desc: 'Enable bower support'});
    this.option('db-driver', {desc: 'Database driver', type: String, defaults: 'mongodb'});
  },

  init: function () {
    this.pkg = require('../package.json');
    this.on('end', function () {
      if (!this.options['skip-install']) {
        var dest = this.dest._base;
        this.installDependencies({callback: function(){
          this.copy(path.join(dest, 'node_modules/bw_labs/config/app.yml.sample'), 'config/app.yml.sample');
        }});
      }
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(yosay('Welcome to the bw_labs web app generator!'));

    var prompts = [];
    var opts = this.options;

    if(opts['enable-db'] == null){
      prompts.push({
        type: 'confirm',
        name: 'enable-db',
        message: 'Would you like to enable database support?',
        default: true
      });
    }

    if(opts['enable-views'] == null){
      prompts.push({
        type: 'confirm',
        name: 'enable-views',
        message: 'Would you like to enable views support (to use this.render() inside request handlers)?',
        default: true
      });
    }

    if(opts['enable-gulp'] == null){
      prompts.push({
        type: 'confirm',
        name: 'enable-gulp',
        message: 'Would you like to enable gulp build system (http://gulpjs.com)?',
        default: false
      });
    }

    if(opts['enable-bower'] == null){
      prompts.push({
        type: 'confirm',
        name: 'enable-bower',
        message: 'Are you going to use bower?',
        default: true
      });
    }

    this.prompt(prompts, function (props) {
      util._extend(opts, props);
      if(opts['enable-db']){
        if(opts['db-driver'] == null){
          this.prompt([{
            type: 'list',
            name: 'db-driver',
            choices: drivers,
            message: 'Which database would you like to use?',
            default: 'mongodb'
          }], function (props) {
            util._extend(opts, props);
            done();
          });
        }
        else{
          done();
        }
      }
      else{
        done();
      }
    }.bind(this));
  },

  app: function () {
    if(drivers.indexOf(this.options['db-driver']) < 0) throw new Error('Invalid db driver ' + this.options['db-driver']);
    this.options.modules = ['bw_labs'];
    this.options.devModules = ['mocha', 'should', 'co-supertest', 'supertest', 'sinon'];
    this.copy('index.js', 'index.js');
    this.mkdir('app');
    this.mkdir('app/controllers');
    this.mkdir('app/middlewares');
    this.mkdir('app/services');
    if(this.options['enable-db']){
      this.options.modules.push('parse-database-url');
      this.mkdir('app/models');
      if(this.options['db-driver'] != 'mongodb'){
        var prefix = getDbModule(this.options['db-driver']);
        this.mkdir('migrations');
        this.options.modules = this.options.modules.concat(['knex', 'bookshelf', prefix]);
        this.options.dbProtocol = prefix;
      }
      else{
        this.options.modules = this.options.modules.concat(['mongoose', 'mongoose-q']);
        this.options.dbProtocol = 'mongodb';
      }
    }
    if(this.options['enable-views']){
      this.options.modules = this.options.modules.concat(['co-render', 'then-jade']);
      this.mkdir('app/views');
    }
    if(this.options['enable-gulp']){
      this.options.devModules.push('gulp');
      this.copy('gulpfile.js', 'gulpfile.js');
    }
    this.mkdir('config');
    this.template('_app.yml', 'config/app.yml');
    this.template('_package.json', 'package.json');
    if(this.options['enable-bower']){
      this.template('_bower.json'  , 'bower.json');
    }
  },

  projectfiles: function () {
    this.copy('jshintrc', '.jshintrc');
    this.copy('_gitignore', '.gitignore');
  }
});


function getDbModule(name){
  if(name == 'postgres') return 'pg';
  if(name == 'sqlite') return 'sqlite3';
  return name;
}

module.exports = BwLabsGenerator;
