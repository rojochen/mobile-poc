// var app = angular.module('fubon.ta.callin.app');
(function () {
    var fubonTaSheets = {
        templateUrl: "fubon-ta-sheets.html",
        controller: fubonTaSheetsCtrl,
        controllerAs: "vm",
    }


    // component
    callinApp.component('fubonTaSheets', fubonTaSheets);

    // controller
    fubonTaSheetsCtrl.$inject = ['InitService', 'F7Service', 'util7', 'APIService', 'CallInEntity', '$timeout', '$log'];


    function fubonTaSheetsCtrl(InitService, F7Service, util7, APIService, CallInEntity, $timeout, $log) {
        var vm = this;
        var mainView = F7Service.getInstance().getCurrentView();
        mainView.params.domCache = true;
        mainView.params.reload = false;
        var pageName = "page3";
        // 排序
        function addUnit(x) {
            if (x !== null) {
                for (var i = 0; i < x.length; i++) {
                    if (typeof x[i] !== 'string') {
                        x[i] = x[i] + '萬';
                    } else {
                        x[i] = x[i];
                    }

                }
                return x;
            }
        }

        function compare(a, b) {
            if (a < b) {
                return 1;
            }
            if (a > b) {
                return -1;
            }
            // a 必須等於 b
            return 0;
        }
        // removeString
        function removeString(input) {
            if (typeof input == 'string') {
                return input.toString().replace(/-|萬|\s/, "");
            } else {
                return input + '萬';
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
        // 判斷載入頁面
        function checkFlow(e) {
            var page = e.detail.page,
                formPage = e.detail.page.fromPage,
                x;
            var _proposal = angular.copy(CallInEntity.getProposal());
            if (page.name === pageName) {
                if (formPage.name === "page2") {
                    x = _proposal.insuredInformations;
                    init(x);
                } else if (formPage.name === "checkInsurance") {
                    x = CallInEntity.getPremium();
                    init(x);
                } else {
                    // $log.debug("藍窗回來!!or 特殊狀況");
                }
            }
        }
        // init
        function init(x) {
            vm.playArea = CallInEntity.getTourismInfo().playArea;
            vm.selectPeopleData = x;

            angular.forEach(vm.selectPeopleData, function (item, index) {
                $timeout(function () {

                    if (Number(vm.selectPeopleData[index].insuredName.length) === 2) {
                        vm.selectPeopleData[index].insuredName = vm.selectPeopleData[index].insuredName.replace(/(\W{1})(\W{1})/, "$1*");
                    } else {
                        vm.selectPeopleData[index].insuredName = vm.selectPeopleData[index].insuredName.replace(/(.*)(\W{1})(\W{1})/, "$1*$3");
                    }
                    item.insuredID = vm.selectPeopleData[index].insuredID.substr(7, 9);

                    var Insurance1_value = vm.selectPeopleData[index].insuredQuota.qADDQuotaRange;
                    var Insurance2_value = vm.selectPeopleData[index].insuredQuota.qMRQuotaRange;

                    addUnit(Insurance1_value);
                    addUnit(Insurance2_value);


                    if (Insurance2_value[0] !== '未選擇任何額度') {
                        Insurance2_value.unshift('未選擇任何額度');
                    }

                    vm.selectPeopleData[index].Insurance1 = document.getElementsByName('Insurance1')[index].value = removeString(vm.selectPeopleData[index].insuredQuota.qADDQuota);
                    vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = removeString(vm.selectPeopleData[index].insuredQuota.qMRQuota);

                    document.getElementsByClassName('Insurance1_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                    document.getElementsByClassName('Insurance2_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');

                    var Insurance1_index = F7Service.getInstance().picker({
                        input: '.Insurance1_' + index,
                        toolbarCloseText: '確認',
                        cols: [{
                            values: Insurance1_value,
                            cssClass: 'Insurance1_index'
                        }],

                        onClose: function () {
                            if (Insurance1_index.value) {
                                document.getElementsByClassName('Insurance1_' + index)[0].value = Insurance1_index.value;
                                document.getElementsByClassName('Insurance1_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                            }
                        },
                        onChange: function (p, value, displayValue) {
                            // add每次change就會呼叫getMRAndOHS1
                            var order = index;
                            var insuredID = vm.selectPeopleData[index].insuredID;
                            var locationType = vm.selectPeopleData[index].locationType;
                            var addQuota = Number(displayValue.toString().replace(/-|萬|\s/, ""));
                            var location = vm.playArea;
                            document.getElementsByName('Insurance2')[index].disabled = false;
                            // 呼叫callMRAndOHS1
                            var validateMRAndOHS1Info = {
                                insuredID: CallInEntity.getProposal().insuredInformations[order].insuredID,
                                addQuota: addQuota,
                                locationType: locationType
                            }
                            $log.debug(validateMRAndOHS1Info);
                            callMRAndOHS1(validateMRAndOHS1Info, order, location);
                        }
                    });

                    var Insurance2_index = F7Service.getInstance().picker({
                        input: '.Insurance2_' + index,
                        toolbarCloseText: '確認',
                        cols: [{
                            values: Insurance2_value,
                            cssClass: 'Insurance2_index'
                        }],
                        value: [Insurance2_value[1]],
                        onClose: function () {
                            if (Insurance2_index.value) {
                                document.getElementsByClassName('Insurance2_' + index)[0].value = Insurance2_index.value;
                                document.getElementsByClassName('Insurance2_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                            }
                        },
                        onChange: function (p, value, displayValue) {
                            if (vm.playArea === 2) {
                                if (p.value == "未選擇任何額度") {
                                    vm.selectPeopleData[index].Insurance3 = document.getElementsByClassName('Insurance3_' + index)[0].value = "未選擇任何額度";
                                }
                            }
                        }
                    });
                    if (vm.playArea === 2) {
                        var Insurance3_value = vm.selectPeopleData[index].insuredQuota.qOHS1QuotaRange;
                        addUnit(Insurance3_value);
                        if (Insurance3_value[0] !== '未選擇任何額度') {
                            Insurance3_value.unshift('未選擇任何額度');
                        }
                        vm.selectPeopleData[index].Insurance3 = document.getElementsByName('Insurance3')[index].value = removeString(vm.selectPeopleData[index].insuredQuota.qOHS1Quota);
                        document.getElementsByClassName('Insurance3_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                        var Insurance3_index = F7Service.getInstance().picker({
                            inputReadOnly: false,
                            scrollToInput: false,
                            input: '.Insurance3_' + index,
                            toolbarCloseText: '確認',
                            cols: [{
                                values: Insurance3_value,
                                cssClass: 'Insurance3_index'
                            }],
                            value: [Insurance3_value[1]],
                            onOpen: function (p) {
                                vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = p.value;
                            },
                            onClose: function () {
                                if (Insurance3_index.value) {
                                    document.getElementsByClassName('Insurance3_' + index)[0].value = Insurance3_index.value;
                                    document.getElementsByClassName('Insurance3_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                                }
                            },
                            onChange: function (p, value, displayValue) {
                                if (p.value !== ["未選擇任何額度"]) {
                                    vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = p.value;
                                    document.getElementsByName('Insurance2')[index].disabled = true;
                                    if (p.value == "未選擇任何額度") {
                                        vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = p.value;
                                        document.getElementsByName('Insurance2')[index].disabled = false;
                                    }
                                }
                            }
                        });
                    }

                });

            });
        }
        // callMRAndOHS1
        function callMRAndOHS1(validateMRAndOHS1Info, order, location) {
            APIService.getMRAndOHS1(validateMRAndOHS1Info).then(function (data) {
                if (data.data.processStatus.status === "SUCCESS") {
                    index = order;
                    getLocation = location;
                    Insurance2_value = data.data.qMRQuotaRange;
                    vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = data.data.qMRQuota + '萬';
                    addUnit(Insurance2_value);
                    if (Insurance2_value[0] !== '未選擇任何額度') {
                        Insurance2_value.unshift('未選擇任何額度');
                    }
                    document.getElementsByClassName('Insurance2_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                    var Insurance2_index = F7Service.getInstance().picker({
                        input: '.Insurance2_' + index,
                        toolbarCloseText: '確認',
                        cols: [{
                            values: Insurance2_value,
                            cssClass: 'Insurance2_index'
                        }],
                        value: [Insurance2_value[1]],
                        onClose: function () {
                            if (Insurance2_index.value) {
                                document.getElementsByClassName('Insurance2_' + index)[0].value = Insurance2_index.value;
                                document.getElementsByClassName('Insurance2_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                            }
                        },
                        onChange: function (p, value, displayValue) {
                            if (vm.playArea === 2) {
                                if (p.value == "未選擇任何額度") {
                                    vm.selectPeopleData[index].Insurance3 = document.getElementsByClassName('Insurance3_' + index)[0].value = "未選擇任何額度";
                                }
                            }
                        }
                    });


                    if (getLocation == 2) {
                        Insurance3_value = data.data.qOHS1QuotaRange;
                        vm.selectPeopleData[index].Insurance3 = document.getElementsByName('Insurance3')[index].value = data.data.qOHS1Quota + '萬';
                        addUnit(Insurance3_value);
                        if (Insurance3_value[0] !== '未選擇任何額度') {
                            Insurance3_value.unshift('未選擇任何額度');
                        }
                        document.getElementsByClassName('Insurance3_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                        var Insurance3_index = F7Service.getInstance().picker({
                            input: '.Insurance3_' + index,
                            toolbarCloseText: '確認',
                            cols: [{
                                values: Insurance3_value,
                                cssClass: 'Insurance3_index'
                            }],
                            value: [Insurance3_value[1]],
                            onOpen: function (p) {
                                vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = p.value;
                            },
                            onClose: function () {
                                if (Insurance3_index.value) {
                                    document.getElementsByClassName('Insurance3_' + index)[0].value = Insurance3_index.value;
                                    document.getElementsByClassName('Insurance3_' + index)[0].parentElement.parentElement.classList.add('not-empty-state');
                                }
                            },
                            onChange: function (p, value, displayValue) {
                                if (p.value !== ["未選擇任何額度"]) {
                                    vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = p.value;
                                    document.getElementsByName('Insurance2')[index].disabled = true;
                                    if (p.value == "未選擇任何額度") {
                                        vm.selectPeopleData[index].Insurance2 = document.getElementsByName('Insurance2')[index].value = p.value;
                                        document.getElementsByName('Insurance2')[index].disabled = false;
                                    }
                                }
                            }
                        });
                    }
                } else {
                    F7Service.getInstance().closeModal('.picker-modal');
                    mainView.router.load({
                        pageName: 'error'
                    });
                }
            });
        }

        // 試算保費
        vm.compute = function () {
            var insuredInformations = [];
            $log.debug(vm.playArea);
            if (vm.playArea == 2) {
                angular.forEach(vm.selectPeopleData, function (item, index) {
                    var _originalProposal = angular.copy(CallInEntity.getProposal().insuredInformations);
                    for (var i = 0; i < _originalProposal.length; i++) {
                        if (_originalProposal[i].insuredID == item.insuredID) {
                            item.insuredName = _originalProposal[i].insuredName;
                            item.insuredQuota.qADDQuotaRange = _originalProposal[i].insuredQuota.qADDQuotaRange;
                            item.insuredQuota.qMRQuotaRange = _originalProposal[i].insuredQuota.qMRQuotaRange;
                            item.insuredQuota.qOHS1QuotaRange = _originalProposal[i].insuredQuota.qOHS1QuotaRange;
                        }
                    }
                    insuredInformations.push({
                        birthday: item.birthday,
                        insuredID: CallInEntity.getProposal().insuredInformations[index].insuredID,
                        insuredName: CallInEntity.getProposal().insuredInformations[index].insuredName,
                        insuredQuota: {
                            qADDQuota: parseInt(removeString(item.Insurance1)),
                            qADDQuotaRange: item.insuredQuota.qADDQuotaRange,
                            qMRQuota: item.Insurance2 == "未選擇任何額度" ? 0 : parseInt(removeString(item.Insurance2)),
                            qMRQuotaRange: item.insuredQuota.qMRQuotaRange,
                            qOHS1Quota: item.Insurance3 == "未選擇任何額度" ? 0 : parseInt(removeString(item.Insurance3)),
                            qOHS1QuotaRange: item.insuredQuota.qOHS1QuotaRange
                        }
                    });
                });
            } else {
                angular.forEach(vm.selectPeopleData, function (item, index) {

                    var _originalProposal = angular.copy(CallInEntity.getProposal().insuredInformations);
                    for (var i = 0; i < _originalProposal.length; i++) {
                        if (_originalProposal[i].insuredID == item.insuredID) {
                            item.insuredName = _originalProposal[i].insuredName;
                            item.insuredQuota.qADDQuotaRange = _originalProposal[i].insuredQuota.qADDQuotaRange;
                            item.insuredQuota.qMRQuotaRange = _originalProposal[i].insuredQuota.qMRQuotaRange;
                        }
                    }
                    insuredInformations.push({
                        birthday: item.birthday,
                        insuredID: CallInEntity.getProposal().insuredInformations[index].insuredID,
                        insuredName: CallInEntity.getProposal().insuredInformations[index].insuredName,
                        insuredQuota: {
                            qADDQuota: parseInt(removeString(item.Insurance1)),
                            qADDQuotaRange: item.insuredQuota.qADDQuotaRange,
                            qMRQuota: item.Insurance2 == "未選擇任何額度" ? 0 : parseInt(removeString(item.Insurance2)),
                            qMRQuotaRange: item.insuredQuota.qMRQuotaRange,
                            qOHS1Quota: 0
                        }
                    });

                });
            }

            var getStartDate = util7.changeYear(CallInEntity.getTourismInfo().startDate);

            validateComplexValidateInfo = {
                callInNumber: CallInEntity.getCallinNumber(),
                identity: CallInEntity.getCustomer().identity,
                date: CallInEntity.getTourismInfo().days.toString(),
                effectiveDate: getStartDate,
                insuredInformations: insuredInformations,
            };
            $log.debug(validateComplexValidateInfo);
            // 綜合檢核api
            APIService.validateComplex(validateComplexValidateInfo).then(function (data) {
                // 取得stateCode

                if (data.data.processStatus.status === "SUCCESS") {
                    var premium = validateComplexValidateInfo.insuredInformations;
                    var stateCode = data.data.failedItemStatusCode;
                    if (stateCode === "03004002") {
                        // $log.debug('自律規範檢核失敗');
                        F7Service.getInstance().alert("“未滿15足歲之被保險人投保殘廢保險金額上限為1000萬元整，被保人XXXXX累計本公司及產險、壽險同業之總額(含本次保額)為XXXX萬元，恕無法接受投保！”與『確定』按『確定』該被保險人不承保。", "錯誤");
                        var removePeople = [];
                        data.data.failureInsureds.forEach(function (data) {
                            removePeople.push(data.insuredName);
                        });
                        angular.forEach(removePeople, function (item, index) {
                            removeSelectPeopleData = premium.filter(function (data, index) {
                                return data.insuredName !== removePeople[index];
                            });
                        });
                        vm.selectPeopleData = removeSelectPeopleData;
                        init(vm.selectPeopleData);
                    } else if (stateCode === "03003002") {
                        // $log.debug('密集投保檢核驗證失敗');
                        var failureInsureds = data.data;
                        failureInsureds.effectiveDate = CallInEntity.getTourismInfo().startDate;
                        CallInEntity.setFailureInsureds(failureInsureds);
                        CallInEntity.setPremium(validateComplexValidateInfo.insuredInformations);
                        mainView.router.loadPage('#checkInsurance');
                    } else {

                        // $log.debug('綜合檢核通過');
                        // 試算保費input
                        var setInsuredInfo = {
                            insuredInformations: validateComplexValidateInfo.insuredInformations,
                            date: validateComplexValidateInfo.date,
                            effectiveDate: validateComplexValidateInfo.effectiveDate
                        };
                        $log.debug(setInsuredInfo);
                        //取得試算保費api
                        APIService.validateFee(setInsuredInfo).then(function (data) {
                            if (data.data.processStatus.status === "SUCCESS") {
                                CallInEntity.setInsuredInformations(data.data.insuredInformations);
                                mainView.router.loadPage('#black');
                            } else {
                                mainView.router.load({
                                    pageName: 'error'
                                });
                            }
                        });
                    }
                } else {
                    mainView.router.load({
                        pageName: 'error'
                    });
                }
            });

        };

        // 清除
        vm.cleanInsurance = function (x, index) {
            switch (x) {
                case "Insurance2":
                    if (vm.playArea == 2) {
                        document.getElementsByName("Insurance3")[index].value = vm.selectPeopleData[index].Insurance3 = '未選擇任何額度';
                    }
                    document.getElementsByName("Insurance2")[index].value = vm.selectPeopleData[index].Insurance2 = '未選擇任何額度';
                    document.getElementsByName('Insurance2')[index].disabled = false;
                    $log.debug(vm.selectPeopleData[index].Insurance2);
                    break;

                case "Insurance3":
                    document.getElementsByName("Insurance3")[index].value = vm.selectPeopleData[index].Insurance3 = '未選擇任何額度';
                    document.getElementsByName('Insurance2')[index].disabled = false;
                    $log.debug(vm.selectPeopleData[index].Insurance3);
                    break;
            }
        };
        // 回第二頁
        vm.backStep2 = function () {
            mainView.router.loadPage('#page2');
        };

    }
})();