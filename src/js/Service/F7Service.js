define([
    'angular', 'framework7'
], function (ng, f7) {
    'use strict';
    var app = angular.module('ngf7');

    function F7Service() {
        var device = Framework7.prototype.device;
        // alert(device.os + "版本" + device.osVersion);
        var f7 = new Framework7({
            animateNavBackIcon: true,
            material: true,
            materialRipple: true,
            modalButtonOk: "確定",
            angular: true,
            pushState: false,
            allowDuplicateUrls: false,
            pushStateRoot: "",
            pushStateSeparator: "",

            pushStateOnLoad: false,
            uniqueHistory: false
        });
        this.views = [];
        this.getInstance = function () {
            return f7;
        };
        this.createDatePicker = function (pickerOptieon) {
            this.getInstance().picker(pickerOptieon);
        };
        this.addView = function (viewName, viewOption) {
            var view = f7.addView(viewName, viewOption);
            viewOption = viewOption || {
                dynamicNavbar: true,
                domCache: true
            };
            this.views.push(view);
            return view;
        };

    }
    app.service('F7Service', F7Service);
});