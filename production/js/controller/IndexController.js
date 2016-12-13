var app = angular.module('fubon.ta.callin.app');
app.controller('aaPageController', ['$scope', '$attrs', '$http', 'InitService', 'F7Service', '$timeout', '$document', 'util7', function ($scope, $attrs, $http, InitService, F7Service, $timeout, $document, util7) {
    'use strict';
    var $$ = Dom7;
    /* begin step1 */
    var myApp = F7Service.getInstance();
    $scope.mainView = F7Service.addView('.view-main', {
        dynamicNavbar: true,
        domCache: true,
        reload: true,
        force: true,
        // reloadPrevious: true,
        pushState: true
    });

}])