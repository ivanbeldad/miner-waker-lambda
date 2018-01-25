const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('build', () =>
    gulp.src('src/*')
        .pipe(zip('miner-waker-lambda.zip'))
        .pipe(gulp.dest('dist'))
);
