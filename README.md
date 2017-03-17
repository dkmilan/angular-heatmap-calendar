# angular-heatmap-calendar

angular-heatmap-calendar is a heatmap generator for angular.


![image](https://raw.github.com/dkmilan/angular-heatmap-calendar/resources/Jietu20170317-222654@2x.png)

## Usage

``` javascript
//import module
var app = angular.module('plunker', ['dk.ngHeatMapCal']);
```

``` xml
<heat-map-cal data="vm.randomDataMap" weeks="52" interval="8" tooltip-Formatter="vm.commitTooltipFormatter"></heat-map-cal>
```

### parameters

|parameter name|is require|data  description|
|--------------|----------|-----------------|
|data|true|a object that contains heat map data. see data format for more details|
|weeks|true|number of weeks to show|
|interval|true|interval of each color|
|tooltipFormatter|false|a formatter that accept date and heat-value, and return formatted tooltip text|
|mapStyle|false|style of map, available value are ```round```,```square```
|showLegend|false|should show legend component|
|showWeekLabel|false|should show week label|
|showMonthLabel|false|should show month Label|
