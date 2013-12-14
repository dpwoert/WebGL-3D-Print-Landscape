Meteor.startup(function(){
	
	//add landscape
	var landscape = new Landscape();
	landscape.geo = {
		lat: 51.697816,
		lon: 5.303675,
		radius: 4
	}

	console.log(landscape);

	//add 3d world
	var world = DDD.init();

});