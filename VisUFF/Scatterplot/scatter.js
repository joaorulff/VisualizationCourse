'use strict';

var myChart = {};

myChart.margins = {top: 20, bottom: 20, left: 20, right: 20};
myChart.width = 500;
myChart.height = 400;
myChart.dataset = dataGenerator.generateData(10, 5);
myChart.xAxis           = undefined;
myChart.yAxis           = undefined;
myChart.xScale          = undefined;
myChart.yScale          = undefined;
myChart.colorScale      = undefined;
myChart.arrayOfGroups   = undefined;
myChart.brush           = undefined;

myChart.appendSVG = function(DOMObj){
    
    
    var svg = d3.select(DOMObj)
                .append('svg')
                .attr('width', myChart.width + myChart.margins.left + myChart.margins.right)
                .attr('height', myChart.height + myChart.margins.top + myChart.margins.bottom);
    
    return svg;
    
}

myChart.createAxes = function(DOMSVGObj){
    
    myChart.xScale = d3.scaleLinear().domain([0,100]).range([0,myChart.width]);
    myChart.yScale = d3.scaleLinear().domain([0,100]).range([myChart.height,0]);
    
    var xAxisGroup = DOMSVGObj.append('g')
                            .attr('class', 'xAxis')
                            .attr('transform', 'translate(' + myChart.margins.left + ',' + (myChart.margins.top + myChart.height) + ')');
    
    var yAxisGroup = DOMSVGObj.append('g')
                            .attr('class', 'yAxis')
                            .attr('transform', 'translate(' + myChart.margins.left + ',' + myChart.margins.top + ')');
                                
    
    
    myChart.xAxis = d3.axisBottom(myChart.xScale);
    myChart.yAxis = d3.axisLeft(myChart.yScale);
    
    xAxisGroup.call(myChart.xAxis);
    yAxisGroup.call(myChart.yAxis);
    
    
}

myChart.appendChartGroups = function(DOMSVGObj){
    
    var chartsAreas = [];
    
    for(var i = 0; i < myChart.dataset.length; i++){
        
        var chartArea = DOMSVGObj.append('g')
                        .attr('width', myChart.width)
                        .attr('height', myChart.height)
                        .attr('transform', 'translate(' + myChart.margins.left + ',' + myChart.margins.top + ')');
        
        chartsAreas.push(chartArea);
        
    }
    
    return chartsAreas;
    
}


myChart.appendData = function(DOMSVGObj){
    
    var transition = d3.transition()
                        .duration(750);
    
    myChart.dataset.forEach(function(data, index){
        
        var circlesSelection = DOMSVGObj[index].selectAll('circle')
                                        .data(data)
                                        .enter()
                                        .append('circle')
                                        .transition(transition)
                                        .attr('cx', function(d){
                                            return myChart.xScale(d.x);
                                        })
                                        .attr('cy', function(d) {
                                            return myChart.yScale(d.y);
                                        })
                                        .attr('r', function(d){
                                            return 5;
                                        });
        
        circlesSelection.style('fill', function(){
            return myChart.colorScale(index);
        });
        
    });
    
    //return circles;
    
    
}

myChart.generateColorScale = function(){
    
    myChart.colorScale = d3.scaleLinear().domain([0,myChart.dataset.length]).range(['yellow', 'blue']);
    
}

myChart.addBrush = function(DOMSVGObj){
    
    function brushed()
    {        
        var coordinates = d3.event.selection,
           x0 = coordinates[0][0],
           y0 = coordinates[0][1],
           x1 = coordinates[1][0],
           y1 = coordinates[1][1];
        
        DOMSVGObj.selectAll('circle')
            .style("fill", function (d) 
            {
                if (myChart.xScale(d.cx) >= x0 && myChart.xScale(d.cx) <= x1 && 
                    myChart.yScale(d.cy) >= y0 && myChart.yScale(d.cy) <= y1)
                { return "white"; }
                else 
                { return "rgb(150,150,190)"; }
            });        
    };
    
     myChart.brush = d3.brush()
                .on('start brush', brushed);
    
    DOMSVGObj.append('g')
                .attr('class', 'brush')
                .call(myChart.brush);
    
}



myChart.run = function(){
    
    var svg = myChart.appendSVG("#mainDiv");
    var svgGroups = myChart.appendChartGroups(svg);
    
    
    myChart.createAxes(svg);
    myChart.generateColorScale();
    myChart.appendData(svgGroups);
    //myChart.addBrush(svgGroups[1]);
    
}



window.onload = myChart.run;