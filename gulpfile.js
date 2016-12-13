// gulp
var gulp = require('gulp'),
    gulpUglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var war = require('gulp-war');
var zip = require('gulp-zip');

var fs = require('fs');
var package = JSON.parse(fs.readFileSync('package.json'));
var nowDate = new Date();

// webpack
var webpack = require("webpack");
var webpackStream = require('webpack-stream');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var named = require('vinyl-named');
var templateCache = require('gulp-angular-templatecache');


gulp.task('dev-template', function () {
    return gulp.src('./production/views/**.html')
        .pipe(templateCache({
            module: "fubon.ta.callin.app"
        }))
        .pipe(gulp.dest('./production/js/template/'));

});
gulp.task('dev-js', function () {
    return gulp.src('src/config.dev.js')
        .pipe(webpackStream({
            devtool: "eval-cheap-module-source-map",
            cache: true,
            output: {
                publicPath: "assets/js/",
                filename: "app.js"
            },
            resolve: {
                modulesDirectories: ['node_modules'],
                alias: {
                    framework7: 'framework7/dist/js/framework7.min',
                    angular: 'angular/angular.min',
                    ngTouch: 'angular-touch/angular-touch.min',
                    ngMock: 'angular-mocks/angular-mocks',
                    ngCookie: 'angular-cookies/angular-cookies.min'
                },
                extensions: ['', '.js']
            },
            module: {
                loaders: []
            },
            plugins: [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    debug: true,
                    minimize: true,
                    sourceMap: false,
                    output: {
                        comments: false
                    },
                    compressor: {
                        warnings: false
                    }
                }),
                new webpack.optimize.OccurrenceOrderPlugin(),
            ]
        })).pipe(gulp.dest("production/js/assets/"))
});
var comArray = ["./production/js/component/prefex.js", "./production/js/component/fubon**"]
gulp.task('dev-build', function () {
    return gulp.src(comArray)
        .pipe(concat('component.js'))
        .pipe(gulp.dest('production/js/component/dist/'))
        .pipe(gulpUglify({
            beautify: true,
            comments: true,
            sourceMap: true,
            mangle: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('production/js/component/dist/'));
});
gulp.task('dev-css', function () {
    return gulp.src('src/style.js')
        .pipe(named())
        .pipe(webpackStream({
            devtool: 'eval',
            module: {
                loaders: [{
                    test: /\.png$/,
                    loader: 'url-loader?limit=100000'
                }, {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract("style", "css!sass!postcss")
                }, {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract("style", "css!sass!postcss")
                }, {
                    test: /\.(jpg|png|woff|svg|ttf|eot)([\?]?.*)$/,
                    loader: "file-loader?name=../img/assets/[name].[ext]"
                }]
            },
            postcss: function () {
                return [autoprefixer({
                    browsers: [
                        'last 2 Chrome versions',
                        'last 2 Firefox versions',
                        'Explorer >= 11',
                        'last 1 Edge versions',
                        'last 2 ChromeAndroid versions',
                        'Android >= 4.1',
                        'safari >= 6',
                        'ios >= 6'
                    ],
                    cascade: true
                })];
            },
            plugins: [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurrenceOrderPlugin(),
                new ExtractTextPlugin("main.css", {
                    allChunks: true
                }),
            ]
        })).pipe(gulp.dest('production/css/'))
        .pipe(browserSync.stream());
});


gulp.task('dev-all', ['dev-js', 'dev-css', 'dev-template', 'dev-build']);

gulp.task('sit-war', ['dev-all', 'gen-sit-war']);
gulp.task('gen-sit-war', function () {
    gulp.src(["./production/**", '!./production/js/component/*.js'])
        .pipe(war({
            welcome: 'index.html',
            displayName: package.version, //form package.json.version
            version: package.version //form package.json.version
        }))
        .pipe(zip('tacallin-sit-' + nowDate.getFullYear() + (nowDate.getMonth() + 1) + nowDate.getDate() + '.war'))
        .pipe(gulp.dest("./dist"));
});
gulp.task('dev-war', ['dev-all', 'gen-dev-war']);
gulp.task('gen-dev-war', function () {
    gulp.src(["./production/**", '!./production/js/component/*.js'])
        .pipe(war({
            welcome: 'index.html',
            displayName: package.version, //form package.json.version
            version: package.version //form package.json.version
        }))
        .pipe(zip('tacallin-dev-' + nowDate.getFullYear() + (nowDate.getMonth() + 1) + nowDate.getDate() + '.war'))
        .pipe(gulp.dest("./dist"));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        port: 3030,
        server: {
            baseDir: './production/'
        },
        ghostMode: false,
        startPath: 'index.dev.html'
    });
});

