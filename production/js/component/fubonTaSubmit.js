// var app = angular.module('fubon.ta.callin.app');

(function () {

    var fubonTaSubmit = {
        templateUrl: "fubon-ta-submit.html",
        controller: fubonTaSubmitCtrl,
        controllerAs: "vm",
        bindings: {
            playData: "=",
            total: "<",
        },
    }

    callinApp.component('fubonTaSubmit', fubonTaSubmit);

    fubonTaSubmitCtrl.$inject = ['$rootScope', 'InitService', 'F7Service', 'util7', 'APIService', 'CallInEntity', '$log'];

    function fubonTaSubmitCtrl($rootScope, InitService, F7Service, util7, APIService, CallInEntity, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;



        // 取得旅遊地點資料
        angular.element(document).on('pageInit', function (e) {
            var page = e.detail.page;
            if (page.name === 'page4') {
                // $log.debug(CallInEntity.getTourismInfo());
                vm.playData = {
                    days: CallInEntity.getTourismInfo().days,
                    endDate: CallInEntity.getTourismInfo().endDate,
                    startDate: CallInEntity.getTourismInfo().startDate,
                    playSite: CallInEntity.getTourismInfo().playSite
                }
            }
        });

        // 多次載入
        angular.element(document).on('pageReinit', function (e) {
            var page = e.detail.page;
            if (page.name === 'page4') {
                // $log.debug(CallInEntity.getTourismInfo());
                vm.playData = {
                    days: CallInEntity.getTourismInfo().days,
                    endDate: CallInEntity.getTourismInfo().endDate,
                    startDate: CallInEntity.getTourismInfo().startDate,
                    playSite: CallInEntity.getTourismInfo().playSite
                }
            }
        });

        //取得投保人資料
        angular.element(document).on('pageInit', function (e) {
            var page = e.detail.page;
            if (page.name === 'page4') {
                // $log.debug(CallInEntity.getInsuredInformations());
                vm.totalFee = CallInEntity.getTourismInfo().feeTotal;
            }
        });

        vm.compute2 = function () {

            mainView.router.loadPage('#black');
        };

        //判斷是否投保
        vm.isOther = false;
        vm.isOthers = function (x) {
            vm.isOther = x;
            if (x === true) {
                Dom7('[name=safety]')[0].checked = true;
                mainView.router.loadPage('#premiumList');
                angular.element(document).on('pageReinit', function (e) {
                    var page = e.detail.page;
                    if (page.name === 'page4') {
                        // $log.debug(CallInEntity.getTourismInfo());
                        if (CallInEntity.getPremiumData().length === 0) {
                            vm.isOther = false;
                            Dom7('[name=safety]')[1].checked = true;
                        }
                    }
                });
            }
            if (x === false) {
                Dom7('[name=safety]')[1].checked = true;
                vm.totalCase = 0;
                vm.totalMoney = 0;
                vm.premiumData = [];
                vm.premiumListData = [];
                CallInEntity.setPremiumData(vm.premiumListData);
            }
            // $log.debug(vm.isOther);
            // $log.debug(vm.premiumListData);
            // $log.debug(vm.premiumData);
            // $log.debug(CallInEntity.getPremiumData());
        };
        //取得信用卡授權資料api
        angular.element(document).on('pageInit', function (e) {
            var page = e.detail.page;
            if (page.name === 'page4') {
                APIService.getCreditInformation({
                    callInNumber: CallInEntity.getCallinNumber()
                }).then(function (data) {
                    vm.bank = CallInEntity.getCreditInformation().bank;
                    vm.cardNumber = CallInEntity.getCreditInformation().cardNumber.replace(/\d{6}(?=\d{4}$)/g, "******");
                })
            }
        });

        vm.editPre = function () {
            mainView.router.loadPage('#premiumList');
        }

        vm.backStep3 = function () {
            // $log.debug(vm.playData);
            mainView.router.loadPage('#page3');
        };

        //確定投保
        vm.end = function () {
            //確定投保input值
            vm.insuredInformations = [];
            vm.insuredOtherCompanyInformation = [];
            angular.forEach(CallInEntity.getInsuredInformations(), function (item) {
                    var items = {
                        insuredID: item.insuredID,
                        fee: item.fee,
                    }
                    vm.insuredInformations.push(items);
                })
                // $log.debug(CallInEntity.getPremiumData());
            angular.forEach(CallInEntity.getPremiumData(), function (item) {

                var items = {
                    companyID: item.companyID,
                    companyName: item.companyName,
                    insuredFee: item.money,
                }
                vm.insuredOtherCompanyInformation.push(items);

            })

            if (vm.isOther === false) {
                vm.insuredOtherCompanyInformation = [];
            } 

            var insuredValidate = {
                // token: "token001",
                callInNumber: CallInEntity.getCallinNumber(),
                totalFee: Number(CallInEntity.getTourismInfo().feeTotal.toString().replace(/-|,|\s/, "")),
                insuredInformations: vm.insuredInformations,
                insuredOtherCompanyInformation: vm.insuredOtherCompanyInformation,
                insuredOtherCompanyStatus: vm.isOther
            };

            APIService.insuredValidate(insuredValidate).then(function (data) {
                $log.debug(insuredValidate);
                if (CallInEntity.getInsuredValidate().processStatus.status === "SUCCESS" && CallInEntity.getInsuredValidate().processStatus.statusCode === "01005001") {
                    mainView.router.loadPage('#success');
                } else {
                    mainView.router.loadPage('#error');
                    //普通失敗或信用卡失敗
                    // if () {
                    //     mainView.router.loadPage('#errorCreditcard');
                    // } else {
                    //     mainView.router.loadPage('#error');
                    // }
                }

            });
        };

        vm.errorCreditcard = function () {
            mainView.router.loadPage('#errorCreditcard');
        };

        vm.error = function () {
            mainView.router.loadPage('#error');
        }
    }
})();