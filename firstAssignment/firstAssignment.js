'use strict';

var myChart = {};

myChart.width = 800;
myChart.height = 450;

var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25];

myChart.appendSVG = function(div, x, y, width, height){
    
    
    var svg = d3.select(div).append("svg")
                .attr('id', "chart")
                .attr('x', x)
                .attr('y', y)
                .attr('width', width)
                .attr('height', height);

    
    return svg;
}

myChart.createBars = function(domObj, data){
    
    var xScale = myChart.createLinearScaleX();
    var yScale = myChart.createLinearScaleY();
    var colorScale = myChart.createLinearColorScale();
    
    
    domObj.selectAll(".bar")
        .data(dataset)
        .enter()
            .append("rect")
            .classed("bar", true)
            .attr("x", function(data, index){
                return (index * xScale(1));
            })
            .attr("y", function(data, index){
                return (myChart.height - yScale(data));
            })
            .attr("width", function(data, index){
                return xScale(1)-2;
            })
            .attr("height", function(data, index){
                return yScale(data);
            })
            .style("fill", function(data, index){
                return colorScale(data);
            });
    
}

myChart.createLabels = function(domObj, data){
    
    var xScale = myChart.createLinearScaleX();
    var yScale = myChart.createLinearScaleY();
    
    domObj.selectAll(".bar-label")
            .data(dataset)
            .enter()
                .append("text")
                .classed("bar-label", true)
                .attr("x", function(data, index){
                    return (index * xScale(1)) + xScale(1)/2;
                })
                .attr("y", function(data, index){
                    return (myChart.height - yScale(data)) + 20;
                })
                .attr("dx", function(data, index){
                    return xScale(1)/4 -2 ;
                })
                .text(function(data, index){
                    return data;
                });
    
}


myChart.createLinearScaleX = function(){
    
    var xScale = d3.scaleLinear()
                    .domain([0, dataset.length])
                    .range([0, myChart.width]);
    
    return xScale;
}

myChart.createLinearScaleY = function(){
    
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset)])
                    .range([0, myChart.height]);
    
    return yScale;
}

myChart.createLinearColorScale = function(){
    
    var colorScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset)])
                        .range(["#8F8FF0", "#00001C"]);
    
    return colorScale;
}

myChart.run = function(){
    
    var svg = myChart.appendSVG("body", 100, 0, myChart.width, myChart.height);
    myChart.createBars(svg, dataset);
    myChart.createLabels(svg, dataset);
    
}


window.onload = myChart.run;  
