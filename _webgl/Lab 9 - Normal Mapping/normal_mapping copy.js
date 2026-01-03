// Define vertex shader
const vertexShader = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoords;
in vec3 aNormal;
in vec3 aTangent;

out vec3 vColour;
out vec2 vTexCoords;
out vec3 vNormal;
out vec3 vPosition;
out vec3 vTangent;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;

  // Output texture coordinates
  vTexCoords = aTexCoords;

  // Output world space normal vectors
  vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);

  // Output world space vertex position
  vPosition = vec3(uModel * vec4(aPosition, 1.0));

  // Output world space tangent vector
  vTangent   = normalize(mat3(uModel) * aTangent);
}`;

// Define fragment shader
const fragmentShader = 
`#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;
in vec3 vNormal;
in vec3 vPosition;
in vec3 vTangent;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform sampler2D uNormalMap;
uniform sampler2D uSpecularMap;
uniform vec3 uCameraPosition;

// Material coefficients
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;

// Light struct
struct Light {
  int type;
  vec3 position;
  vec3 colour;
  vec3 direction;
  float constant;
  float linear;
  float quadratic;
  float cutoff;
  float innerCutoff;
};

// Number of lights
uniform int uNumLights;

// Array of lights
uniform Light uLights[16];

// Function to calculate diffuse and specular reflection
vec3 computeLight(Light light, vec3 N, vec3 V, vec3 objectColour, vec3 specularMap){

  // Light vector
  vec3 L = normalize(light.position - vPosition);
  if (light.type == 3) {
    L = normalize(-light.direction);
  }

  // Reflection vector
  vec3 R = normalize(2.0 * dot(L, N) * N - L);
  // Attenuation
  float attenuation = 1.0;
  if (light.type != 3) {
    float dist = length(light.position - vPosition);
    attenuation = 1.0 / (light.constant + light.linear * dist + light.quadratic * dist * dist);
  }

  // Ambient reflection
  vec3 ambient = uKa * objectColour;

  // Spotlight
  float spotLight = 1.0;
  if (light.type == 2) {
    vec3 D = normalize(light.direction);
    float theta = dot(-L, D);
    float epsilon = light.cutoff - light.innerCutoff;
    spotLight = clamp((light.cutoff - theta) / epsilon, 0.0, 1.0);
  }

  // Diffuse
  vec3 diffuse = uKd * max(dot(N, L), 0.0) * light.colour * objectColour;

  // Specular
  vec3 specular = uKs * pow(max(dot(R, V), 0.0), uShininess) * light.colour * specularMap;

  // Output fragment colour
  return spotLight * attenuation * (ambient + diffuse + specular);
}

// Main function
void main() {

  // Object colour
  vec4 objectColour = texture(uTexture, vTexCoords);

  // Specular map
  vec3 specularMap = texture(uSpecularMap, vTexCoords).rgb;

  // Lighting vectors
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCameraPosition - vPosition);

  // Construct tangent space basis
  vec3 T = normalize(vTangent);
  vec3 B = cross(N, T);
  mat3 TBN = mat3(T, B, N);

  // Calculate world space normal
  vec3 normalSample = texture(uNormalMap, vTexCoords).rgb * 2.0 - 1.0;
  N = normalize(TBN * normalSample);

  // Calculate lighting for each light source
  vec3 result = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    if (i >= uNumLights) break;
    result += computeLight(uLights[i], N, V, objectColour.rgb, specularMap);
  }

  // Fragment colour
  fragColour = vec4(result, objectColour.a);
}`;

// Define vertex and fragment shaders for the light source
const lightVertexShader = 
`#version 300 es
precision mediump float;

in vec3 aPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`;

const lightFragmentShader = 
`#version 300 es
precision mediump float;

out vec4 fragColour;

uniform vec3 uLightColour;

