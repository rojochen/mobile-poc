define([
    'angular', 'framework7'
], function (ng, f7) {
    'use strict';
    var app = angular.module('ngf7');
    var util7 = function () {
        return {
            //String and limit length
            padLeft: function (str, len) {
                str = '' + str;
                return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
            },
            padRight: function (str, len) {
                str = '' + str;
                return str.length >= len ? str : str + new Array(len - str.length + 1).join("0");
            },
            formatnumber: function (input) {

                return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            },
            changeYear: function (x) {
                var array = [];
                array = x.split(/-|:|\s/);

                if (array.length === 3) {
                    x = (parseInt(array[0]) + 1911) + '-' + array[1] + '-' + array[2];
                } else {
                    x = (parseInt(array[0]) + 1911) + '-' + array[1] + '-' + array[2] + ' ' + array[3] + ':' + array[4];
                }

                return x;
            }
        };
    };
    app.factory('util7', util7);
});