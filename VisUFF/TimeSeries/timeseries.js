'use strict';

var timeChart = {};

timeChart.margins = {top: 20, bottom: 20, left: 20, right: 20};
timeChart.width = 500;
timeChart.height = 400;


timeChart.appendSVG = function(){
    
    d3.select("mainDiv")
        .append('svg')
        .attr('width', timeChart.width + timeChart.margins.left + timeChart.margins.right)
        .attr('height', timeChart.height + timeChart.margins.bottom + timeChart.margins.top);
    
    
}


timeChart.run = function(){
    
    var svgRef = timeChart.appendSVG(DOMObj);
    
    
}