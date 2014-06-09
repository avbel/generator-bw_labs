'use strict';
var config = require('../lib/config');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');


var EnableViewsGenerator = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);
    this.on('error', function(err){
      console.log(chalk.bold.red(err));
      process.exit(1);
    });
  },
  enableViews: function () {
    var promtBootstrapIfNeed = function(callback){
      if(!this.options['enable-layout']){
        this.options['use-bootstrap'] = false;
        callback();
        return;
      }
      if(this.options['use-bootstrap'] == null){
        this.prompt([{
          type: 'confirm',
          name: 'use-bootstrap',
          message: 'Would you like to use Twitter Bootstrap?',
          default: true
        }], function (props) {
          this.options['use-bootstrap'] = props['use-bootstrap'];
          callback();
        }.bind(this));
      }
      else{
        callback();
      }
    };
    var promtLayoutSupportIfNeed = function(callback){
      if(this.options['use-bootstrap'] == null){
        this.prompt([{
          type: 'confirm',
          name: 'enable-layout',
          message: 'Would you like to enable layouts support?',
          default: true
        }], function (props) {
          this.options['enable-layout'] = props['enable-layout'];
          callback();
        }.bind(this));
      }
      else{
        callback();
      }
    };
    var done = this.async();
    promtLayoutSupportIfNeed.call(this, function(){
      promtBootstrapIfNeed.call(this, function(){
        try{
          var cfg = config.loadAppConfigFile.call(this);
          cfg.views = cfg.views || {};
          cfg.views.enabled = true;
          config.saveAppConfigFile.call(this, cfg);
          var p = config.loadJSON.call(this, "package.json");
          if(!p.dependencies['co-render']) p.dependencies['co-render'] ='*';
          if(!p.dependencies['then-jade']) p.dependencies['then-jade'] ='*';
          config.saveJSON.call(this, "package.json", p);
          this.mkdir('app/views');
          this.mkdir('assets');
          this.mkdir('assets/images');
          this.copy('favicon.ico', 'assets/images/favicon.ico');
          this.mkdir('public');
          this.copy('favicon.ico', 'public/favicon.ico');
          var createIndexIfNeed = function(callback){
            if(!fs.existsSync('app/controllers/__root.js')){
              this.invoke("bw_labs:controller", {args: ['__root'], options: {nested: true, 'skip-install': true,
                'enable-layout': this.options['enable-layout'], 'use-bootstrap': this.options['use-bootstrap']}}, callback);
            }
            else{
              callback();
            }
          };
          createIndexIfNeed.call(this, function(){
            if(!this.options.nested){
             console.log(chalk.green('Views support is enabled'));
            }
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
      }.bind(this));
    }.bind(this));

  }
});

module.exports = EnableViewsGenerator;