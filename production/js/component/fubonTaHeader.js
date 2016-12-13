// var app = angular.module('fubon.ta.callin.app');
(function () {
    var headerComponent = {
        template: '<div class="navbar-inner header"><div class="content"><p>TA Call-In申請平台</p></div></div>',
        controller: headerComponentCtrl,
        controllerAs: 'vm',
        bindings: {
            headerContent: '@'
        }
    };
    callinApp.component('fubonHeader', headerComponent);

    function headerComponentCtrl() {
        var vm = this;
    }
})();