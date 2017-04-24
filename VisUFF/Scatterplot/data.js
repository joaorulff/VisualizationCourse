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