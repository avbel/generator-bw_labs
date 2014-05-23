'use strict';
var config = require('../lib/config');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var drivers = [ 'mongodb', 'mysql', 'postgres', 'sqlite'];
var EnableDbGenerator = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);
    this.on('error', function(err){
      console.log(chalk.bold.red(err));
      process.exit(1);
    });
  },
  enableView: function () {
    var done = this.async();
    try{
      var cfg = config.loadAppConfigFile.call(this);
      var dbDriver, idx;
      var getDbDriver = function(callback){
        if(cfg.connectionString){
          idx = cfg.connectionString.indexOf('://');
          if(idx >= 0){
            dbDriver = cfg.connectionString.substr(0, idx);
            if(dbDriver == 'pg') dbDriver = 'postgres';
            if(dbDriver == 'sqlite3') dbDriver = 'sqlite';
          }
        }
        if(!dbDriver){
          this.prompt([{
            type: 'list',
            name: 'db-driver',
            choices: drivers,
            message: 'Which database would you like to use?',
            default: 'mongodb'
          }], function (props) {
            dbDriver = props['db-driver'];
            callback();
          });
        }
        else{
          callback();
        }
      };
      getDbDriver.call(this, function(){
        if(drivers.indexOf(dbDriver) < 0) return done('Invalid db driver ' + dbDriver);
        var modules = ['parse-database-url'];
        if(dbDriver == 'mongodb') {
          modules.push('mongoose');
          modules.push('mongoose-q');
        }
        else{
          modules.push('knex');
          modules.push('bookshelf');
          if(dbDriver == "postgres") dbDriver = 'pg';
          else if(dbDriver == "sqlite") dbDriver = 'sqlite3';
          modules.push(dbDriver);
        }
        if(!cfg.connectionString){
          cfg.connectionString = dbDriver + "://localhost/" + this._.underscored(this.appname);
          cfg.testConnectionString = cfg.connectionString + "_test";
        }
        config.saveAppConfigFile.call(this, cfg);
        var p = config.loadJSON.call(this, "package.json");
        modules.forEach(function(m){
          if(!p.dependencies[m]) p.dependencies[m] ='*';
        });
        config.saveJSON.call(this, "package.json", p);
        console.log(chalk.green('Database support is enabled'));
        if(this.options['skip-install']){
          done()
        }
        else{
          this.installDependencies(done);
        }
      }.bind(this));

    }
    catch(err){
      done(err);
    }
  }
});

module.exports = EnableDbGenerator;