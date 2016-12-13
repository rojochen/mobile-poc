// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonTaFormComponent = {
        templateUrl: "fubon-ta-form.html",
        controller: fubonTaFormCtrl,
        controllerAs: 'vm',
        bindings: {
            // selectPlayList: '='
        }
    };
    callinApp.component('fubonTaForm', fubonTaFormComponent);

    fubonTaFormCtrl.$inject = ['F7Service', '$rootScope', '$timeout', 'util7', 'APIService', 'option7', 'CallInEntity', '$log'];

    function fubonTaFormCtrl(F7Service, $rootScope, $timeout, util7, APIService, option7, CallInEntity, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;


        //取得被保險人、旅遊地點資料-pageReinit
        angular.element(document).on('pageReinit', function (e) {
            var page = e.detail.page;
            if (page.name === 'page2') {
                // $log.debug('pageReinit page2');
                vm.peopleName = [];
                angular.forEach(CallInEntity.getCustomerInsuredOption(), function (item) {
                    if (item.checked === true) {
                        vm.peopleName.push(item);
                    }
                })
                if (e.detail.page.fromPage.name === 'playLocation') {
                    vm.selectPlayList = [];
                    vm.locationData = CallInEntity.getLocationOption().location.locations[1].locations;
                    // $log.debug(vm.locationData);
                    angular.forEach(vm.locationData, function (item) {
                        if (item.checked === true) {
                            // $log.debug(vm.selectPlayList);
                            vm.selectPlayList.push(item);
                            vm.isDisabled = '';
                        }
                    })
                }
            }
        });


        //選擇國外或國內
        vm.playArea = '';
        vm.selectPlaySite = function (isGoAbroadis) {
            if (isGoAbroadis === 'yes') {

                Dom7('[name=isGoAbroad]')[0].checked = true;
                vm.playArea = 2;
                mainView.router.loadPage('#playLocation');
                vm.delPlayLocation = true;
                vm.isDisabled = '';


            } else {



                Dom7('[name=isGoAbroad]')[0].checked = false;
                Dom7('[name=isGoAbroad]')[1].checked = true;
                vm.playArea = 1;
                vm.delPlayLocation = false;
                vm.selectPlayList = [];
                vm.selectPlayList.push(CallInEntity.getLocationOption().location.locations[0].locations[0]);
                vm.isDisabled = 'disabled';
                vm.days = '';
                document.getElementById('days').parentElement.parentElement.className = "item-inner";
                vm.endDate = '';
                vm.endDateStyle = '';
            }
        }


        //開啟旅遊地點頁面
        vm.goPlayLocation = function ($event) {
            vm.delPlayLocation = true;
            if (!Dom7($event.target).hasClass('chip-delete')) {
                mainView.router.loadPage('#playLocation');
            }
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
            var savelocationInfo = CallInEntity.getLocationOption();
            savelocationInfo.location.locations[1].locations = vm.locationData;
            CallInEntity.setLocationOption(savelocationInfo);
        };


        //開啟被保險人頁面
        vm.goInsured = function ($event) {
            if (!Dom7($event.target).hasClass('chip-delete')) {
                mainView.router.loadPage('#Insured');
            }
        }


        //取消被保險人
        vm.chipDelete = function (e) {
            angular.forEach(vm.peopleName, function (item, index) {
                if (item === e) {
                    vm.peopleName.splice(index, 1);
                }
            });

            var copyPeopleData = angular.copy(CallInEntity.getCustomerInsuredOption());
            angular.forEach(copyPeopleData, function (info) {
                if (info.insuredID === e.insuredID) {
                    info.checked = false;
                }
            })
            CallInEntity.setCustomerInsuredOption(copyPeopleData);
        };


        //Picker Date Time - startDate
        var today = new Date();
        var startDate = F7Service.getInstance().picker(option7.getYYYMMDDHHOption('startDate'));
        vm.startDate = today.format(today.getFullYear() - 1911 + '-MM-dd hh:00');
        if (vm.startDate) {
            vm.startDateStyle = 'not-empty-state';
        } else {
            vm.startDateStyle = '';
        }


        //計算投保結束時間
        var startDateInfo = '';
        vm.blur = function (x) {
            if (vm.startDate.length !== 0) {
                startDateInfo = vm.startDate;
            } else {
                vm.startDate = startDateInfo;
            }
            // $log.debug(vm.startDate); 
            // $log.debug(vm.playArea);
            // $log.debug(parseInt(vm.days));
            if (vm.startDate && vm.days && /^[0-9]/.test(vm.days) === true) {
                if (vm.playArea === 1 && parseInt(vm.days) > 30) {
                    F7Service.getInstance().alert('「台澎金馬」旅遊不得超過30天,國外旅遊不得超過180天。', '錯誤');
                    vm.days = '';
                    document.getElementById('days').parentElement.parentElement.className = "item-inner";
                } else if (vm.playArea !== 1 && parseInt(vm.days) > 180) {
                    F7Service.getInstance().alert('「台澎金馬」旅遊不得超過30天,國外旅遊不得超過180天。', '錯誤');
                    vm.days = '';
                    document.getElementById('days').parentElement.parentElement.className = "item-inner";
                } else {
                    var startDateArray;
                    var re = /-|:|\s/;
                    startDateArray = vm.startDate.split(re);
                    endDate = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2], startDateArray[3]);
                    vm.days = parseInt(vm.days);
                    endDate.setDate(endDate.getDate() + vm.days);
                    vm.endDate = endDate.format('yyyy-MM-dd hh:mm');
                    vm.endDateStyle = 'not-empty-state';
                }
            }
            if (/^[0-9]/.test(vm.days) === false || !vm.startDate || !vm.days) {
                vm.days = '';
                document.getElementById('days').parentElement.parentElement.className = "item-inner";
                vm.endDate = '';
                vm.endDateStyle = '';
            }
        }


        //清除投保開始時間、投保天數、投保結束時間欄位
        vm.cleanInput = function (x) {
            if (x === 'startDate') {
                document.getElementById('startDate').value = '';
                document.getElementById('startDate').parentElement.parentElement.classList.remove('not-empty-state');
                vm.startDate = '';
                vm.endDate = '';
                vm.endDateStyle = '';
            }
            if (x === 'days') {
                vm.days = '';
                document.getElementById('days').parentElement.parentElement.className = "item-inner";
                vm.endDate = '';
                vm.endDateStyle = '';
            }
        }


        //導到第三頁
        vm.goStap3 = function () {
            console.log(vm.selectPlayList);
            if (vm.selectPlayList !== undefined) {
                if (vm.selectPlayList.length == []) {
                    F7Service.getInstance().alert('旅遊地點未輸入，請重新確認！', '錯誤');
                } else if (angular.isUndefined(vm.peopleName) || vm.peopleName.length == []) {
                    F7Service.getInstance().alert('被保險人未輸入，請重新確認！', '錯誤');
                } else if (vm.startDate == '') {
                    F7Service.getInstance().alert('投保開始時間未輸入，請重新確認！', '錯誤');
                } else if (angular.isUndefined(vm.days) || vm.days == '') {
                    F7Service.getInstance().alert('投保天數未輸入，請重新確認！', '錯誤');
                } else {
                    // $log.debug(vm.endDate);
                    if (!angular.isUndefined(vm.endDate)) {
                        var peopleIDArrary = [];
                        angular.forEach(CallInEntity.getCustomerInsuredOption(), function (item) {
                            if (item.checked === true) {
                                peopleIDArrary.push(item.insuredID);
                            }
                        })

                        var validatePeriodInfo = {
                            callInNumber: CallInEntity.getCallinNumber(),
                            insuredIDs: peopleIDArrary,
                            travelInformation: {
                                locations: vm.selectPlayList,
                                dateRange: vm.days,
                                startDate: util7.changeYear(vm.startDate),
                                endDate: util7.changeYear(vm.endDate),

                            }
                        };
                        // $log.debug(JSON.stringify(validatePeriodInfo, null, " "));
                        APIService.validatePeriod(validatePeriodInfo).then(function (data) {
                            if (angular.lowercase(data.data.processStatus.status) === 'success') {
                                // $log.debug('API - 重複投保檢核');
                                var duplicateName = '',
                                    copyPeopleName = angular.copy(vm.peopleName);


                                function setTourismInfo() {
                                    var peopleIDInfo = [];
                                    angular.forEach(vm.peopleName, function (item) {
                                        if (item.checked === true) {
                                            peopleIDInfo.push(item.insuredID);
                                        }
                                    })

                                    vm.playData = {
                                        playArea: vm.playArea ? vm.playArea : 1,
                                        peopleData: vm.peopleName,
                                        peopleIDArrary: peopleIDInfo,
                                        playSite: vm.selectPlayList,
                                        startDate: vm.startDate,
                                        days: vm.days,
                                        endDate: vm.endDate
                                    };
                                    CallInEntity.setTourismInfo(vm.playData);
                                    // $log.debug(CallInEntity.getTourismInfo());
                                }


                                function getProposal() {
                                    var getProposalInfo = {
                                            "callInNumber": CallInEntity.getCallinNumber(),
                                            "insuredIDs": CallInEntity.getTourismInfo().peopleIDArrary,
                                            "locationType": CallInEntity.getTourismInfo().playArea
                                        }
                                        // $log.debug(getProposalInfo);
                                    APIService.getProposal(getProposalInfo).then(function (data) {
                                        if (angular.lowercase(data.data.processStatus.status) === 'success') {
                                            // $log.debug('API-取得建議投保方案');
                                            // $log.debug(CallInEntity.getProposal());
                                            mainView.router.loadPage('#page3');
                                        }
                                    })
                                }


                                function removeName() {
                                    var copyPeopleData = angular.copy(CallInEntity.getCustomerInsuredOption());
                                    angular.forEach(copyPeopleName, function (item) {
                                        angular.forEach(copyPeopleData, function (info) {
                                            if (info.insuredID !== item.insuredID) {
                                                info.checked = false;
                                            }
                                        })
                                    })
                                    CallInEntity.setCustomerInsuredOption(copyPeopleData);

                                    vm.peopleName = copyPeopleName;

                                    if (vm.peopleName.length === 0) {
                                        mainView.router.loadPage('#error');
                                    } else {
                                        setTourismInfo();
                                        // $log.debug(CallInEntity.getTourismInfo());
                                        getProposal();
                                    }
                                }


                                angular.forEach(CallInEntity.getValidatePeriod().periodStatus, function (item) {
                                    if (item.status === true) {
                                        angular.forEach(copyPeopleName, function (info, index) {
                                            if (info.insuredID === item.insuredIDs) {
                                                duplicateName += info.name + '、';
                                                copyPeopleName.splice(index, 1);
                                            }
                                        })
                                    }
                                })


                                if (duplicateName) {
                                    duplicateName = duplicateName.substring(0, duplicateName.length - 1);
                                    F7Service.getInstance().alert('被保人 ' + duplicateName + ' 已投保本公司旅平險，保險期間為' + vm.startDate + '~' + vm.endDate + '，不可重覆投保！', '錯誤', function () {
                                        removeName();
                                    });
                                } else {
                                    setTourismInfo();
                                    // $log.debug(CallInEntity.getTourismInfo());
                                    getProposal();
                                }

                            }
                        })
                    }
                }
            } else {
                F7Service.getInstance().alert('未輸入，請重新確認！', '錯誤');
            }

        };
    }

})();