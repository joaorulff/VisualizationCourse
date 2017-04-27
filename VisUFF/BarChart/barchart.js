
'use strict';

var barChart = {};

barChart.dataset = dataGenerator.generateData();

barChart.margin = {top: 20, bottom: 20, left: 40, right: 100};

barChart.width = 500;
barChart.height = 300;

barChart.globalXScale   = d3.scaleBand().domain(barChart.dataset.map(function(set) { return set.key; })).rangeRound([0, barChart.width]).paddingInner(0.3);
barChart.xScale         = d3.scaleBand().domain(Object.keys(barChart.dataset[0]).slice(1)).padding(0.05).rangeRound([0, barChart.globalXScale.bandwidth()]);
barChart.yScale         = d3.scaleLinear().domain([0,d3.max(barChart.dataset, function(set){ 
                            return d3.max(Object.keys(barChart.dataset[0]).slice(1), function(d){
                                return set[d];}) 
                            })]).rangeRound([barChart.height, 0]);
barChart.colorScale     = d3.scaleOrdinal(d3.schemeCategory10);

barChart.brush          = undefined;

barChart.xAxis          = undefined;
barChart.yAxis          = undefined;

barChart.appendSVG = function(DOMObj){
    
    var svg = d3.select(DOMObj)
                    .append('svg')
                    .attr('width', barChart.width + barChart.margin.left + barChart.margin.right)
                    .attr('height', barChart.height + barChart.margin.top + barChart.margin.bottom);
    return svg;
    
    
}

barChart.appendChartGroup = function(DOMObj){
    
    var groupRef = DOMObj.append('g')
                        .attr("transform", "translate(" + barChart.margin.left + "," + barChart.margin.top + ")");
    
    return groupRef;
    
}


barChart.appendData = function(svgGroupRef){
    
        var ranges = Object.keys(barChart.dataset[0]).slice(1);

    
        var globalGroups = svgGroupRef.selectAll("g")
                   .data(barChart.dataset)
                   .enter().append("g")
                   .attr("transform", function(d) { return "translate(" + barChart.globalXScale(d.key) + ",0)"; });
    
    
        var localGroups = globalGroups.selectAll("rect")
                                    .data(function(data) { 
                                            return ranges.map(function(key){
                                                return {key: key, value: data[key] }
                                            })
                                            })
                                    .enter()
                                    .append("rect")
                                    .transition().ease(d3.easeLinear).duration(500)
                                    .delay(function(d, i) {
                                      return i * 50;
                                    })
                                    .attr('class', 'data-bar')
                                    .attr("x", function(data) {
                                                    return barChart.xScale(data.key);
                                                })
                                    .attr("y", function(data) { return barChart.yScale(data.value); })
                                    .attr("width", barChart.xScale.bandwidth())
                                    .attr("height", function(d) { return barChart.height - barChart.yScale(d.value); })
                                    .attr("fill", function(d) { return barChart.colorScale(d.key); });
}


barChart.appendXAxis = function(svgGroupRef){
    
    var xAxis = svgGroupRef.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + barChart.height + ")")
        .call(d3.axisBottom(barChart.globalXScale));


    return xAxis; 
    
}

barChart.appendYAxis = function(svgGroupRef){
    
    var yAxis = svgGroupRef.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(barChart.yScale).ticks(null, "s"));
    
    return yAxis;
    
}

barChart.appendYLegend = function(yAxisRef, legendText){
    
    yAxisRef.append("text")
      .attr("x", 2)
      .attr("y", 2)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text(legendText);
    
}

barChart.appendXLegend = function(xAxisRef, legendText){
    
    xAxisRef.append("text")
      .attr("x", barChart.width + barChart.margin.right/2)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text(legendText);
    
}

barChart.appendDataLabel = function(groupRef){
    
  var legend = groupRef.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data( Object.keys(barChart.dataset[0]).slice(1))
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", barChart.width + barChart.margin.right - 40)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", barChart.colorScale);

  legend.append("text")
      .attr("x", barChart.width + barChart.margin.right - 42)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
    
    
}


barChart.appendBrush = function(svgRef){
    
    function brushed(){
        
        var brushCoords = d3.event.selection;
        var x0 = brushCoords[0],
            x1 = brushCoords[1];
        
        svgRef.selectAll('.data-bar')
            .style("fill", function(d){
            console.log(d);
        });
    }
    
    barChart.brush = d3.brushX().extent([
        [barChart.margin.left, barChart.margin.right],
        [barChart.width + barChart.margin.left, barChart.height + barChart.margin.top ]
      ]).on("start", brushed);
    
    svgRef.append('g')
            .attr('class', 'brush')
            .call(barChart.brush);
    
    
}

barChart.start = function(
//DOMObj, width, height, margin, xAxis, yAxis, xAxisLabel, yAxisLabel, 
){
    
//    barChart.width = width;
//    barChart.height = height;
//    barChart.margin = margin;
    
    var mainSVG = barChart.appendSVG("#mainDiv");
    var svgGroup = barChart.appendChartGroup(mainSVG);
    
    barChart.appendData(svgGroup);
    
    var xAxis = barChart.appendXAxis(svgGroup);
    var yAxis = barChart.appendYAxis(svgGroup);
    
    barChart.appendYLegend(yAxis, "Eixo Y");
    barChart.appendXLegend(xAxis, "Eixo X");
    
    barChart.appendBrush(mainSVG);
    
    barChart.appendDataLabel(svgGroup);
    
    
}

window.onload = barChart.start;