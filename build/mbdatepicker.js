'use strict';

/**
  * By Mo Binni
 */
var app;

app = angular.module('materialDatePicker', []);

app.filter('capitalize', [
  function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    };
  }
]);

app.directive("outsideClick", [
  '$document', '$parse', function($document, $parse) {
    return {
      link: function($scope, $element, $attributes) {
        var onDocumentClick, scopeExpression;
        scopeExpression = $attributes.outsideClick;
        onDocumentClick = function(event) {
          var isChild;
          isChild = $element.find(event.target.tagName).length > 0;
          if (!isChild) {
            $scope.$apply(scopeExpression);
          }
        };
        $document.on("click", onDocumentClick);
        $element.on("$destroy", function() {
          $document.off("click", onDocumentClick);
        });
      }
    };
  }
]);

app.directive('mbDatepicker', [
  '$filter', function($filter) {
    return {
      scope: {
        elementId: '@',
        date: '=',
        dateFormat: '@',
        minDate: '@',
        maxDate: '@',
        inputClass: '@',
        inputName: '@',
        arrows: '=?',
        calendarHeader: '=?',
        isRequired: '@ngRequired',
        config: '='
      },
      template: '<div id="dateSelectors" class="date-selectors"  outside-click="hidePicker()"> <input name="{{ inputName }}" type="text" class="mb-input-field"  ng-click="showPicker()"  class="form-control"  ng-model="date" ng-required="isRequired"> <div class="mb-datepicker" ng-show="isVisible"> <div class="mb-table-header-bckgrnd" ng-style="{\'background-color\': params.color1 }"></div> <table> <caption> <div class="header-year-wrapper"> <span style="display: inline-block; float: left; cursor: pointer" class="noselect" ng-click="previousMonth(currentDate)"><img style="height: 10px;" ng-src="{{ arrows.year.left }}"/></span> <div class="header-year noselect" ng-class="noselect"> <div class="mb-custom-select-box"> <span class="mb-custom-select-title" ng-click="showMonthsList = true; showYearsList = false" ng-style="{ \'border-color\': params.color1 }">{{ month }}</span> <div class="mb-custom-select" ng-show="showMonthsList" ng-style="{ \'background-color\': params.color1 }"> <span ng-repeat="monthName in monthsList" ng-click="selectMonth(monthName)">{{ monthName }}</span> </div> </div><div class="mb-custom-select-box"> <span class="mb-custom-select-title" ng-click="showYearsList = true; showMonthsList = false" ng-style="{ \'border-color\': params.color1 }">{{ year }}</span> <div class="mb-custom-select" ng-show="showYearsList"  ng-style="{ \'background-color\': params.color1 }"> <span ng-repeat="yearNumber in yearsList" ng-click="selectYear(yearNumber)">{{ yearNumber }}</span> </div> </div> </div> <span style="display: inline-block; float: right; cursor: pointer" class="noselect" ng-click="nextMonth(currentDate)"><img style="height: 10px;" ng-src="{{ arrows.year.right }}"/></span> </div> </caption> <tbody> <tr class="days-head"> <td class="day-head">{{ calendarHeader.monday }}</td> <td class="day-head">{{ calendarHeader.tuesday }}</td> <td class="day-head">{{ calendarHeader.wednesday }}</td> <td class="day-head">{{ calendarHeader.thursday }}</td> <td class="day-head">{{ calendarHeader.friday }}</td> <td class="day-head">{{ calendarHeader.saturday }}</td> <td class="day-head">{{ calendarHeader.sunday }}</td> </tr> <tr class="days" ng-repeat="week in weeks"> <td ng-click="selectDate(day)" class="noselect" ng-class="[day.class, {\'day-selected\': isDaySelected(day)}]" ng-repeat="day in week">{{ day.value.format(\'DD\') }}</td> </tr> </tbody> </table> </div> </div>',
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attrs) {
        var getWeeks, init, selectors, today, year;
        scope.params = {
          color1: '#15a5db'
        };
        angular.extend(scope.params, scope.config);
        selectors = document.querySelector('#dateSelectors');
        today = moment();
        scope.month = '';
        scope.year = today.year();
        scope.monthsList = moment.months();
        scope.yearsList = (function() {
          var j, ref, results;
          results = [];
          for (year = j = 2005, ref = moment().year(); 2005 <= ref ? j <= ref : j >= ref; year = 2005 <= ref ? ++j : --j) {
            results.push(year);
          }
          return results;
        })();
        console.log(scope.maxDate);
        if (scope.inputClass) {
          selectors.className = selectors.className + " " + scope.inputClass;
        }
        if (!scope.dateFormat) {
          scope.dateFormat = "YYYY-MM-DD";
        }
        if (scope.minDate) {
          scope.minDate = moment(scope.minDate, scope.dateFormat);
        }
        if (scope.maxDate) {
          scope.maxDate = moment(scope.maxDate, scope.dateFormat);
        }
        if (!scope.calendarHeader) {
          scope.calendarHeader = {
            monday: $filter('date')(new Date(moment().isoWeekday(1)), 'EEE'),
            tuesday: $filter('date')(new Date(moment().isoWeekday(2)), 'EEE'),
            wednesday: $filter('date')(new Date(moment().isoWeekday(3)), 'EEE'),
            thursday: $filter('date')(new Date(moment().isoWeekday(4)), 'EEE'),
            friday: $filter('date')(new Date(moment().isoWeekday(5)), 'EEE'),
            saturday: $filter('date')(new Date(moment().isoWeekday(6)), 'EEE'),
            sunday: $filter('date')(new Date(moment().isoWeekday(7)), 'EEE')
          };
        }
        console.log(scope.maxDate);
        scope.$watch('maxDate', function(val) {
          return console.log(val);
        });
        if (!scope.arrows) {
          scope.arrows = {
            year: {
              left: 'images/white_arrow_left.svg',
              right: 'images/white_arrow_right.svg'
            },
            month: {
              left: 'images/grey_arrow_left.svg',
              right: 'images/grey_arrow_right.svg'
            }
          };
        }
        getWeeks = function(monthLength, startDay, month) {
          var chunk_size, day, initialStartDay, j, monthDays, newDate, ref, start, weeks;
          monthDays = [];
          initialStartDay = moment(startDay);
          if (initialStartDay.date() === 25) {
            initialStartDay.date(32);
            monthLength -= 7;
          }
          for (day = j = 0, ref = monthLength; 0 <= ref ? j <= ref : j >= ref; day = 0 <= ref ? ++j : --j) {
            start = moment(initialStartDay);
            newDate = start.add(day, 'd');
            if (scope.minDate && moment(newDate, scope.dateFormat) <= moment(scope.minDate, scope.dateFormat)) {
              monthDays.push({
                value: newDate,
                isToday: true,
                isEnabled: false,
                "class": 'disabled'
              });
            } else if (scope.maxDate && moment(newDate, scope.dateFormat) >= moment(scope.maxDate, scope.dateFormat)) {
              monthDays.push({
                value: newDate,
                isToday: true,
                isEnabled: false,
                "class": 'disabled'
              });
            } else if (newDate.format(scope.dateFormat) === moment().format(scope.dateFormat)) {
              monthDays.push({
                value: newDate,
                isToday: true,
                isEnabled: true,
                "class": 'day-item today'
              });
            } else if (newDate.month() === month) {
              monthDays.push({
                value: newDate,
                isToday: false,
                isEnabled: true,
                "class": 'day-item day'
              });
            } else if (newDate.day() === 0 || newDate.day() === 6) {
              monthDays.push({
                value: newDate,
                isToday: false,
                isEnabled: true,
                "class": 'day-item weekend'
              });
            } else {
              monthDays.push({
                value: newDate,
                isToday: false,
                isEnabled: true,
                "class": 'day-item'
              });
            }
          }
          chunk_size = 7;
          weeks = monthDays.map(function(e, i) {
            if (i % chunk_size === 0) {
              return monthDays.slice(i, i + chunk_size);
            } else {
              return null;
            }
          }).filter(function(e) {
            return e;
          });
          if (weeks) {
            return weeks;
          } else {
            return [];
          }
        };
        scope.nextMonth = function(date) {
          var first_day, last_day, next_month;
          next_month = moment(date).date(0);
          last_day = moment(next_month).add(4, 'months').date(0);
          scope.year = last_day.year();
          if (0 < last_day.day() && last_day.day() !== 7) {
            last_day = last_day.add(7 - last_day.day(), 'days');
          }
          first_day = moment(next_month).add(2, 'months').startOf('isoweek');
          scope.currentDate = first_day;
          scope.weeks = [];
          scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, next_month.add(3, 'months').month());
          return scope.month = $filter('date')(new Date(next_month), 'MMMM');
        };
        scope.previousMonth = function(date) {
          var first_day, last_day, last_month;
          last_month = moment(date).date(0);
          last_day = moment(last_month).add(2, 'months').date(0);
          scope.year = last_day.year();
          if (0 < last_day.day() && last_day.day() !== 7) {
            last_day = last_day.add(7 - last_day.day(), 'days');
          }
          first_day = moment(last_month).startOf('isoweek');
          scope.currentDate = first_day;
          scope.weeks = [];
          scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, last_month.add(1, 'months').month());
          return scope.month = $filter('date')(new Date(last_month), 'MMMM');
        };
        scope.selectMonth = function(monthName) {
          var first_day, last_day, last_month;
          scope.showMonthsList = scope.showYearsList = false;
          last_month = moment(scope.currentDate).month(monthName).date(0);
          last_day = moment(last_month).add(2, 'months').date(0);
          first_day = moment(last_month).startOf('isoweek');
          scope.year = last_day.year();
          if (0 < last_day.day() && last_day.day() !== 7) {
            last_day = last_day.add(7 - last_day.day(), 'days');
          }
          scope.currentDate = first_day;
          scope.weeks = [];
          scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, last_month.add(1, 'months').month());
          return scope.month = $filter('date')(new Date(last_month), 'MMMM');
        };
        scope.nextYear = function(date) {
          var first_day, last_day, next_month;
          next_month = moment(date).date(0);
          last_day = moment(next_month).add(1, 'year').add(3, 'months').date(0);
          scope.year = last_day.year();
          if (0 < last_day.day() && last_day.day() !== 7) {
            last_day = last_day.add(7 - last_day.day(), 'days');
          }
          first_day = moment(next_month).add(1, 'years').add(1, 'months').startOf('isoweek');
          scope.currentDate = first_day;
          scope.weeks = [];
          scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, next_month.add(2, 'months').month());
          return scope.month = $filter('date')(new Date(next_month), 'MMMM');
        };
        scope.previousYear = function(date) {
          var first_day, last_day, last_month;
          last_month = moment(date).date(0);
          last_day = moment(last_month).subtract(1, 'years').add(3, 'months').date(0);
          scope.year = last_day.year();
          if (0 < last_day.day() && last_day.day() !== 7) {
            last_day = last_day.add(7 - last_day.day(), 'days');
          }
          first_day = moment(last_month).subtract(1, 'years').add(1, 'months').startOf('isoweek');
          scope.currentDate = first_day;
          scope.weeks = [];
          scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, last_month.add(2, 'months').month());
          return scope.month = $filter('date')(new Date(last_month), 'MMMM');
        };
        scope.selectYear = function(yearName) {
          var first_day, last_day, last_month;
          scope.showMonthsList = scope.showYearsList = false;
          last_month = moment(scope.currentDate).year(yearName).date(moment(scope.currentDate).year(yearName).daysInMonth());
          last_day = moment(last_month).add(2, 'months').date(0);
          first_day = moment(last_month).startOf('isoweek');
          scope.year = last_day.year();
          if (0 < last_day.day() && last_day.day() < 7) {
            last_day = last_day.add(7 - last_day.day(), 'days');
          }
          scope.currentDate = first_day;
          scope.weeks = [];
          scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, last_month.add(1, 'months').month());
          return scope.month = $filter('date')(new Date(last_month), 'MMMM');
        };
        scope.selectDate = function(day) {
          if (day.isEnabled) {
            scope.date = day.value.format(scope.dateFormat);
            return scope.isVisible = false;
          }
        };
        scope.isVisible = false;
        scope.showPicker = function() {
          scope.isVisible = true;
        };
        scope.hidePicker = function() {
          scope.isVisible = scope.showMonthsList = scope.showYearsList = false;
        };
        scope.isDaySelected = function(day) {
          return day.value.isSame(moment(scope.date), 'day');
        };
        init = function() {
          var days, endDate, firstMonday;
          firstMonday = moment(moment().date(today.month())).startOf('isoweek');
          if (firstMonday.format('DD') !== '01') {
            firstMonday.subtract(1, 'weeks');
          }
          days = moment(moment().date(today.month())).daysInMonth();
          endDate = moment().add(1, 'months').date(0);
          scope.month = $filter('date')(new Date(endDate), 'MMMM');
          if (endDate.day() !== 7) {
            endDate = endDate.add(7 - endDate.day(), 'days');
          }
          scope.currentDate = firstMonday;
          return scope.weeks = getWeeks(endDate.diff(firstMonday, 'days'), firstMonday, today.month());
        };
        return init();
      }
    };
  }
]);
