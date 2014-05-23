'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var config = require('../lib/config');

function format(n){
  var s = n.toString();
  if(s.length < 2){
    return "0" + s;
  }
  return s;
}

var MigrationGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    var cfg = config.loadAppConfigFile.call(this);
    if(!cfg.connectionString || cfg.connectionString.indexOf("mongodb://") == 0){
      return console.log(chalk.red("Migrations are not supported for current config"));
    }
    var d = new Date();
    this.mkdir('migrations');
    this.copy('migration.js', 'migrations/' + d.getFullYear() + format(d.getMonth()+1) +
      format(d.getDate()) + format(d.getHours()) + format(d.getMinutes())  + format(d.getSeconds()) + "_" + this._.camelize(this._.underscored(this.name)) + '.js');
  }
});

module.exports = MigrationGenerator;