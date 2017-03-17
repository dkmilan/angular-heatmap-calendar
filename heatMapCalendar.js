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
        scope: {},
        bindToController: {
          mapData: '=data',
          weeks: '@',
          interval: '@',
          tooltipFormatter: '&',
          mapStyle: '@?',
          showLegend: '=?',
          showWeekLabel: '=?',
          showMonthLabel: '=?'
        },
        controllerAs: 'ctrl',
        template: ''
        + '<table class="{{ctrl.mapClasses}}">'
        + '  <tr ng-if="ctrl.calendar.showMonthLabel">'
        + '    <th class="weekDayHeader"></th>'
        + '    <th class="monthHeader" ng-repeat="week in ctrl.calendar.weeks">'
        + '      <span class="monthLabel" ng-if="ctrl.calendar.isFirstWeekInMonth($index)">'
        + '       {{ctrl.calendar.getMonthLabelInWeek($index)}}'
        + '      </span>'
        + '    </th>'
        + '  </tr>'
        + '  <tr ng-repeat="day in ctrl.calendar.weekDays track by $index">'
        + '    <th class="weekDayHeader" ng-if="ctrl.calendar.showWeekLabel">{{day}}</th>'
        + '    <td ng-repeat="week in ctrl.calendar.weeks"'
        + '        ng-class="{day: ctrl.calendar.isNotFuture($index, $parent.$index), hidden: !ctrl.calendar.isNotFuture($index, $parent.$index)}"'
        + '        title="{{ctrl.calendar.getTooltip($index, $parent.$index)}}"'
        + '        ng-style="{backgroundColor: ctrl.calendar.getColorOfDay( $index, $parent.$index)}"'
        + '        day="{{ctrl.calendar.getFormattedDate( $index, $parent.$index)}}"'
        + '        week="{{week}}">'
        + '    </td>'
        + '  </tr>'
        + '</table>'
        + '<div class="legend" ng-if="ctrl.calendar.showLegend">'
        + '  <table class="legendTable">'
        + '    <tr>'
        + '      <td ng-repeat="color in ctrl.calendar.colors" ng-style="{backgroundColor: color}"></td>'
        + '    </tr>'
        + '    <tr>'
        + '      <th class="legend-label" ng-repeat="color in ctrl.calendar.colors track by $index" >'
        + '        <span>{{($index+1)*ctrl.calendar.interval}}</span>'
        + '      </th>'
        + '    </tr>'
        + '  </table>'
        + '</div>',
        controller: function () {

          var self = this,
            today = moment().hours(0).minutes(0).seconds(0),
            colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
            weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            dateFormat = 'YYYY-MM-DD'; //momentjs style

          var weekNumber = today.isoWeekYear();
          var weekNumArr = [];
          for (var i = 0; i < self.weeks; i++) {
            weekNumArr.push((i + weekNumber) % self.weeks + 1);
          }

          self.mapClasses = self.mapStyle?'calendar '+self.mapStyle:'calendar';

          var getDateByWeekNumAndDay = function (weekNum, dayInWeek) {

            var todayMnt = moment().hours(0).minutes(0).seconds(0);
            var currentWeekIdx = self.weeks - 1; //current week is last week
            var weekDiff = currentWeekIdx - weekNum;
            var dayDiff = dayInWeek - todayMnt.day();

            var date = todayMnt.subtract(weekDiff, 'w').add(dayDiff, 'd');
            return date;
          };
          var interval = self.interval ? self.interval : 6;
          var showLegend = self.showLegend!=undefined ? self.showLegend : true;
          var showWeekLabel = self.showWeekLabel!=undefined ? self.showWeekLabel : true;
          var showMonthLabel = self.showMonthLabel!=undefined ? self.showMonthLabel : true;

          self.calendar = {
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
              var days = today.day() + (self.weeks - weekNum - 1) * 7 - dayInWeek;
              return days >= 0;
            },
            getFormattedDate: function (weekNum, dayInWeek) {
              var date = getDateByWeekNumAndDay(weekNum, dayInWeek);
              var formattedDate = date.format(dateFormat);
              return formattedDate;
            },

            getHeatValue: function (weekNum, dayInWeek) {

              var date = getDateByWeekNumAndDay(weekNum, dayInWeek);
              //the statistic data from server is like { yyyy-MM-dd : 6 }
              var dayKey = date.format(dateFormat);
              //console.log(dayKey);
              var commitCount = self.mapData && self.mapData[dayKey] ? self.mapData[dayKey] : 0;
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

            getTooltip: function (weekNum, dayInWeek) {
              var numberOfCommits = this.getHeatValue(weekNum, dayInWeek);
              var date = getDateByWeekNumAndDay(weekNum, dayInWeek);
              if (self.tooltipFormatter && angular.isFunction(self.tooltipFormatter())){
                  return self.tooltipFormatter()(date, numberOfCommits);
              } else {
                  return 'Heat: ' + numberOfCommits + ' in ' + date.format(dateFormat);
              }
            },
            getColorOfDay: function (weekNum, dayInWeek) {
              var commitCount = this.getHeatValue(weekNum, dayInWeek);
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
        }
      };
    })
    .name; // pass back as dependency name
}));
