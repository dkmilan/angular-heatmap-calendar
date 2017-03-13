var app = angular.module('plunker', ['dk.ngHeatMapCal']);

app.controller('MainCtrl', function($scope, $timeout) {
  var self = this;
  this.name = 'World';
  this.today = moment();
  var mapData = {}
  $timeout(function(){
      for (var i=0; i<365; i++)
      {
        var date = moment().subtract(i, 'd').format("YYYY-MM-DD");
        self.map[date] = parseInt(Math.random() * 50);
      }
  }, 1500)

  this.map = mapData;
  this.commitTooltipFormatter = function(date, numberOfCommits){
  	return numberOfCommits + ' commits in ' + date.format("YYYY-MM-DD");
  }
  $timeout(function(){
      var map = {};
      for (var i=0; i<365; i++)
      {
        var date = moment().subtract(i, 'd').format("YYYY-MM-DD");
        map[date] = parseInt(Math.random() * 50);
      }
      return map;
  }, 1500).then(function(map){
      self.randomDataMap = map;
  })
});
