'use strict';
var config = require('../lib/config');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var charlen = chars.length;


function uid (length){
  if(!length) length = 32;
  var index, i, buf = crypto.randomBytes(length);
  var result = [];
  for(i = 0; i < length; i ++){
    index = (buf.readUInt8(i) % charlen);
    result.push(chars[index]);
  }
  return result.join('');
}


var EnableAuthGenerator = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);
    this.on('error', function(err){
      console.log(chalk.bold.red(err));
      process.exit(1);
    });
  },
  enableAuth: function () {
    var done = this.async();
    try{
      if(!fs.existsSync(path.join(this.dest._base, 'config', 'keys.yml'))){
        var keys = {
          cookie: [uid(), uid(), uid(), uid(), uid()],
          pepper: uid()
        };
        config.saveAppConfigFile.call(this, 'keys.yml', keys);
      }
      this.invoke("bw_labs:enableViews", {options: {nested: true, 'skip-install': true }});

      var p = config.loadJSON.call(this, 'package.json');
      if(!p.dependencies['bw_labs.auth']) p.dependencies['bw_labs.auth'] ='*';
      if(!p.dependencies['bw_labs.email']) p.dependencies['bw_labs.email'] ='*';
      if(!p.dependencies['bw_labs.cache']) p.dependencies['bw_labs.cache'] ='*';
      config.saveJSON.call(this, 'package.json', p);
      console.log(chalk.green('Authentification support is enabled'));
      if(this.options['skip-install']){
        done()
      }
      else{
        this.installDependencies(done);
      }
    }
    catch(err){
      done(err);
    }
  }
});

module.exports = EnableAuthGenerator;