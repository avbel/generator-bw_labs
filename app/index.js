'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var drivers = [ 'mongodb', 'mysql', 'postgres', 'sqlite'];
var BwLabsGenerator = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);
    this.option('enable-db', {desc: 'Enable database support', defaults: null});
    this.option('enable-views', {desc: 'Enable views support', defaults: null});
    this.option('enable-gulp', {desc: 'Enable gulp support', defaults: null});
    this.option('simple-gulp', {desc: 'Create simple gulpfile.js', defaults: null});
    this.option('enable-bower', {desc: 'Enable bower support', defaults: null});
    this.option('db-driver', {desc: 'Database driver (mongodb, mysql, postgres, sqlite)', type: String, defaults: null});
    this.pkg = require('../package.json');
    this.on("error", function(err){
      console.log(chalk.bold.red(err));
      process.exit(1);
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
        default: false
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
    var done = this.async();
    if(this.options['enable-db'] && drivers.indexOf(this.options['db-driver']) < 0) return done('Invalid db driver ' + this.options['db-driver']);
    this.options.modules = ['bw_labs'];
    this.options.devModules = ['co-mocha', 'mocha', 'should', 'co-supertest', 'supertest', 'sinon'];
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
    if(this.options['enable-gulp'] && this.options['simple-gulp']){
      this.options.devModules.push('gulp');
      this.copy('gulpfile.js', 'gulpfile.js');
    }

    this.mkdir('config');
    this.template('_app.yml', 'config/app.yml');
    this.template('_package.json', 'package.json');
    if(this.options['enable-bower']){
      this.template('_bower.json'  , 'bower.json');
    }
    this.mkdir('test');
    this.copy('mocha.opts', 'test/mocha.opts');
    done();
  },

  projectfiles: function () {
    this.copy('jshintrc', '.jshintrc');
    this.copy('_gitignore', '.gitignore');
  },

  install: function () {
    if (this.options['skip-install']) {
      return;
    }
    var done = this.async();
    var dest = this.destinationRoot();
    var createGulpFileIfNeed = function(callback){
      if(this.options['enable-gulp'] && !this.options['simple-gulp']){
        this.invoke("bw_labs:gulpFile", {options: {nested: true, 'skip-install': true, force: true }}, callback);
      }
      else{
        callback();
      }
    };
    var enableViewsIfNeed = function(callback){
      if(this.options['enable-views']){
        this.invoke("bw_labs:enableViews", {options: {nested: true, 'skip-install': true, force: true }}, callback);
      }
      else{
        callback();
      }
    };

    createGulpFileIfNeed.call(this, function(err){
      if(err) return done(err);
      enableViewsIfNeed.call(this, function(err){
        if(err) return done(err);
        this.installDependencies({callback: function(err){
          if(err) return done(err);
          if(!fs.existsSync(path.join(dest, 'config/app.yml.sample'))){
            this.copy(path.join(dest, 'node_modules/bw_labs/config/app.yml.sample'), 'config/app.yml.sample');
          }
          done();
        }.bind(this)});
      }.bind(this));
    }.bind(this));
  }
});


function getDbModule(name){
  if(name == 'postgres') return 'pg';
  if(name == 'sqlite') return 'sqlite3';
  return name;
}

module.exports = BwLabsGenerator;
