// var app = angular.module('fubon.ta.callin.app');
(function () {
    var qaComponent = {
        template: '<a href="#" class="open-popup floating-button color-blue" ng-click="vm.linkQa()"><img src="img/QA.svg" alt="" /></a>',
        controller: qaComponentCtrl,
        controllerAs: 'vm',
        bindings: {
            blockPage: '@'
        }
    };
    callinApp.component('fubonQa', qaComponent);

    qaComponentCtrl.$inject = ['F7Service', '$rootScope', '$timeout', '$log'];

    function qaComponentCtrl(F7Service, $rootScope, $timeout, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;
        vm.linkQa = function () {
            $rootScope.$broadcast('qa.exit', {
                pageName: vm.blockPage

            });
            $timeout(function () {
                mainView.router.loadPage('#qa?' + new Date().getTime());
            })
        }
    }
})();