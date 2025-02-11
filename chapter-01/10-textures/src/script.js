import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures - Manual
 *
 * This is an example of what is going on in the background.
 * We should actually use the TextureLoader class to load a texture.
 */
// const image = new Image();
// const texture = new THREE.Texture(image);
// texture.colorSpace = THREE.SRGBColorSpace; // Textures used as "map" and "matcap" are supposed to be encoded in sRGB
// image.addEventListener("load", () => {
//   texture.needsUpdate = true;
// });
// image.src = "/textures/door/color.jpg";

/**
 * Textures - Class
 */
const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => console.log("onStart");
// loadingManager.onLoad = () => console.log("onLoad");
// loadingManager.onProgress = () => console.log("onProgress");
// loadingManager.onError = () => console.log("onError");

const textureLoader = new THREE.TextureLoader(loadingManager);
// Color texture
const colorTexture = textureLoader.load(
  // "/textures/door/color.jpg"
  // "/textures/checkerboard-8x8.png"
  "/textures/minecraft.png"
  // "/textures/checkerboard-1024x1024.png"
  // () => console.log("load"),
  // () => console.log("progress"),
  // () => console.log("error")
);
// Textures used as "map" and "matcap" are supposed to be encoded in sRGB.
// In the latest versions of Three.js we need to specify it by setting their colorSpace to THREE.SRGBColorSpace
colorTexture.colorSpace = THREE.SRGBColorSpace;
// Other textures
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

/**
 * Texture transformations
 */
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;

// Instead of stretching the texture repeats
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// Instead of stretching the texture repeats changing the orientation of the next one
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// When you rotate, the pivot point is bottom left.
// You can change it to the center, changing the center coords
// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

/**
 * Filtering and Mipmapping
 *
 * Mipmapping is a technic that consists of creating
 * half size version of a texture again and again until we get a 1x1 texture
 * and use it to make pixels blurry when necessary
 * E.g: 4x4, 2x2, 1x1
 */
// minification filter: happens when the texture is too big for the surface it covers
// and we can change the minFilter as per below.
colorTexture.minFilter = THREE.NearestFilter;
// when we use THREE.NearestFilter on minFilter we don't need mipmapping so we can deactivate them (performance)
colorTexture.generateMipmaps = false;

// magnification filter: happens when the texture is too small for the surface it covers
// NOTE: THREE.NearestFilter is cheaper than the other ones. performs better
colorTexture.magFilter = THREE.NearestFilter;

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
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
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
