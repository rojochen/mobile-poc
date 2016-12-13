// var app = angular.module('fubon.ta.callin.app');
(function () {
var fubonSuccessComponent = {
    templateUrl: 'fubon-ta-success.html',
    controller: fubonSuccessComponentCtrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
        name: '@'
    }
};
callinApp.component('fubonSuccess', fubonSuccessComponent);

function fubonSuccessComponentCtrl() {
    var vm = this;

    vm.back = function () {
        mainView.router.back({
            // pageName: vm.blockPage,
            ignoreCache: true,
            reload: false
        });
    }
};


})();