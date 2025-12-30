import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import rawVertexShader from "./shaders/raw/vertex.glsl";
import rawFragmentShader from "./shaders/raw/fragment.glsl";

// import normalVertexShader from "./shaders/normal/vertex.glsl";
// import normalFragmentShader from "./shaders/normal/fragment.glsl";

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
const flagTexture = textureLoader.load("/textures/flag-french.jpg");

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

/**
 * 3. Bumpy effect with custom attribute (see shaders)
 */
// Add a custom attribute (aRandom) to the geometry
const count = geometry.attributes.position.count; // Get the number of vertices in the geometry (32 + 1) × (32 + 1) = 33 × 33 = 1089 vertices
const randoms = new Float32Array(count); // Create a Float32Array to hold the random values
for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}
// For every vertex, attach 1 float called aRandom
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// Raw Shader Material (for 1, 2, 3 and 4 topics)
const material = new THREE.RawShaderMaterial({
  vertexShader: rawVertexShader,
  fragmentShader: rawFragmentShader,
  transparent: true,
  // 4. Uniforms (animated flag) (see shaders)
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: flagTexture },
  },
});

// Shader Material
// Does not need to add projectionMatrix, viewMatrix, modelMatrix uniforms to shaders
// const material = new THREE.ShaderMaterial({
//   vertexShader: normalVertexShader,
//   fragmentShader: normalFragmentShader,
//   transparent: true,
//   // 4. Uniforms (animated flag) (see shaders)
//   uniforms: {
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//     uTime: { value: 0 },
//     uColor: { value: new THREE.Color("orange") },
//     uTexture: { value: flagTexture },
//   },
// });

// 4. Uniforms (animated flag) GUI
gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyX");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyY");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3; // 4. Uniforms (animated flag)
scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
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

  // 4. Uniforms (animated flag)
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
