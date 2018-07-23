const gulp    = require('gulp')
const clean   = require('gulp-clean')
const ts      = require('gulp-typescript')
const nodemon = require('gulp-nodemon')

const tsProject = ts.createProject('tsconfig.json')

let initServer = () => {
  process.env.NODE_ENV = 'development'
  nodemon({
    script: 'dist/',
    ext: 'js'
  })
  .on('restart', () => {
    gulp.src('dist/')
  })
}

gulp.task('scripts', ['static'], () => {
  const tsResult = tsProject.src().pipe(tsProject())
  return tsResult.js.pipe(gulp.dest('dist'))
})

gulp.task('static', ['clean'], () => {
  return gulp.src(['src/**/*.json'])
             .pipe(gulp.dest('dist'))
})

gulp.task('clean', () => {
  return gulp.src('dist/*')
             .pipe(clean())
})

gulp.task('build', ['clean', 'static', 'scripts'])

gulp.task('watch', ['build'], () => {
  return gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['build'])
})

gulp.task('default', ['watch'], () => {
  return initServer()
})
