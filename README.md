# angular-heatmap-calendar

angular-heatmap-calendar is a heatmap generator for angular.


![image](https://raw.github.com/dkmilan/angular-heatmap-calendar/resources/Jietu20170317-222654@2x.png)

## Usage

``` shell
$ bower install angular-heatmap-calendar

$ npm install angular-heatmap-calendar
```

Then import angular-heatmap-calendar's js and css files into your project

``` HTML
<link rel="stylesheet" href="[Script-Path]/angular-heatmap-calendar/heatMapCalendar.css" />

<script src="[Script-Path]/moment/moment.js"></script>
<script src="[Script-Path]/angular/angular.min.js"></script>
<script src="[Script-Path]/angular-heatmap-calendar/heatMapCalendar.js"></script>

```

then import module ```dk.ngHeatMapCal``` in your angular application
``` javascript
//import module
var app = angular.module('plunker', ['dk.ngHeatMapCal']);
```

Use ```<heat-map-cal/>``` directive in your template
``` html
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


### examples
|parameter name|value|
|--------------|-----|
|mapStyle|round|
|showLegend|false|
|showWeekLabel|false|
|showMonthLabel|false|

![image](https://raw.github.com/dkmilan/angular-heatmap-calendar/resources/round-simple.png)

examples
|parameter name|value|
|--------------|-----|
|showLegend|true|
|showWeekLabel|true|
|showMonthLabel|true|

![image](https://raw.github.com/dkmilan/angular-heatmap-calendar/resources/square-legend-label.png)
