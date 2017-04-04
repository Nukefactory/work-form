import gulp        from 'gulp';
import plugins     from 'gulp-load-plugins';
import browser     from 'browser-sync';
import pug         from 'gulp-pug';
import rimraf      from 'rimraf';
import yargs       from 'yargs';
import lazypipe    from 'lazypipe';
import siphon      from 'siphon-media-query';
import path        from 'path';
import merge       from 'merge-stream';
import colors      from 'colors';
import imgresize   from 'gulp-responsive';
import rename      from 'gulp-rename';
import concat      from 'gulp-concat';
import uglify      from 'gulp-uglify';
import prefix      from 'gulp-autoprefixer';

const $ = plugins();

// Look for the --production flag
const PRODUCTION = !!(yargs.argv.production);
const EMAIL = yargs.argv.to;

// Test task. For testing things
gulp.task('test',
  gulp.series(clean, copy));

// Build the "dist" folder by running all of the above tasks
gulp.task('build',
  gulp.series(clean, pages, sass, images, copy, scripts));

// Build pages, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

// Clean out dist folder
gulp.task('clean',
  gulp.series(clean));

// Just run the pages
gulp.task('pages',
  gulp.series(pages, copy));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf('dist', done);
}

// Copy php files to dist
function copy() {
  return gulp.src('src/pages/**/*.php')
    .pipe(gulp.dest('dist/'));
}

// Compile Pug into html and send to dist
function pages() {
  return gulp.src('src/pages/**/[^_]*.pug')
    .pipe(pug({pretty: true, basedir: 'src/pages'}))
    .pipe(gulp.dest('dist'));
}

// Compile Sass into CSS
function sass() {
  return gulp.src('src/scss/app.scss')
    .pipe($.sass({
      includePaths: ['bower_components/foundation-sites/scss']
    }).on('error', $.sass.logError))
    .pipe(prefix())
    .pipe(gulp.dest('dist/css'));
}

// Concat and minify .js files
function scripts() {
  return gulp.src(['bower_components/jquery/dist/jquery.js',
                  'bower_components/foundation-sites/dist/js/foundation.js',
                  'bower_components/motion-ui/dist/motion-ui.js',
                  'bower_components/what-input/dist/what-input.js',
                  'src/js/jquery-ui.js',
                  'src/js/jquery-form.js',
                  'src/js/add-fields.js',
                  'src/js/date-picker.js',
                  'src/js/app.js',
                  'src/js/form-submit.js'])
    .pipe(concat('scripts.min.js'))
    //.pipe(gulp.dest('dist/js'))
    //.pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
}

// Copy and compress images
function images() {
  return gulp.src('src/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/images'));
}

// Start a server with LiveReload to preview the site in
function server(done) {
  browser.init({
    server: 'dist'
  });
  done();
}

// Watch for file save changes. Will not respond to file additions.
function watch() {
  gulp.watch('src/**/*.html').on('change', gulp.series(copy, browser.reload));
  gulp.watch(['src/pages/**/*', 'src/templates/**/*']).on('change', gulp.series(pages, copy, browser.reload));
  gulp.watch('src/scss/**/*').on('change', gulp.series(sass, pages,browser.reload));
  gulp.watch('src/images/**/*').on('change', gulp.series(images, browser.reload));
//  gulp.watch('src/assets/product-thumbs/**/*').on('change', gulp.series(resize, browser.reload));
}