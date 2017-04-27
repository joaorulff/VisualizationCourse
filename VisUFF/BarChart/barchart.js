
'use strict';

var barChart = {};

//barChart.dataset = dataGenerator.generateData(4, 6);

barChart.margin = {top: 20, bottom: 20, left: 20, right: 20};

barChart.width = 500;
barChart.height = 300;

barChart.globalXScale   = d3.scaleBand().rangeRound([0, barChart.width]).paddingInner(0.1);
barChart.xScale         = d3.scaleBand().padding(0.05);
barChart.yScale         = d3.scaleLinear().rangeRound([barChart.height, 0]);
barChart.colorScale     = d3.scaleOrdinal(d3.schemeCategory10);

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


barChart.loadAndAppendData = function(svgGroupRef){
    
    d3.csv("data.csv", function(data) {
      
        var keys = data.columns.slice(1);
        
        //Defining Axes domain
        barChart.globalXScale.domain(data.map(function(d) { return d.State; }));
        barChart.xScale.domain(keys).rangeRound([0, barChart.globalXScale.bandwidth()]);
        
        var maxData = d3.max(data, function(state){
            return d3.max(keys, function(key){
                return state[key];
            })
        });
        
        barChart.yScale.domain([0, maxData]).nice();
        
        var globalGroups = svgGroupRef.selectAll("g")
                   .data(data)
                   .enter().append("g")
                   .attr("transform", function(d) { return "translate(" + barChart.globalXScale(d.State) + ",0)"; });
        
        var localGroups = globalGroups.selectAll("rect")
                   .data(function(d) { 
                       return keys.map(function(key) { return {key: key, value: d[key]}; }); 
                   })
                  .enter().append("rect")
                  .attr("x", function(d) { return barChart.xScale(d.key); })
                  .attr("y", function(d) { return barChart.yScale(d.value); })
                  .attr("width", barChart.xScale.bandwidth())
                  .attr("height", function(d) { return barChart.height - barChart.yScale(d.value); })
                  .attr("fill", function(d) { return barChart.colorScale(d.key); });
        
    });   
}

barChart.start = function(){
    
    var mainSVG = barChart.appendSVG("#mainDiv");
    var svgGroup = barChart.appendChartGroup(mainSVG);
    
    barChart.loadAndAppendData(svgGroup);
    
    
}

window.onload = barChart.start;