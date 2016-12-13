// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonErrorComponent = {
        templateUrl: 'fubon-ta-error.html',
        controller: fubonErrorComponentCtrl,
        controllerAs: 'vm',
        transclude: true,
        bindings: {
            name: '@'
        }
    };
    callinApp.component('fubonError', fubonErrorComponent);

    function fubonErrorComponentCtrl() {
        var vm = this;
    }
})();
