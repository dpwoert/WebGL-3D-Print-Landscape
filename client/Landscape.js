Landscape = function(){

	//center point
	this.geo = {
		lat: null,
		lon: null,
		radius: null
	};

	//nr of lines on on axis
	this.accuracy = 500;

	//material
	this.material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });

	//init - create 3d object
	this.init = function(){

		this.geometry = new THREE.PlaneGeometry(3000,3000,50,50);
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.mesh.rotateX(-Math.PI/2);

	};

	//return lat-lon
	this.translatePoint = function(i){

	};

	this.changePoint = function(i, height){

		this.geometry.vertices[i].z = height;
		this.geometry.verticesNeedUpdate = true;

	};

};