// Переменные
let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer');

  gulp.task('clean', async function(){
    del.sync('dist');
  })

// Преобразуем sass в css
gulp.task('scss', function () {
  return gulp.src('app/sass/**/*.sass') //берем все файлы sass 
    // return gulp.src('app/sass/**/*.(scss || sass)') //если в проекте есть файлы этих типов
    .pipe(sass({ outputStyle: "expanded" })) // оптравляем на обработку плагину gulp-sass сжатый css - ('compressed') несжатый - ('expanded')
    .pipe(autoprefixer({
      
    })) //добавляем вендорные префиксы
    .pipe(rename({ suffix: '.min' })) //добавляется сжатый файл .min.css    
    .pipe(gulp.dest('app/css')) // скомпилированный файл отправляем в папку css
    .pipe(browserSync.reload({ stream: true })) // релоадинг браузера при изменении файла CSS! ====== 2
});


gulp.task('css', function () {
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    // 'node_modules/magnific-popup/dist/magnific-popup.css'
  ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/sass/'))
    // .pipe(browserSync.reload({ stream: true }))
})

// релоадинг при изменении HTML
gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true })) // релоадинг браузера при изменении файла HTML ====== 3
});

//task для script.js
gulp.task('script', function () {
  return gulp.src('app/js/*.js') //перезагружаем браузер при изменении нашего js файла
    .pipe(browserSync.reload({ stream: true })); // релоадинг браузера при изменении файла JS ====== 3
});


// task для js библиотек
gulp.task('js', function () {
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js', //берем файлы библиотек
    // 'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
  ])
    .pipe(concat('libs.min.js')) // объединяем их в один файл
    .pipe(uglify()) // применяем сжатие для js - uglify
    .pipe(gulp.dest('app/js')) //скидываем все в папку js
    .pipe(browserSync.reload({ stream: true })) // перезагружаемся при изменении js - (сигнал от watch) ====== 4
})

// следим за файлами sass html
gulp.task('watch', function () {
  gulp.watch('app/sass/**/*.sass', gulp.parallel('scss')); //параллельно запуcкаем task sass
  gulp.watch('app/*.html', gulp.parallel('html')); //параллельно запуcкаем task html
  gulp.watch('app/js/*.js', gulp.parallel('js')) //параллельно запуcкаем task js
});
// task browser-sync
gulp.task('browser-sync', function () { // является первой частью функции ====== 1
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  })
});


// Сборка готового проекта в папку Dist
gulp.task('build', async function(){
  let buildHtml = gulp.src('app/**/*.html')
  .pipe(gulp.dest('dist'))

  let buildCss = gulp.src('app/css/**/*.css')
  .pipe(gulp.dest('dist/css'))

  let buildJs = gulp.src('app/js/**/*.js')
  .pipe(gulp.dest('dist/js'))

  let buildFonts = gulp.src('app/fonts/**/*.*')
  .pipe(gulp.dest('dist/fonts'))

  let buildImg = gulp.src('app/img/**/*.*')
  .pipe(gulp.dest('dist/img'))
  
})

//default task
gulp.task('default', gulp.parallel('css','scss', 'script', 'browser-sync', 'watch'))

