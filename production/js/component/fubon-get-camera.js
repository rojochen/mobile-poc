// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonGetCameraComponent = {
        templateUrl: 'fubon-get-camera.html',
        controller: fubonGetCameraCtrl,
        controllerAs: 'vm',
    };
    callinApp.component('fubonGetCamera', fubonGetCameraComponent);
    fubonGetCameraCtrl.$inject = ['$scope', 'InitService', 'F7Service', 'util7', 'CallInEntity', 'APIService', '$timeout', '$log'];

    function fubonGetCameraCtrl() {
        var vm = this;
    }
})();