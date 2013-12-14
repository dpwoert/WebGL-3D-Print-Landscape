Meteor.startup(function(){
	
	//add landscape
	window.landscape = new Landscape();
	landscape.geo = {
		lat: 51.697816,
		lon: 5.303675,
		radius: 4
	}

	console.log(landscape);
	landscape.init();

	//add 3d world
	var world = DDD.init();
	world.add(landscape.mesh);

	//load database
	Meteor.subscribe("all-buildings");
	window.DB = new Meteor.Collection('buildings');

	window.TEST = landscape;

});

Meteor.autorun(function(){

	//check if all is loaded

	//add to landscape

});