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
    	color: 0x0000FF,
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
		this.box = getBoundingBox(this.geo.lat,this.geo.lon,this.geo.radius);

		//add point array
		for(var i = 0; i < Math.pow(this.accuracy, 2) ; i++ ){
			this.data.push([]);
		}

	};


	//add points
	this.addPointGeo = function(lat, lon, value, weight){

		//geo to point
		var x = Math.round(lat2x(lat,this.accuracy, this.geo.lat,this.geo.lon,this.geo.radius));
		var y = Math.round(lon2y(lon,this.accuracy, this.geo.lat,this.geo.lon,this.geo.radius));

		//console.log(x, y);

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