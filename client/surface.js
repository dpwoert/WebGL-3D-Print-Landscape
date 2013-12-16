surface = function(coordinates){
	
	var buildingLonArray =[];
	var buildingLatArray =[];

	for(var i=0; i<coordinates.length; i++){
		buildingLonArray.push(coordinates[i][0]);
		buildingLatArray.push(coordinates[i][1]);
	}

	var buildingSurface = 1e8*(((Math.max.apply(Math, buildingLatArray))-(Math.min.apply(Math, buildingLatArray)))*((Math.max.apply(Math, buildingLonArray))-(Math.min.apply(Math, buildingLonArray)))

	return buildingSurface;
};

// var coordinates = [
// 	[
// 		 5.297564850154452,
// 		51.70830683769465
// 	],
// 	[
// 		5.297563733136366,
// 		51.70830834690624
// 	],
// 	[
// 		5.297404531080081,
// 		51.70826295920597
// 	],
// 	[
// 		5.297409390889038,
// 		51.708256374367906
// 	],
// 	[
// 		5.297508037223381,
// 		51.70812282704433
// 	],
// 	[
// 		5.297667238890321,
// 		51.708168214604456
// 	],
// 	[
// 		5.297564850154452,
// 		51.70830683769465
// 	]
// ];

// surface(coordinates);