import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/1.png"); // test others from 1 to 8
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg"); // try it with 5.jpg as well

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * MeshBasicMaterial
 */
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0xff0000);
// material.wireframe = true;

// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture; // if texture is white = visible and black = invisible

// material.side = THREE.DoubleSide; // use double side only when necessary because can affect performance

/**
 * MeshNormalMaterial
 */
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

/**
 * MeshMatcapMaterial
 */
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

/**
 * MeshDepthMaterial
 */
// const material = new THREE.MeshDepthMaterial();

/**
 * MeshLambertMaterial
 * - Needs light
 * - Same as basic material but with some extra stuff for lights
 * - It's the most performant material that uses lights, but the parameters
 *   aren't convenient and you can see strange patterns if you look closely
 *   at rounded geometries like spheres
 * - If it looks good use it, otherwise move to other materials that use lights
 *   like MeshPhongMaterial
 */
// const material = new THREE.MeshLambertMaterial();

/**
 * MeshPhongMaterial
 * - Needs light
 * - The glitches that appear on MeshLambertMaterial are gone here
 * - Less performant than MeshLambertMaterial because there are more features,
 *   it doesn't matter much if you have just a few objects
 * - The problem with this one is that the parameters are not very realistic,
 *   it's arbitrary values used by the algorithm and it's hard to make something
 *   realistic with that. To get something more realistic, we need to move
 *   to more realistic materials, see MeshStandardMaterial.
 */
// const material = new THREE.MeshPhongMaterial();
// // With the two below we get the reflection from the point light (not ambient)
// material.shininess = 100; // light reflection intensity
// material.specular = new THREE.Color(0x1188ff); // light reflection colour

/**
 * MeshToonMaterial
 * - Needs light
 * - Toon effect, the technique is called cell shading and can be seen on games
 *   like Zelda Wind Waker
 * - Performance is ok
 */
// const material = new THREE.MeshToonMaterial();
// // By default, we only get a two-part coloration (one for shadow, one for light)
// // To add more steps, we can use the gradientTexture on the gradientMap prop
// material.gradientMap = gradientTexture;
// // If we use only the gradientMap above, due to mipmapping,
// // the GPU will blend (stretch) the texture pixels.
// // We can manipulate the mipmapping via
// // minFilter (texture is big and gets squeezed) and
// // magFilter (texture is too small and stretches)
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// // Since we are not using mipmapping anymore (not being stretch),
// // due to minFilter and magFilter changes, we can deactivate mipmapping
// gradientTexture.generateMipmaps = false;

/**
 * MeshStandardMaterial
 * - needs light
 * - uses physically based rendering principles, supports lights
 *   but with a more realistic algorithm and better parameters like
 *   roughness and metalness
 * - it's called standard because the PBR (physically based rendering)
 *   has become the standard in many softwares, engines and libs
 * - gets a realistic output with realistic parameters, and similar result
 *   regardless of the tech being used (Unity, Unreal, Blender or 3js).
 *   similar because we don't have access to the raytracing stuff
 */
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColorTexture;

// // aoMap create shadows where is dark in the image,
// // light does no affect those areas
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;

// // Places in the image where the pixels are bright, the surface will go up
// // and where they are dark, it goes down (or not as high)
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;

// // restrict the metalness to certain areas
// // Note: if you add a material.metalness = 0.7, the metalnessMap will be multiplied
// // by 0.7, affecting the metalness result
// material.metalnessMap = doorMetalnessTexture;
// // specify where in the texture the pixels should be rough,
// // like the metals in the door, they are more rusty and likely to be rough.
// // Note: if you add a material.roughness = 0.2, the roughnessMap will be multiplied
// // by 0.2, resulting in a very small roughness
// // Note 2: the texture was made to look like there is a varnish coating on the wood,
// // that's why it looks smooth. the artist who created the texture made it like that
// material.roughnessMap = doorRoughnessTexture;
// // adds details to the texture, more depth to lines
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);

// // alphaMap needs "transparent" to work
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);

/**
 * MeshPhysicalMaterial
 * - needs light
 * - even more realistic
 * - worst in performance
 * - same as MeshStandardMaterial with additional effects:
 *   clearcoat, sheen, iridescence, transmission
 * - below you gonna see the same props added for StandardMaterial above
 */
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

// // clearcoat simulates a thin layer of varnish on top of the actual material (like a glass)
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

// // sheen highlights the material when seen from narrow angle. usually on fluffy material like fabric.
// // called flannel effect as well
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);
// gui.add(material, "sheen").min(0).max(1).step(0.0001);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
// gui.addColor(material, "sheenColor");

// // iridescence creates colours artifacts like fuel puddle, soap bubbles or even laser disks
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];
// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.0001); // if goes above 2.333, we create materials that don't exists in real life
// gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);

// transmission enables light to go through the material
// more than just transparency with opacity because the image behind the object gets deformed
// Note: looks really good on pure material tto, test it commenting out all the other props and
// keep metalness and roughness at 0 (not 1). it gives you a blur effect tweaking these values
material.transmission = 1;
// IOR, index of refraction, depends on the type of material you want to simulate:
// diamond: 2.417
// water: 1.333
// air: 1.000293
// More: https://en.wikipedia.org/wiki/List_of_refractive_indices
material.ior = 1.5;
material.thickness = 0.5;
gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Environment map
 * - compatible with MeshStandardMaterial, MeshLambertMaterial
 *   and MeshPhongMaterial
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
