window.BLOCK = false;

window.updateCity = function(){
	Meteor.call('getCity');
	BLOCK = true;
}

Meteor.startup(function(){
	
	//add landscape
	var landscape = new Landscape();
	landscape.geo = {
		lat: 51.697816,
		lon: 5.303675,
		radius: 4
	}

	console.log(landscape);
	landscape.range = d3.scale.pow().domain([1945,2013]).range([0,100])
	//.clamp(true);
	landscape.init();

	//add 3d world
	var world = DDD.init();

	//load database
	Meteor.subscribe('all-buildings');
	var DB = new Meteor.Collection('buildings');

	//get the correct data
	var buildingCount = 0;
	Meteor.call('buildingCount', function(err, res){ 
		buildingCount = res; 

		console.log('nr of buildings to add: ' + buildingCount);

		//load the data from the DB know we know the data
		Meteor.autorun(function(){

			//check
			if(window.BLOCK) return false;

			//get the data
			var list = DB.find({}).fetch();

			//check if all is loaded
			if( buildingCount == list.length && buildingCount > 0 ){

				console.log('start loading');

				//add
				_.each(list, function(building){

					if(isNaN(building.bouwjaar)){
						console.log('geen bouwjaar');
					}

					landscape.addPointGeo(building.lat, building.lon, building.bouwjaar, 1);
				});

				//build
				landscape.build();
			}

		});

	});

	//add to 3d world
	landscape.finished = function(){
		world.add(landscape.mesh);
		console.log('finished');
	};

});
