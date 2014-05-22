"use strict";
let gulp = require("gulp");


gulp.task("css", function() {
  return gulp.src("assets/css/**/*.css")
    .pipe(gulp.dest("./public/css"));
});

gulp.task("fonts", function() {
  return gulp.src("assets/fonts/**/*")
    .pipe(gulp.dest("./public/fonts"));
});

gulp.task("images", function() {
  return gulp.src("assets/images/**/*")
    .pipe(gulp.dest("./public/images"));
});

gulp.task("js", function() {
  return gulp.src("assets/js/**/*")
    .pipe(gulp.dest("./public/js"));
});



gulp.task("default", ["css", "fonts", "images", "js"], function() {

});