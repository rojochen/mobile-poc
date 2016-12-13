// var app = angular.module('fubon.ta.callin.app');

(function () {
    var footerComponent = {
        template: '<div class="toolbar-inner"><div></div><div>&copy; 2016 富邦人壽版權所有</div><div></div></div>',
        controller: footerComponentCtrl,
        controllerAs: 'vm',
        bindings: {
            footerContent: '@'
        }
    };
    callinApp.component('fubonFooter', footerComponent);

    function footerComponentCtrl() {
        var vm = this;
    }
})();