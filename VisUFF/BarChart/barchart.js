
'use strict';

var barChart = {};

barChart.dataset = dataGenerator.generateData(4, 6);

barChart.margin = {top: 20, bottom: 20, left: 20, right: 20};
barChart.width = 500;
barChart.height = 400;
barChart.xAxis      = undefined;
barChart.yAxis      = undefined;
barChart.xScale     = undefined;
barChart.yScale     = undefined;


barChart.appendSVG = function(DOMObj){
    
    var svg = d3.select(DOMObj)
                    .append('svg')
                    .attr('width', barChart.width + barChart.margin.left + barChart.margin.right)
                    .attr('height', barChart.height + barChart.margin.top + barChart.margin.bottom);
    return svg;
    
    
}

barChart.createAxes = function(DOMObj){
    
    
    
}

barChart.appendChartGroup = function(DOMObj){
    
    
}

barChart.functionTest = function(){
    
    var dataset = [
    {label:"Men", "Not Satisfied":20, "Not Much Satisfied":10, "Satisfied": 50, "Very Satisfied":20},
    {label:"Women", "Not Satisfied":15, "Not Much Satisfied":30, "Satisfied":40, "Very Satisfied":15}
];


var options = d3.keys(dataset[0]).filter(
                                    function(key){ 
                                        return key !== "label"; 
                                    });

dataset.forEach(function(d) {
    d.valores = options.map(function(name) { return {name: name, value: +d[name]}; });
    console.log(d);
});
    
}


barChart.start = function(){
    
    var mainSVG = barChart.appendSVG("#mainDiv");
    var svgGroup = barChart.appendChartGroup(mainSVG);
    barChart.functionTest();
    
}

window.onload = barChart.start();