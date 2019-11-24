// Scene
var scene = new THREE.Scene();
scene.background = new THREE.Color( "skyblue" );

// Camera
const field_of_view = 75;
const aspect_ratio = window.innerWidth / window.innerHeight;
const near_clip = 0.1;
const far_clip = 1000;
var camera = new THREE.PerspectiveCamera(field_of_view, aspect_ratio, near_clip, far_clip);
camera.position.set(0, 7, 15);
camera.lookAt(0, 0, 0);

// Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
var light = new THREE.DirectionalLight(0xffffff, 0.7);
light.position.set(1, 1, 0).normalize();
scene.add(light);
var light2 = new THREE.DirectionalLight(0xffffff, 0.7);
light2.position.set(-3, -1, 0).normalize();
scene.add(light2);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// Object for the scene
var ground = createGround();
scene.add(ground);

var tree = createTree();
tree.position.set(1, 2, 0);
scene.add(tree);

var cloud = createCloud();
cloud.position.set(-5, 7, -1);
scene.add(cloud);

// Animate loop
function animate(){
	requestAnimationFrame(animate);
	
	
	
	renderer.render(scene, camera);
}
animate();
