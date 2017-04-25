'use strict';

var timeChart = {};

timeChart.margins       = {top: 10, right: 10, bottom: 100, left: 40};
timeChart.brushMargins  = {top: 430, right: 10, bottom: 20, left: 40};

timeChart.width         = 960 - timeChart.margins.left - timeChart.margins.right;
timeChart.height        = 500 - timeChart.margins.top - timeChart.margins.bottom;
timeChart.heightBrush   = 500 - timeChart.brushMargins.top - timeChart.brushMargins.bottom;

timeChart.xScale        = d3.scaleTime().range([0,timeChart.width]);
timeChart.yScale        = d3.scaleLinear().range([timeChart.height, 0]);
timeChart.xScaleBrush   = d3.scaleLinear().range([0,timeChart.width]);
timeChart.yScaleBrush   = d3.scaleLinear().range([timeChart.heightBrush,0]);
timeChart.colorScale    = d3.scaleOrdinal(d3.schemeCategory10);

timeChart.line          = undefined;
timeChart.brushLine     = undefined;

timeChart.xAxis         = d3.axisBottom(timeChart.xScale);
timeChart.yAxis         = d3.axisLeft(timeChart.yScale);
timeChart.brushXAxis    = d3.axisBottom(timeChart.xScaleBrush);

timeChart.brush         = d3.brushX()//.extent([[0,0], [timeChart.width, timeChart.heightBrush]])
                                    .on("brush", brushed);

//timeChart.zoom = d3.zoom().scaleExtent([1, Infinity])
//                            .translateExtent([[0, 0], [timeChart.width, timeChart.height]])
//                            .extent([[0, 0], [timeChart.width, timeChart.height]])
//                            .on("zoom", zoomed);

var svgRef, groupRef, brushGroupRef;


timeChart.appendSVG = function(DOMObj){
    
   var svgRef = d3.select(DOMObj)
        .append('svg')
        .attr('width', timeChart.width + timeChart.margins.left + timeChart.margins.right)
        .attr('height', timeChart.height + timeChart.margins.bottom + timeChart.margins.top);
    
    svgRef.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", timeChart.width)
                    .attr("height", timeChart.height);
    
    return svgRef;
    
}

timeChart.appendGroup = function(svgRef){
    
    var group = svgRef.append('g')
                        .attr('transform', 'translate(' + timeChart.margins.left + ',' + timeChart.margins.top + ')');
    
    return group;
}

timeChart.appendBrushGroup = function(svgRef){
    
    var group = svgRef.append('g')
                        .attr('transform', 'translate(' + timeChart.brushMargins.left + "," + timeChart.brushMargins.top + ')');
    
    return group;
}

timeChart.defineLine = function(){
    
    timeChart.line = d3.line()
                        .defined(function(d) { return !isNaN(d.temperature); })
                        .x(function(d) {return timeChart.xScale(d.date); })
                        .y(function(d) {return timeChart.yScale(d.temperature); });

}

timeChart.defineBrushLine = function(){
    
    timeChart.brushLine = d3.line()
                        .defined(function(d) { return !isNaN(d.temperature); })
                        .x(function(d) {return timeChart.xScaleBrush(d.date); })
                        .y(function(d) {return timeChart.yScaleBrush(d.temperature); });
    
}

