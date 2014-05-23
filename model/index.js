'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var ModelGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    this.mkdir('app/models');
    this.copy('model.js', 'app/models/' + this._.camelize(this._.underscored(this.name)) + '.js');
  }
});

module.exports = ModelGenerator;