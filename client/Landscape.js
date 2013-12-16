Landscape = function(){

	//center point
	this.geo = {
		lat: null,
		lon: null,
		radius: null
	};

	//nr of lines on on axis
	this.accuracy = 50;
	// this.accuracy = 250;

	//range
	this.range = function(input){ return input; };

	//material
	this.material = new THREE.MeshLambertMaterial({
    	color: 0xFFFFFF,
    	shading: THREE.FlatShading,
    	// wireframe: true
    }); 

	//data
	this.data = [];

	//init - create 3d object
	this.init = function(){

		//make 3d object
		this.geometry = new THREE.PlaneGeometry(3000,3000,this.accuracy,this.accuracy);
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.mesh.rotateX(-Math.PI/2);

		//make boundingbox
		this.box = getBoundingBox(this.geo.lat,this.geo.lon,this.geo.radius*2);
		this.geoPoint = new GeoPoint(this.geo.lat, this.geo.lon);
		this.BBOX = this.geoPoint.boundingCoordinates(this.geo.radius, null, true);

		//add point array
		for(var i = 0; i < Math.pow(this.accuracy, 2) ; i++ ){
			this.data.push([]);
		}

	};


	//add points
	this.addPointGeo = function(lat, lon, value, weight){

		//geo to point
		//var x = Math.round( ( (lat-this.box[0]) / Math.abs(this.box[0]-this.box[1])) * this.accuracy );
		//var y = Math.round( ( (lon-this.box[2]) / Math.abs(this.box[2]-this.box[3]) ) * this.accuracy );

		var x = Math.round( ( (lat-this.BBOX[0].latitude()) / Math.abs(this.BBOX[0].latitude()-this.BBOX[1].latitude())) * this.accuracy );
		var y = Math.round( ( (lon-this.BBOX[0].longitude()) / Math.abs(this.BBOX[0].longitude()-this.BBOX[1].longitude()) ) * this.accuracy );
		y = this.accuracy - y;

		//check if in plane
		if(x >= 0 && x < this.accuracy && y >= 0 && y < this.accuracy){
			this.addPoint(x, y, value, weight);
		} else {
			console.log('not in plane');
		}

	};

	this.addPoint = function(x, y, value, weight){
		var i = (this.accuracy*y) + x;
		this.data[i].push({
			'value': value,
			'weight': weight
		});
	}

	this.changePoint = function(i, height, update){

		if( isNaN(height) ){
			height = -100;
			console.log('no height data');
		} 

		this.geometry.vertices[i].z = height;
		if(update) this.updateGeometry();

	};

	//build
	this.build = function(){

		//loop through all grid-points
		for( var grid = 0 ; grid < Math.pow(this.accuracy,2) ; grid++ ){

			var _point = this.data[grid];
			var total = 0;
			var weights = 0;

			//loop through all points
			for( var pointNr = 0 ; pointNr < _point.length ; pointNr++ ){

				var point = _point[pointNr];
				total += point.value * point.weight;
				weights += point.weight;

			}

			//get average
			var avg = total/weights;

			//range
			avg = this.range(avg);

			//modify grid point
			this.changePoint(grid, avg);

		}

		//update in 3d world
		this.updateGeometry();

		//finish
		this.finished();

	};

	//update geometry
	this.updateGeometry = function(){
		this.geometry.verticesNeedUpdate = true;
		THREE.GeometryUtils.triangulateQuads( this.geometry );
	}

	//execute when finished
	this.finished = function(){};


};