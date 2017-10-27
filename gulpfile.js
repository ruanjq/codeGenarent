const gulp = require("gulp"),
    rename = require('gulp-rename'),
    mincss = require("gulp-minify-css"),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    less = require("gulp-less"),
    uglify = require('gulp-uglify');

const processors = [
    autoprefixer({
        browsers: ["last 4 versions", "Firefox >= 20", "Firefox < 20"]
    })
];
gulp.task('less',  function(done) {
    gulp.src('./css/*.less')
        .pipe(less())
        .pipe(rename({ suffix: '.min' }))
        .pipe(mincss())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./css'));
    done();
});

gulp.task('bundle', function() {
    gulp.src("./lib/*.js")
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});


gulp.task('watch', function() {
    gulp.watch(['css/*.less'],['less']);
    gulp.watch(['lib/*.js'],['bundle']);
});

gulp.task('default', ['less','bundle']);
