// Define vertex shader code
const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 aPosition; 
in vec3 aColour;

out vec3 vColour;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;
}`;

// Define fragment shader code
const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 vColour;

out vec4 outColour;

void main() {
  outColour = vec4(vColour, 1.0);
}`;


// Main function
function textureTriangle() {

  // Setup WebGL
  const canvas = document.getElementById('demo-canvas');
  if (!canvas) {
    showError('Could not find HTML canvas element - check for typos, or loading JavaScript file too early');
    return;
  }
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    const isWebGL1Supported = !!(document.createElement('canvas')).getContext(`webgl`);
    if (isWebGL1Supported) {
      showError('WebGL 1 is supported, but not v2 - try using a different device or browser');
    } else {
      showError('WebGL is not supported on this device - try using a different device or browser');
    }
    return;
  }

  // Define triangle vertices
  const vertices = new Float32Array([
    // x     y    z        r    g    b
     -0.5, -0.5, 0.0,     1.0, 0.0, 0.0, // vertex 0       2
      0.5, -0.5, 0.0,     0.0, 1.0, 0.0, // vertex 1     /   \
      0.0,  0.5, 0.0,     0.0, 0.0, 1.0, // vertex 2    0 --- 1
  ]);

  // Define triangle indices
  const indices = new Uint16Array([
    0, 1, 2,
  ]);

  // Create vertex buffer
  const VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Create element buffer object
  const EBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Create WebGL program 
  const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Clear the canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // dark gray background
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set the shader program
  gl.useProgram(shaderProgram);

  // Get attribute locations
  const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
  const colourLocation = gl.getAttribLocation(shaderProgram, "aColour");

  // Create VAO
  const VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(colourLocation);
  gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.bindVertexArray(null);

  // Draw triangle
  gl.bindVertexArray(VAO);
  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

}

try {
  textureTriangle();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}