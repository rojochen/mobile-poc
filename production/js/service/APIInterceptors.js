(function () {
    var myApp = angular.module('fubon.ta.callin.app');
    Preloader.$inject = ['$q', 'F7Service', '$log'];

    function Preloader($q, F7Service, $log) {
        var Preloader = {
            request: function (config) {
                if (config.url.indexOf('.html') === -1) {
                    F7Service.getInstance().showPreloader();
                }
                return config;
            },
            requestError: function (rejection) {},
            response: function (response) {
                if (response.config.url.indexOf('.html') === -1) {
                    F7Service.getInstance().hidePreloader();
                }
                return response;
            },
            responseError: function (rejection) {
                F7Service.getInstance().hidePreloader();
                return $q.reject(rejection);
            }
        };
        return Preloader;
    }

    APIInterceptors.$inject = ['$q', 'F7Service', 'CallInEntity', '$log'];

    function APIInterceptors($q, F7Service, CallInEntity, $log) {
        var APIInterceptors = {
            request: function (config) {
                config.headers.Authorization = 'Bearer ' + CallInEntity.getAuthorization();
                return config;
            },
            requestError: function (rejection) {},
            response: function (response) {
                var mainView = F7Service.getInstance().getCurrentView();
                mainView.params.domCache = true;
                mainView.params.reload = false;
                // $log.debug(response);
                if (response.data.processStatus !== undefined || response.data.processStatus === "FAILURE") {
                    var statusCode = response.data.processStatus.statusCode;
                    switch (statusCode) {
                        case '00000001':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '01001003':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '01002002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '01012003':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '01003002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '01004002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '01005002':
                            mainView.router.load({
                                pageName: 'errorCreditcard'
                            });
                            break;
                        case '01006002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '01007002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                            // case '03001002':
                            //     mainView.router.load({
                            //         pageName: 'error'
                            //     });
                            //     break;
                        case '03002002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '03004002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '03005002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                        case '03006002':
                            mainView.router.load({
                                pageName: 'error'
                            });
                            break;
                    }
                }
                return response;
            },
            responseError: function (rejection) {
                var mainView = F7Service.getInstance().getCurrentView();
                mainView.params.domCache = true;
                mainView.params.reload = false;
                // F7Service.getInstance().alert("ddddd", "錯誤");
                $log.error('server response error')
                $log.error(rejection);
                mainView.router.load({
                    pageName: 'error'
                });
                return $q.reject(rejection);
            }
        };
        return APIInterceptors;
    };

    myApp.factory('Preloader', Preloader);
    myApp.factory('APIInterceptors', APIInterceptors);

    myApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('Preloader');
        $httpProvider.interceptors.push('APIInterceptors');
    }]);
})();