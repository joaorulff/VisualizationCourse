'use strict';

var dataGenerator = {};

dataGenerator.ranges = ["classA", "classB", "classC", "classD", "classE", "classF"];
dataGenerator.sets = ["Brazil", "EUA", "Mexico", "Canada", "Chile", "Argentina"];

dataGenerator.generateData = function(){
    
    var dataset = [];
    
    for(var set = 0; set < dataGenerator.sets.length; set++){
        
        var currentObj = {key: dataGenerator.sets[set]};
        
        for(var rangeIndex = 0; rangeIndex < dataGenerator.ranges.length; rangeIndex++){
            
            currentObj[dataGenerator.ranges[rangeIndex]] = Math.random()*1000;
            
        }
        
        dataset.push(currentObj);
    }
    
    return dataset;
    
}