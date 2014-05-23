'use strict';
var config = require('../lib/config');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var EnableViewsGenerator = yeoman.generators.Base.extend({
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
      cfg.views = cfg.views || {};
      cfg.views.enabled = true;
      config.saveAppConfigFile.call(this, cfg);
      this.npmInstall(['co-render', 'then-jade'], {save: true}, function(err){
        if(err) return done(err);
        console.log(chalk.green('Views support is enabled'));
        done();
      });
    }
    catch(err){
      done(err);
    }
  }
});

module.exports = EnableViewsGenerator;