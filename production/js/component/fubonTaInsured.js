// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonInsuredComponent = {
        templateUrl: "fubon-ta-insured.html",
        controller: fubonInsuredCtrl,
        controllerAs: 'vm',
        bindings: {}
    };
    callinApp.component('fubonInsured', fubonInsuredComponent);

    fubonInsuredCtrl.$inject = ['F7Service', '$rootScope', '$timeout', 'CallInEntity', '$log'];

    function fubonInsuredCtrl(F7Service, $rootScope, $timeout, CallInEntity, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;


        //取得被保險人資料
        angular.element(document).on('pageInit', function (e) {
            var page = e.detail.page;
            if (page.name === 'Insured') {
                vm.peopleData = CallInEntity.getCustomerInsuredOption();
                // $log.debug(vm.peopleData);
            }
        });


        //取得被保險人資料-pageReinit
        angular.element(document).on('pageReinit', function (e) {
            var page = e.detail.page;
            if (page.name === 'Insured') {
                vm.peopleData = CallInEntity.getCustomerInsuredOption();
                // $log.debug(vm.peopleData);
                angular.forEach(vm.peopleData, function (item) {
                    if (vm.isALlchecked === true && item.checked === false) {
                        vm.isALlchecked = false;
                    }
                })
            }
        });


        //全選被保險人
        vm.isALlchecked = false;
        vm.selectAll = function () {
            vm.isALlchecked = !vm.isALlchecked;
            angular.forEach(vm.peopleData, function (item, index) {
                item.checked = vm.isALlchecked;
            });
            // $log.debug(vm.peopleData);
        }


        //選擇被保險人
        vm.selectPeople = function (x) {
            // $log.debug(x);
            var selectNum = [];
            angular.forEach(vm.peopleData, function (item) {
                if (item.insuredID === x.insuredID) {
                    item.checked = !item.checked;
                }
                if (item.checked === true) {
                    selectNum.push(item.checked);
                }
            })
            if (selectNum.length === 6) {
                vm.isALlchecked = true;
            } else {
                vm.isALlchecked = false;
            }
        }


        //返回第二頁
        vm.backLaction = function (x) {
            CallInEntity.setCustomerInsuredOption(vm.peopleData);
            mainView.router.loadPage('#page2');
        };
    }
})();