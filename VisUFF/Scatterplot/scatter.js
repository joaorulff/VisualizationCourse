'use strict';

var myChart = {};

myChart.margins         = undefined;
myChart.width           = undefined;
myChart.height          = undefined;

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

myChart.svgRef          = undefined;

//Responsible to keep brush and zoom working together
myChart.brushCoord      = {x0: undefined, x1: undefined, y0: undefined, y1: undefined};


myChart.appendSVG = function(DOMObj){
    
    var svg = d3.select(DOMObj)
                .append('svg')
                .attr('width', myChart.width + myChart.margins.left + myChart.margins.right)
                .attr('height', myChart.height + myChart.margins.top + myChart.margins.bottom);
    
    return svg;
    
}

myChart.appendChartGroup = function(DOMSVGObj){
        
    var chartArea = DOMSVGObj.append('g')
                    .attr('class', 'chart-area')
                    .attr('width', myChart.width)
                    .attr('height', myChart.height)
                    .attr('transform', 'translate(' + myChart.margins.left + ',' + myChart.margins.top + ')');

    return chartArea;
    
}

myChart.generateXScale = function(){
    
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
    
    myChart.xScale = d3.scaleLinear().domain([minX,maxX]).range([0,myChart.width]);
    myChart.originalXScale = d3.scaleLinear().domain([minX,maxX]).range([0,myChart.width]);
    
}


myChart.generateYScale = function(){
    
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
    
    
    
    myChart.yScale = d3.scaleLinear().domain([minY,maxY]).range([myChart.height,0]);
    myChart.originalYScale = d3.scaleLinear().domain([minY,maxY]).range([myChart.height,0]);
    
}

myChart.generateColorScale = function(){
    
    myChart.colorScale = d3.scaleLinear().domain([0,myChart.dataset.length]).range(['yellow', 'blue']);
    
}


myChart.createXAxis = function(DOMSVGObj, tickFormat){
    
    var xAxisGroup = DOMSVGObj.append('g')
                        .attr('class', 'xAxis')
                        .attr('transform', 'translate(' + myChart.margins.left + ',' + (myChart.margins.top + myChart.height) + ')');

    myChart.xAxis = d3.axisBottom(myChart.xScale).ticks(10).tickFormat(d3.format(tickFormat));
        
    xAxisGroup.call(myChart.xAxis);
    
    return xAxisGroup;

}


myChart.createYAxis = function(DOMSVGObj, tickFormat){
    
    var yAxisGroup = DOMSVGObj.append('g')
                        .attr('class', 'yAxis')
                        .attr('transform', 'translate(' + myChart.margins.left + ',' + myChart.margins.top + ')');

    myChart.yAxis = d3.axisLeft(myChart.yScale).ticks(10).tickFormat(d3.format(tickFormat));
    
    yAxisGroup.call(myChart.yAxis);
    
    return yAxisGroup;
    
}

myChart.createXAxisLabel = function(DOMSVGObj, textXAxis){
    
    
    //Append LabelX
    DOMSVGObj.append("text")
                .attr("class", "label")
                .attr("x", myChart.width)
                .attr("y", -5)
                .style("text-anchor", "end")
                .style("fill", "black")
                .text(textXAxis);
}

myChart.createYAxisLabel = function(DOMSVGObj, textYAxis){
    
    //Append LabelY
    DOMSVGObj.append("text")
                .attr("class", "label")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", ".90em")
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "end")
                .style("fill", "black")
                .text(textYAxis);
    
}

myChart.addBrush = function(DOMSVGObj){
    
    function brushed(){
        
        var s = d3.event.selection;
            myChart.brushCoord.x0 = s[0][0],
            myChart.brushCoord.y0 = s[0][1],
            myChart.brushCoord.x1 = s[1][0],
            myChart.brushCoord.y1 = s[1][1];
        
        myChart.brushMethod();
    }
    
    myChart.brush = d3.brush().on('start brush', brushed);
    
    DOMSVGObj.append('g').attr('class', 'brush').call(myChart.brush);
    
}

