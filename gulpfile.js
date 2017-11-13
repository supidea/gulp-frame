/*
 * @Author: super 
 * @Date: 2017-06-10 23:40:40 
 * @Last Modified by: super
 * @Last Modified time: 2017-08-16 17:45:58
 */

const gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  less = require('gulp-less'),
  clean = require('gulp-clean'),
  autoprefixer = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require("browser-sync").create(),
  plumber = require('gulp-plumber'),
  requirejsOptimize = require('gulp-requirejs-optimize')

const srcPath = {
  html: './src/**/*.html',
  less: './src/less/**/*.less',
  css: './src/css/*',
  img: './src/images/**/*',
  fonts: './src/fonts/*',
  js: './src/js/**/*.js'
}

const disPath = {
  html: './dist/',
  css: './dist/css/',
  img: './dist/images/',
  fonts: './dist/fonts/',
  js: './dist/js/'
}

/** 通用部分 */

// fonts处理 
gulp.task('fonts', () => {
  return gulp.src(srcPath.fonts, {base: './src/'})
    .pipe(gulp.dest(disPath.fonts))
})

// html处理
gulp.task('html', () => {
  return gulp.src(srcPath.html, {base: './src/'})
    .pipe(gulp.dest(disPath.html))
})

// 清除文件
gulp.task('clean', () => {
  return gulp.src('./dist', { read: false }).pipe(clean())
})

/** 开发环境 */

// LESS处理
gulp.task('less:dev', () => {
  return gulp.src(srcPath.less)
    .pipe(plumber({errorHandler: error => this.emit('end')}))
    .pipe(less())
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer())
    .pipe(gulp.dest(disPath.css))
    .pipe(browserSync.stream())
})

// JS处理
gulp.task('scripts:dev', () => {
  return gulp.src(srcPath.js, {base: './src/js/'})
    .pipe(gulp.dest(disPath.js))
    .pipe(browserSync.stream())
})

// CSS处理
gulp.task('css:dev', () => {
  return gulp.src(srcPath.css)
    .pipe(gulp.dest(disPath.css))
    .pipe(browserSync.stream())
})

// 图片处理
gulp.task('images:dev', () => {
  return gulp.src(srcPath.img)
    .pipe(gulp.dest(disPath.img))
})

// 热更新
gulp.task('serve', () => {
  browserSync.init({
    port: 2017,
    server: {
      baseDir: ['./dist']
    }
  })
})

// 监听文件变化
gulp.task('watch', ['serve'], () => {
  gulp.watch(srcPath.less, ['less:dev'])
  gulp.watch(srcPath.js, ['scripts:dev'])
  gulp.watch(srcPath.css, ['css:dev'])
  gulp.watch(srcPath.img, ['images:dev'])
  gulp.watch(srcPath.html, ['html']).on('change', browserSync.reload)
})

// 开发环境
gulp.task('dev', ['clean'], () => {
  gulp.start('fonts', 'html', 'images:dev', 'css:dev', 'less:dev', 'watch', 'scripts:dev')
})


/** 生产环境 */

// LESS处理
gulp.task('less', () => {
  return gulp.src(srcPath.less)
    .pipe(plumber({errorHandler: error => this.emit('end')}))
    .pipe(less())
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(disPath.css))
})

// CSS处理
gulp.task('css', () => {
  return gulp.src(srcPath.css)
    .pipe(minifyCSS())
    .pipe(gulp.dest(disPath.css))
})

// 图片处理
gulp.task('images', () => {
  return gulp.src(srcPath.img)
    .pipe(imagemin())
    .pipe(gulp.dest(disPath.img))
})

// require 打包
gulp.task('rjs', function () {
  return gulp.src('./src/js/pages/*.js')
    .pipe(requirejsOptimize({
      mainConfigFile: './src/js/rConfig.js',
      optimize: 'uglify',
      exclude: ['jquery', 'bootstrap']
    }))
    .pipe(gulp.dest("./dist/js/pages"))
})

// JS处理
gulp.task('scripts',['clean'], () => {
  gulp.src([srcPath.js, "!./src/js/{modules,pages}/*.js"], {base: './src/js/'})
    .pipe(uglify())
    .pipe(gulp.dest(disPath.js))
})

// 生产打包
gulp.task('build', ['scripts'], () => {
  gulp.start('fonts', 'images', 'less', 'css', 'html', 'rjs')
})
