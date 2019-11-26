// Ground plane

function createGround(){
	var width = 100;
	var height = 100;
	var geometry = new THREE.PlaneGeometry(width, height);
	var material = new THREE.MeshBasicMaterial({color: 0x00aa00, side: THREE.DoubleSide});
	var plane = new THREE.Mesh(geometry, material);
	plane.rotateX(Math.PI / 2);
	return plane;
}

// Tree mesh
// https://blog.mozvr.com/procedural-geometry-trees/

function createTree(){
	var geo = new THREE.Geometry();
	var level1 = new THREE.ConeGeometry(15, 20, 8);
	level1.translate(0, 40, 0);
	geo.merge(level1);
	var level2 = new THREE.ConeGeometry(20, 20, 8);
	level2.translate(0, 30, 0);
	geo.merge(level2);
	var level3 = new THREE.ConeGeometry(30, 20, 8);
	level3.translate(0, 20, 0);
	geo.merge(level3);
	var mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color: 0x009900}));

	var trunk = new THREE.CylinderGeometry(5, 5, 20);
	trunk.translate(0, 0, 0);
	var trunk_mesh = new THREE.Mesh(trunk, new THREE.MeshLambertMaterial({color: 0xbb6600}));

	var group = new THREE.Group();
	group.add(mesh);
	group.add(trunk_mesh);
	return group;
}

// Cloud
// https://blog.mozvr.com/procedural-geometry-low-poly-clouds/

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
	var tuft1 = new THREE.SphereGeometry(15, 70, 8);
	tuft1.translate(-2, 0, 0);
	geo.merge(tuft1);
	var tuft2 = new THREE.SphereGeometry(15, 70, 8);
	tuft2.translate(2, 0, 0);
	geo.merge(tuft2);
	var tuft3 = new THREE.SphereGeometry(20, 70, 8);
	tuft3.translate(0, 0, 0);
	geo.merge(tuft3);
	jitter(geo, 2);
	chopBottom(geo, 5);
	geo.computeFlatVertexNormals();
	var material = new THREE.MeshLambertMaterial({color: 'white', flatShading: true});
	var cloud = new THREE.Mesh(geo, material);
	return cloud;
}

// Sprite
// http://stemkoski.github.io/Three.js/Texture-Animation.html

class Sprite {
	constructor(json_path, callback){
		this.callback = callback;
		this.get_json(json_path, this.init.bind(this));
	}

	get_json(href, callback){
		var req = new XMLHttpRequest();
		req.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				var data = JSON.parse(this.responseText);
				callback(data);
			}
		};
		req.open("GET", href, true);
		req.send();
	}

	init(data){
		this.image = new Image();
		this.image.src = data.image;
		var canvas = document.createElement("canvas");
		canvas.width = 64;
		canvas.height = 128;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.texture = new THREE.CanvasTexture(this.canvas);
		this.material = new THREE.MeshBasicMaterial({map: this.texture, transparent: true});
		this.geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.rows = data.rows;
		this.cols = data.columns;
		this.frameWidth = data.frameWidth;
		this.frameHeight = data.frameHeight;
		this.animations = data.animations;
		this.timer = 0;

		var cb = this.callback.bind(this);
		var sf = this.setFrame.bind(this);
		this.playing = false;

		this.image.onload = function(){
			sf(0);
			cb();
		};
	}

	setFrame(i){
		var x = this.frameWidth * (i % this.cols);
		var y = this.frameHeight * Math.floor(i / this.cols);
		this.ctx.clearRect(0, 0, this.frameWidth, this.frameHeight);
		this.ctx.drawImage(this.image, x, y, this.frameWidth, this.frameHeight, 0, 0, this.canvas.width, this.canvas.height);
		this.texture.needsUpdate = true;
	}

	play(key){
		this.playing = this.animations[key];
		this.timer = 0;
		this.currentFrame = 0;
		this.setFrame(0);
	}

	update(){
		if (this.playing && this.timer % 6 == 0){
			var numFrames = this.playing.frames.length;
			// If it's the last frame and no more repeats
			if (this.currentFrame == numFrames - 1 && this.playing.repeat == 0){
				this.playing = false;
				return;
			}
			// If there's still room to increment the current frame
			this.currentFrame = (this.currentFrame + 1) % numFrames;
			this.setFrame(this.playing.frames[this.currentFrame]);
		}
		this.timer++;
	}
}
