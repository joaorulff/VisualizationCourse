'use strict'

var dataGenerator = {};

dataGenerator.generateData = function(numberOfEntries, numberOfSets){
    
    var dataset = [];
    
    for(var sets = 0; sets < numberOfSets; sets++){
        
        var array = [];
        
        for(var entry = 0; entry < numberOfEntries; entry++){
            
            var x = Math.random()*100;
            var y = Math.random()*100;
            var obj = {'x': x, 'y': y};
            
            array.push(obj);
            
        }
        
        dataset.push(array);
    }
    
    return dataset;
}


dataGenerator.generateNewData = function(dataset){
    
    
    for(var set = 0; set < dataset.length; set++){
        
        var newValueX = Math.random()*100;
        var newValueY = Math.random()*100;
        
        var obj = {'x': newValueX, 'y': newValueY};
        
        console.log(dataset[set]);
        dataset[set].push(obj);
        console.log(dataset[set]);
        
    }
    
    return dataset;
    
}

dataGenerator.test = function(){
    
    var dataset = dataGenerator.generateData(5, 5);
    console.log('first dataset; ', dataset);
    
    dataGenerator.generateNewData(dataset);
    
}

window.onload = dataGenerator.test;