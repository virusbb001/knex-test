/* eslint no-console: 0 */
require("babel-register");

const gulp=require("gulp"),
  mocha=require("gulp-mocha"),
  istanbul=require("gulp-babel-istanbul"),
  babel=require("gulp-babel"),
  sourcemaps=require("gulp-sourcemaps"),
  plumber=require("gulp-plumber"),
  eslint=require("gulp-eslint");

var coverageVariable;

gulp.task("eslint", () =>
  gulp.src(["gulpfile.js", "src/**/*.js", "test/**/*.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    );

gulp.task("babel", ["eslint"], () =>
    gulp.src("src/**/*.js")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest("lib"))
    );

gulp.task("pre-test", ["babel"], ()=>{
  coverageVariable = "$$cov_" + new Date().getTime() + "$$";
  return gulp.src(["src/**/*.js"])
    .pipe(istanbul({
      coverageVariable: coverageVariable
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task("mocha", ["pre-test"], () =>
  gulp.src("test/**/*.js")
    .pipe(plumber({
      errorHandler: function(err){
        console.log(err.stack);
        this.emit("end");
      }
    }))
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      coverageVariable: coverageVariable
    }))
);

gulp.task("watch", () => {
  gulp.watch(["src/**/*.js", "test/**/*.js"], ["mocha"]);
});

gulp.task("default", ["watch", "mocha"]);
