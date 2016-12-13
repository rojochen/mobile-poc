(function () {
    var mtModule = angular.module('fubon.ta.callin', ['ngf7']);


    //backend service
    var myApp = angular.module('fubon.ta.callin.app', ['fubon.ta.callin', 'ngTouch', 'ngCookies']);
    console.log(window.$$API_PATH);
    myApp.constant('APIDomain', window.$$API_PATH ? window.$$API_PATH : "");
    myApp.config(["$touchProvider", function ($touchProvider) {
        $touchProvider.ngClickOverrideEnabled(true);
    }]);

    myApp.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
    }]);

    myApp.config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(true);
    }]);
})();