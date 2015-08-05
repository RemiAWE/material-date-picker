'use strict';

var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var plumberErrorHandler = {
    errorHandler: function (err) {
        console.log(err);
        this.emit('end');
    }
};

gulp.task('coffee', function(){
    return gulp.src(__dirname+'/app/scripts/**/*.coffee')
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.coffee({bare: true}))
        .pipe(gulp.dest(__dirname+'/build/'));
});

gulp.task('sass', function(){
    return gulp.src(__dirname+'/app/styles/**/*.scss')
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.sass({ outputStyle: 'expanded' }))
        .pipe(gulp.dest(__dirname+'/build/styles/'));
})

/**
 * Watch
 */
gulp.task('watch', function(){
    $.watch(__dirname+'/app/styles/**/*.scss', $.batch(function(events, done){
        gulp.start('sass', done);
    }));
    $.watch(__dirname+'/app/scripts/**/*.coffee', $.batch(function(events, done){
        //console.log('Modification du fichier CoffeeScript : '+event.path);
        gulp.start('coffee', done);
    }));
});
