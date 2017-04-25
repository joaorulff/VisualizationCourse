var datagenerator = {};

datagenerator.loadData = function(){
     
    var parseTime = d3.timeParse("%Y%m%d");
    var parsedData = [];
    
    d3.csv("data.csv", function(dataset){
        dataset.forEach(function(d){
            d.date = parseTime(d.date);
        })
    });
    
}

//window.onload = datagenerator.loadData();

