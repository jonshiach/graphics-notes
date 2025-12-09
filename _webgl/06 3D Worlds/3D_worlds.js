// Globals 
let gl;
let shaderProgram;
let canvas;

// Define vertex shader code
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition; 
in vec3 aColour;
in vec2 aTexCoord;

out vec3 vColour;
out vec2 vTexCoord;

uniform mat4 uMvp;

void main() {
  gl_Position = uMvp * vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;

  // Output texture co-ordinates
  vTexCoord = aTexCoord;
}`;

// Define fragment shader code
const fragmentShaderSource = 
`#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoord;

out vec4 outColour;

uniform sampler2D uSampler;

void main() {
  outColour = texture(uSampler, vTexCoord);
}`;

// Camera object
const camera = new Camera();

// Cube positions
const numCubes = 2;
const cubePositions = [
  0, 0, -2, 
  0, 0, -6
];

// Render frame
function render(time) {

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Update camera vectors
  const target = new Vec3(0, 0, -2);
  camera.eye   = new Vec3(1, 1, 1); 
  camera.front = target.subtract(camera.eye).normalize();
  camera.updateVectors();

  // Calculate view and projection matrices
  const view       = camera.lookAt();
  // const projection = camera.orthographic(-2, 2, -2, 2, 0, 100);
  const projection = camera.perspective();

  // Draw cubes
  for (let i = 0; i < numCubes; i++) {

    // Calculate the model matrix   
    const tx = cubePositions[i * 3 + 0];
    const ty = cubePositions[i * 3 + 1];
    const tz = cubePositions[i * 3 + 2];
    const translate = new Mat4().translate(tx, ty, tz);
    const scale     = new Mat4().scale(0.5, 0.5, 0.5);
    const angle     = 1/3 * time * 2 * Math.PI * 0.001;
    const rotate    = new Mat4().rotate(0, 1, 0, 0);
    const model     = translate.multiply(rotate).multiply(scale);

    // Calculate MVP matrix and send it to the shaders
    const mvp = projection.multiply(view).multiply(model);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMvp"), false, mvp.m);

    // Draw triangles
    gl.bindVertexArray(VAO);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  }

  // Call the render function before the next screen refresh
  requestAnimationFrame(render);
}

// Main function
function main() {

  // Setup WebGL
  canvas = document.getElementById('demo-canvas');
  gl = canvas.getContext('webgl2');
  gl.enable(gl.DEPTH_TEST);

  // Create WebGL program 
  shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);


  // Define cube vertices
  const vertices = new Float32Array([
    // x  y  z      r  g  b     u  v                    + ------ +
    // front                                           /|       /|
    -1, -1,  1,     0, 0, 0,    0, 0,  //    y        / |      / |
     1, -1,  1,     0, 0, 0,    1, 0,  //    |       + ------ +  |
     1,  1,  1,     0, 0, 0,    1, 1,  //    +-- x   |  + ----|- +
    -1, -1,  1,     0, 0, 0,    0, 0,  //   /        | /      | /   
     1,  1,  1,     0, 0, 0,    1, 1,  //  z         |/       |/
    -1,  1,  1,     0, 0, 0,    0, 1,  //            + ------ +   
    // right                        
     1, -1,  1,     0, 0, 0,    0, 0,
     1, -1, -1,     0, 0, 0,    1, 0, 
     1,  1, -1,     0, 0, 0,    1, 1,
     1, -1,  1,     0, 0, 0,    0, 0,
     1,  1, -1,     0, 0, 0,    1, 1,
     1,  1,  1,     0, 0, 0,    0, 1,
    // back
     1, -1, -1,     0, 0, 0,    0, 0,
    -1, -1, -1,     0, 0, 0,    1, 0,
    -1,  1, -1,     0, 0, 0,    1, 1,
     1, -1, -1,     0, 0, 0,    0, 0,
    -1,  1, -1,     0, 0, 0,    1, 1,
     1,  1, -1,     0, 0, 0,    0, 1,
    // left
    -1, -1, -1,     0, 0, 0,    0, 0,
    -1, -1,  1,     0, 0, 0,    1, 0,
    -1,  1,  1,     0, 0, 0,    1, 1,
    -1, -1, -1,     0, 0, 0,    0, 0,
    -1,  1,  1,     0, 0, 0,    1, 1,
    -1,  1, -1,     0, 0, 0,    0, 1,
    // bottom
    -1, -1, -1,     0, 0, 0,    0, 0,
     1, -1, -1,     0, 0, 0,    1, 0,
     1, -1,  1,     0, 0, 0,    1, 1,
    -1, -1, -1,     0, 0, 0,    0, 0,
     1, -1,  1,     0, 0, 0,    1, 1, 
    -1, -1,  1,     0, 0, 0,    0, 1,
    // top
    -1,  1,  1,     0, 0, 0,    0, 0,
     1,  1,  1,     0, 0, 0,    1, 0,
     1,  1, -1,     0, 0, 0,    1, 1,
    -1,  1,  1,     0, 0, 0,    0, 0,
     1,  1, -1,     0, 0, 0,    1, 1,
    -1,  1, -1,     0, 0, 0,    0, 1
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

  // Load texture from file
  loadTexture(gl, "assets/mario.png");

  // Clear the canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // dark gray background
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the shader program
  gl.useProgram(shaderProgram);

  // Tell the shader that uSampler uses texture unit 0:
  const uSamplerLocation = gl.getUniformLocation(shaderProgram, "uSampler");
  gl.uniform1i(uSamplerLocation, 0);

  // Create VAO
  VAO = createVAO(gl, vertices, indices, shaderProgram);

  // Call the render function 
  render();
}

try {
  main();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}