// Setup WebGL
const canvas = document.getElementById('demo-canvas');
gl = canvas.getContext('webgl2');

// Define vertex shader code
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition; 
in vec3 aColour;
in vec2 aTexCoord;

out vec3 vColour;
out vec2 vTexCoord;

uniform mat4 uModel;

void main() {
  gl_Position = uModel * vec4(aPosition, 1.0);

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

// Create WebGL program 
shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

// Render frame
function render(time) {

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Calculate transformation matrices
  const translate = new Mat4().translate(0.4, 0.3, 0);
  const scale     = new Mat4().scale(0.5, 0.4, 1);
  const angle     = 1/2 * time * 0.001 * 2 * Math.PI;
  const rotate    = new Mat4().rotate(0, 0, 1, angle);

  // Calculate transformation matrix and send it to the shader
  const model = translate.multiply(rotate).multiply(scale);
  // const model = rotate.multiply(translate).multiply(scale);
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModel"), false, model.m);

  // Draw triangles
  gl.bindVertexArray(VAO);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  // Call the render function before the next screen refresh
  requestAnimationFrame(render);
}

// Main function
function main() {

  // Define vertices
  const vertices = new Float32Array([
    // x    y    z       r    g    b       u    v     
    -0.5, -0.5, 0.0,    1.0, 0.0, 0.0,    0.0, 0.0, // vertex 0     3 -- 2
     0.5, -0.5, 0.0,    0.0, 1.0, 0.0,    1.0, 0.0, // vertex 1     |  / |    
     0.5,  0.5, 0.0,    0.0, 0.0, 1.0,    1.0, 1.0, // vertex 2     | /  | 
    -0.5,  0.5, 0.0,    0.0, 0.0, 0.0,    0.0, 1.0, // vertex 3     0 -- 1 
  ]);

  // Define triangle indices
  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3,
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

  // // Calculate transformation matrices
  // const translate = new Mat4().translate(0.4, 0.3, 0);
  // const scale     = new Mat4().scale(0.5, 0.4, 1);
  // const angle     = 45 * Math.PI / 180;
  // const rotate    = new Mat4().rotate(0, 0, 1, angle);

  // // Calculate transformation matrix and send it to the shader
  // const model = translate.multiply(rotate).multiply(scale);
  // gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModel"), false, model.m);

  // // Draw triangles
  // gl.bindVertexArray(VAO);
  // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  // Call the render function 
  render();
}

try {
  main();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}