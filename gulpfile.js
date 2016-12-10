/**
 * Created by baobao on 2016/10/8.
 */
var gulp = require('gulp');
// 自动加载插件
var $ = require('gulp-load-plugins')();
// 删除文件插件
var del = require('del');
// 按顺序执行任务
var runSequence = require('run-sequence');
// 浏览器自动刷新
var borwserSync = require('browser-sync').create();
// 浏览器自动刷新
reload = borwserSync.reload;

function gulpScripts(app_name) {
    return gulp.src(['js/*.js']) //源文件下的所有js
        .pipe($.assetRev())        //配置版本号
        //.pipe($.uglify())        //进行压缩
        .pipe(gulp.dest(app_name + "_dist/js"));//复制到目标文件路径
}

function gulpStyles(app_name) {
    return gulp.src(['css/*.css'])
        .pipe($.assetRev())
        .pipe($.minifyCss())
        .pipe(gulp.dest(app_name + "_dist/css"));
}

function gulpImages(app_name) {
    return gulp.src(['images/*'])
        .pipe(gulp.dest(app_name + "_dist/images"));   //复制所有图片到目标文件夹
}

function gulpRevHtml(app_name) {
    gulp.src(['./*.html', 'cn/*.html'])   //源文件下面是所有html
        .pipe($.assetRev())                           //配置引用的js和css文件
        .pipe(gulp.dest(app_name + '_dist'));       //打包到目标文件夹路径下面
}

// 压缩JS并配置版本号
gulp.task('app_js', function(){
    gulpScripts("tideWeb");
});

// 压缩CSS并配置版本号
gulp.task('app_css', function(){
    gulpStyles("tideWeb");
});

// 复制图片
gulp.task('app_img',function(){
    gulpImages("tideWeb");
});

// 压缩并添加版本号
gulp.task('app_rev', ['app_css', 'app_js'], function(){
    gulpRevHtml("tideWeb");
});

// 清除文件
gulp.task('clean', del.bind(null, ['tideWeb_dist'], {
    force: true
}));

gulp.task("pack", function() {
    runSequence('clean', ["app_rev"]);
});

// 编译less
gulp.task('lessfile', function () {
    gulp.src('./less/*.less')
        .pipe($.less())
        .pipe(gulp.dest('./css'));
});

// 编译less文件
gulp.task('f5', function(){
    borwserSync.init({
        server:{
            baseDir:'./'
        }
    });

    gulp.watch('less/*.less', ['lessfile']).on('change', reload);
    gulp.watch(['./*.html']).on('change', reload);
});
