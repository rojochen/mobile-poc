
(function () {
    var myApp = angular.module('fubon.ta.callin.app');
    var APIService = function ($http, APIDomain, CallInEntity, $log) {

        $log.debug(APIDomain);
        return {
            getCustomer: function (params) { //API - 取得個人資料
                return $http.get(APIDomain + 'api/customer/', params)
                    .success(function (data) {
                        CallInEntity.setCustomer(data);
                    })
                    .error(function (data) {
                        $log.error('getCustomer API error!!');

                    });
            },
            validateCustomer: function (params) { //API - 登入檢核
                return $http.post(APIDomain + 'api/validate/customer', params)
                    .success(function (data) {})
                    .error(function (data) {
                        $log.error('error!!');
                    });
            },
            getCustomerInsured: function (params) { //API - 取得被保險人資訊清單
                return $http.get(APIDomain + 'api/customer/insured/' + CallInEntity.getCallinNumber(), params)
                    .success(function (data) {
                        CallInEntity.setCustomerInsured(data);
                    })
                    .error(function (data) {
                        $log.error('error!!');
                    });
            },
            getLocation: function (params) { //API - 取得旅遊地點清單
                return $http.get(APIDomain + 'api/location/0', params)
                    .success(function (data) {
                        CallInEntity.setLocation(data);
                    })
                    .error(function (data) {
                        $log.error('error!!');
                    });
            },
            validatePeriod: function (params) { //API - 重複投保檢核

                return $http.post(APIDomain + "api/validate/period/", params)
                .success(function (data) {
                    CallInEntity.setValidatePeriod(data);
                })

                .error(function (data) {
                    $log.error('error!!');
                });
            },
            validateComplex: function (params) { // API-綜合檢核
                return $http.post(APIDomain + "api/validate/complex", params).success(function (data) {})
                    .error(function (data) {
                        $log.error('error');
                    });
            },
            getMRAndOHS1: function (params) {
                return $http.post(APIDomain + "api/proposal/mrandohs1", params).success(function (data) {


                    })
                    .error(function (data) {
                        $log.error('error!!');
                    });
            },
            getProposal: function (params) { // API-取得建議投保方案
                return $http.post(APIDomain + "api/proposal", params)
                    .success(function (data) {
                        $log.error(data);
                        CallInEntity.setProposal(data);
                    })
                    .error(function (data) {
                        $log.error('error!!');
                    });
            },

            getTAInsuredAmount: function (params) { // API-取得本次TA可投保保額
                return $http.post(APIDomain + "api/insured/amount/ta", params).success(function (data) {

                })
                .error(function (data) {
                    $log.error('error');
                });

            },
            getCompany: function (params) { //API-取得保險公司清單(暨檢核資料)
                return $http.get(APIDomain + 'api/company', params)

                //return $http.get("data/getCompany")
                .success(function (data) {
                        CallInEntity.setCompany(data);
                    })
                    .error(function (data) {
                        $log.error('error!!');
                    });

            },
            getCreditInformation: function (params) { // API-取得信用卡授權資料
                return $http.post(APIDomain + 'api/information/credit/' + CallInEntity.getCallinNumber(), params)
                    .success(function (data) {
                        CallInEntity.setCreditInformation(data);
                    })
                    .error(function (data) {
                        $log.error('error!!');
                    });
            },
            insuredValidate: function (params) { // API-確認投保
                return $http.post(APIDomain + 'api/validate/insured', params)
                    .success(function (data) {
                        CallInEntity.setInsuredValidate(data);
                    })
                    .error(function (data) {
                        $log.error('error!!');
                    });
            },
            validateFee: function (params) {
                return $http.post(APIDomain + "api/validate/fee", params).success(function (data) {

                }).error(function (data) {
                    $log.error('error!!');
                });
            }
        }
    };
    APIService.$inject = ["$http", "APIDomain", "CallInEntity", "$log"];
    myApp.factory('APIService', APIService);
})();
