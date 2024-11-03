// Import necessary modules
import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
// import del from 'del';

// Define tasks
// export const clean = () => del(['dist']);

export const styles = () => {
  return gulp.src('public/src/styles/**/*.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/styles'));
};

export const scripts = () => {
  return gulp.src('public/src/**/*.js')
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
};

// Watch task
export const watch = () => {
  gulp.watch('public/src/**/*.less', styles);
  gulp.watch('public/src/**/*.js', scripts);
};

// Default task
const build = gulp.parallel(styles, scripts);
export default build;