timeChart.loadAndAppendData = function(groupRef, brushGroupRef){
    
    var parseTime = d3.timeParse("%Y%m%d");
    timeChart.defineLine();
    timeChart.defineBrushLine();
    
    d3.csv("data.csv", function(dataset){
        
        //returns array of cities
        var cities = dataset.columns.slice(1);
        
        var citiesFormatted = cities.map(function(city){
            return{
                city: city,
                values: dataset.map(function(row){
                    return {
                        date: parseTime(row.date),
                        temperature: row[city]
                    }
                })
            }
        });
        
        
        timeChart.xScale.domain(d3.extent(dataset, function(row){
            return parseTime(row.date);
        }));
        
        timeChart.xScaleBrush.domain(d3.extent(dataset, function(row){
            return parseTime(row.date);
        }));
        
        
        timeChart.yScale.domain([
            d3.min(citiesFormatted, function(city){
                return d3.min(city.values, function(d){
                    return d.temperature;
                });
            }),
            
            d3.max(citiesFormatted, function(city){
                return d3.max(city.values, function(d){
                    return d.temperature;
                });
            })
        ]);
        
        timeChart.yScaleBrush.domain([
            d3.min(citiesFormatted, function(city){
                return d3.min(city.values, function(d){
                    return d.temperature;
                });
            }),
            
            d3.max(citiesFormatted, function(city){
                return d3.max(city.values, function(d){
                    return d.temperature;
                });
            })
        ]);
        
        timeChart.colorScale.domain(citiesFormatted.map(function(d){
            return d.city;
        }));
        
        timeChart.appendXAxisGroup(groupRef);
        timeChart.appendYAxisGroup(groupRef);
        timeChart.appendXAxisBrushGroup(brushGroupRef);
        
        
        var city = groupRef.selectAll(".city")
                    .data(citiesFormatted)
                    .enter()
                    .append("g")
                    .attr("class", "city");
        
        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return timeChart.line(d.values); })
            .style("stroke", function(d) { return timeChart.colorScale(d.city); });
        
        
        var cityBrush = brushGroupRef.selectAll(".cityBrush")
                    .data(citiesFormatted)
                    .enter()
                    .append("g")
                    .attr("class", "cityBrush");
        
        cityBrush.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return timeChart.brushLine(d.values); })
            .style("stroke", function(d) { return timeChart.colorScale(d.city); });
        
        
        brushGroupRef.append("g")
                    .attr("class", "brush")
                    .call(timeChart.brush)
                    .call(timeChart.brush.move, timeChart.xScale.range());
        
//        svgRef.append("rect")
//                  .attr("class", "zoom")
//                  .attr("width", timeChart.width)
//                  .attr("height", timeChart.height)
//                  .attr("transform", "translate(" + timeChart.margins.left + "," + timeChart.margins.top + ")")
//                  .call(timeChart.zoom);
        
//        city.append("text")
//            .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
//            .attr("transform", function(d) { return "translate(" + timeChart.xScale(d.value.date) + "," + timeChart.yScale(d.value.temperature) + ")"; })
//            .attr("x", 3)
//            .attr("dy", "0.35em")
//            .style("font", "10px sans-serif")
//            .text(function(d) { return d.id; });
        
    });
    
}


timeChart.appendXAxisGroup = function(groupRef){
    
    groupRef.append('g')
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + timeChart.height + ")")
                .call(timeChart.xAxis);
    
}

timeChart.appendYAxisGroup = function(groupRef){
    
    groupRef.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(timeChart.yScale));
    
    
}


timeChart.appendXAxisBrushGroup = function(brushGroupRef){
    
    brushGroupRef.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + timeChart.heightBrush + ")")
        .call(timeChart.brushXAxis);
    
}

function brushed() {
  timeChart.xScale.domain(d3.event.sourceEvent && d3.event.sourceEvent.type != "brush" ? timeChart.xScaleBrush.domain() : timeChart.brush.extent());
  groupRef.selectAll(".line").attr("d",  function(d) { return timeChart.line(d.values)});
  groupRef.select("axis axis--x").call(timeChart.xAxis);
  groupRef.select("axis axis--y").call(timeChart.yAxis);
}

//function brushed() {
//  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
//  var s = d3.event.selection || timeChart.xScaleBrush.range();
//  timeChart.xScale.domain(s.map(timeChart.xScaleBrush.invert, timeChart.xScaleBrush));
//  //groupRef.select(".line").attr("d", area);
//  groupRef.select(".axis--x").call(timeChart.xAxis);
//  svgRef.select(".zoom").call(timeChart.zoom.transform, d3.zoomIdentity
//      .scale(timeChart.width / (s[1] - s[0]))
//      .translate(-s[0], 0));
//}

//function zoomed() {
//  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
//  var t = d3.event.transform;
//  timeChart.xScale.domain(t.rescaleX(timeChart.xScaleBrush).domain());
//  //focus.select(".area").attr("d", area);
//  groupRef.select(".axis--x").call(timeChart.xAxis);
//  brushGroupRef.select(".brush").call(timeChart.brush.move, timeChart.xScale.range().map(t.invertX, t));
//}

timeChart.run = function(){
    
    svgRef = timeChart.appendSVG("#mainDiv");
    groupRef = timeChart.appendGroup(svgRef);
    brushGroupRef = timeChart.appendBrushGroup(svgRef);
    
    timeChart.loadAndAppendData(groupRef, brushGroupRef);
        
}

window.onload = timeChart.run;