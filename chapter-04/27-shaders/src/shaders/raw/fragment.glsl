    precision mediump float;

    //
    // 3. Bumpy effect varying
    //
    // varying float vRandom;

    //
    // 4. Uniforms (animated flag)
    //
    uniform vec3 uColor;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying float vElevation;


    void main() {
      // 1, 2. Add colour to the fragment
      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

      //
      // 3. Bumpy effect
      //
      // gl_FragColor = vec4(vRandom, vRandom * 0.5, 1.0, 1.0);

      //
      // 4. Uniforms (animated flag)
      //
      vec4 textureColor = texture2D(uTexture, vUv);
      textureColor.rgb *= vElevation * 2.0 + 0.5; // Adjust brightness based on elevation 
      gl_FragColor = textureColor;
    }