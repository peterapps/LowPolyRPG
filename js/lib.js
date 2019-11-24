function createGround(){
	var width = 100;
	var height = 100;
	var geometry = new THREE.PlaneGeometry(width, height);
	var material = new THREE.MeshBasicMaterial({color: 0x00aa00, side: THREE.DoubleSide});
	var plane = new THREE.Mesh(geometry, material);
	plane.rotateX(Math.PI / 2);
	return plane;
}

function createTree(){
	var geo = new THREE.Geometry();
	var level1 = new THREE.ConeGeometry(1.5, 2, 8);
	level1.translate(0, 4, 0);
	geo.merge(level1);
	var level2 = new THREE.ConeGeometry(2, 2, 8);
	level2.translate(0, 3, 0);
	geo.merge(level2);
	var level3 = new THREE.ConeGeometry(3, 2, 8);
	level3.translate(0, 2, 0);
	geo.merge(level3);
	var mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color: 0x009900}));

	var trunk = new THREE.CylinderGeometry(0.5, 0.5, 2);
	trunk.translate(0, 0, 0);
	var trunk_mesh = new THREE.Mesh(trunk, new THREE.MeshLambertMaterial({color: 0xbb6600}));

	var group = new THREE.Group();
	group.add(mesh);
	group.add(trunk_mesh);
	return group;
}

// Cloud

function map(val, min1, max1, min2, max2){
	return (max2 - min2) * (val - min1) / (max1 + min1) + min2;
}

function jitter(geo, per){
	geo.vertices.forEach(function(v){
		v.x += map(Math.random(), 0, 1, -per, per);
		v.y += map(Math.random(), 0, 1, -per, per);
		v.z += map(Math.random(), 0, 1, -per, per);
	});
}

function chopBottom(geo, bottom){
	geo.vertices.forEach(function(v){
		v.y = Math.max(v.y, bottom);
	});
}

function createCloud(){
	var geo = new THREE.Geometry();
	var tuft1 = new THREE.SphereGeometry(1.5, 7, 8);
	tuft1.translate(-2, 0, 0);
	geo.merge(tuft1);
	var tuft2 = new THREE.SphereGeometry(1.5, 7, 8);
	tuft2.translate(2, 0, 0);
	geo.merge(tuft2);
	var tuft3 = new THREE.SphereGeometry(2.0, 7, 8);
	tuft3.translate(0, 0, 0);
	geo.merge(tuft3);
	jitter(geo, 0.2);
	chopBottom(geo, -0.5);
	geo.computeFlatVertexNormals();
	var material = new THREE.MeshLambertMaterial({color: 'white', flatShading: true});
	var cloud = new THREE.Mesh(geo, material);
	return cloud;
}
