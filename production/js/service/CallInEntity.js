var myApp = angular.module('fubon.ta.callin.app');

myApp.service('CallInEntity', function () {

    // var fubonCookies = null;
    // this.setFubonCookies = function (data) {
    //     fubonCookies = angular.copy(data);
    // };
    // this.getFubonCookies = function (data) {
    //     return angular.copy(fubonCookies);
    // }

    // Authorization
    var authorization = null;
    this.setAuthorization = function (data) {
        authorization = angular.copy(data);
    };
    this.getAuthorization = function (data) {
        return angular.copy(authorization);
    }

    // urlType
    var urlType = null;
    this.setUrlType = function (data) {
        urlType = angular.copy(data);
    };
    this.getUrlType = function (data) {}

    // isMask
    var isMask = null;
    this.setIsMask = function (data) {
        isMask = angular.copy(data);
    };
    this.getIsMask = function (data) {}

    // token
    var token = null;
    this.setToken = function (data) {
        token = angular.copy(data);
    };
    this.getToken = function (data) {}


    /* begin API - 取得個人資料 */
    var customer = null;
    this.setCustomer = function (data) {
        customer = angular.copy(data);
    };
    this.getCustomer = function () {
        return angular.copy(customer);
    };
    this.getCallinNumber = function () {
        if (customer) {
            return customer.callInNumber;
        } else {
            return null;
        }
    };
    /* end API - 取得個人資料 */

    /* begin API - 取得被保險人資訊清單 */
    var customerInsured = null;
    var customerInsuredOption = null;
    this.setCustomerInsured = function (data) {
        customerInsured = angular.copy(data);
    };
    this.getCustomerInsured = function () {
        return angular.copy(customerInsured);
    };
    this.setCustomerInsuredOption = function (data) {
        customerInsuredOption = angular.copy(data);
    };
    this.getCustomerInsuredOption = function () {
        return angular.copy(customerInsuredOption);
    };
    /* end API - 取得被保險人資訊清單 */

    /* begin API - 取得旅遊地點清單 */
    var location = null;
    var locationOption = null;
    this.setLocation = function (data) {
        location = angular.copy(data);
    };
    this.getLocation = function () {
        return angular.copy(location);
    };
    this.setLocationOption = function (data) {
        locationOption = angular.copy(data);
    };
    this.getLocationOption = function () {
        return angular.copy(locationOption);
    };
    /* end API - 取得旅遊地點清單 */

    /* begin API - 重複投保檢核 */
    var validatePeriod = null;
    this.setValidatePeriod = function (data) {
        validatePeriod = angular.copy(data);
    };
    this.getValidatePeriod = function () {
        return angular.copy(validatePeriod);
    };
    /* end API - 重複投保檢核 */

    /* begin API-取得建議投保方案 */
    var proposal = null;
    this.setProposal = function (data) {
        proposal = angular.copy(data);
    };
    this.getProposal = function () {
        return proposal;
    };
    /* end API-取得建議投保方案 */

    /* begin API - 取得保險公司清單(暨檢核資料) */
    var company = null;
    this.setCompany = function (data) {
        company = angular.copy(data);
    };
    this.getCompany = function () {
        return angular.copy(company);
    };
    /* end API - 取得保險公司清單(暨檢核資料) */

    /* begin API - 取得信用卡授權資料 */
    var creditInformation = null;
    this.setCreditInformation = function (data) {
        creditInformation = angular.copy(data);
    };
    this.getCreditInformation = function () {
        return angular.copy(creditInformation);
    };
    /* end API - 取得信用卡授權資料 */

    /* begin API - 確認投保 */
    var insuredValidate = null;
    this.setInsuredValidate = function (data) {
        insuredValidate = angular.copy(data);
    };
    this.getInsuredValidate = function () {
        return angular.copy(insuredValidate);
    };
    /* end API - 確認投保 */

    /* begin API - 登入檢核 */
    var validateCustomer = null;
    this.setValidateCustomer = function (data) {
        validateCustomer = angular.copy(data);
    };
    this.getValidateCustomer = function () {
        return angular.copy(validateCustomer);
    };
    /* end API - 登入檢核 */




    // begin MRAndOHS1


    // end MRAndOHS1


    /* begin 保險資訊*/
    var tourismInfo = null;
    this.setTourismInfo = function (data) {
        tourismInfo = angular.copy(data);
    };
    this.getTourismInfo = function () {
        return angular.copy(tourismInfo);
    };
    /* end 保險資訊*/

    // begin 試算保費資訊
    var insuredInformations = null;
    this.setInsuredInformations = function (data) {
        insuredInformations = angular.copy(data);
    };
    this.getInsuredInformations = function () {
        return insuredInformations;
    };
    // end 試算保費資訊

    // begin 失敗人員名單

    var failureInsureds = null;

    this.setFailureInsureds = function (data) {
        failureInsureds = angular.copy(data);
    };
    this.getFailureInsureds = function () {
        return angular.copy(failureInsureds);
    };
    // end 失敗人員名單

    // begin 試算保費

    var premium = null;

    this.setPremium = function (data) {
        premium = angular.copy(data);
    };

    this.getPremium = function () {
        return angular.copy(premium);
    };
    // end 試算保費


    //最後保險資料
    var premiumData = null;

    this.setPremiumData = function (data) {
        premiumData = angular.copy(data);
    };

    this.getPremiumData = function () {
        return angular.copy(premiumData);
    };
    // end 最後保險資料


});