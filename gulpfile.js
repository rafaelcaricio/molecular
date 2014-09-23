var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');

var paths = {
  testScripts: ['./test/example1.js']
};

gulp.task('clean', function(cb) {
    del(['build', 'test/build'], cb);
});

gulp.task('testScripts', function() {
  return browserify(paths.testScripts)
    .bundle()
    .pipe(source('examples.web.js'))
    .pipe(gulp.dest('./test/build/'));
});

gulp.task('build', ['testScripts'], function() {
});

gulp.task('test', function() {
});

gulp.task('default', ['build', 'test']);
