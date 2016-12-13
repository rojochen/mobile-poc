// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonTaInsuranceOthers = {
        templateUrl: "fubon-ta-insurance-others.html",
        controller: fubonTaInsuranceOthersCtrl,
        controllerAs: 'vm',
        bindings: {
            total: "=",

        }
    }

    callinApp.component('fubonTaInsuranceOthers', fubonTaInsuranceOthers);

    fubonTaInsuranceOthersCtrl.$inject = ['InitService', 'F7Service', 'util7', 'APIService', 'CallInEntity', '$log'];

    function fubonTaInsuranceOthersCtrl(InitService, F7Service, util7, APIService, CallInEntity, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;


        vm.premiumList = {};
        vm.premiumListData = [];
        vm.total = {};
        vm.total.totalMoney = '',
            vm.total.totalCase = '';
        var editStatus,
            editList = {};


        var companyNameValue = [];

        //取得投保人資料
        angular.element(document).on('pageInit', function (e) {
            var page = e.detail.page;
            if (page.name === 'premiumList') {
                APIService.getCompany().then(function (data) {
                    angular.forEach(CallInEntity.getCompany().companys, function (item) {
                            companyNameValue.push(item.companyName);
                        })
                        // $log.debug(CallInEntity.getCompany().companys);
                })
            }
        });

        // 多次載入
        angular.element(document).on('pageReinit', function (e) {
            var page = e.detail.page;
            if (page.name === 'premiumList') {
                // $log.debug(CallInEntity.getTourismInfo());
                // vm.premiumListData = [];
                CallInEntity.setPremiumData(vm.premiumListData);


            }
        });


        //天地人壽選單
        var companyName = F7Service.getInstance().picker({
            input: '#companyName',
            toolbarCloseText: '確認',
            cols: [{
                values: companyNameValue,
                cssClass: 'companyname'
            }],
            onOpen: function (picker) {
                if (editStatus === '修改') {
                    var col0Values = picker.cols[0].values;
                    var col0Random = col0Values[editList.index];
                    picker.setValue([col0Random]);
                }
            },
            onClose: function () {
                if (companyName.value) {
                    vm.premiumList.companyName = companyName.value[0];
                    document.getElementById('companyName').value = companyName.value;
                    document.getElementById('companyName').parentElement.parentElement.classList.add('not-empty-state');
                }
            }
        });

        //儲存
        vm.savePremium = function (x) {
            if (editStatus === '修改') {
                if (vm.premiumList.companyName === "" || vm.premiumList.money === "" || angular.isUndefined(vm.premiumList.companyName) || angular.isUndefined(vm.premiumList.money) || vm.premiumList.money.length > 5) {
                    F7Service.getInstance().alert('有欄位未輸入或金額超過萬元，請重新確認！', '錯誤');
                } else {
                    // $log.debug(x);
                    // $log.debug(vm.premiumListDataIndex);

                    if (vm.premiumList.companyName && vm.premiumList.money && /^[0-9]+$/.test(vm.premiumList.money) === true && /^0/.test(vm.premiumList.money) == false) {

                        angular.forEach(CallInEntity.getCompany().companys, function (item, index) {
                            if (item.companyName === x.companyName) {
                                vm.premiumListData[vm.premiumListDataIndex].index = index;
                                vm.premiumListData[vm.premiumListDataIndex].companyID = item.companyID;
                                vm.premiumListData[vm.premiumListDataIndex].companyName = x.companyName;
                                vm.premiumListData[vm.premiumListDataIndex].money = x.money;
                            }
                        });
                        // $log.debug(vm.premiumListData);
                        vm.premiumList = {};
                        document.getElementById('companyName').parentElement.parentElement.classList.remove('not-empty-state');
                        document.getElementById('money').parentElement.parentElement.classList.remove('not-empty-state');
                        editStatus = '新增';
                        vm.premiumListDataIndex = '';
                    } else if (/^[0-9]+$/.test(vm.premiumList.money) === false || !vm.premiumList.money || /^0/.test(vm.premiumList.money) == true) {
                        F7Service.getInstance().alert('輸入的格式不正確，請重新確認！', '錯誤');
                        vm.premiumList.money = '';
                        document.getElementById('money').parentElement.parentElement.className = "item-inner";
                        editStatus = '新增';
                    }
                }
            } else {
                editStatus = '新增';
                if (angular.isUndefined(vm.premiumList) || angular.isUndefined(vm.premiumList.companyName) || angular.isUndefined(vm.premiumList.money) || vm.premiumList.money.length > 4) {
                    F7Service.getInstance().alert('有欄位未輸入或輸入金額超過，請重新確認！', '錯誤');
                } else {
                    if (vm.premiumList.companyName && vm.premiumList.money && /^[0-9]+$/.test(vm.premiumList.money) === true && /^0/.test(vm.premiumList.money) == false) {
                        angular.forEach(CallInEntity.getCompany().companys, function (item, index) {
                            if (item.companyName === x.companyName) {
                                vm.premiumListData.push({
                                    index: index,
                                    companyID: item.companyID,
                                    companyName: item.companyName,
                                    money: x.money
                                });
                            }
                        });
                        // $log.debug(vm.premiumListData);
                        vm.premiumList = {};
                        document.getElementById('companyName').value = '';
                        document.getElementById('companyName').parentElement.parentElement.classList.remove('not-empty-state');
                        document.getElementById('money').parentElement.parentElement.classList.remove('not-empty-state');
                    }
                    // console.log(/^0/.test(vm.premiumList.money));
                    // console.log(/^[0-9]+$/.test(vm.premiumList.money));
                    else if (/^[0-9]+$/.test(vm.premiumList.money) === false || !vm.premiumList.money || /^0/.test(vm.premiumList.money) == true) {
                        F7Service.getInstance().alert('輸入的格式不正確，請重新確認！', '錯誤');
                        vm.premiumList.money = '';
                        document.getElementById('money').parentElement.parentElement.className = "item-inner";
                        editStatus = '新增';
                    }
                }
            }
        };

        //修改
        vm.modifyPremium = function (x, index) {
            // $log.debug(x);
            vm.premiumListDataIndex = index;
            editStatus = '修改';
            editList = {
                index: x.index,
                companyID: x.companyID,
                companyName: x.companyName,
                money: x.money
            }
            vm.premiumList = editList;
            document.getElementById('companyName').parentElement.parentElement.classList.add('not-empty-state');
            document.getElementById('money').parentElement.parentElement.classList.add('not-empty-state');
        };


        //完成
        vm.completePremium = function () {
            // $log.debug(vm.premiumListData);
            var totalMoney = 0;
            vm.totalCase = vm.premiumListData.length;
            angular.forEach(vm.premiumListData, function (item) {
                totalMoney = totalMoney + parseInt(item.money);
            })
            vm.totalMoney = util7.formatnumber(totalMoney);
            vm.total.totalMoney = vm.totalMoney;
            vm.total.totalCase = vm.totalCase;

            $log.debug(vm.premiumListData);
            $log.debug(vm.total);

            // 傳出資料
            function setPremiumData() {
                CallInEntity.setPremiumData(vm.premiumListData);
            }

            setPremiumData();
            mainView.router.loadPage('#page4');

        };

        //刪除
        vm.deletePremium = function (index) {
            vm.premiumListData.splice(index, 1);
            vm.premiumList = {};
            editStatus = '新增';
            document.getElementById('companyName').parentElement.parentElement.className = "item-inner";
            document.getElementById('money').parentElement.parentElement.className = "item-inner";

        };



        //清除
        vm.cleanInput = function (x) {
            if (x === 'companyName') {
                vm.premiumList.companyName = undefined;
                document.getElementById('companyName').value = '';
                document.getElementById('companyName').parentElement.parentElement.classList.remove('not-empty-state');
            }
            if (x === 'money') {
                vm.premiumList.money = undefined;
                document.getElementById('money').value = '';
                document.getElementById('money').parentElement.parentElement.classList.remove('not-empty-state');
            }
        };
    }

})();