gulp.task('watch', function () {
    gulp.watch('production/**/*.html', ['dev-template', 'dev-build', browserSync.reload]);
    gulp.watch('src/style.js', ['dev-css']);
    gulp.watch('production/js/component/*.js', ['dev-build', browserSync.reload]);
    gulp.watch('production/js/controller/*.js', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);


// -----------------------------------------------------

gulp.task('pro-js', function () {
    return gulp.src('src/config.js')
        .pipe(webpackStream({
            devtool: "eval-cheap-module-source-map",
            cache: true,
            output: {
                publicPath: "assets/js/",
                filename: "app.js"
            },
            resolve: {
                modulesDirectories: ['node_modules'],
                alias: {
                    framework7: 'framework7/dist/js/framework7.min',
                    angular: 'angular/angular.min',
                    ngTouch: 'angular-touch/angular-touch.min',
                    ngMock: 'angular-mocks/angular-mocks',
                    ngCookie: 'angular-cookies/angular-cookies.min'
                },
                extensions: ['', '.js']
            },
            module: {
                loaders: []
            },
            plugins: [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    debug: true,
                    minimize: true,
                    sourceMap: false,
                    output: {
                        comments: false
                    },
                    compressor: {
                        warnings: false
                    }
                }),
                new webpack.optimize.OccurrenceOrderPlugin(),
            ]
        })).pipe(gulp.dest("production/js/assets/"))
});


gulp.task('pro-css', function () {
    return gulp.src('src/style.js')
        .pipe(named())
        .pipe(webpackStream({
            devtool: 'eval',
            module: {
                loaders: [{
                    test: /\.png$/,
                    loader: 'url-loader?limit=100000'
                }, {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract("style", "css!sass!postcss")
                }, {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract("style", "css?!sass!postcss")
                }, {
                    test: /\.(jpg|png|woff|svg|ttf|eot)([\?]?.*)$/,
                    loader: "file-loader?name=../img/assets/[name].[ext]"
                }]
            },
            postcss: function () {
                return [autoprefixer({
                    browsers: [
                        'last 2 Chrome versions',
                        'last 2 Firefox versions',
                        'Explorer >= 11',
                        'last 1 Edge versions',
                        'last 2 ChromeAndroid versions',
                        'Android >= 4.1',
                        'safari >= 6',
                        'ios >= 6'
                    ]
                })];
            },
            plugins: [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurrenceOrderPlugin(),
                new ExtractTextPlugin("main.css", {
                    allChunks: true
                })
            ]
        })).pipe(gulp.dest('production/css/'))
        .pipe(browserSync.stream());
});

var proArray = ["./production/js/component/prefex.js", "./production/js/component/fubon**"]
gulp.task('pro-build', function () {
    return gulp.src(comArray)
        .pipe(concat('component.js'))
        .pipe(gulp.dest('production/js/component/dist/'))
        .pipe(gulpUglify({
            beautify: true,
            comments: true,
            sourceMap: true,
            mangle: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('production/js/component/dist/'));
});
gulp.task('pro-template', function () {
    return gulp.src('./production/views/**.html')
        .pipe(templateCache({
            module: "fubon.ta.callin.app"
        }))
        .pipe(gulp.dest('./production/js/template/'));
});
var excludedFile = ["./production/**", '!./production/js/component/*.js', '!./production/index.bak.html', '!./production/index.dev.html', '!./production/js/controller/main.dev.js', './production/js/component/dist/component.js'];
gulp.task('gen-pro-war', function () {
    gulp.src(excludedFile)
        .pipe(war({
            welcome: 'index.html',
            displayName: package.version, //form package.json.version
            version: package.version //form package.json.version
        }))
        .pipe(zip('tacallin-pro-' + nowDate.getFullYear() + (nowDate.getMonth() + 1) + nowDate.getDate() + '.war'))
        .pipe(gulp.dest("./dist"));
});
gulp.task('pro-all', ['pro-js', 'pro-css', 'pro-template', 'pro-build']);
gulp.task('pro-war', ['pro-all', 'gen-pro-war']);


gulp.task('pro-browser-sync', function () {
    // browserSync.init({
    //     host: "172.17.24.234/tacallindiy",
    //     port: "8080",
    //     browser: "google chrome",
    //     minify: true,
    //     server: './',
    //     https: true,
    //     ghostMode: false,
    //     open: "external",
    //     startPath: "production/index.html"
    // });
    browserSync.init({
        port: 3050,
        server: {
            baseDir: './production/'
        },
        ghostMode: false,
        startPath: 'index.html'
    });
});