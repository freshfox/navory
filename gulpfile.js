const gulp = require('gulp');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const path = require('path');
const favicons = require('gulp-favicons');
const gutil = require('gulp-util');

const dirDist = 'dist';
const dirAssets = 'src/assets';
const dirImages = dirAssets + '/images';
const dirIcons = dirImages + '/icons';

gulp.task('svgstore', function () {
    return gulp
        .src(dirIcons + '/*.svg')
        .pipe(svgmin(function (file) {
            let prefix = path.basename(file.relative, path.extname(file.relative));
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

gulp.task('favicons', function () {
	return gulp.src(dirImages + '/favicon.png').pipe(favicons({
		appName: 'Navory',
		background: '#4c89fb',
		path: '/assets/images/favicons/',
		url: 'https://app.navory.com/',
		online: false,
		orientation: 'landscape',
		html: 'dist/index.html',
		pipeHTML: false,
		replace: false,
		version: 1.0,
		logging: true,
		icons: {
			android: true,              // Create Android homescreen icon. `boolean`
			appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
			appleStartup: false,        // Create Apple startup images. `boolean`
			favicons: true,             // Create regular favicons. `boolean`
			firefox: false,              // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
			windows: false,              // Create Windows 8 tile icons. `boolean`
			yandex: false                // Create Yandex browser icon. `boolean`
		}
	}))
		.on('error', gutil.log)
		.pipe(gulp.dest('./dist/assets/images/favicons/'));
});

gulp.task('default', ['beforeBuild', 'afterBuild']);
gulp.task('beforeBuild', ['svgstore']);
gulp.task('afterBuild', ['favicons']);
