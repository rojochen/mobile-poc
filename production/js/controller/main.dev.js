(function () {
    var mtModule = angular.module('fubon.ta.callin', ['ngf7']);


    //backend service
    var myApp = angular.module('fubon.ta.callin.app', ['fubon.ta.callin', 'ngTouch', 'ngCookies', 'ngMockE2E']);

    myApp.constant('APIDomain', '');
    myApp.config(["$touchProvider", function ($touchProvider) {
        $touchProvider.ngClickOverrideEnabled(true);
    }]);

    myApp.config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(false);
    }]);

    myApp.run(["$httpBackend", "$cookies", function ($httpBackend, $cookies) {
        $httpBackend.whenGET(/views\/.*/).passThrough();
        $httpBackend.whenGET(/.*\.json/).passThrough();
        $cookies.put('status', 'SUCCESS');

        $cookies.put('Authorization', 'THIS_IS_TEST_EVN');
        $cookies.put('statusCode', '01012003');
        $cookies.put('token', 'token1');
        $cookies.put('isMask', 'Y');
        $cookies.put('urlType', '2');


        //begin API - 取得被保險人資訊清單
        $httpBackend.when('GET', /^api\/customer\/insured\/*/).respond({
            "insuredSorts": [{
                "authSEQ": "string",
                "birthYear": "85",
                "insuredID": "A123456000",
                "lastCode": "000",
                "name": "小智"
            }, {
                "authSEQ": "string",
                "birthYear": "85",
                "insuredID": "B223456111",
                "lastCode": "111",
                "name": "小霞"
            }, {
                "authSEQ": "string",
                "birthYear": "84",
                "insuredID": "C123456222",
                "lastCode": "222",
                "name": "小剛"
            }, {
                "authSEQ": "string",
                "birthYear": "68",
                "insuredID": "D123456333",
                "lastCode": "333",
                "name": "大木博士"
            }, {
                "authSEQ": "string",
                "birthYear": "79",
                "insuredID": "E223456444",
                "lastCode": "444",
                "name": "武藏"
            }, {
                "authSEQ": "string",
                "birthYear": "80",
                "insuredID": "F123456555",
                "lastCode": "555",
                "name": "小次郎郎郎"
            }],
            "processStatus": {
                "message": "取得被保險人資訊成功",
                "status": "SUCCESS",
                "statusCode": "200"
            }
        }, {
            'A-Token': 'xxx'
        });
        //end API - 取得被保險人資訊清單

        //begin 取得個人資料(暨檢核資料)
        $httpBackend.when('GET', /^api\/customer\/*/).respond({
            "callInNumber": "1234567890123456",
            "identity": "A123456789",
            "msisdn": "0987654321",
            "processStatus": {
                "message": "取得客戶資訊成功",
                "status": "SUCCESS",
                "statusCode": "200"
            }
        }, {
            'token': 'xxx'
        });
        //end 取得個人資料(暨檢核資料)

        //begin 登入檢核
        $httpBackend.when('POST', /^api\/validate\/customer*/).respond({
            "processStatus": {
                "message": "登入檢核成功",
                "status": "SUCCESS",
                "statusCode": "登入檢核驗證成功"
            }
        }, {
            'A-Token': 'xxx'
        });
        //end 登入檢核

        //begin API - 取得旅遊地點清單    
        $httpBackend.when('GET', /^api\/location*/).respond({
            "processStatus": {
                "status": "SUCCESS",
                "statusCode": "01008001",
                "message": "取得旅遊地點成功"
            },
            "location": {
                "locationID": "998",
                "locationName": "全世界",
                "locations": [{
                    "locationID": "098",
                    "locationName": "國內",
                    "locations": [{
                        "locationID": "000",
                        "locationName": "台澎金馬",
                        "locations": null
                    }]
                }, {
                    "locationID": "099",
                    "locationName": "國外",
                    "locations": [{
                        "locationID": "100",
                        "locationName": "亞洲",
                        "locations": null
                    }, {
                        "locationID": "200",
                        "locationName": "美洲",
                        "locations": null
                    }, {
                        "locationID": "300",
                        "locationName": "非洲",
                        "locations": null
                    }, {
                        "locationID": "400",
                        "locationName": "歐洲",
                        "locations": null
                    }, {
                        "locationID": "500",
                        "locationName": "大洋洲",
                        "locations": null
                    }, {
                        "locationID": "600",
                        "locationName": "南極洲",
                        "locations": null
                    }]
                }]
            }
        }, {
            'A-Token': 'xxx'
        });
        //end API - 取得旅遊地點清單

        //begin API - 重複投保檢核
        $httpBackend.when('POST', /^api\/validate\/period*/).respond({
            "periodStatus": [{
                "insuredIDs": "D123456333",
                "status": true
            }, {
                "insuredIDs": "E223456444",
                "status": true
            }, {
                "insuredIDs": "F123456555",
                "status": false
            }],
            "processStatus": {
                "message": "重複投保檢核驗證成功",
                "status": "SUCCESS",
                "statusCode": "200"
            },
            "travelInformation": {
                "dateRange": "string",
                "endDate": "2016-11-18T05:42:33.130Z",
                "locations": [{
                    "locationID": "string",
                    "locationName": "string"
                }],
                "startDate": "2016-11-18T05:42:33.130Z"
            }
        }, {
            'A-Token': 'xxx'
        });
        //end API - 重複投保檢核
        // begin MRAndOHS1
        $httpBackend.when('POST', /^api\/proposal\/mrandohs1/).respond({
            "processStatus": {
                "status": "SUCCESS",
                "statusCode": "200",
                "message": "取得MR與OHS1成功"
            },
            "qMRQuota": 60,
            "qMRQuotaRange": [
                2,
                6,
                10,
                18,
                20,
                30,
                40,
                50,
                60
            ],
            "qOHS1Quota": 20,
            "qOHS1QuotaRange": [
                0,
                20,
                60
            ]
        });

        // end MRAndOHS1
        //begin 取得建議投保方案 
        $httpBackend.when('POST', /^api\/proposal/).respond({
            "processStatus": {
                "status": "SUCCESS",
                "statusCode": "200",
                "message": "取得建議投保方案成功"
            },
            "insuredInformations": [{
                "insuredName": "小智",
                "birthday": "2000-02-12",
                "insuredID": "A123456000",
                "locationType": 1,
                "insuredQuota": {
                    "qADDQuota": 200,
                    "qADDQuotaRange": [200, 100, 60, 50],
                    "qMRQuota": 60,
                    "qMRQuotaRange": [60, 50, 40, 30, 20, 10],
                    "qOHS1Quota": 20,
                    "qOHS1QuotaRange": [60, 20, 10]
                }
            }, {
                "insuredName": "小次郎郎郎",
                "birthday": "2005-12-25",
                "insuredID": "F123456555",
                "locationType": 1,
                "insuredQuota": {
                    "qADDQuota": 200,
                    "qADDQuotaRange": [200, 100, 60],
                    "qMRQuota": 60,
                    "qMRQuotaRange": [60, 50, 40, 30, 20, 10],
                    "qOHS1Quota": 20,
                    "qOHS1QuotaRange": [60, 20, 10]
                }
            }]
        }, {
            'A-Token': 'xxx'
        });
        //end 取得建議投保方案

        //begin 取得本次TA可投保保額
        $httpBackend.when('POST', /^api\/insured\/amount\/ta*/).respond({
            "processStatus": {
                "status": "SUCCESS",
                "statusCode": "01006001",
                "message": "取得本次TA可投保保額，成功"
            },
            "taQuota": 70
        }, {
            'A-Token': 'xxx'
        });
        //end 取得本次TA可投保保額
        // begin 試算保費
        $httpBackend.when('POST', /^api\/validate\/fee*/).respond({
            "processStatus": {
                "message": "試算保費檢核成功",
                "status": "SUCCESS",
                "statusCode": "03003001"
            },
            "insuredInformations": [{
                "birthYear": "85",
                "birthday": "2000-02-12",
                "fee": "200",
                "insuredID": "A123456000",
                "insuredName": "小智",
                "insuredQuota": {
                    "qADDFee": 10,
                    "qMRFee": 20,
                    "qOHS1Fee": 30,
                    "dailyOutpatientQuota": 3
                },
                "lastCode": "000",
                "locationType": "0"
            }, {
                "birthYear": "90",
                "birthday": "2005-12-25",
                "fee": "200",
                "insuredID": "F123456555",
                "insuredName": "小次郎郎郎",
                "insuredQuota": {
                    "qADDFee": 10,
                    "qMRFee": 20,
                    "qOHS1Fee": 30,
                    "dailyOutpatientQuota": 3
                },
                "lastCode": "555",
                "locationType": "0"
            }, {
                "birthYear": "85",
                "birthday": "2000-02-12",
                "fee": "200",
                "insuredID": "A123456000",
                "insuredName": "小智",
                "insuredQuota": {
                    "qADDFee": 10,
                    "qMRFee": 20,
                    "qOHS1Fee": 30,
                    "dailyOutpatientQuota": 3
                },
                "lastCode": "000",
                "locationType": "0"
            }, {
                "birthYear": "90",
                "birthday": "2005-12-25",
                "fee": "200",
                "insuredID": "F123456555",
                "insuredName": "小次郎郎郎",
                "insuredQuota": {
                    "qADDFee": 10,
                    "qMRFee": 20,
                    "qOHS1Fee": 30,
                    "dailyOutpatientQuota": 3
                },
                "lastCode": "555",
                "locationType": "0"
            }, {
                "birthYear": "85",
                "birthday": "2000-02-12",
                "fee": "200",
                "insuredID": "A123456000",
                "insuredName": "小智",
                "insuredQuota": {
                    "qADDFee": 10,
                    "qMRFee": 20,
                    "qOHS1Fee": 30,
                    "dailyOutpatientQuota": 3
                },
                "lastCode": "000",
                "locationType": "0"
            }, {
                "birthYear": "90",
                "birthday": "2005-12-25",
                "fee": "200",
                "insuredID": "F123456555",
                "insuredName": "小次郎郎郎",
                "insuredQuota": {
                    "qADDFee": 10,
                    "qMRFee": 20,
                    "qOHS1Fee": 30,
                    "dailyOutpatientQuota": 3
                },
                "lastCode": "555",
                "locationType": "0"
            }]
        });
        // end 試算保費
        //begin 綜合檢核
        $httpBackend.when('POST', /^api\/validate\/complex*/).respond({

            "processStatus": {
                "message": "綜合檢核驗證成功",
                "status": "SUCCESS",
                "statusCode": "03006001"
            },
            "failedItemStatusCode": "111",
            // "failedItemStatusCode": "03003002",
            // "failedItemStatusCode": "03004002",
            "failureInsureds": [{
                "insuredID": "A123456000",
                "insuredName": "小智",
                "quota": "1111"
            }, {
                "insuredID": "F123456555",
                "insuredName": "小次郎郎郎",
                "quota": "1111"
            }]
        }, {
            'A-Token': 'xxx'
        });
        //end 綜合檢核

        //begin 取得保險公司清單(暨檢核資料)
        $httpBackend.when('GET', /^api\/company*/).respond({
            "companys": [{
                "companyID": "001",
                "companyName": "天地人壽"
            }, {
                "companyID": "002",
                "companyName": "山海人壽"
            }, {
                "companyID": "003",
                "companyName": "黑白人壽"
            }],
            "processStatus": {
                "message": "成功",
                "status": "SUCCESS",
                "statusCode": "200"
            }
        }, {
            'A-Token': 'xxx'
        });
        //end  取得保險公司清單(暨檢核資料)

        //begin 取得信用卡授權資料
        $httpBackend.when('POST', /^api\/information\/credit*/).respond({
            "processStatus": {
                "status": "SUCCESS",
                "statusCode": "200",
                "message": "取得信用卡授權資料成功"
            },
            "bank": "富邦銀行",
            "cardNumber": "4938170100001213"
        }, {
            'A-Token': 'xxx'
        });
        //end 取得信用卡授權資料

        //begin 確定投保
        $httpBackend.when('POST', /^api\/validate\/insured*/).respond({
            "processStatus": {
                "status": "SUCCESS",
                "statusCode": "01005001",
                "message": "申請成功"
            }
        }, {
            'A-Token': 'xxx'
        });
        //end 確定投保
    }]);
})();


//control step status
//UIService
//UICompoent 
//control step for app