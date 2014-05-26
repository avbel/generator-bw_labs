'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var config = require('../lib/config');

var GulpFileGenerator = yeoman.generators.Base.extend({
  gulpfile: function () {
    var done = this.async();
    this.prompt([{
      type: 'checkbox',
      name: 'features',
      choices: ['concat', 'uglify', 'bower', 'livereload', 'supervisor'],
      message: 'Select gulp features to use',
    }], function (props) {
      this.features = props.features;
      this.hasFeature = function(feature){
        var r = this.features.indexOf(feature) >= 0;
        return r;
      }.bind(this);
      var p = config.loadJSON.call(this, "package.json");
      p.devDependencies = p.devDependencies || {};
      var devDependencies = this.features.map(function(f){ return (f == 'supervisor')?f:'gulp-' + f;});
      devDependencies.push('gulp');
      devDependencies.push('gulp-newer');
      devDependencies.forEach(function(d){
        if(!p.devDependencies[d]) p.devDependencies[d] ='*';
      });
      config.saveJSON.call(this, "package.json", p);
      this.template('_gulpfile.js', 'gulpfile.js');
      this.mkdir('assets');
      this.mkdir('assets/css');
      this.mkdir('assets/js');
      this.mkdir('assets/images');
      this.mkdir('assets/fonts');
      this.mkdir('assets/vendor');
      this.mkdir('assets/vendor/css');
      this.mkdir('assets/vendor/js');
      this.mkdir('assets/vendor/images');
      this.mkdir('assets/vendor/fonts');
      debugger;
      if(this.options['skip-install']){
        done()
      }
      else{
        this.installDependencies(done);
      }
    }.bind(this));
  }
});

module.exports = GulpFileGenerator;