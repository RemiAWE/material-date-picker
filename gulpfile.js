'use strict';

var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var swallowError = function(error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

gulp.task('coffee', function(){
    return gulp.src(__dirname+'/app/scripts/**/*.coffee')
        .pipe($.plumber())
        .pipe($.coffee({bare: true}))
        .pipe(gulp.dest(__dirname+'/build/'));
});

/**
 * Watch JS
 */
gulp.task('watchJs', function(){
    $.watch(__dirname+'/app/scripts/**/*.coffee', $.batch(function(events, done){
        //console.log('Modification du fichier CoffeeScript : '+event.path);
        gulp.start('coffee', done);
    }));
});
