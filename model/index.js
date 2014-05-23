'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var config = require('../lib/config');

var ModelGenerator = yeoman.generators.NamedBase.extend({
  files: function () {
    var cfg = config.loadAppConfigFile.call(this);
    if(!cfg.connectionString){
      return console.log(chalk.red("Models are not supported now. Please fill connection string and/or tune on database support."));
    }
    this.mkdir('app/models');
    this.copy('model.js', 'app/models/' + this._.camelize(this._.underscored(this.name)) + '.js');
  }
});

module.exports = ModelGenerator;