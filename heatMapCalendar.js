(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([ 'module', 'angular' ], function (module, angular) {
      module.exports = factory(angular);
    });
  } else if (typeof module === 'object') {
    module.exports = factory(require('angular'));
  } else {
    if (!root.dk) {
      root.dk = {};
    }

    root.dk.ngHeatMapCal = factory(root.angular);
  }
}(this, function (angular) {
  'use strict';
  return angular.module('dk.ngHeatMapCal', [])
    .directive('heatMapCal', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          weeks: '@',
          interval: '@',
          showLegend: '@?',
          showWeekLabel: '@?',
          showMonthLabel: '@?'
        },
        template: ''
        + '<table class="calendar">'
        + '  <tr ng-if="calendar.showMonthLabel">'
        + '    <th class="weekDayHeader"></th>'
        + '    <th class="monthHeader" ng-repeat="week in calendar.weeks">'
        + '      <span class="monthLabel" ng-if="calendar.isFirstWeekInMonth($index)">'
        + '       {{calendar.getMonthLabelInWeek($index)}}'
        + '      </span>'
        + '    </th>'
        + '  </tr>'
        + '  <tr ng-repeat="day in calendar.weekDays track by $index">'
        + '    <th class="header" ng-if="calendar.showWeekLabel">{{day}}</th>'
        + '    <td ng-repeat="week in calendar.weeks"'
        + '        ng-class="{day: calendar.isNotFuture($index, $parent.$index), hidden: !calendar.isNotFuture($index, $parent.$index)}"'
        + '        title="{{calendar.getNumOfCommits($index, $parent.$index)}} commits on {{calendar.getFormattedDate( $index, $parent.$index)}}"'
        + '        ng-style="{backgroundColor: calendar.getColorOfDay( $index, $parent.$index)}"'
        + '        day="{{calendar.getFormattedDate( $index, $parent.$index)}}"'
        + '        week="{{week}}">'
        + '    </td>'
        + '  </tr>'
        + '</table>'
        + '<div class="legend" ng-if="calendar.showLegend">'
        + '  <table class="legendTable">'
        + '    <tr>'
        + '      <td ng-repeat="color in calendar.colors" ng-style="{backgroundColor: color}"></td>'
        + '    </tr>'
        + '    <tr>'
        + '      <th class="legend-label" ng-repeat="color in calendar.colors track by $index" >'
        + '        <span>{{($index+1)*calendar.interval}}</span>'
        + '      </th>'
        + '    </tr>'
        + '  </table>'
        + '</div>',

        controller: function ($scope) {

          var today = moment().hours(0).minutes(0).seconds(0),
            colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
            weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dateFormat = 'YYYY-MM-DD'; //momentjs style

          var weekNumber = today.isoWeekYear();
          var weekNumArr = [];
          for (var i = 0; i < $scope.weeks; i++) {
            weekNumArr.push((i + weekNumber) % $scope.weeks + 1);
          }


          var getDateByWeekNumAndDay = function (weekNum, dayInWeek) {

            var todayMnt = moment().hours(0).minutes(0).seconds(0);
            var currentWeekIdx = $scope.weeks - 1; //current week is last week
            var weekDiff = currentWeekIdx - weekNum;
            var dayDiff = dayInWeek - todayMnt.day();

            var date = todayMnt.subtract(weekDiff, 'w').add(dayDiff, 'd');
            return date;
          };
          var interval = $scope.interval ? $scope.interval : 6;
          var showLegend = $scope.showLegend ? $scope.showLegend : true;
          var showWeekLabel = $scope.showWeekLabel ? $scope.showWeekLabel : true;
          var showMonthLabel = $scope.showMonthLabel ? $scope.showMonthLabel : true;
          $scope.calendar = {
            endWeekNumber: weekNumber,
            endDayInWeek: today.day(),
            weekDays: weekDays,
            weeks: weekNumArr,
            colors: colors,
            interval: interval,
            showLegend: showLegend,
            showWeekLabel: showWeekLabel,
            showMonthLabel: showMonthLabel,
            isNotFuture: function (weekNum, dayInWeek) {
              var days = today.day() + ($scope.weeks - weekNum - 1) * 7 - dayInWeek;
              return days >= 0;
            },
            getFormattedDate: function (weekNum, dayInWeek) {
              var date = getDateByWeekNumAndDay(weekNum, dayInWeek);
              var formattedDate = date.format(dateFormat);
              return formattedDate;
            },

            getNumOfCommits: function (weekNum, dayInWeek) {
              var date = getDateByWeekNumAndDay(weekNum, dayInWeek);
              //the statistic data from server is like { yyyy-MM-dd : 6 }
              var dayKey = date.format(dateFormat);

              var commitCount = $scope.mapData && $scope.mapData[dayKey] ? $scope.mapData[dayKey] : 0;
              return commitCount;
            },

            isFirstWeekInMonth: function (weekNum) {
              var saturday = getDateByWeekNumAndDay(weekNum, 6);
              var dateInMonth = saturday.date();
              return dateInMonth < 8;
            },

            getMonthLabelInWeek: function (weekNum) {
              var saturday = getDateByWeekNumAndDay(weekNum, 6);
              return saturday.format("MMM");
            },

            getColorOfDay: function (weekNum, dayInWeek) {
              var commitCount = this.getNumOfCommits(weekNum, dayInWeek);
              var color = '#ffffff';
              if (commitCount > 0) {
                var colorIndex = parseInt(commitCount / interval);
                if (colorIndex >= colors.length) {
                  colorIndex = colors.length - 1;
                }
                color = colors[colorIndex];
              }
              return color;
            }
          };

          $scope.$watch('data', function (mapData) {
            $scope.mapData = mapData;
          })
        }
      };
    })
    .name; // pass back as dependency name
}));
