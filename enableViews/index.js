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
  enableViews: function () {
    var done = this.async();
    try{
      var cfg = config.loadAppConfigFile.call(this);
      cfg.views = cfg.views || {};
      cfg.views.enabled = true;
      config.saveAppConfigFile.call(this, cfg);
      var p = config.loadJSON.call(this, "package.json");
      if(!p.dependencies['co-render']) p.dependencies['co-render'] ='*';
      if(!p.dependencies['then-jade']) p.dependencies['then-jade'] ='*';
      config.saveJSON.call(this, "package.json", p);
      console.log(chalk.green('Views support is enabled'));
      if(this.options['skip-install']){
        done()
      }
      else{
        this.installDependencies(done);
      }
    }
    catch(err){
      done(err);
    }
  }
});

module.exports = EnableViewsGenerator;