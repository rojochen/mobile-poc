// var app = angular.module('fubon.ta.callin.app');

(function () {
    var fubonErrorCreditcardComponent = {
        templateUrl: 'fubon-ta-error-creditcard.html',
        controller: fubonErrorCreditcardComponentCtrl,
        controllerAs: 'vm',
        transclude: true,
        bindings: {
            name: '@'
        }
    };
    callinApp.component('fubonErrorCreditcard', fubonErrorCreditcardComponent);

    function fubonErrorCreditcardComponentCtrl() {
        var vm = this;
    };

})();