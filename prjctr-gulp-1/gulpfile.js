var gulp = require('gulp');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var moduleBgFix = require('./moduleBgFix/');

var concat = require('gulp-concat');
var del = require('del');

var browserSync = require('browser-sync');
var server = browserSync.create();

var imagemin = require('gulp-imagemin');

var svgSprites = require('gulp-svg-sprites');


function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './build'
    }
  });
  done();
}

var pugFiles = [
  'src/**/*.pug',
  '!src/layouts/**',
  '!src/blocks/**'
];
var stylFiles = [
  'src/assets/**/*.styl',
  'src/blocks/**/*.styl',
];


var jsFiles = [
  'src/vendor/**/*.js',
  'src/assets/**/*.js',
  'src/blocks/**/*.js'  
];

var imgFiles = [
  'src/assets/**/*.{jpg,png,jpeg,svg,gif}',
];

// var imgSvgFiles = [
//  'src/assets/**/*.svg'
// ];

gulp.task('pug', function() {
  return gulp.src(pugFiles)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
});

gulp.task('stylus', function() {
    var postCSSplugins = [
        autoprefixer({browsers: ['last 10 version']}),
        // moduleBgFix()
    ];

  return gulp.src(stylFiles)
    .pipe(stylus())
    .pipe(postcss(postCSSplugins))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream())
});

gulp.task('js', function () {
  return gulp.src(jsFiles)
    .pipe(concat('assets/app.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('img', function () {
  return gulp.src(imgFiles)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('build/assets'))
});

gulp.task('svg', function() {
  return gulp.src('src/assets/svg/*.svg')
  .pipe(svgSprites())
  .pipe(gulp.dest('build/assets/'));
});


gulp.task('watch', function(){
  gulp.watch('src/**/*.styl', gulp.series('stylus'));
  gulp.watch('src/**/*.pug', gulp.series('pug', reload));
  gulp.watch('src/**/*.js', gulp.series('js', reload));
  gulp.watch(imgFiles, gulp.series('img', reload));
  gulp.watch('src/**/*.svg', gulp.series('svg', reload));
});

gulp.task('clean', function(){
  return del('./build');
});

gulp.task('build', gulp.parallel('stylus', 'pug', 'js', 'img', 'svg'));

gulp.task('serve', gulp.parallel('watch', serve));

gulp.task('default', gulp.series('clean','build', 'serve'));