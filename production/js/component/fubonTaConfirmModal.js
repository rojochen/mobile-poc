// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonTaConfirmModal = {
        templateUrl: "fubon-ta-confirm-modal.html",
        controller: fubonTaConfirmModalCtrl,
        controllerAs: "vm",

    }

    callinApp.component('fubonTaConfirmModal', fubonTaConfirmModal);

    fubonTaConfirmModalCtrl.$inject = ['$scope', 'InitService', 'F7Service', 'util7', 'CallInEntity', 'APIService', '$timeout', '$log'];

    function fubonTaConfirmModalCtrl($scope, InitService, F7Service, util7, CallInEntity, APIService, $timeout, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();

        function initTaConfirmModal() {

            $timeout(function () {

                vm.selectPeopleData = [], total = null;
                var insuredInformationsLength = Number(CallInEntity.getInsuredInformations().length);
                for (var i = 0; i < insuredInformationsLength; i++) {
                    // $log.debug(CallInEntity.getInsuredInformations()[i]);
                    total += Number(CallInEntity.getInsuredInformations()[i].fee);
                    vm.selectPeopleData.push({
                        fee: util7.formatnumber(CallInEntity.getInsuredInformations()[i].fee) + '元',
                        lastCode: CallInEntity.getInsuredInformations()[i].lastCode,
                        insuredName: CallInEntity.getInsuredInformations()[i].insuredName.length == 2 ? CallInEntity.getInsuredInformations()[i].insuredName.replace(/(\W{1})(\W{1})/, "$1*") : CallInEntity.getInsuredInformations()[i].insuredName.replace(/(.*)(\W{1})(\W{1})/, "$1*$3"),
                        qADDFee: util7.formatnumber(CallInEntity.getInsuredInformations()[i].insuredQuota.qADDFee) + '萬',
                        qMRFee: util7.formatnumber(CallInEntity.getInsuredInformations()[i].insuredQuota.qMRFee) + '萬',
                        qOHS1Fee: util7.formatnumber(CallInEntity.getInsuredInformations()[i].insuredQuota.qOHS1Fee) + '萬',
                        dailyOutpatientQuota: util7.formatnumber(CallInEntity.getInsuredInformations()[i].insuredQuota.dailyOutpatientQuota) + '萬'
                    });
                }

                vm.feeTotal = util7.formatnumber(total);

                var playData = CallInEntity.getTourismInfo();
                playData.feeTotal = null;
                playData.feeTotal = vm.feeTotal;
                CallInEntity.setTourismInfo(playData);


                // console.log(Dom7('.accordion-item').eq(0).addClass('.accordion-item-expanded'));


                Dom7('.comdashed').on('opened', function (e) {
                    Dom7(this).children(".accordion-item-content").css({
                        height: auto,
                        overflow: 'initial'
                    });

                    Dom7("#ccc").css({
                        height: '100%',
                        overflow: 'initial'
                    });

                });
                Dom7('.comdashed').on('closed', function (e) {

                    Dom7(this).children(".accordion-item-content").css({
                        height: '0px',
                        overflow: 'hidden'
                    });

                    Dom7("#ccc").css({
                        height: '100%',
                        overflow: 'initial｀'
                    });
                });
            });

        }

        var pageName = "black";

        function checkFlow(e) {
            var page = e.detail.page;
            var fromPage = e.detail.page.fromPage;

            if (page.name === pageName) {
                // Dom7(".page-content").css({
                //     height: '100%',
                //     overflow: 'visible'
                // });
                // Dom7(".accordion-list").css({
                //     height: '100%',
                //     overflow: 'auto'
                // });
                Dom7('.protection').css({
                    height: "100%",
                    // background: "#ccc",
                    overflow: scroll
                });
                if (fromPage.name === "page3") {
                    Dom7('fubon-ta-sheets').addClass('blurry');
                    initTaConfirmModal();
                    vm.button = 1;

                } else if (fromPage.name === "page4") {
                    Dom7('fubon-ta-submit').addClass('blurry');
                    vm.button = 2;

                } else {
                    // $log.debug("error");
                }
            } else {
                // Dom7(".page-content").css({
                //     height: '100%',
                //     overflow: 'scroll'
                // });
            }
        }
        // 第一次載入
        angular.element(document).on('pageInit', function (e) {
            checkFlow(e);

        });
        // 多次載入
        angular.element(document).on('pageReinit', function (e) {
            checkFlow(e);
        });
        vm.backStep3 = function (x) {
            Dom7('fubon-ta-sheets').removeClass('blurry');
            mainView.router.loadPage('#page3');
        };
        vm.goStep4 = function () {
            Dom7('fubon-ta-sheets').removeClass('blurry');
            mainView.router.loadPage('#page4');
        };

        vm.backStep4 = function () {
            Dom7('fubon-ta-submit').removeClass('blurry');
            mainView.router.loadPage('#page4');
        }
    }
})();