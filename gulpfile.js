'use strict';

const concatCSS = require('gulp-concat-css');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');

const DistDir = './dist';
const SrcDir = './src';

gulp.task('clean', () => {
  return del([`${DistDir}/**/*`]);
});

gulp.task('sass', () => {
  return gulp.src(`${SrcDir}/public/**/*.scss`)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(concatCSS('app.min.css'))
    .pipe(gulp.dest(`${DistDir}/css`));
});

gulp.task('watch', ['build'], () => {
  const fileChanged = file => {
    let filePath = path.relative(__dirname, file.path);
  };

  gulp.watch(
    [`${SrcDir}/public/**/*.scss`],
    ['sass']
  ).on('change', fileChanged);
});

gulp.task('build', cb => {
  runSequence(
    'clean',
    ['sass'],
    cb
  );
});

gulp.task('default', ['build']);