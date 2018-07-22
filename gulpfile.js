const gulp    = require('gulp')
const clean   = require('gulp-clean')
const ts      = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const livereload   = require('gulp-livereload')

const tsProject = ts.createProject('tsconfig.json')

let initServer = () => {
  livereload.listen()
  nodemon({
    script: 'dist/index.js',
    ext: 'js'
  })
  .on('restart', () => {
    gulp.src('dist/index.js')
      .pipe(livereload())
  })
}

gulp.task('scripts', ['static'], () => {
  const tsResult = tsProject.src().pipe(tsProject())
  return tsResult.js.pipe(gulp.dest('dist'))
})

gulp.task('static', ['clean'], () => {
  return gulp.src(['src/**/*.json'])
             .pipe(gulp.dest('dist'))
             .pipe(livereload())
})

gulp.task('clean', () => {
  return gulp.src('dist/*')
             .pipe(clean())
             .pipe(livereload())
})

gulp.task('build', ['clean', 'static', 'scripts'])

gulp.task('watch', ['build'], () => {
  return gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['build'])
})

gulp.task('default', ['watch'], () => {
  return initServer()
})
