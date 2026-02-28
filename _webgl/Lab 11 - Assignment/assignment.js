// Define vertex shader
const vertexShader = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoord;
in vec3 aNormal;
in vec3 aTangent;

out vec3 vColour;
out vec2 vTexCoord;
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
  vTexCoord = aTexCoord;

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
in vec2 vTexCoord;
in vec3 vNormal;
in vec3 vPosition;
in vec3 vTangent;

out vec4 fragColour;

uniform sampler2D uDiffuseMap;
uniform sampler2D uNormalMap;
uniform sampler2D uSpecularMap;
uniform vec3 uCameraPosition;
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform vec3 uColour;
uniform bool uHasDiffuseMap;

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
  specular *= texture(uSpecularMap, vTexCoord).rgb;

  // Output fragment colour
  return attenuation * (ambient + intensity * (diffuse + specular));
}

// Main fragment shader function
void main() {

  // Object colour
  vec4 objectColour = texture(uDiffuseMap, vTexCoord);

  // Lighting vectors
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCameraPosition - vPosition);

  // Construct tangent space basis
  vec3 T = normalize(vTangent);
  vec3 B = cross(N, T);
  mat3 TBN = mat3(T, B, N);

  // Calculate world space normal
  vec3 normalSample = texture(uNormalMap, vTexCoord).rgb * 2.0 - 1.0;
  N = normalize(TBN * normalSample);

  // Calculate lighting for each light source
  vec3 lighting;
  for (int i = 0; i < uNumLights; i++) {
    lighting += computeLighting(uLights[i], N, V, objectColour.rgb);
  }

  // Fragment colour
  if (uHasDiffuseMap) {
    fragColour = vec4(lighting, objectColour.a);
  } else {
    fragColour = vec4(uColour, 1.0);  
  }
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

  // Define cube positions (5x5 grid of cubes)
  const cubes = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      cubes.push({
        position  : [3 * i, 0, -3 * j],
      });
    }
  }
  const numCubes = cubes.length;

  // --- MODELS ---

  // Create cube object
  const cube = await Model.create(gl, "assets/cube.obj");
  cube.ks = 0.2;
  cube.loadTexture("assets/crate.png", "diffuse");
  cube.loadTexture("assets/crate_normal.png", "normal");

  // Create floor object
  const floor = await Model.create(gl, "assets/plane.obj");
  floor.loadTexture("assets/stones.png", "diffuse");
  floor.loadTexture("assets/stones_normal.png", "normal");
  floor.loadTexture("assets/stones_specular.png", "specular");
  floor.setTextureRepeat(8, 8);

  // Create Suzanne object
  const suzanne = await Model.create(gl, "assets/suzanne2.obj");
  suzanne.loadTexture("assets/suzanne_diffuse.png", "diffuse");

  // --- LIGHT SOURCES ---

  // Light models
  const whiteLightModel = await Model.create(gl, "assets/cube.obj");
  const yellowLightModel = await Model.create(gl, "assets/cube.obj");
  yellowLightModel.colour = [1, 1, 0];

  // Light sources array
  const lightSources = new LightSources();

  // Add light sources
  const whiteLight = new Light();
  whiteLight.position = [6, 2, 0];
  whiteLight.model = whiteLightModel
  lightSources.addLight(whiteLight);

  const yellowLight = new Light(1);
  yellowLight.position = [9, 3, -9];
  yellowLight.colour = [1, 1, 0];
  yellowLight.model = yellowLightModel;
  lightSources.addLight(yellowLight);

  const directionalLight = new Light(2);
  directionalLight.colour = [1, 0, 1];
  directionalLight.direction = [2, -1, -1];
  lightSources.addLight(directionalLight);

  // --- PLAYER AND CAMERA OBJECTS ---

  // Create player object
  const player = new Player();
  player.model = suzanne;
  player.position = [-1, 0, 1];

  // Keyboard and mouse inputs
  const input = new Input(canvas);

  // Create camera manager
  const cameraManager = new CameraManager(player, input);

  // Timer
  let lastTime = 0;

  // --- RENDER FUNCTION ----
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

    // Calculate change in time since last frame was rendered
    const dt = (time - lastTime) * 0.001;
    lastTime = time;

    // Update player and camera
    cameraManager.update(dt);
    const camera = cameraManager.activeCamera;
    player.update(input, camera, dt)

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

    // --- DRAW CUBES ---
    for (let i = 0; i < numCubes; i++) {

      // Calculate the model matrix
      const angle = 0;
      const model = new Mat4()
        .translate(cubes[i].position)
        .rotate([0, 1, 0], angle)
        .scale([0.5, 0.5, 0.5]);

      // Send model matrix to the shader
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

      // Draw cube
      cube.draw(program);
    }

    // --- DRAW FLOOR --- 
    const model = new Mat4()
      .translate([6, -0.5, -6])
      .scale([10, 1, 10]);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    // Draw floor
    floor.draw(program);

    // --- DRAW LIGHT SOURCES ---
    for (let i = 0; i < lightSources.lights.length; i++) {

      // Don't draw directional light source
      if (lightSources.lights[i].type == 2) continue;

      // Calculate model matrix for light source
      const model = new Mat4()
        .translate(lightSources.lights[i].position)
        .scale([0.1, 0.1, 0.1]);

      // Send model matrix to the shader
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

      // Draw light model
      lightSources.lights[i].model.draw(program);
    }

    // --- DRAW PLAYER CHARACTER (third perdon camera only) ---
    if (camera instanceof ThirdPersonCamera) {
      player.draw(gl, program);
    }

    // Render next frame
    requestAnimationFrame(render);
  }

  render();
}

main();