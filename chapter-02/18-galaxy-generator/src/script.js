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
 * Galaxy
 */
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.02;
parameters.randomnessPower = 3;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  // Destroy so they can be recreated when we tweak the GUI
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  // Instead of using positions count, we loop 1/3 of the array and fill it 3 by 3
  // to have more control of what it's being added
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    /**
     * Positioning
     */
    const radius = Math.random() * parameters.radius;
    // curve shape of the branch. move point position according to the distance to 0
    const spinAngle = radius * parameters.spin;

    // We can use Math.cos(...) and Math.sin(...) to position the particles on those branches.
    // We first calculate an angle with the modulo (%), divide the result by
    // the branches count parameter to get an angle between 0 and 1,
    // and multiply this value by Math.PI * 2 to get an angle between 0 and
    // a full circle. We then use that angle with Math.cos(...) and Math.sin(...)
    // for the x and the z axis and we finally multiply by the radius

    // i % 3 will give us 0 1 2, 0 1 2, 0 1 2...
    const branch = i % parameters.branches;
    // Convert the 0 1 2 in a range of 0 to 1, like 0 0.33 0.66, 0 0.33 0.66...
    const branchNormalized = branch / parameters.branches;
    const branchAngle = branchNormalized * Math.PI * 2;

    // This add the randomness but the result has a square shape that is not ideal
    // const randomX = (Math.random() - 0.5) * parameters.randomness;
    // const randomY = (Math.random() - 0.5) * parameters.randomness;
    // const randomZ = (Math.random() - 0.5) * parameters.randomness;

    // Using power, we gonna have a bigger density of point next to the origin
    // and less density as the value goes far from origin.
    // The problem is that we can't use a negative value with Math.pow().
    // What we will do is calculate the power then multiply it by -1 randomly.
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    // We can also add parameters.randomness * radius and density will be bigger at
    // the centre of the galaxy (instead of doing the one above)
    // const randomX =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1) *
    //   parameters.randomness *
    //   radius;
    // const randomY =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1) *
    //   parameters.randomness *
    //   radius;
    // const randomZ =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1) *
    //   parameters.randomness *
    //   radius;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX; // x
    positions[i3 + 1] = randomY; // y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // z

    /**
     * Color
     */
    const mixedColor = colorInside.clone();
    const alpha = radius / parameters.radius; // gets the radius size ranging from 0 to 1
    mixedColor.lerp(colorOutside, alpha);

    colors[i3] = mixedColor.r; // r
    colors[i3 + 1] = mixedColor.g; // g
    colors[i3 + 2] = mixedColor.b; // b
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();

/**
 * GUI
 */
gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
