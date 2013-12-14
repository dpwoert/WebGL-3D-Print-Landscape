geo = {
	APIurl: 'http://api.citysdk.waag.org/nodes',

	radius: 4, //km
	center: [51.697816,5.303675]

};

Meteor.startup(function(){

	//load database
	geo.buildingsDB = new Meteor.Collection('buildings');

	//share it
	Meteor.publish("all-buildings", function() {
		return geo.buildingsDB.find({});
	});

});

Meteor.methods({

	getCity: function(pos, radius){

		//use standard data when no parameters are given
		if(!pos || !radius){
			pos = geo.center;
			radius = geo.radius;
		}

		console.log("====== Start Fetching city =======")

		geo.makeCall({
			'pos': pos,
			'radius': radius
		});

	}

});

geo.makeCall = function(obj){

	var options = {
		lat: obj.pos[0],
		lon: obj.pos[1],
		radius: 1000*obj.radius,
		layer: 'bag.panden',
		geom: true,
		per_page: 1000,
		page: 0
	};

	getPage();

	function getPage(){

		//measure no calls
		options.page += 1;
		console.log('get BAG page: ' + options.page)

		//make request
		Meteor.http.get(geo.APIurl, { params: options } , function(error, result){

			//add to data object
			_.each(result.data.results, function(value){
				geo.addBag(value);
			});

			//check if finished/more pages
			if(result.data.results.length < obj.per_page){

				//finished
				console.log('finshed gettings BAG data');
				console.log('records added:' + geo.buildingsDB.find().fetch().length);

			} 
			else {
				getPage();
			}
		});
	}

};

geo.addBag = function(obj){

	var geoCenter = geo.getCenter(obj.geom.coordinates[0]);
	var bagID = obj.layers['bag.panden'].data.pand_id;

	//insert into database
	geo.buildingsDB.insert({
		id: bagID,
		bouwjaar: obj.layers['bag.panden'].data.bouwjaar,
		geom: obj.geom,
		lat: geoCenter[0],
		lon: geoCenter[1]
	});
};

geo.getCenter = function(arr){
    var x = arr.map(function(a){ return a[0] });
    var y = arr.map(function(a){ return a[1] });
    var minX = Math.min.apply(null, x);
    var maxX = Math.max.apply(null, x);
    var minY = Math.min.apply(null, y);
    var maxY = Math.max.apply(null, y);
    return [(minX + maxX)/2, (minY + maxY)/2];
};