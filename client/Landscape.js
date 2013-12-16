Landscape = function(){

	//center point
	this.geo = {
		lat: null,
		lon: null,
		radius: null
	};

	//nr of lines on on axis
	this.accuracy = 50;
	// this.accuracy = 100;

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
		this.box = getBoundingBox(this.geo.lat,this.geo.lon,this.geo.radius*4);
		this.geoPoint = new GeoPoint(this.geo.lat, this.geo.lon);
		this.BBOX = this.geoPoint.boundingCoordinates(this.geo.radius, null, true);
		this.rows = Math.sqrt(this.geometry.vertices.length);

		//add point array
		for(var i = 0; i < Math.pow(this.rows, 2) ; i++ ){
			this.data.push([]);
		}

	};

	//geo
	this.toGrid = function(lat, lon){

		var x = lat2x(lat, this.accuracy, this.geo.lat, this.geo.lon, this.geo.radius );
		var y = lon2y(lon, this.accuracy, this.geo.lat, this.geo.lon, this.geo.radius );
		y = this.accuracy - y;

		return {
			'x': x,
			'y': y
		};

	}

	//add points
	this.addPointGeo = function(lat, lon, value, weight, update){

		//geo to point
		var pos = this.toGrid(lat, lon);

		//check if in plane
		if(pos.x >= 0 && pos.x < this.accuracy && pos.y >= 0 && pos.y < this.accuracy){
			this.addPoint(pos.x, pos.y, value, weight);
		} else {
			console.log('not in plane');
		}

	};

	this.addPoint = function(x, y, value, weight){
		var i = (this.rows * y) + x;
		this.data[i].push({
			'value': value,
			'weight': weight
		});
	};

	this.changePointGeo = function(lat, lon, height){

		//geo to point
		var pos = this.toGrid(lat, lon);

		var i = (this.rows * pos.y ) + pos.x;

		this.changePoint(i, height, true);

	};

	this.changePoint = function(i, height, update){

		if( isNaN(height) ){
			height = -100;
			console.log('no height data');
		} 

		this.geometry.vertices[i].z = height;
		if(update) this.updateGeometry();

	};

	//regions
	this.addGeoRegion = function(list){

		list2 = [];

		for(var i = 0; i < list.length ; i++ ){

			//geo to point
			var pos = this.toGrid(list[i][1], list[i][0]);

			if(pos.x >= 0 && pos.x < this.accuracy && pos.y >= 0 && pos.y < this.accuracy){
				list2.push(pos);
			}

		}

		this.addRegion(list2);

	};

	this.addRegion = function(list){

		var path = [];

		//add points
		for(var i = 0; i < list.length ; i++ ){

			var i2 = i;
			if(i == list.length-1) i2 = 0;

			//get grid point
			var pointNr = (this.rows * list[i2].y) + list[i2].x;
			var vertex = this.geometry.vertices[pointNr];

			//points
			var point = new THREE.Vector3( vertex.x , vertex.y , 300 );
			path.push(point);

		}

		//make path
		var path3D = new THREE.SplineCurve3(path);
		var tube = new THREE.TubeGeometry(path3D, 40, 10, 40, true, false);
		var mesh = new THREE.Mesh(tube, this.material)
		mesh.rotateX(-Math.PI/2);
		//THREE.GeometryUtils.merge(this.mesh,tube);

		DDD.scene.add( mesh );


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
	};

	//execute when finished
	this.finished = function(){};

	//export to 3d object
	this.exporter = function(){
		var exporter = new THREE.ObjectExporter();

		var output = JSON.stringify( exporter.parse( this.mesh ), null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		// console.save(output, 'MODEL.json');
		THREE.saveGeometryToObj(this.geometry,true);
	};


};