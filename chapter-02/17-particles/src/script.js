import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;

// Float array is a performant way to handle positions
// You have a sequential array where indexes 0, 1, 2 will be one position (x, y, z values)
// 3, 4, 5 another position, 6, 7, 8 another. If we want to have 500 points,
// then we need to multiply it by 3 to have slots for x, y, z of each position
const positions = new Float32Array(count * 3); // x, y, z
const colors = new Float32Array(count * 3); // r, g, b (needs to activate "particlesMaterial.vertexColors" to work)

// Fill the array with position values
for (let i = 0; i < positions.length; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true; // create perspective, far particles are small and the close ones big
// particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.vertexColors = true; // this is to make colors being added via array above to work
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// When we apply the texture to a particle we have issues with transparency
// Due to the order they are created, the GPU has a hard time identifying which
// ones are in front of each other, so you can see edges, not fully transparent

// First solution would be set alphaTest, telling from each point the alpha should be rendered
// It is not perfect but could be a good solution for some situations
// particlesMaterial.alphaTest = 0.001;

// Second solution, deactivating alphaTest.
// This make the GPU stop to try to guess if the elements are in front of each other.
// It works but we shouldn't do it. We gonna have bugs if we have elements with different colours
// E.g: when adding a white cube among the particles you gonna be able to see particles in the middle
// of the cube, when they shouldn't be visible since they are behind it.
// particlesMaterial.depthTest = false;

// Third solution:
// The WebGL is testing if what's being drawn is closer than what's already drawn.
// The depth of what's being drawn is stored in what we call a depth buffer.
// Instead of not testing if the particle is closer than what's in this depth buffer,
// we can tell the WebGL not to write particles in that depth buffer.
// It might lead to some bugs sometimes but in general a good solution.
particlesMaterial.depthWrite = false;

// Makes colors blend. With the transparency and blend, when particles are
// on top of each other, they make colors brighter
particlesMaterial.blending = THREE.AdditiveBlending;

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Cube
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update group of particles
  // particles.rotation.y = elapsedTime * 0.2;

  // IMPORTANT: This is an example on how we could animate the positions
  // and it is alright to do it if we had like 15 particles.
  // We shouldn't do the wave effect this way if we have a lot of particles,
  // we should use custom shaders instead (will learn it in the future)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const xIndex = i3 + 0;
    const yIndex = i3 + 1;
    // We need to create an offset to create an wave effect, so we add the x position to the elapsedTime
    const xValue = particlesGeometry.attributes.position.array[xIndex];
    particlesGeometry.attributes.position.array[yIndex] = Math.sin(
      elapsedTime + xValue
    );
    // we need the below otherwise particles won't animate.
    // we need to inform three.js they are changing
    particlesGeometry.attributes.position.needsUpdate = true;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
