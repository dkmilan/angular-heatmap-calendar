var app = angular.module('plunker', ['dk.ngHeatMapCal']);

app.controller('MainCtrl', function() {
  this.name = 'World';
  this.today = moment();
  var mapData = {}
  for (var i=0; i<365; i++)
  {
	var date = moment().subtract(i, 'd').format("YYYY-MM-DD");
	mapData[date] = parseInt(Math.random() * 50);
  }
  this.map = mapData;
  this.commitTooltipFormatter = function(date, numberOfCommits){
  	return numberOfCommits + ' commits in ' + date.format("YYYY-MM-DD");
  }
});
