import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Cursor
 */
const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  // Instead of using clientX directly and values
  // ranging from 0 to viewport width, we can divide the clientX position
  // per the area width, creating a amplitude/range from 0 to 1
  // Note: if your canvas has the viewport size, you can use clientX
  cursor.x = event.clientX / sizes.width;
  cursor.y = event.clientY / sizes.height;

  // To make things better we can deduct 0.5 from the result
  // and make it range from -0.5 to 0.5, so the camera can move
  // left and right easily
  cursor.x = cursor.x - 0.5;
  cursor.y = cursor.y - 0.5;
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

/**
 * Perspective Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

/**
 * Orthographic Camera
 *
 * If we use left = -1 and right = 1, the camera area will be stretched
 * to fit the canvas size (800x600), and that would make the cube flat.
 * If we changed the canvas size to 800x800, we would get a perfect cube.
 * To keep using a rectangle canvas, we can use the aspect ratio on
 * the left and right to make the camera width larger than the height.
 */
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
// smooth the animation, controls need to be updated on tick
controls.enableDamping = true;
// controls.target.y = 1;
// controls.update();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.y = elapsedTime;

  // // Cursor controls - move camera in front on the cube
  // camera.position.x = cursor.x * 10;
  // // We use minus/invert the value here to match 3js y values.
  // // cursor.y is -0.5 at the top and 0.5 at the bottom while
  // // 3js y is positive going up and negative going down
  // camera.position.y = -cursor.y * 10;

  // // Cursor controls - move camera around the cube
  // // Horizontal movement (full rotation)
  // // sin and cos, when combined and used with the same angle,
  // // enable us to place things on a circle
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // // Vertical movement
  // camera.position.y = cursor.y * 5;

  // camera.lookAt(mesh.position);

  // Update controls for damping
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
