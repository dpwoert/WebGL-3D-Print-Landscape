getSurface = function(coordinates){
	
	var buildingLonArray =[];
	var buildingLatArray =[];

	for(var i=0; i<coordinates.length; i++){
		buildingLonArray.push(coordinates[i][0]);
		buildingLatArray.push(coordinates[i][1]);
	}

	var buildingSurface = 1e8*(((Math.max.apply(Math, buildingLatArray))-(Math.min.apply(Math, buildingLatArray)))*((Math.max.apply(Math, buildingLonArray))-(Math.min.apply(Math, buildingLonArray))));

	return buildingSurface;
};