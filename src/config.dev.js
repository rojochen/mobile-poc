define(['angular', 'framework7', 'ngTouch', 'ngCookie', 'ngMock'],
    function (ng, f7) {
        'use strict';
        Date.prototype.format = function (fmt) {
            var o = {
                'M+': this.getMonth() + 1,
                'd+': this.getDate(),
                'h+': this.getHours(),
                'm+': this.getMinutes(),
                's+': this.getSeconds(),
                'q+': Math.floor((this.getMonth() + 3) / 3),
                'S': this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        };

        global.angular = angular;
        var app = angular.module('ngf7', ['ngTouch']);
        require('./js/service/option7.js');
        require('./js/service/F7Service.js');
        require('./js/service/util7.js');




        app.factory('InitService', ['$document', 'F7Service', function ($document, f7Service) {
            var pub = {},
                eventListeners = {
                    'ready': []
                };

            pub.addEventListener = function (eventName, listener) {
                eventListeners[eventName].push(listener);
            };
            var viewOption = {
                dynamicNavbar: true,
                domCache: true
            };

            function onReady() {

                f7Service.addView('.view-main');
                //fw7.views.push(fw7.addView('.view-main', viewOption));

                for (var i = 0; i < eventListeners.ready.length; i = i + 1) {
                    eventListeners.ready[i]();
                }


                function syncActivePage(e) {
                    var p = e.detail.page;
                    var pName = p.name;
                    var view = p.view;

                    if (!p) {
                        console.log('page not found');
                        return false;
                    }
                    if (!view) {
                        console.log("view not found");
                        return false;
                    }
                    if (pName !== view.activePage.name) {

                        view.activePage = p;
                    }
                }
                Dom7(document).on('pageInit', function (e) {
                    var page = e.detail.page;
                    // console.log(e);
                    // console.log("page init :" + page.name);
                    // console.log(page);
                    syncActivePage(e);
                });
                Dom7(document).on('pageBeforeRemove', function (e) {

                    var page = e.detail.page;
                    console.warn(' DOM Remove :' + page.name);
                    // console.log("page init :" + page.name);

                });
                Dom7(document).on('pageReinit', function (e) {
                    var page = e.detail.page;
                    // console.log("page reinit :" + page.name);
                    syncActivePage(e);
                });
                Dom7(document).on('pageBack', function (e) {
                    var page = e.detail.page;
                    // console.log("page back :" + page.name);
                });
                Dom7(document).on('pageBeforeInit', function (e) {
                    // var page = e.detail.page;
                    // console.log("page before init :" + page.name);
                });
                Dom7(document).on('pageBeforeAnimation', function (e) {
                    var page = e.detail.page;
                    // console.log("pageBeforeAnimation :" + page.name);
                    syncActivePage(e);
                });
                document.documentElement.addEventListener('touchstart', function (event) {
                    if (event.touches.length > 1) {
                        event.preventDefault();
                    }
                    if (Dom7(event.target).hasClass('header')) {
                        event.preventDefault();
                    }
                    // console.log(event);
                }, false);
            }

            // Init
            (function () {
                $document.ready(function () {

                    if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
                        // Cordova
                        console.log("Using Cordova/PhoneGap setting");
                        document.addEventListener("deviceready", onReady, false);
                    } else {
                        // Web browser
                        console.log("Using web browser setting");
                        onReady();
                    }
                });
            }());

            return pub;

        }]);

        return ng;
    });