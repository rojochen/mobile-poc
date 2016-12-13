// var app = angular.module('fubon.ta.callin.app');
(function () {
    var qaPageComponent = {
        templateUrl: "fubon-ta-qa-content.html",
        controller: qaPageComponentCtrl,
        controllerAs: 'vm',
        bindings: {
            // blockPage: '@'
        }
    };

    callinApp.component('fubonQaPage', qaPageComponent);

    qaPageComponentCtrl.$inject = ['F7Service', '$rootScope', '$compile', '$timeout', '$log'];

    function qaPageComponentCtrl(F7Service, $rootScope, $compile, $timeout, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();


        var name = vm.blockPage;
        $rootScope.$on('qa.exit', function (events, args) {
            vm.pageName = args.pageName;
        });
        vm.backOtherPage = function () {
                mainView.params.domCache = true;
                mainView.params.reload = false;

                if (mainView.activePage.name === "index") {
                    mainView.router.refreshPage();
                } else {
                    if (vm.pageName === 'index') {
                        // alert('Hello');

                        $timeout(function () {
                            mainView.router.loadPage('#index?' + new Date().getTime());
                        });

                        //location.href = "index.html";



                        //mainView.router.reloadPreviousPage('index.html');
                    } else {
                        mainView.router.loadPage('#' + vm.pageName);
                        // mainView.router.load({
                        //     pageName: vm.pageName,
                        //     ignoreCache: true,
                        //     reload: false
                        // });
                    }
                }


                // window.history.back();
                // mainView.router.back({
                //     ignoreCache: true,
                //     reload: false,
                //     reloadPrevious: true
                // });
                // mainView.router.load({
                //     pageName: vm.blockPage,
                //     ignoreCache: true,
                //     reload: false
                // });
            }
            // this.$onInit = function () {
            //     $log.debug('qa component init');
            // };
            // this.$onChanges = function () {
            //     $log.debug('qa component change');
            // };
            // this.$doCheck = function () {
            //     $log.debug('qa component doCheck');
            // };
            // this.$onDestroy = function () {
            //     $log.debug('qa component onDestroy');
            // };
            // this.$postLink = function () {
            //     $log.debug('qa component postLink');
            // };
    }
})();