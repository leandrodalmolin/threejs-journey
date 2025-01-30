import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Time
// let time = Date.now();

// Clock
// const clock = new THREE.Clock();

// GSAP (has its own tick but it needs the render.renderer() on the tick below)
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

// Animations
const tick = () => {
  // Time
  // We base our animation on how much time was spent since the last frame,
  // this rotation speed will be the same on every screen and every computers regardless of the frame rate.
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  // mesh.rotation.y += 0.001 * deltaTime;

  // Update objects - Clock
  // const elapsedTime = clock.getElapsedTime();
  // mesh.rotation.y = elapsedTime;
  // mesh.rotation.y = elapsedTime * Math.PI * 2; // One revolution per second
  // Circular movement
  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);
  // Circular camera movement
  // camera.position.x = Math.cos(elapsedTime);
  // camera.position.y = Math.sin(elapsedTime);
  // camera.lookAt(mesh.position); // Circular move but always looking at the cube

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
