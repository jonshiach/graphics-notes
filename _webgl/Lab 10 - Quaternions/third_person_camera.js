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
  vTangent = normalize(mat3(uModel) * aTangent);
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
  float outerCutoff;
};

// Number of lights
uniform int uNumLights;

// Array of lights
uniform Light uLights[16];

// Function to compute the lighting
vec3 computeLighting(Light light, vec3 N, vec3 V, vec3 objectColour){

  // Light vector
  vec3 L = normalize(light.position - vPosition);

  // Attenuation
  float distance = length(light.position - vPosition);
  float attenuation = 1.0 / (
    light.constant + 
    light.linear * distance + 
    light.quadratic * distance * distance
  );

  // Spotlight intensity
  float intensity = 1.0;
  if (light.type == 1) {
    float theta = dot(-L, normalize(light.direction));
    float epsilon = light.cutoff - light.outerCutoff;
    intensity = clamp((theta - light.outerCutoff) / epsilon, 0.0, 1.0);
  }

  // Directional light
  if (light.type == 2) {
    L = normalize(-light.direction);
    attenuation = 1.0;
  }

  // Ambient light
  vec3 ambient = uKa * objectColour;

  // Diffuse light
  float diff = max(dot(N, L), 0.0);
  vec3 diffuse = uKd * diff * light.colour * objectColour;

  // Specular light
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), uShininess);
  vec3 specular = uKs * spec * light.colour;
  specular *= texture(uSpecularMap, vTexCoords).rgb;

  // Output fragment colour
  return attenuation * (ambient + intensity * (diffuse + specular));
}