void main() {
  fragColour = vec4(uLightColour, 1.0);
}`;

// Main function
async function main() {

  // Setup WebGL
  const canvas = document.getElementById("canvasId");
  const gl = initWebGL(canvas);
  
  // Create WebGL program 
  const program = createProgram(gl, vertexShader, fragmentShader);
  const lightProgram = createProgram(gl, lightVertexShader, lightFragmentShader);

  // Set the shader program
  gl.useProgram(program);

  // Define cube vertices
  const vertices = new Float32Array([
    // x  y  z      r  g  b     u  v     nx  ny  nz                   + ------ +
    // front                                                         /|       /|
    -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //    y        / |      / |
     1, -1,  1,     0, 0, 0,    1, 0,    0,  0,  1,  //    |       + ------ +  |
     1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //    +-- x   |  + ----|- +
    -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //   /        | /      | /   
     1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //  z         |/       |/
    -1,  1,  1,     0, 0, 0,    0, 1,    0,  0,  1,  //            + ------ +   
    // right                        
     1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
     1, -1, -1,     0, 0, 0,    1, 0,    1,  0,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
     1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
     1,  1,  1,     0, 0, 0,    0, 1,    1,  0,  0,
    // back
     1, -1, -1,     0, 0, 0,    0, 0,    0,  0, -1,
    -1, -1, -1,     0, 0, 0,    1, 0,    0,  0, -1,
    -1,  1, -1,     0, 0, 0,    1, 1,    0,  0, -1,
     1, -1, -1,     0, 0, 0,    0, 0,    0,  0, -1,
    -1,  1, -1,     0, 0, 0,    1, 1,    0,  0, -1,
     1,  1, -1,     0, 0, 0,    0, 1,    0,  0, -1,
    // left
    -1, -1, -1,     0, 0, 0,    0, 0,   -1,  0,  0,
    -1, -1,  1,     0, 0, 0,    1, 0,   -1,  0,  0,
    -1,  1,  1,     0, 0, 0,    1, 1,   -1,  0,  0,
    -1, -1, -1,     0, 0, 0,    0, 0,   -1,  0,  0,
    -1,  1,  1,     0, 0, 0,    1, 1,   -1,  0,  0,
    -1,  1, -1,     0, 0, 0,    0, 1,   -1,  0,  0,
    // bottom
    -1, -1, -1,     0, 0, 0,    0, 0,    0, -1,  0,
     1, -1, -1,     0, 0, 0,    1, 0,    0, -1,  0,
     1, -1,  1,     0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1, -1,     0, 0, 0,    0, 0,    0, -1,  0,
     1, -1,  1,     0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1,  1,     0, 0, 0,    0, 1,    0, -1,  0,
    // top
    -1,  1,  1,     0, 0, 0,    0, 0,    0,  1,  0,
     1,  1,  1,     0, 0, 0,    1, 0,    0,  1,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1,  1,     0, 0, 0,    0, 0,    0,  1,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1, -1,     0, 0, 0,    0, 1,    0,  1,  0,
  ]);

  // Define cube indices
  const indices = new Uint16Array([
     0,  1,  2,  3,  4,  5,  // front
     6,  7,  8,  9, 10, 11,  // right
    12, 13, 14, 15, 16, 17,  // back
    18, 19, 20, 21, 22, 23,  // left
    24, 25, 26, 27, 28, 29,  // bottom
    30, 31, 32, 33, 34, 35   // top
  ]);

  // Define cube positions (5x5 grid of cubes)
  const cubePositions = [];
  for (let i = 0; i < 5; i++)  {
    for (let j = 0; j < 5; j++) {
      cubePositions.push([3 * i, 0, -3 * j]);
    }
  }
  
  // Define cubes
  const numCubes = cubePositions.length;
  const cubes = [];
  for (let i = 0; i < numCubes; i++) {
    cubes.push({
      position  : cubePositions[i],
      ka        : 0.2,
      kd        : 0.7,
      ks        : 0.2,
      shininess : 32.0,
    });
  }

  // Create vector of light sources
  const lightSources = [ 
    {
      type        : 1,
      position    : [6, 2, 0],
      colour      : [1, 1, 1],
      direction   : [0, -1, -1],
      constant    : 1.0,
      linear      : 0.1,
      quadratic   : 0.02,
      cutoff      : Math.cos(40 * Math.PI / 180),
      innerCutoff : Math.cos(30 * Math.PI / 180),
    },
    {
      type        : 1,
      position    : [9, 2, -9],
      direction   : [0, -1, 0],
      colour      : [1, 1, 0],
      constant    : 1.0,
      linear      : 0.1,
      quadratic   : 0.02,
      cutoff      : 0,
      innerCutoff : 0,
    },
    {
      type        : 3,
      position    : [0, 0, 0],
      direction   : [2, -1, -1],
      colour      : [1, 0, 1],
      constant    : 1.0,
      linear      : 0.1,
      quadratic   : 0.02,
      cutoff      : 0,
      innerCutoff : 0,
    },
  ];

  // Number of lights
  const numLights = lightSources.length;

  // Create VAO
  // const mesh = await loadOBJ('assets/teapot.obj');
  const vao = createVao(gl, program, vertices, indices);

  // Load textures
  const texture = loadTexture(gl, "assets/crate.png");
  const normalMap = loadTexture(gl, "assets/crate_normal.png");
  const specularMap = loadTexture(gl, "assets/crate_specular.png");

  // Define floor vertices
  const floorVertices = new Float32Array([
    // x  y   z      r  g  b     u  v     nx  ny  nz
     -1,  0,  1,     0, 0, 0,    0, 0,    0,  1,  0,
      1,  0,  1,     0, 0, 0,    8, 0,    0,  1,  0,
      1,  0, -1,     0, 0, 0,    8, 8,    0,  1,  0,
     -1,  0, -1,     0, 0, 0,    0, 8,    0,  1,  0,
  ]);

  // Define floor indices
  const floorIndices = new Uint16Array([
     0,  1,  2,  
     0,  2,  3,
  ]);

  // Define floor VAO
  const floorVao = createVao(gl, program, floorVertices, floorIndices);

  // Load floor textures
  const floorTexture = loadTexture(gl, "assets/stones.png");
  const floorNormalMap = loadTexture(gl, "assets/stones_normal.png");
  const floorSpecularMap = loadTexture(gl, "assets/stones_specular.png");

  // Create camera object
  const camera = new Camera(canvas);
  camera.eye = new Vec3(6, 2, 5);

  // Timer
  let lastTime = 0;

  // Render function
  function render(time) {
    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update camera vectors
    const dt = (time - lastTime) * 0.001;
    lastTime = time;
    camera.update(dt);

    // Use shader program
    gl.useProgram(program);

    // Calculate view and projection matrices
    const view       = camera.lookAt();
    const projection = camera.perspective();
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view.m);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection.m);

    // Send camera position to the shader
    gl.uniform3fv(gl.getUniformLocation(program, "uCameraPosition"), camera.eye.array);

    // Send light source properties to the shader
    gl.uniform1i(gl.getUniformLocation(program, "uNumLights"), numLights);
    for (let i = 0; i < numLights; i++) {
      gl.uniform1i(gl.getUniformLocation(program, `uLights[${i}].type`), lightSources[i].type);
      gl.uniform3fv(gl.getUniformLocation(program, `uLights[${i}].position`), lightSources[i].position);
      gl.uniform3fv(gl.getUniformLocation(program, `uLights[${i}].direction`), lightSources[i].direction);
      gl.uniform3fv(gl.getUniformLocation(program, `uLights[${i}].colour`), lightSources[i].colour);  
      gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].constant`), lightSources[i].constant);
      gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].linear`), lightSources[i].linear);
      gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].quadratic`), lightSources[i].quadratic);
      gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].cutoff`), lightSources[i].cutoff);
      gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].innerCutoff`), lightSources[i].innerCutoff);
    }

    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

    // Bind normal map
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, normalMap);
    gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 1);

    // Bind specular map
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, specularMap);
    gl.uniform1i(gl.getUniformLocation(program, "uSpecularMap"), 2);

    // Draw cubes
    for (let i = 0; i < numCubes; i++){
      
      // Calculate the model matrix
      const translate = new Mat4().translate(...cubes[i].position);
      const scale     = new Mat4().scale(0.5, 0.5, 0.5);
      const rotate    = new Mat4().rotate(0, 1, 0, 0);
      const model     = translate.multiply(rotate).multiply(scale);
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

      // Send object light properties to the shader
      gl.uniform1f(gl.getUniformLocation(program, "uKa"), cubes[i].ka);
      gl.uniform1f(gl.getUniformLocation(program, "uKd"), cubes[i].kd);
      gl.uniform1f(gl.getUniformLocation(program, "uKs"), cubes[i].ks);
      gl.uniform1f(gl.getUniformLocation(program, "uShininess"), cubes[i].shininess);

      // Draw the rectangle
      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    // Draw floor
    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

    // Bind normal map
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, floorNormalMap);
    gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 1);

    // Bind specular map
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, floorSpecularMap);
    gl.uniform1i(gl.getUniformLocation(program, "uSpecularMap"), 2);

    // Send object light properties to the shader
    gl.uniform1f(gl.getUniformLocation(program, "uKa"), 0.2);
    gl.uniform1f(gl.getUniformLocation(program, "uKd"), 0.7);
    gl.uniform1f(gl.getUniformLocation(program, "uKs"), 1.0);
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), 32);

    // Calculate the model matrix
    const translate = new Mat4().translate(6, -0.5, -6);
    const scale     = new Mat4().scale(10, 0.01, 10);
    const rotate    = new Mat4().rotate(0, 1, 0, 0);
    const model     = translate.multiply(rotate).multiply(scale);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    // Draw the triangles
    gl.bindVertexArray(floorVao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // Render light sources
    gl.useProgram(lightProgram);

    for (let i = 0; i < numLights; i++) {
      if (lightSources[i].type === 3) continue;

      // Calculate model matrix for light source
      const translate = new Mat4().translate(...lightSources[i].position);
      const scale     = new Mat4().scale(0.1, 0.1, 0.1);
      const model     = translate.multiply(scale);
      gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
      gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
      gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

      // Send light colour to the shader
      gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), lightSources[i].colour);

      // Draw light source cube
      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    // Render next frame
    requestAnimationFrame(render);
  }

  render();
}

main();