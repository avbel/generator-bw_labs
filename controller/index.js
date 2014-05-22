'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var ServiceGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    this.mkdir('app/controllers');
    this.copy('controller.js', 'app/controllers/' + this._.camelize(this._.slugify(this.name)) + '.js');
  }
});

module.exports = ServiceGenerator;