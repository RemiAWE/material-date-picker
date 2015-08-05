'use strict'

###*
 # By Mo Binni
###
app = angular.module('materialDatePicker', [])

app.filter('capitalize', [ ->
    return (input) ->
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase()

])
app.directive("outsideClick", ['$document', '$parse', ($document, $parse) ->
  link: ($scope, $element, $attributes) ->
    scopeExpression = $attributes.outsideClick
    onDocumentClick = (event) ->
      isChild = $element.find(event.target.tagName).length > 0;
      $scope.$apply scopeExpression  unless isChild
      return

    $document.on "click", onDocumentClick
    $element.on "$destroy", ->
      $document.off "click", onDocumentClick
      return
    return
])
app.directive('mbDatepicker', ['$filter', ($filter)->
  scope: {
    elementId: '@',
    date: '=',
    dateFormat: '@'
    minDate: '@'
    maxDate: '@'
    inputClass: '@'
    inputName: '@'
    arrows: '=?'
    calendarHeader: '=?'
    isRequired: '@ngRequired'
    userConfig: '=config'
  }
  template: '
            <div id="dateSelectors" class="date-selectors"  outside-click="hidePicker()">
                    <input name="{{ inputName }}" type="text" class="mb-input-field"  ng-click="showPicker()"  class="form-control"  ng-model="date" ng-required="isRequired">
                    <div class="mb-datepicker" ng-show="isVisible">
                        <div class="mb-table-header-bckgrnd" ng-style="{\'background-color\': params.color1 }"></div>
                        <table>
                            <caption>
                                <div class="header-year-wrapper">
                                    <span style="display: inline-block; float: left; cursor: pointer" class="noselect" ng-click="previousMonth(currentDate)"><img style="height: 10px;" ng-src="{{ arrows.year.left }}"/></span>
                                    <div class="header-year noselect" ng-class="noselect">
                                        <div class="mb-custom-select-box">
                                            <span class="mb-custom-select-title mb-month-name" ng-click="showMonthsList = true; showYearsList = false" ng-style="{ \'border-color\': params.color1 }">{{ month }}</span>
                                            <div class="mb-custom-select" ng-show="showMonthsList" ng-style="{ \'background-color\': params.color1 }">
                                                <span ng-repeat="monthName in monthsList" ng-click="selectMonth(monthName)">{{ monthName }}</span>
                                            </div>
                                        </div><div class="mb-custom-select-box">
                                            <span class="mb-custom-select-title" ng-click="showYearsList = true; showMonthsList = false" ng-style="{ \'border-color\': params.color1 }">{{ year }}</span>
                                            <div class="mb-custom-select" ng-show="showYearsList"  ng-style="{ \'background-color\': params.color1 }">
                                                <span ng-repeat="yearNumber in yearsList" ng-click="selectYear(yearNumber)">{{ yearNumber }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span style="display: inline-block; float: right; cursor: pointer" class="noselect" ng-click="nextMonth(currentDate)"><img style="height: 10px;" ng-src="{{ arrows.year.right }}"/></span>
                                </div>
                            </caption>
                            <tbody>
                              <tr class="days-head">
                                <td class="day-head">{{ calendarHeader.monday }}</td>
                                <td class="day-head">{{ calendarHeader.tuesday }}</td>
                                <td class="day-head">{{ calendarHeader.wednesday }}</td>
                                <td class="day-head">{{ calendarHeader.thursday }}</td>
                                <td class="day-head">{{ calendarHeader.friday }}</td>
                                <td class="day-head">{{ calendarHeader.saturday }}</td>
                                <td class="day-head">{{ calendarHeader.sunday }}</td>
                              </tr>
                              <tr class="days" ng-repeat="week in weeks">
                                <td ng-click="selectDate(day)" class="noselect" ng-class="[day.class, {\'day-selected\': isDaySelected(day)}]" ng-repeat="day in week">{{ day.value.format(\'DD\') }}</td>
                              </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
'
  restrict: 'E',
  transclude: true,
  link: (scope, element, attrs) ->

    scope.params =
      color1: '#15a5db'

    angular.extend(scope.params, scope.userConfig)

    # Vars
    selectors = document.querySelector('#dateSelectors')
    today = moment()
    scope.month = ''
    scope.year = today.year()
    scope.monthsList = moment.months()
    scope.yearsList = (year for year in [2005..moment().year()])

    # Casual definition
    if scope.inputClass then selectors.className = selectors.className + " " + scope.inputClass
    if !scope.dateFormat then scope.dateFormat = "YYYY-MM-DD"
    if scope.minDate then scope.minDate = moment(scope.minDate, scope.dateFormat)
    if scope.maxDate then scope.maxDate = moment(scope.maxDate, scope.dateFormat)
    if !scope.calendarHeader then scope.calendarHeader = {
      monday: $filter('date')( new Date(moment().isoWeekday(1)), 'EEE'),
      tuesday: $filter('date')( new Date(moment().isoWeekday(2)), 'EEE'),
      wednesday: $filter('date')( new Date(moment().isoWeekday(3)), 'EEE'),
      thursday: $filter('date')( new Date(moment().isoWeekday(4)), 'EEE'),
      friday: $filter('date')( new Date(moment().isoWeekday(5)), 'EEE'),
      saturday: $filter('date')( new Date(moment().isoWeekday(6)), 'EEE'),
      sunday: $filter('date')( new Date(moment().isoWeekday(7)), 'EEE'),
    }

    if !scope.arrows then scope.arrows = {
      year: {
        left: 'images/white_arrow_left.svg',
        right: 'images/white_arrow_right.svg'
      },
      month: {
        left: 'images/grey_arrow_left.svg',
        right: 'images/grey_arrow_right.svg'
      }
    }

    # Datepicker logic to get weeks
    getWeeks = (monthLength, startDay, month) ->
      monthDays = []
      initialStartDay = moment(startDay)
      if(initialStartDay.date() == 25)
        initialStartDay.date(32)
        monthLength -= 7
      # Iterate over other dates
      for day in [0..monthLength]
        start = moment(initialStartDay)
        newDate = start.add(day, 'd')
        if(scope.minDate and moment(newDate, scope.dateFormat) <= moment(scope.minDate, scope.dateFormat))
          monthDays.push({value: newDate, isToday: true, isEnabled: false, class: 'disabled'})
        else if(scope.maxDate and moment(newDate, scope.dateFormat) >= moment(scope.maxDate, scope.dateFormat))
          monthDays.push({value: newDate, isToday: true, isEnabled: false, class: 'disabled'})
        else if newDate.format(scope.dateFormat) == moment().format(scope.dateFormat)
          monthDays.push({value: newDate, isToday: true, isEnabled: true, class: 'day-item today'})
        else if(newDate.month() == month)
          monthDays.push({value: newDate, isToday: false, isEnabled: true, class: 'day-item day'})
        else if(newDate.day() == 0 || newDate.day() == 6)
          monthDays.push({value: newDate, isToday: false, isEnabled: true, class: 'day-item weekend'})
        else
          monthDays.push({value: newDate, isToday: false, isEnabled: true, class: 'day-item'})
      chunk_size = 7;

      # Map reduce by 7 days per week
      weeks = monthDays.map((e, i) ->
        if i % chunk_size == 0 then monthDays.slice(i, i + chunk_size)
        else null;
      ).filter((e) ->
        return e;
      );
      if weeks then return weeks
      else return []

    # Logic to get the following month
    scope.nextMonth = (date) ->
      next_month = moment(date).date(0)
      last_day = moment(next_month).add(4, 'months').date(0)
      scope.year = last_day.year()
      if(0 < last_day.day() && last_day.day() != 7)
        last_day = last_day.add(7 - last_day.day(), 'days')
      first_day = moment(next_month).add(2, 'months').startOf('isoweek')
      scope.currentDate = first_day
      scope.weeks = []
      scope.weeks = getWeeks(
        last_day.diff(first_day, 'days'),
        first_day,
        next_month.add(3, 'months').month()
      )
      scope.month = $filter('date')( new Date(next_month), 'MMMM' )

    # Logic to get the previous month
    scope.previousMonth = (date) ->
      last_month = moment(date).date(0)
      last_day = moment(last_month).add(2, 'months').date(0)
      scope.year = last_day.year()
      if(0 < last_day.day() && last_day.day() != 7)
        last_day = last_day.add(7 - last_day.day(), 'days')
      first_day = moment(last_month).startOf('isoweek')
      scope.currentDate = first_day
      scope.weeks = []
      scope.weeks = getWeeks(
        last_day.diff(first_day, 'days'),
        first_day,
        last_month.add(1, 'months').month()
      )
      scope.month = $filter('date')( new Date(last_month), 'MMMM' )

    # Logic to select a month
    scope.selectMonth = (monthName) ->
      scope.showMonthsList = scope.showYearsList = false # Ferme les menus
      last_month = moment(scope.currentDate).month(monthName).date(0)
      last_day   = moment(last_month).add(2, 'months').date(0)
      first_day  = moment(last_month).startOf('isoweek')
      scope.year  = last_day.year()
      if(0 < last_day.day() && last_day.day() != 7)
        last_day = last_day.add(7 - last_day.day(), 'days')
      scope.currentDate = first_day;
      scope.weeks = []
      scope.weeks = getWeeks(
        last_day.diff(first_day, 'days'),
        first_day,
        last_month.add(1, 'months').month()
      )
      scope.month = $filter('date')( new Date(last_month), 'MMMM' )

    # Logic to get the next year
    scope.nextYear = (date) ->
      next_month = moment(date).date(0)
      last_day = moment(next_month).add(1, 'year').add(3, 'months').date(0)
      scope.year = last_day.year()
      if(0 < last_day.day() && last_day.day() != 7)
        last_day = last_day.add(7 - last_day.day(), 'days')
      first_day = moment(next_month).add(1, 'years').add(1, 'months').startOf('isoweek')
      scope.currentDate = first_day
      scope.weeks = []
      scope.weeks = getWeeks(
        last_day.diff(first_day, 'days'),
        first_day,
        next_month.add(2, 'months').month()
      )
      scope.month = $filter('date')( new Date(next_month), 'MMMM' )

    # Logic to get the previous year
    scope.previousYear = (date) ->
      last_month = moment(date).date(0)
      last_day = moment(last_month).subtract(1, 'years').add(3, 'months').date(0)
      scope.year = last_day.year()
      if(0 < last_day.day() && last_day.day() != 7)
        last_day = last_day.add(7 - last_day.day(), 'days')
      first_day = moment(last_month).subtract(1, 'years').add(1, 'months').startOf('isoweek')
      scope.currentDate = first_day
      scope.weeks = []
      scope.weeks = getWeeks(
        last_day.diff(first_day, 'days'),
        first_day,
        last_month.add(2, 'months').month()
      )
      scope.month = $filter('date')( new Date(last_month), 'MMMM' )

    # Logic to select a year
    scope.selectYear = (yearName) ->
      scope.showMonthsList = scope.showYearsList = false # Ferme les menus
      last_month = moment(scope.currentDate).year(yearName).date(moment(scope.currentDate).year(yearName).daysInMonth())
      last_day   = moment(last_month).add(2, 'months').date(0)
      first_day  = moment(last_month).startOf('isoweek')
      scope.year  = last_day.year()
      if(0 < last_day.day() && last_day.day() < 7)
        last_day = last_day.add(7 - last_day.day(), 'days')
      scope.currentDate = first_day;
      scope.weeks = []
      scope.weeks = getWeeks(
        last_day.diff(first_day, 'days'),
        first_day,
        last_month.add(1, 'months').month()
      )
      scope.month = $filter('date')( new Date(last_month), 'MMMM' )

    # Logic to hide the view if a date is selected
    scope.selectDate = (day) ->
      if day.isEnabled
        scope.date = day.value.format(scope.dateFormat)
        scope.isVisible = false;


    scope.isVisible = false
    scope.showPicker = ->
      scope.isVisible = true
      return

    scope.hidePicker = ->
      scope.isVisible = scope.showMonthsList = scope.showYearsList = false
      return

    scope.isDaySelected = (day) ->
        console.log(day.value.isSame(moment(scope.date, scope.dateFormat), 'day'))
        return day.value.isSame(moment(scope.date, scope.dateFormat), 'day')

    init = ->
# First day of month
      firstMonday = moment(moment().date(today.month())).startOf('isoweek')
      if(firstMonday.format('DD') != '01') then firstMonday.subtract(1, 'weeks')

      # No. of days in month
      days = moment(moment().date(today.month())).daysInMonth()

      # Last day of month
      endDate = moment().add(1, 'months').date(0);
      scope.month = $filter('date')( new Date(endDate), 'MMMM' )

      # Check if last date is sunday, else add days to get to Sunday
      if(endDate.day() != 7)
        endDate = endDate.add(7 - endDate.day(), 'days')

      scope.currentDate = firstMonday
      scope.weeks = getWeeks(
# No. of days in a month from sunday to sunday
        endDate.diff(firstMonday, 'days'),
        firstMonday,
        today.month()
      )
    init()


])
