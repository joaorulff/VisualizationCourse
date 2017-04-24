var datagenerator = {};


datagenerator.loadData = function(){
    
    
    d3.csv("data.csv", function(error, dataset){
        dataset.forEach(function(d){
            var dateTest = d['date'];
            console.log(parseTime(dateTest));
            
        })
    });
    
}

window.onload = datagenerator.loadData();

