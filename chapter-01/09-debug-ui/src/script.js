import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI({
  width: 300,
  title: "Nice debug UI",
  // closeFolders: true,
});
// gui.close();
// gui.hide(); // to be used with the key event below
const debugObject = {};

// Access debug via key "H", to be used with gui.hide()
window.addEventListener("keydown", (event) => {
  if (event.key == "h") {
    gui.show(gui._hidden);
  }
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
debugObject.color = "#a778d8";

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * lil-gui folders
 */
const cubeTweaks = gui.addFolder("Awesome cube");
// cubeTweaks.close();

/**
 * Debug - Range
 */
// gui.add(mesh.position, "y", -3, 3, 0.01);
cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");

/**
 * Debug - Checkbox
 */
cubeTweaks.add(mesh, "visible");
cubeTweaks.add(material, "wireframe");

/**
 * Debug - Colours
 */
// Just an example, but it's better to use the debugObject solution instead.
// This solution is not ideal to share with other people.
//
// // If you try to take the colour value from the GUI and
// // apply it to the colour property, you end up with the wrong colour.
// // This is because 3js applies some color management in order
// // to optimise the rendering.
// // Not the best solution but we can leverage onChange() and getHexString()
// // to get the real colour.
// gui
//   // if we do only this, the GUI won't reflect the right colour
//   .addColor(material, "color")
//   // Get real colour
//   .onChange((value) => {
//     const realColor = value.getHexString();
//     console.log(realColor);
//   });

// debugObject solution
cubeTweaks.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});

/**
 * Debug - Function / Buttons
 */
debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};
cubeTweaks.add(debugObject, "spin");

/**
 * Debug - Geometries
 *
 * We can't tweak "widthSegments" directly using lil-gui
 * because "widthSegments" isn’t a property of the geometry.
 * "widthSegments" is only a parameter that we send to the
 * BoxGeometry when we instantiate it. It’ll be used to generate
 * the whole geometry only once.
 * Since it’s not an actual property, we need to add a
 * subdivision property to the debugObject object and
 * build a brand-new geometry when it changes.
 */
debugObject.subdivision = 2;
cubeTweaks
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  // Don't use onChange (performance)
  .onFinishChange(() => {
    // Always remember to dispose (performance)
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
