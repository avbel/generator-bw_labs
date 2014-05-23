'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var ServiceGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    this.mkdir('app/services');
    this.copy('service.js', 'app/services/' + this._.camelize(this._.underscored(this.name)) + '.js');
  }
});

module.exports = ServiceGenerator;