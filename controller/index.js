'use strict';
var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var config = require('../lib/config');


var ControllerGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    var done = this.async();
    var cfg = config.loadAppConfigFile.call(this);
    this.viewsEnabled = (cfg.views && cfg.views.enabled !== false);
    this.mkdir('app/controllers');
    this.copy('controller.js', 'app/controllers/' + ((this.name == "__root")?this.name:this._.camelize(this._.underscored(this.name))) + '.js');
    if(this.viewsEnabled && this.name == "__root"){
      this.mkdir('app/views');
      this.template('_index.jade', 'app/views/index.jade');
      if(this.options['enable-layout']){
        if(this.options['use-vendor-js'] == null && this.options['use-vendor-css'] == null && fs.existsSync('gulpfile.js')){
          var text = fs.readFileSync('gulpfile.js', 'utf8');
          this.options['use-vendor-js'] = text.indexOf('vendor.js') >= 0;
          this.options['use-vendor-css'] = text.indexOf('vendor.css') >= 0;
        }
        this.template('_layout.jade', 'app/views/layout.jade');
        done();
      }
    }
  }
});

module.exports = ControllerGenerator;