myChart.brushMethod = function(){
        
        myChart.svgRef.selectAll('circle')
            .style("fill", function (d) 
            {   
                if (myChart.xScale(d.x) >= myChart.brushCoord.x0 && myChart.xScale(d.x) <= myChart.brushCoord.x1 && 
                    myChart.yScale(d.y) >= myChart.brushCoord.y0 && myChart.yScale(d.y) <= myChart.brushCoord.y1)
                { return "black"; }
            });
}

myChart.addZoomX = function(svg, xAxis){
    
    myChart.zoom = d3.zoom().on("zoom", myChart.zoomXMethod);
    
    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", myChart.width)
        .attr("height", myChart.margins.bottom)
        .attr('transform', 'translate('+ myChart.margins.left +','+ (myChart.height+myChart.margins.top) +')')
        .call(myChart.zoom);    
}

myChart.zoomXMethod = function(){
        
        var transformation = d3.event.transform;
        
        myChart.xScale = transformation.rescaleX(myChart.originalXScale);
        myChart.xAxis.scale(myChart.xScale);
      
        var xAxisGroup = myChart.svgRef.select('.xAxis');
        
//        //if(xAxis){
//            xAxisGroup.call(myChart.xAxis);
//        //}
        
          
        myChart.svgRef.select('.chart-area')
                .selectAll('circle')
                .attr("cx",  function(d){ return myChart.xScale(d.x);  });  
    
    myChart.brushMethod();
        
}

myChart.addZoomY = function(svg, yAxis){
    
    myChart.zoom = d3.zoom().on("zoom", myChart.zoomYMethod);
    
    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", myChart.margins.left)
        .attr("height", myChart.height)
        .attr('transform', 'translate(0,' + (myChart.margins.top) +')')
        .call(myChart.zoom);
    
}

myChart.zoomYMethod = function(){
        
    var transformation = d3.event.transform;

    myChart.yScale = transformation.rescaleY(myChart.originalYScale);
    myChart.yAxis.scale(myChart.yScale);

    var yAxisGroup = myChart.svgRef.select('.yAxis');

//    if(yAxis){
//        yAxisGroup.call(myChart.yAxis);
//    }


    myChart.svgRef.select('.chart-area')
            .selectAll('circle')
            .attr("cy",  function(d){ return myChart.yScale(d.y);  }); 
    
    myChart.brushMethod();
    
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


myChart.appendDatasetLabel = function(DOMObj){
    
    var legend = DOMObj.selectAll(".legend")
      .data(myChart.dataset)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate("+ (myChart.margins.left ) + "," + i * 20 + ")"; });
    
    legend.append("rect")
      .attr("x", myChart.width - 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i){
        return myChart.colorScale(i);
      });
    
    legend.append("text")
      .attr("x", myChart.width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d,i) { return i; });
    
    legend.on("click", function(){
        console.log("CLICK");
    });
}



myChart.run = function(domElement, width, height, margin, xAxis, yAxis, zoomX, zoomY, brush, labelX, labelY, dataLabel, tickType){
    
    myChart.width = width;
    myChart.height = height;
    myChart.margins = margin;
    
    var svg = myChart.appendSVG(domElement);
    myChart.svgRef = svg;
    var svgGroup = myChart.appendChartGroup(svg);
    
    myChart.generateXScale();
    myChart.generateYScale();
    myChart.generateColorScale();
    
    var xAxisGroup = myChart.createXAxis(svg, tickType);
    var yAxisGroup = myChart.createYAxis(svg, tickType);
    
    myChart.createXAxisLabel(xAxisGroup, "Eixo X");
    myChart.createYAxisLabel(yAxisGroup, "Eixo Y");
    
    myChart.appendData(svgGroup);
    
    if(brush){
        myChart.addBrush(svgGroup);
    }
    
    if(zoomX){
        myChart.addZoomX(svg, xAxis);
    }
    
    if(zoomY){
        myChart.addZoomY(svg, yAxis);
    }
    
    if(dataLabel){
        myChart.appendDatasetLabel(svgGroup);
    }
    
        
    
}

//window.onload = myChart.run;