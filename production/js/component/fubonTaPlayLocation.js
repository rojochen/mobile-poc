// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonPlayLocationComponent = {
        templateUrl: "fubon-ta-play-location.html",
        controller: fubonPlayLocationCtrl,
        controllerAs: 'vm',
        bindings: {}
    };
    callinApp.component('fubonPlayLocation', fubonPlayLocationComponent);

    fubonPlayLocationCtrl.$inject = ['F7Service', '$rootScope', '$timeout', 'CallInEntity', '$log'];

    function fubonPlayLocationCtrl(F7Service, $rootScope, $timeout, CallInEntity, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;


        //取得旅遊地點資料
        angular.element(document).on('pageInit', function (e) {
            var page = e.detail.page;
            if (page.name === 'playLocation') {
                vm.locationData = CallInEntity.getLocationOption().location.locations[1].locations;
                // $log.debug(vm.locationData);
            }
        });


        //取得旅遊地點資料 - pageReinit
        angular.element(document).on('pageReinit', function (e) {
            var page = e.detail.page;
            if (page.name === 'playLocation') {
                vm.locationData = CallInEntity.getLocationOption().location.locations[1].locations;
                // $log.debug(vm.locationData);
                vm.selectPlayList = [];
                angular.forEach(vm.locationData, function (item) {
                    if (item.checked === true) {
                        vm.selectPlayList.push(item);
                    }
                })
            }
        });


        //選擇旅遊地點
        vm.selectLocation = function (x) {
            // $log.debug(x);
            vm.selectPlayList = [];
            x.checked = !x.checked;
            angular.forEach(vm.locationData, function (item) {
                if (item.checked === true) {
                    vm.selectPlayList.push(item);
                }
            })
        }


        //取消旅遊地點
        vm.playListDelete = function (e, index) {
            // $log.debug(e);
            vm.selectPlayList.splice(index, 1);
            angular.forEach(vm.locationData, function (item) {
                if (item.locationID === e.locationID) {
                    item.checked = false;
                }
            })
        };


        //返回第二頁
        vm.backLaction = function (x) {
            if (!angular.isUndefined(vm.selectPlayList) && vm.selectPlayList.length !== 0) {
                Dom7('[name=isGoAbroad]')[0].checked = true;
                Dom7('[name=isGoAbroad]')[1].checked = false;
            }
            var savelocationInfo = CallInEntity.getLocationOption();
            savelocationInfo.location.locations[1].locations = vm.locationData;
            CallInEntity.setLocationOption(savelocationInfo);
            // $log.debug(CallInEntity.getLocationOption());
            mainView.router.loadPage('#page2');
        };
    }
})();