// Main fragment shader function
void main() {

  // Object colour
  vec4 objectColour = texture(uTexture, vTexCoords);

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
  vec3 lighting;
  for (int i = 0; i < uNumLights; i++) {
    lighting += computeLighting(uLights[i], N, V, objectColour.rgb);
  }

  // Fragment colour
  fragColour = vec4(lighting, objectColour.a);
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
function main() {

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
    // x y   z     R  G  B     u  v     nx  ny  nz                  + ------ +
    // front                                                       /|       /|
    -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //   y        / |      / |
     1, -1,  1,    0, 0, 0,    1, 0,    0,  0,  1,  //   |       + ------ +  |
     1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  //   +-- x   |  + ----|- +
    -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //  /        | /      | /
     1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  // z         |/       |/
    -1,  1,  1,    0, 0, 0,    0, 1,    0,  0,  1,  //           + ------ +
    // right
     1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
     1, -1, -1,    0, 0, 0,    1, 0,    1,  0,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
     1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
     1,  1,  1,    0, 0, 0,    0, 1,    1,  0,  0,
    // back
     1, -1, -1,    0, 0, 0,    0, 0,    0,  0, -1,
    -1, -1, -1,    0, 0, 0,    1, 0,    0,  0, -1,
    -1,  1, -1,    0, 0, 0,    1, 1,    0,  0, -1,
     1, -1, -1,    0, 0, 0,    0, 0,    0,  0, -1,
    -1,  1, -1,    0, 0, 0,    1, 1,    0,  0, -1,
     1,  1, -1,    0, 0, 0,    0, 1,    0,  0, -1,
    // left
    -1, -1, -1,    0, 0, 0,    0, 0,   -1,  0,  0,
    -1, -1,  1,    0, 0, 0,    1, 0,   -1,  0,  0,
    -1,  1,  1,    0, 0, 0,    1, 1,   -1,  0,  0,
    -1, -1, -1,    0, 0, 0,    0, 0,   -1,  0,  0,
    -1,  1,  1,    0, 0, 0,    1, 1,   -1,  0,  0,
    -1,  1, -1,    0, 0, 0,    0, 1,   -1,  0,  0,
    // bottom
    -1, -1, -1,    0, 0, 0,    0, 0,    0, -1,  0,
     1, -1, -1,    0, 0, 0,    1, 0,    0, -1,  0,
     1, -1,  1,    0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1, -1,    0, 0, 0,    0, 0,    0, -1,  0,
     1, -1,  1,    0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1,  1,    0, 0, 0,    0, 1,    0, -1,  0,
    // top
    -1,  1,  1,    0, 0, 0,    0, 0,    0,  1,  0,
     1,  1,  1,    0, 0, 0,    1, 0,    0,  1,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1,  1,    0, 0, 0,    0, 0,    0,  1,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1, -1,    0, 0, 0,    0, 1,    0,  1,  0,
  ]);


  // Define cube indices
  const indices = new Uint16Array([
     0,  1,  2,  3,  4,  5,  // front
     6,  7,  8,  9, 10, 11,  // right
    12, 13, 14, 15, 16, 17,  // back
    18, 19, 20, 21, 22, 23,  // left
    24, 25, 26, 27, 28, 29,  // bottom
    30, 31, 32, 33, 34, 35,  // top
  ]);

  // Define cube positions (5x5 grid of cubes)
  const cubes = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      cubes.push({
        position  : [3 * i, 0, -3 * j],
        ka        : 0.2,
        kd        : 0.7,
        ks        : 0.2,
        shininess : 32,
      });
    }
  }
  const numCubes = cubes.length;

  // Create VAO
  const vao = createVao(gl, program, vertices, indices);

  // Load texture
  const texture = loadTexture(gl, "assets/crate.png");
  const normalMap = loadTexture(gl, "assets/crate_normal.png");

  // Define floor vertices
  const floorVertices = new Float32Array([
    // x y   z     R  G  B     u  v     nx  ny  nz
    -1,  0,  1,    0, 0, 0,    0, 0,    0,  1,  0,
     1,  0,  1,    0, 0, 0,    8, 0,    0,  1,  0,
     1,  0, -1,    0, 0, 0,    8, 8,    0,  1,  0,
    -1,  0, -1,    0, 0, 0,    0, 8,    0,  1,  0,
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

  // Create player object
  const player = new Player();

  // Create camera object
  let camera = new FirstPersonCamera();
  // let camera = new ThirdPersonCamera();
  camera.eye = [6, 2, 5];

  // Keyboard and mouse inputs
  const input = new Input(canvas);

  // Timer
  let lastTime = 0;

  // Light object
  const light = new Light();
  light.position = [6, 2, 0];

  // Add light sources
  const lightSources = new LightSources();
  lightSources.addLight(light);

  // Yellow light
  const yellowLight = new Light(1);
  yellowLight.position = [9, 3, -9];
  yellowLight.colour = [1, 1, 0];
  lightSources.addLight(yellowLight);

  // Directional light
  const directionalLight = new Light(2);
  directionalLight.colour = [1, 0, 1];
  directionalLight.direction = [2, -1, -1];
  lightSources.addLight(directionalLight);

  // Render function
  function render(time) {

    // Manual init call, no timing yet
    if (time == null) {
      requestAnimationFrame(render);
      return;
    }

    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the shader program
    gl.useProgram(program);

    if (input.isDown("c")) {
      if (camera instanceof FirstPersonCamera)
        camera = new ThirdPersonCamera();
      else
        camera = new FirstPersonCamera();
    }

    // Update player and camera
    const dt = (time - lastTime) * 0.001;
    lastTime = time;
    player.update(input, dt, camera)
    camera.update(input, player, dt);

    // Calculate view matrix
    const view = camera.getViewMatrix();

    // Calculate projection matrix
    const projection = camera.getPerspectiveMatrix();

    // Send light source properties to the shader
    lightSources.toShader(gl, program);

    // Send view and project matrices to the shaders
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view.m);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection.m);

    // Send camera position to the shader
    gl.uniform3fv(gl.getUniformLocation(program, "uCameraPosition"), camera.eye);

    // Draw cubes
    for (let i = 0; i < numCubes; i++) {

      // Calculate the model matrix
      const angle = 0;
      const model = new Mat4()
        .translate(cubes[i].position)
        .rotate([0, 1, 0], angle)
        .scale([0.5, 0.5, 0.5]);

      // Send model matrix to the shader
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

      // Send object light properties to the shader
      gl.uniform1f(gl.getUniformLocation(program, "uKa"), cubes[i].ka);
      gl.uniform1f(gl.getUniformLocation(program, "uKd"), cubes[i].kd);
      gl.uniform1f(gl.getUniformLocation(program, "uKs"), cubes[i].ks);
      gl.uniform1f(gl.getUniformLocation(program, "uShininess"), cubes[i].shininess);

      // Bind texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, normalMap);
      gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 1);

      // Draw the triangles
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
    const model = new Mat4()
      .translate([6, -0.5, -6])
      .scale([10, 1, 10]);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    // Draw the triangles
    gl.bindVertexArray(floorVao);
    gl.drawElements(gl.TRIANGLES, floorIndices.length, gl.UNSIGNED_SHORT, 0);

    // Draw light sources
    gl.useProgram(lightProgram);

    for (let i = 0; i < lightSources.lights.length; i++) {

      // Don't draw directional light source
      if (lightSources.lights[i].type == 2) continue;

      // Calculate model matrix for light source
      const model = new Mat4()
        .translate(lightSources.lights[i].position)
        .scale([0.1, 0.1, 0.1]);

      // Send model, view and projection matrices to the shaders
      gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
      gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
      gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

      // Send light colour to the shader
      gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), lightSources.lights[i].colour);

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