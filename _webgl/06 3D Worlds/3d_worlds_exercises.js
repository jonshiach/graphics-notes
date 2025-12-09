// Globals
let gl;
let shaderProgram;
const cubePositions = [ 0, 0, -2, 0, 0, -5 ];
const numberOfCubes = 2;

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

// Orbital camera
function orbitCamera(cx, cy, cz, radius, rotationsPerSecond, time) {
  const rotationAngle = radians(1/rotationsPerSecond * time * 360 * 0.001);
  return [cx + radius * Math.cos(rotationAngle), cy, cz + radius * Math.sin(rotationAngle)];
}

// Render frame
function render(time) {

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (let i = 0; i < numberOfCubes; i++){
    // Calculate the model matrix
    const rotationSpeed = 1/3;
    const rotationAngle = rotationSpeed * time * 360 * 0.001;
    const tx = cubePositions[i * 3 + 0];
    const ty = cubePositions[i * 3 + 1];
    const tz = cubePositions[i * 3 + 2];
    const translateMatrix = translate(tx, ty, tz);
    const scaleMatrix = scale(0.5, 0.5, 0.5);
    const rotateMatrix = rotate([0, 1, 0], 0);
    const model = matrixMult(translateMatrix, matrixMult(rotateMatrix, scaleMatrix));

    // Calculate MVP matrix and send it to the shaders
    const eye = orbitCamera(0, 2, -2, 5, 5, time);
    const view = viewMatrix(eye, [0, 0, -2], [0, 1, 0]);
    // const projection = orthographicMatrix(-2, 2, -2, 2, 0, 20);
    const  projection = perspectiveMatrix(45, 800 / 600, 0.1, 20);
    const mvp = matrixMult(projection, matrixMult(view, model));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMvp"), false, mvp);

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
  const canvas = document.getElementById('demo-canvas');
  gl = canvas.getContext('webgl2');
  if (!gl) return alert("WebGL not supported");

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

   // Create WebGL program 
  shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  
  // Load texture from file
  loadTexture(gl, "assets/mario_small.png");

  // Configure the canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // dark gray background
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.enable(gl.DEPTH_TEST);

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