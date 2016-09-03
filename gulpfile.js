var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');

var dirPublic = 'public';
var dirImages = dirPublic + '/images';
var dirIcons = dirImages + '/icons';

gulp.task('svgstore', function () {
    return gulp
        .src(dirIcons + '/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(gulp.dest(dirImages));
});


gulp.task('default', ['svgstore']);
