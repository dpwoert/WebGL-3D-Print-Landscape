window.DDD = {};

DDD.init = function(){

	//camera
	DDD.camera = new THREE.PerspectiveCamera( 45 , window.innerWidth / window.innerHeight, 0.1, 4000 );
    DDD.camera.position.z = 500;
    DDD.camera.position.y = 200;
    // DDD.camera.rotation.order = "YXZ";

    //make scene
    DDD.scene = new THREE.Scene();

    //start
    DDD.renderer = new THREE.WebGLRenderer();
    DDD.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( DDD.renderer.domElement );

    //light
    DDD.hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
 	DDD.scene.add(DDD.hemisphere);

    //controls
    DDD.addControls();

    //timer and start
    DDD.clock = new THREE.Clock();
    DDD.animate();


    return DDD.scene;
	
};

DDD.addControls = function(){

	DDD.controls = new THREE.FirstPersonControls( DDD.camera );

	DDD.controls.movementSpeed = 100;
	DDD.controls.lookSpeed = 0.125;
	DDD.controls.lookVertical = true;
	DDD.controls.constrainVertical = true;
	DDD.controls.verticalMin = 1.4;
	DDD.controls.verticalMax = 2.2;

};

DDD.animate = function(){

	//shedule next frame
    requestAnimationFrame( DDD.animate );

    //update
    DDD.controls.update( DDD.clock.getDelta() );

    //render
    DDD.renderer.render( DDD.scene, DDD.camera );

};