/* Modules
------------------------------------- */
var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var reactify    = require('reactify');

gulp.task('browserify', function() {
  return browserify({entries: ('./lib/index.js'), 
              extensions: ['.js', '.jsx'],
              debug: false,
              insertGlobals: true,
              transform: [reactify]})
  .bundle().on('error', function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
  })
  .pipe(source('material.js'))
  .pipe(gulp.dest('./dist'));
});