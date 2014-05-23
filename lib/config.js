'use strict';
var path = require('path');
var yaml = require('js-yaml');

module.exports = {
  loadAppConfigFile:  function(name){
    return yaml.safeLoad(this.readFileAsString(path.join(this.dest._base, 'config', name || 'app.yml'))) || {};
  },
  saveAppConfigFile: function(name, config){
    if(typeof name != "string" && name){
      config = name;
      name = "app.yml";
    }
    this.writeFileFromString(yaml.safeDump(config), path.join(this.dest._base, 'config', name || 'app.yml'));
  },
  loadJSON:  function(name){
    return JSON.parse(this.readFileAsString(path.join(this.dest._base, name || 'package.json'))) || {};
  },
  saveJSON:  function(name, data){
    if(typeof name != "string" && name){
      data = name;
      name = "package.json";
    }
    this.writeFileFromString(JSON.stringify(data, null, 2), path.join(this.dest._base, name || 'package.json'));
  }
};
