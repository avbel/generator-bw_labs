'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

function format(n){
  var s = n.toString();
  if(s.length < 2){
    return "0" + s;
  }
  return s;
}

var MigrationGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    var d = new Date();
    this.mkdir('migrations');
    this.copy('migration.js', 'migrations/' + d.getFullYear() + format(d.getMonth()+1) +
      format(d.getDate()) + format(d.getHours()) + format(d.getMinutes())  + format(d.getSeconds()) + "_" + this._.camelize(this._.underscored(this.name)) + '.js');
  }
});

module.exports = MigrationGenerator;