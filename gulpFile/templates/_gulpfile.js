"use strict";
let gulp = require("gulp");
let newer = require("gulp-newer");
<% if(hasFeature("bower")) {%>let bower = require("gulp-bower");<% } %>
<% if(hasFeature("concat")) {%>let concat = require("gulp-concat");<% } %>
<% if(hasFeature("uglify")) {%>let uglify = require("gulp-uglify");<% } %>
<% if(hasFeature("livereload")) {%>let livereload = require("gulp-livereload");<% } %>
<% if(hasFeature("supervisor")) {%>let supervisor = require("supervisor");<% } %>

let paths = {
  vendor:{
    css:["assets/vendor/css/**/*.css"],
    js:["assets/vendor/js/**/*.js"],
    images: ["assets/vendor/images/**/*"],
    fonts:["assets/vendor/fonts/**/*"]
  },
  css:["assets/css/**/*.css"],
  js:["assets/js/**/*.js"],
  images:["assets/images/**/*", "!assets/images/favicon.ico"],
  fonts:["assets/fonts/**/*"]
};

<% if(hasFeature("bower")) {%>
gulp.task("bower", function() {
  return bower();
});
<% } %>
gulp.task("css", function() {
  return gulp.src(paths.css)
    .pipe(newer("./public/css"))
    .pipe(gulp.dest("./public/css"));
});

gulp.task("fonts", function() {
  return gulp.src(paths.fonts)
    .pipe(newer("./public/fonts"))
    .pipe(gulp.dest("./public/fonts"));
});

gulp.task("images", function() {
  return gulp.src(paths.images)
    .pipe(newer("./public/images"))
    .pipe(gulp.dest("./public/images"));
});

gulp.task("js", function() {
  return gulp.src(paths.js)
    .pipe(newer("./public/js"))
    .pipe(gulp.dest("./public/js"));
});

gulp.task("vendor-js", <% if(hasFeature("bower")) {%>["bower"],<%} %> function() {
  return gulp.src(paths.vendor.js)
    .pipe(newer("./public/js/vendor.js"))
<% if(hasFeature("concat")) {%>    .pipe(concat("vendor.js"))<% } %>
<% if(hasFeature("uglify")) {%>    .pipe(uglify())<% } %>
    .pipe(gulp.dest("./public/js"));
});

gulp.task("vendor-css", <% if(hasFeature("bower")) {%>["bower"],<%} %> function() {
  return gulp.src(paths.vendor.css)
    .pipe(newer("./public/css/vendor.css"))
<% if(hasFeature("concat")) {%>    .pipe(concat("vendor.css"))<% } %>
    .pipe(gulp.dest("./public/css"));
});

gulp.task("vendor-fonts", <% if(hasFeature("bower")) {%>["bower"],<%} %> function() {
  return gulp.src(paths.vendor.fonts)
    .pipe(newer("./public/fonts"))
    .pipe(gulp.dest("./public/fonts"));
});

gulp.task("vendor-images", <% if(hasFeature("bower")) {%>["bower"],<%} %> function() {
  return gulp.src(paths.vendor.images)
    .pipe(newer("./public/images"))
    .pipe(gulp.dest("./public/images"));
});


gulp.task("favicon.ico", function() {
  return gulp.src("assets/images/favicon.ico")
    .pipe(newer("./public"))
    .pipe(gulp.dest("./public"));
});


gulp.task("default", ["css", "fonts", "images", "js", "vendor-css", "vendor-js", "vendor-fonts", "vendor-images", "favicon.ico"], function() {

});
<% if(hasFeature("livereload")) {%>
gulp.task("watch", ["default"], function() {
  let server = livereload();
  let lr = function(w){
    w.on("change", function(file) {
      server.changed(file.path);
    });
  };
  lr(gulp.watch(paths.js, ["js"]));
  lr(gulp.watch(paths.css, ["css"]));
  lr(gulp.watch(paths.fonts, ["fonts"]));
  lr(gulp.watch(paths.images, ["images"]));
  lr(gulp.watch(paths.vendor.js, ["vendor-js"]));
  lr(gulp.watch(paths.vendor.css, ["vendor-css"]));
  lr(gulp.watch(paths.vendor.fonts, ["vendor-fonts"]));
  lr(gulp.watch(paths.vendor.images, ["vendor-images"]));
  lr(gulp.watch(paths.vendor.images, ["vendor-images"]));
  lr(gulp.watch("assets/images/favicon.ico", ["favicon.ico"]));
  lr(gulp.watch("./app/**/*.jade"));
});
<%} %>
<% if(hasFeature("supervisor")) {%>
gulp.task("supervisor", <% if(hasFeature("livereload")) {%>["watch"],<%} %> function() {
  return supervisor.run(["--harmony",  "--watch",  "lib,app,config,index.js",  "--extensions",  "js,node,yml", "index.js"]);
});
<%} %>


