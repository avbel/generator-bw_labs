'use strict';
var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var config = require('../lib/config');


var ControllerGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    var cfg = config.loadAppConfigFile.call(this);
    this.viewsEnabled = (cfg.views && cfg.views.enabled !== false);
    this.mkdir('app/controllers');
    this.copy('controller.js', 'app/controllers/' + ((this.name == "__root")?this.name:this._.camelize(this._.underscored(this.name))) + '.js');
    if(this.viewsEnabled && this.name == "__root"){
      this.mkdir('app/views');
      this.copy('index.jade', 'app/views/index.jade');
    }
  }
});

module.exports = ControllerGenerator;