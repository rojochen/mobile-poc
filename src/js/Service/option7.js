define([
    'angular', 'framework7'
], function (ng, f7) {
    'use strict';
    var app = angular.module('ngf7');

    var Option7 = function (util7) {
        return {
            getYYYMMDDOption: function (domID) {
                return {
                    input: '#' + domID,
                    rotateEffect: true,
                    toolbarCloseText: '確認',
                    onChange: function (picker, values, displayValues) {
                        // changeDate(values[0], values[1]);
                        var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, 0).getDate();
                        if (values[2] > daysInMonth) {
                            picker.cols[2].setValue(daysInMonth);
                        }
                    },

                    formatValue: function (p, values, displayValues) {
                        // console.log(values);
                        // console.log(displayValues);
                        if (displayValues == '') {
                            displayValues[1] = values[1] + 1;
                        }
                        return values[0] + '-' + displayValues[1] + '-' + values[2];
                    },
                    value: [today.getFullYear() - 30, today.format('MM') - 1, today.format('dd')],
                    cols: [
                        // Years
                        {
                            values: (function () {
                                var arr = [];
                                for (var i = today.getFullYear() - 100; i <= today.getFullYear(); i++) {
                                    arr.push(i);
                                }
                                return arr;
                            })(),
                            cssClass: 'logodatecss'

                        },
                        // Months
                        {
                            values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                            // displayValues: ('一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月').split(' '),
                            // displayValues: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
                            displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),
                            // textAlign: 'left',
                            cssClass: 'logodatecss'

                        },
                        // Days
                        {
                            // values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                            cssClass: 'logodatecss'
                        }
                    ],
                    onClose: function (picker) {
                        if (picker.displayValue[0] && picker.displayValue[1] && picker.displayValue[2]) {
                            document.getElementById(domID).value = picker.displayValue[0] + '-' + picker.displayValue[1] + '-' + picker.displayValue[2];
                            document.getElementById(domID).parentElement.parentElement.classList.add('not-empty-state');
                        }
                    }
                };
            },
            getYYYMMDDHHOption: function (domID) {
                var today = new Date();
                return {
                    input: '#' + domID,
                    // container: '#picker-date-container',
                    // toolbar: false,
                    rotateEffect: true,
                    toolbarCloseText: '確認',
                    value: [today.getFullYear() - 1911, today.format('MM') - 1, today.format('dd'), today.format('hh')],

                    onChange: function (picker, values, displayValues) {
                        // changeDate(values[0], values[1]);
                        var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, 0).getDate();
                        if (values[2] > daysInMonth) {
                            picker.cols[2].setValue(daysInMonth);
                        }

                        var monthTime = new Date(today.getFullYear() - 1911, today.getMonth()).getTime();
                        var changeMonthTime = new Date(values[0], values[1]).getTime();
                        if (changeMonthTime < monthTime) {
                            picker.cols[1].setValue(today.format('MM') - 1);
                        }

                        var dateTime = new Date(today.getFullYear() - 1911, today.getMonth(), today.getDate()).getTime();
                        var changeDateTime = new Date(values[0], values[1], values[2]).getTime();
                        if (changeDateTime < dateTime) {
                            picker.cols[2].setValue(today.format('dd'));
                        }

                        var hoursTime = new Date(today.getFullYear() - 1911, today.getMonth(), today.getDate(), today.getHours()).getTime();
                        var changeHoursTime = new Date(values[0], values[1], values[2], values[3]).getTime();
                        if (changeHoursTime < hoursTime) {
                            picker.cols[4].setValue(today.format('hh'));
                        }
                    },

                    formatValue: function (p, values, displayValues) {
                        // console.log(values);
                        // console.log(displayValues);
                        if (displayValues == '') {
                            displayValues[1] = values[1] + 1;
                        }

                        return values[0] + '-' + util7.padLeft(displayValues[1].toString(), 2) + '-' + util7.padLeft(values[2], 2) + ' ' + values[3] + ':00';
                    },

                    cols: [
                        // Years
                        {
                            values: (function () {
                                var arr = [];
                                for (var i = today.getFullYear() - 1911; i <= today.getFullYear() - 1911 + 1; i++) {
                                    arr.push(i);
                                }
                                return arr;
                            })(),
                            cssClass: 'startdatecss'
                        },
                        // Months
                        {
                            values: ('0 01 02 03 04 05 06 07 08 09 10 11').split(' '),
                            // displayValues: ('一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月').split(' '),
                            // displayValues: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
                            displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),
                            // textAlign: 'left'
                            cssClass: 'startdatecss'
                        },
                        // Days
                        {
                            // values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                            cssClass: 'startdatecss'
                        },
                        // Space divider
                        {
                            divider: true,
                            content: '  '
                        },
                        // Hours
                        {
                            values: (function () {
                                var arr = [];
                                for (var i = 0; i <= 23; i++) {

                                    arr.push(util7.padLeft(i.toString(), 2));
                                }
                                return arr;
                            })(),
                            cssClass: 'startdatecss'
                        }
                    ],
                    onClose: function (picker) {
                        if (picker.displayValue[0] && picker.displayValue[1] && picker.displayValue[2] && picker.displayValue[3]) {
                            document.getElementById(domID).value = picker.displayValue[0] + '-' + picker.displayValue[1] + '-' + picker.displayValue[2] + ' ' + picker.displayValue[3] + ':00';
                            document.getElementById(domID).parentElement.parentElement.classList.add('not-empty-state');
                        }
                    }
                };
            },
            getCalendar: function (domID) {
                var today = new Date();
                return {
                    input: '#calendar-default',
                    rotateEffect: true,
                    toolbarCloseText: '確認',

                    onChange: function (picker, values, displayValues) {
                        // changeDate(values[0], values[1]);
                        var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, 0).getDate();
                        if (values[2] > daysInMonth) {
                            picker.cols[2].setValue(daysInMonth);
                        }
                    },
                    formatValue: function (p, values, displayValues) {
                        // console.log(values);
                        // console.log(displayValues);
                        if (displayValues == '') {
                            displayValues[1] = values[1] + 1;
                        }
                        return values[0] + '-' + displayValues[1] + '-' + values[2];
                    },
                    value: [today.getFullYear() - 1911 - 30, today.format('MM') - 1, today.format('dd')],
                    cols: [
                        // Years
                        {
                            values: (function () {
                                var arr = [];
                                for (var i = today.getFullYear() - 1911 - 100; i <= today.getFullYear() - 1911; i++) {
                                    arr.push(i);
                                }
                                return arr;
                            })(),
                            cssClass: 'logodatecss'

                        },
                        // Months
                        {
                            values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                            // displayValues: ('一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月').split(' '),
                            // displayValues: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
                            displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),
                            // textAlign: 'left',
                            cssClass: 'logodatecss'

                        },
                        // Days
                        {
                            // values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                            cssClass: 'logodatecss'
                        }
                    ],
                    onClose: function (picker) {
                        if (picker.displayValue[0] && picker.displayValue[1] && picker.displayValue[2]) {
                            document.getElementById('calendar-default').value = picker.displayValue[0] + '-' + picker.displayValue[1] + '-' + picker.displayValue[2];
                            document.getElementById('calendar-default').parentElement.parentElement.classList.add('not-empty-state');
                        }
                    }
                };
            },
            getItems: function (domID, item) {

            }
        };
    };
    Option7.$inject = ['util7'];
    app.factory('option7', Option7);

});