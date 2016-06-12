var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('bundle', function() {
    return browserify({
        extensions: ['.js', '.jsx'],
        entries: 'views/assets/js/components/main.js'
    })
        .transform(babelify.configure({
            ignore: /(bower_components)|(node_modules)/,
            presets: ['react', 'es2015']

        }))
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('views/assets/js/'));
});
gulp.task('default', function() {
    gulp.watch('views/assets/js/components/*.js', ['bundle']);
    gulp.watch('views/assets/js/action/*.js', ['bundle']);
    gulp.watch('views/assets/js/reducers/*.js', ['bundle']);

});
