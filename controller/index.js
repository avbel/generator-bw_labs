'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var ControllerGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    this.mkdir('app/controllers');
    this.copy('controller.js', 'app/controllers/' + this._.camelize(this._.underscored(this.name)) + '.js');
  }
});

module.exports = ControllerGenerator;