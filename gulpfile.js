const gulp = require('gulp')
const zip = require('gulp-zip')
const install = require('gulp-install')
const clean = require('gulp-clean')

const tmpDir = 'tmp'
const srcDir = 'src'
const distDir = 'dist'

const copySrc = () => {
  return gulp.src(`${srcDir}/**/*`)
    .pipe(gulp.dest(`${tmpDir}/${srcDir}`))
}

const copyConfig = () => {
  return gulp.src('config.yml')
    .pipe(gulp.dest(`${tmpDir}`))
}

const installTask = () => {
  return gulp.src('package.json')
    .pipe(gulp.dest(tmpDir))
    .pipe(install({
      npm: '--production'
    }))
}

const zipTask = () => {
  return gulp.src(`${tmpDir}/**/*`, {
    nodir: true
  })
    .pipe(zip('miner-waker-lambda.zip'))
    .pipe(gulp.dest(distDir))
}

const cleanTask = () => {
  return gulp.src('tmp').pipe(clean({
    force: true
  }))
}

gulp.task('build', (done) => {
  gulp.series(copySrc, copyConfig, installTask, zipTask, cleanTask)(() => done())
})
