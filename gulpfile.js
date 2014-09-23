var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');
var mocha = require('gulp-mocha');

var paths = {
  tests: ['./test/example1.js'],
  specs: ['./test/specs/*_spec.js']
};

gulp.task('clean', function(cb) {
    del(['build', 'test/build'], cb);
});

gulp.task('testScripts', function() {
  return browserify(paths.tests)
    .bundle()
    .pipe(source('examples.web.js'))
    .pipe(gulp.dest('./test/build/'));
});

gulp.task('build', ['testScripts'], function() {
});

gulp.task('test', function() {
  return gulp.src(paths.specs, {read: false})
          .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['build', 'test']);
