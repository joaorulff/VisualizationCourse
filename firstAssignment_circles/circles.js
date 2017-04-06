'use strict';

var myChart = {};
myChart.width = 1000;
myChart.height = 300;
myChart.dataset =  [[5, 20], [480, 90], [250, 50], [100, 33], [330, 95], [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]];



myChart.appendSvg = function(domObj, x, y, width, height){
    
   var svgNode =  d3.select(domObj)
                    .append("svg")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", width)
                    .attr("height", height);
    
    return svgNode;
}

myChart.appendCircles = function(domObj){
    
    var xScale = myChart.createXScale();
    var yScale = myChart.createYScale();
    var radiusScale = myChart.createRadiusScale();
    
    domObj.selectAll("circle")
        .data(myChart.dataset)
        .enter()
            .append("circle")
            .classed("circle", true)
            .attr("cx", function(data, index){
                return xScale(data[0]);
            })
            .attr("cy", function(data, index){
                return yScale(data[1]);
            })
            .attr("r", function(data, index){
                return radiusScale(data[1]);
            });
}

myChart.appendLabel = function(domObj){ 
    
    var xScale = myChart.createXScale();
    var yScale = myChart.createYScale();
    var radiusScale = myChart.createRadiusScale();
    
    domObj.selectAll(".circle-label")
            .data(myChart.dataset)
            .enter()
                .append("text")
                .classed("circle-label", true)
                .attr("x", function(data, index){
                    return xScale(data[0]);
                })
                .attr("y", function(data, index){
                    return yScale(data[1]);
                })
                .attr("dx", function(data, index){
                    return radiusScale(data[1]);
                })
                .text(function(data, index){
                    return "[" + data[0] + "," + data[1] +"]";
                });
    
}


myChart.createXScale = function(){
    
    
    var xMax = d3.max(myChart.dataset, function(data){
        return data[0];
    });
    
    var xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, myChart.width]);
    
    return xScale;
    
}

myChart.createYScale = function(){
    
    
    var yMax = d3.max(myChart.dataset, function(data){
        return data[1];
    });
    
    var yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([0, myChart.height]);
    
    return yScale;
    
}

myChart.createRadiusScale = function(){
    
    var yMax = d3.max(myChart.dataset, function(data){
        return data[1];
    });
    
    var radiusScale = d3.scaleLinear()
                        .domain([yMax,0])
                        .range([10,20]);
    
    return radiusScale;
    
}



myChart.run = function(){
    var svgNode = myChart.appendSvg("body", 100, 100, 1000, 1000);
    myChart.appendCircles(svgNode);
    myChart.appendLabel(svgNode);
}

window.onload = myChart.run;