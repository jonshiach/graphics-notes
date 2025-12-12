// Define vertex shader
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition;

void main() {
  gl_Position = vec4(aPosition, 1.0);
}`;

// Define fragment shader
const fragmentShaderSource = 
`#version 300 es
precision mediump float;

out vec4 fragColour;

void main() {
  fragColour = vec4(1.0, 0.0, 0.0, 1.0);
}`;


// Main function
function main() {

  // Setup WebGL
  const canvas = document.getElementById('demo-canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return alert("WebGL not supported");

  // Define triangle vertices
  const triangleVertices = new Float32Array([
    // x    y    z
    -0.5, -0.5, 0.0, // vertex 0       2
     0.5, -0.5, 0.0, // vertex 1     /   \
     0.0,  0.5, 0.0, // vertex 2    0 --- 1
  ]);

  // Create triangle vertex buffer
  const VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Create WebGL program 
  const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Clear the canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // dark gray background
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the shader program
  gl.useProgram(shaderProgram);

  // Tell WebGL how to read data from the vertex buffer
  const positionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.vertexAttribPointer(
    positionLocation, // index
    3,                // size
    gl.FLOAT,         // type
    false,            // normalized
    0,                // stride
    0);               // offset

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

try {
  main();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}