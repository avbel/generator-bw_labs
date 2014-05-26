'use strict';
var config = require('../lib/config');
var spawn = require('child_process').spawn;
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var RunGulpGenerator = yeoman.generators.Base.extend({
  runGulp: function (){
    var args = ((this.options.argv || {}).original || []).slice(1) || [];
    if(this.options['skip-run']){
      this.commandLine = ['node', '--harmony', path.join(this.dest._base, 'node_modules/.bin/gulp')].concat(args).join(' ');
    }
    else{
      spawn('node', ['--harmony', path.join(this.dest._base, 'node_modules/.bin/gulp')].concat(args), { stdio: 'inherit' });
    }
  }
});

module.exports = RunGulpGenerator;