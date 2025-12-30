    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;

    // 4. Uniforms (animated flag)
    uniform vec2 uFrequency;
    uniform float uTime;
    attribute vec2 uv; // native
    varying vec2 vUv; // To pass the UV coordinates to the fragment shader
    varying float vElevation;

    // Come from the attributes of the geometry (do console.log on a geometry to see all attributes)
    // - position: for vertex positions (vec3)
    // - uv: for texture coordinates (vec2)
    // - normal: for normals that are used for lighting calculations (vec3)
    attribute vec3 position;
    
    // 3. Bumpy effect custom attributes and varying
    // attribute float aRandom;
    // varying float vRandom; // To pass the random value to the fragment shader if needed

    void main() {
      //
      // 1. One line positioning
      //
      // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

      //
      // 2. Separated steps for granular control (positioning)
      //
      // vec4 modelPosition = modelMatrix * vec4(position, 1.0); // Mesh (position, rotation, scale)
      // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1; // Wavy effect
      // vec4 viewPosition = viewMatrix * modelPosition; // Camera (position, rotation, field of view, near, far)
      // vec4 projectedPosition = projectionMatrix * viewPosition; // transform coordinates into the clip space coordinates
      // gl_Position = projectedPosition;
      
      //
      // 3. Bumpy effect with custom attribute
      //
      // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // modelPosition.z += aRandom * 0.1; // Create some random displacement on the z axis (bumpy effect)
      // vec4 viewPosition = viewMatrix * modelPosition;
      // vec4 projectedPosition = projectionMatrix * viewPosition;
      // gl_Position = projectedPosition;     
      // vRandom = aRandom; // Pass the random value to the fragment shader

      //
      // 4. Uniforms (animated flag)
      //
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
      elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
      modelPosition.z += elevation;    
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;     
      // Pass the varying to the fragment shader
      vUv = uv; 
      vElevation = elevation;
    }