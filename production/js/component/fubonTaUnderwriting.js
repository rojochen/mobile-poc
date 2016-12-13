// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonTaUnderwriting = {
        templateUrl: "fubon-ta-underwriting.html",
        controller: fubonTaUnderwritingCtrl,
        controllerAs: "vm",
        bindings: {
            playData: "="
        },
        require: {

        }
    }



    callinApp.component('fubonTaUnderwriting', fubonTaUnderwriting);


    fubonTaUnderwritingCtrl.$inject = ['InitService', 'F7Service', 'util7', 'CallInEntity', 'APIService', '$log'];

    function fubonTaUnderwritingCtrl(InitService, F7Service, util7, CallInEntity, APIService, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;

        //sort list;
        function sorting(x) {
            var preIndex, current;
            for (var i = 0; i < x.length; i++) {
                preIndex = i - 1;
                current = x[i];
                while (preIndex >= 0 && x[preIndex] < current) {
                    x[preIndex + 1] = x[preIndex];
                    preIndex--;
                }
                x[preIndex + 1] = parseInt(current.toString().replace(/-|萬|\s/, ""));
            }
            return x;

        }



        function underWritingInit(underWriting) {
            vm.playData = CallInEntity.getFailureInsureds().failureInsureds;
            for (var i = 0; i < vm.playData.length; i++) {

                if (vm.playData[i].insuredName.length == 2) {
                    vm.playData[i].insuredName = vm.playData[i].insuredName.replace(/(\W{1})(\W{1})/, "$1*");
                } else {
                    vm.playData[i].insuredName = vm.playData[i].insuredName.replace(/(.*)(\W{1})(\W{1})/, "$1*$3");
                }
                vm.playData[i].lastCode = vm.playData[i].insuredID.substr(7, 9);
            }

            vm.blurIncome = function (x) {

                if (/^[0-9]+$/.test(x.income) === true && /^0/.test(x.income) === false) {
                    var income = parseInt(x.income);
                    TAInsuredAmount = [];
                    var _taQuota, getInsurePeople;

                    for (var i = 0; i < underWriting.length; i++) {
                        if (underWriting[i].insuredID === x.insuredID) {
                            getInsurePeople = i;
                        }
                    }
                    var getInsureQuotaRange = underWriting[getInsurePeople].insuredQuota.qADDQuotaRange;
                    // 級距排序
                    sorting(getInsureQuotaRange);
                    TAInsuredAmount.push({
                        effectiveDate: CallInEntity.getTourismInfo().startDate,
                        insuredID: x.insuredID,
                        revenue: income,
                    });
                    // 取得年收入保額
                    APIService.getTAInsuredAmount(TAInsuredAmount).then(function (data) {
                        var taQuota = data.data.taQuota;
                        var getSmailRange = getInsureQuotaRange[getInsureQuotaRange.length - 1];
                        // 判斷金額是否小於級距
                        if (taQuota < getSmailRange) {
                            mainView.router.load({
                                pageName: 'error'
                            });
                        } else {
                            if (taQuota) {
                                x.maxMoney = taQuota;
                            } else {
                                x.maxMoney = '';
                            }
                        }

                        // 大小排序
                        for (var i = 0, l = getInsureQuotaRange.length; i < l; i++) {
                            var item = getInsureQuotaRange[i];
                            if (taQuota >= item) {
                                _taQuota = item
                                break;
                            }
                        }
                        underWriting[getInsurePeople].insuredQuota.qADDQuota = _taQuota;
                        insuredInformations = [];
                        for (var i = 0; i < underWriting.length; i++) {
                            insuredInformations.push(underWriting[i]);

                        }
                        CallInEntity.setPremium(insuredInformations);
                    });


                    x.income = x.income + '萬';

                } else {
                    F7Service.getInstance().alert('輸入的格式不正確，請重新確認！', '錯誤');
                    x.income = '';
                }



            };
        }

        angular.element(document).on('pageInit', function (e) {
            var page = e.detail.page;
            var formPage = e.detail.page.fromPage;

            if (page.name == 'checkInsurance' && formPage.name == "page3") {
                var underWriting = CallInEntity.getPremium();
                underWritingInit(underWriting);
            }
        });
        // 多次載入
        angular.element(document).on('pageReinit', function (e) {
            var page = e.detail.page;
            var formPage = e.detail.page.fromPage;

            if (page.name == 'checkInsurance' && formPage.name == "page3") {
                var underWriting = CallInEntity.getPremium();
                underWritingInit(underWriting);
            }
        });



        // 返回第三頁
        vm.backPage3 = function () {
            var error = [];
            angular.forEach(vm.playData, function (item, index) {
                if (!item.income) {
                    error.push(index);
                } else {
                    item.Insurance1 = item.maxMoney + '萬';
                    item.Insurance1_style = 'not-empty-state';
                }

            });

            if (error.length !== 0) {
                F7Service.getInstance().alert('有欄位未輸入，請重新確認！', '錯誤');
            } else {
                mainView.router.loadPage('#page3');

            }
        };

    }
})();