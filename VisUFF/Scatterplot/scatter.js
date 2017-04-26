'use strict';

var myChart = {};

myChart.margins = {top: 20, bottom: 20, left: 20, right: 20};
myChart.width = 500;
myChart.height = 400;
myChart.dataset = dataGenerator.generateData(10, 5);


myChart.xAxis           = undefined;
myChart.yAxis           = undefined;

myChart.originalXScale  = undefined;
myChart.xScale          = undefined;
myChart.yScale          = undefined;

myChart.colorScale      = undefined;
myChart.arrayOfGroups   = undefined;

myChart.brush           = undefined;
myChart.zoom            = undefined;

myChart.appendSVG = function(DOMObj){
    
    
    var svg = d3.select(DOMObj)
                .append('svg')
                .attr('width', myChart.width + myChart.margins.left + myChart.margins.right)
                .attr('height', myChart.height + myChart.margins.top + myChart.margins.bottom);
    
    return svg;
    
}

myChart.createAxes = function(DOMSVGObj){
    
    var minX = d3.min(myChart.dataset, function(list){
        return d3.min(list, function(element){
            return element.x;
        })
    });
    
    var maxX = d3.max(myChart.dataset, function(list){
        return d3.max(list, function(element){
            return element.x;
        })
    });
    
    var minY = d3.min(myChart.dataset, function(list){
        return d3.min(list, function(element){
            return element.y;
        })
    });
    
    var maxY = d3.max(myChart.dataset, function(list){
        return d3.max(list, function(element){
            return element.y;
        })
    });
    
    myChart.xScale = d3.scaleLinear().domain([minX,maxX]).range([0,myChart.width]);
    myChart.originalXScale = d3.scaleLinear().domain([minX,maxX]).range([0,myChart.width]);
    myChart.yScale = d3.scaleLinear().domain([minY,maxY]).range([myChart.height,0]);
    
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

myChart.appendChartGroup = function(DOMSVGObj){
        
    var chartArea = DOMSVGObj.append('g')
                    .attr('class', 'chart-area')
                    .attr('width', myChart.width)
                    .attr('height', myChart.height)
                    .attr('transform', 'translate(' + myChart.margins.left + ',' + myChart.margins.top + ')');

    return chartArea;
    
}


myChart.appendData = function(DOMSVGObj){
    
    var transition = d3.transition().duration(750);
    
    var circlesSelection = DOMSVGObj.selectAll('.series')
                                    .data(myChart.dataset)
                                    .enter()
                                    .append('g')
                                    .attr('class', 'series')
                                    .style('fill', function(data, index){
                                        return myChart.colorScale(index);
                                    })
                                    .selectAll(".point")
                                    .data(function(d){
                                            return d;
                                    })
                                    .enter()
                                    .append('circle')
                                    .transition(transition)
                                    .attr("class", "point")
                                    .attr("r", 4.5)
                                    .attr("cx", function(d) { return myChart.xScale(d.x) })
                                    .attr("cy", function(d) { return myChart.yScale(d.y); }); 
   
    
    return circlesSelection;
    
    
}

myChart.addZoom = function(svg){
    
    function zoomed(){
        
        var transformation = d3.event.transform;
        
        myChart.xScale = transformation.rescaleX(myChart.originalXScale);
        myChart.xAxis.scale(myChart.xScale);
        
        var xAxisGroup = svg.select('.xAxis');
        xAxisGroup.call(myChart.xAxis);
        
        svg.select('.chart-area')
                .selectAll('circle')
                .attr("cx",  function(d){ return myChart.xScale(d.x); });  
        
    }
    
    myChart.zoom = d3.zoom().on("zoom", zoomed);
    
    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", myChart.width)
        .attr("height", myChart.margins.bottom)
        .attr('transform', 'translate('+ myChart.margins.left +','+ (myChart.height+myChart.margins.top) +')')
        .call(myChart.zoom); 
    
    
}

myChart.generateColorScale = function(){
    
    myChart.colorScale = d3.scaleLinear().domain([0,myChart.dataset.length]).range(['yellow', 'blue']);
    
}

myChart.addBrush = function(DOMSVGObj){
    
    function brushed()
    {        
        var s = d3.event.selection;
        var x0 = s[0][0],
            y0 = s[0][1],
            x1 = s[1][0],
            y1 = s[1][1];
        
        DOMSVGObj.selectAll('circle')
            .style("fill", function (d) 
            {   
                if (myChart.xScale(d.x) >= x0 && myChart.xScale(d.x) <= x1 && 
                    myChart.yScale(d.y) >= y0 && myChart.yScale(d.y) <= y1)
                { return "black"; }
            });        
    };
    
    myChart.brush = d3.brush() 
                .on('start brush', brushed);
    
    DOMSVGObj.append('g')
                .attr('class', 'brush')
                .call(myChart.brush);
    
}



myChart.run = function(xAxis, yAxis){
    
    console.log('xAxis', xAxis);
    console.log('yAxis', yAxis);
    
    var svg = myChart.appendSVG("#mainDiv");
    var svgGroup = myChart.appendChartGroup(svg);
    
    
    myChart.createAxes(svg);
    myChart.generateColorScale();
    myChart.appendData(svgGroup);
    
    myChart.addBrush(svgGroup);
    myChart.addZoom(svg);
    
}

window.onload = myChart.run("test", "test1");