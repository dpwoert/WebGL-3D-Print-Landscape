window.BLOCK = false;

window.updateCity = function(){
	Meteor.call('getCity');
	BLOCK = true;
}

Meteor.startup(function(){
	
	//add landscape
	var landscape = new Landscape();
	landscape.geo = {
		lat: 51.70818,
		lon: 5.29720,
		radius: 3.496
	}

	console.log(landscape);
	landscape.range = d3.scale.linear().domain([1945,2013]).range([0,500])
	//.clamp(true);
	landscape.init();

	//add 3d world
	var world = DDD.init();

	//load database
	Meteor.subscribe('all-buildings');
	var DB = new Meteor.Collection('buildings');

	//get the correct building data
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

				//future projects
				landscape.addPointGeo(51.69139405,5.30622482, 2014, 2); //GZG
				landscape.addPointGeo(51.690542,5.293723, 2014, 2); //Station
				landscape.addPointGeo(51.702499,5.317694, 2015, 2); //Carolus
				landscape.addPointGeo(51.684344,5.280175, 2014, 2); //Willemspoort
				landscape.addPointGeo(51.677252,5.336437, 2014, 2); //XXL

				//build
				landscape.build();
			}

		});

	});

	//add to 3d world
	landscape.finished = function(){
		world.add(landscape.mesh);
		console.log('finished');

		//only add region when finished
		// var regionUrls = 'http://api.citysdk.waag.org/admr.nl.shertogenbosch/regions?admr::admn_level=4&geom&per_page=100';
		// Meteor.http.get(regionUrls, function(err, r){

		// 	_.each(r.data.results, function(o){
		// 		landscape.addGeoRegion(o.geom.coordinates[0][0]);
		// 	})

		// });

		//export to 3d object
		if(location.hash == '#save'){
			console.log('export');
			landscape.exporter();
		}
	};

	//debug
	window.DEBUG = landscape;
	window.DB = DB;

});
