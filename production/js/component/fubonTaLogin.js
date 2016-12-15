// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonTaLoginComponent = {
        templateUrl: "fubon-ta-login.html",
        controller: fubonTaLoginCtrl,
        controllerAs: 'vm'
    };
    callinApp.component('fubonTaLogin', fubonTaLoginComponent);

    fubonTaLoginCtrl.$inject = ['util7', 'F7Service', '$rootScope', '$timeout', 'APIService', 'CallInEntity', 'option7', '$cookies', '$log'];

    function fubonTaLoginCtrl(util7, F7Service, $rootScope, $timeout, APIService, CallInEntity, option7, $cookies, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;

        vm.insurance = function (myRadiois) {
            vm.myRadiois = myRadiois;
            if (myRadiois === 'Y') {
                Dom7('[name=myRadio]')[0].checked = true;
            } else {
                Dom7('[name=myRadio]')[1].checked = true;
            }
        }

        Dom7(document).on('pageBeforeInit', function (e) {
            if (e.detail === null || e.detail === undefined) {
                if ($cookies.get('Authorization')) {
                    if ($cookies.get('status') === "SUCCESS") {
                        var Authorization = $cookies.get('Authorization');
                        if ($cookies.get('urlType') === "1") {
                            vm.type1 = true;
                            vm.type2 = false;
                        } else {
                            vm.type1 = false;
                            vm.type2 = true;
                        }
                        CallInEntity.setAuthorization(Authorization);
                        mainView.router.loadPage('#index');
                    } else {
                        mainView.router.loadPage('#error');
                    }
                } else {
                    mainView.router.loadPage('#error');
                }
            }
        }).trigger('pageBeforeInit');


        // API - 取得個人資料
        APIService.getCustomer({
            // token: CallInEntity.getToken()
        }).then(function (data) {
            //帶入身分證字號＆手機號碼
            vm.inputName = CallInEntity.getCustomer().identity.replace(/\d\d(?=\d{3}$)/g, "**");
            vm.inputPhone = CallInEntity.getCustomer().msisdn.replace(/\d{5}(?=\d{2}$)/g, "*****");

            if (vm.inputName) {
                vm.nameStyle = 'not-empty-state';
            } else {
                vm.nameStyle = '';
            }
            if (vm.inputPhone) {
                vm.phoneStyle = 'not-empty-state';
            } else {
                vm.phoneStyle = '';
            }
        })


        //Picker Date Time
        var myCalendar = F7Service.createDatePicker(option7.getCalendar('calendar-default'));
        vm.birthdayStyle = false;


        //清除生日欄位
        vm.cleanInput = function () {
            document.getElementById('calendar-default').value = '';
            document.getElementById('calendar-default').parentElement.parentElement.classList.remove('not-empty-state');
        }


        //導到第二頁
        vm.login = function () {
            var formData = F7Service.getInstance().formToJSON('#formData');

            if (formData.id === '') {
                F7Service.getInstance().alert("請輸入身份證字號", "錯誤");
            } else if (formData.phone === '') {
                F7Service.getInstance().alert("請輸入手機號碼", "錯誤");
            } else if (formData.birthday === '') {
                F7Service.getInstance().alert("請輸入出生年月日", "錯誤");
            } else if (vm.type2 === true && formData.myRadio === undefined) {
                F7Service.getInstance().alert("請選擇半年內是否有投保過富邦人壽旅行平安險？", "錯誤");
            } else {
                var validateCustomerInfo = {
                    identity: CallInEntity.getCustomer().identity,
                    msisdn: CallInEntity.getCustomer().msisdn,
                    birthday: util7.changeYear(vm.calendarDefault),
                    siv: vm.myRadiois ? vm.myRadiois : 'N'
                }

                // API - 登入檢核
                APIService.validateCustomer(validateCustomerInfo).then(function (data) {
                    // $log.debug(data.data.processStatus.status);
                    if (data.data.processStatus.status === "SUCCESS") {
                        APIService.getCustomerInsured({
                            callInNumber: CallInEntity.getCallinNumber()
                        }).then(function (data) {
                            if (angular.lowercase(data.data.processStatus.status) === 'success') {
                                // $log.debug('API - 取得被保險人資訊清單');
                                // $log.debug(CallInEntity.getCustomerInsured());
                                vm.peopleData = [];
                                angular.forEach(CallInEntity.getCustomerInsured().insuredSorts, function (item) {
                                    var name = '';
                                    if (item.name.length === 2) {
                                        name = item.name.replace(/(\W{1})(\W{1})/, "$1*")
                                    } else {
                                        name = item.name.replace(/(.*)(\W{1})(\W{1})/, "$1*$3");
                                    }
                                    var itemObj = {
                                        insuredID: item.insuredID,
                                        lastCode: item.lastCode,
                                        name: name,
                                        birthday: item.birthYear,
                                        checked: false
                                    }
                                    vm.peopleData.push(itemObj);
                                })
                                CallInEntity.setCustomerInsuredOption(vm.peopleData);
                                // $log.debug(CallInEntity.getCustomerInsuredOption());
                            }
                        })

                        APIService.getLocation({
                            locationType: '0'
                        }).then(function (data) {
                            if (angular.lowercase(data.data.processStatus.status) === 'success') {
                                // $log.debug('API - 取得旅遊地點清單');
                                $log.debug(CallInEntity.getLocation());
                                vm.locationData = [];
                                vm.locationData = angular.copy(CallInEntity.getLocation());
                                angular.forEach(vm.locationData.location.locations, function (items) {
                                    angular.forEach(items.locations, function (item) {
                                        item.checked = false;
                                    })
                                })
                                CallInEntity.setLocationOption(vm.locationData);
                            }
                        })
                        mainView.router.loadPage('#page2');
                    } else {
                        F7Service.getInstance().alert("出生年月日不正確", "錯誤");
                    }
                })
            }
        }

        vm.camera = function () {
            mainView.router.loadPage('#camera');
        }
    }
})();