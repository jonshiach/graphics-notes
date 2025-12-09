// Define vertex shader code
const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 aPosition; 
in vec3 aColour;

out vec3 vColour;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // Output fragment colour
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
function main() {

  // Setup WebGL
  const canvas = document.getElementById('demo-canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return alert("WebGL not supported");

  // Define triangle vertices
  const triangleVertices = new Float32Array([
    // x     y    z        r    g    b
     -0.5, -0.5, 0.0,     1.0, 0.0, 0.0, // vertex 0       2
      0.5, -0.5, 0.0,     0.0, 1.0, 0.0, // vertex 1     /   \
      0.0,  0.5, 0.0,     0.0, 0.0, 1.0, // vertex 2    0 --- 1
  ]);

  // Create triangle vertex buffer
  const VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Define square vertices
  const squareVertices = new Float32Array([
    // x    y    z       r    g    b             
      0.5, 0.2, 0.0,    1.0, 0.0, 0.0, // vertex 0     3 -- 2
      0.8, 0.2, 0.0,    0.0, 1.0, 0.0, // vertex 1     |  / |    
      0.8, 0.6, 0.0,    0.0, 0.0, 1.0, // vertex 2     | /  | 
      0.5, 0.6, 0.0,    1.0, 1.0, 1.0, // vertex 3     0 -- 1 
  ]);

  // Define square indices
  const squareIndices = new Uint16Array([
  0, 1, 2,  // lower-right triangle
  0, 2, 3,  // upper-left triangle
  ]);

  // Create square vertex buffer
  const squareVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVBO);
  gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Create square EBO
  const squareEBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareEBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, squareIndices, gl.STATIC_DRAW);
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

  // Create VAO for the triangle
  const triangleVAO = gl.createVertexArray();
  gl.bindVertexArray(triangleVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  // gl.enableVertexAttribArray(colourLocation);
  // gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.bindVertexArray(null);

  // Create VAO for the square
  const squareVAO = gl.createVertexArray();
  gl.bindVertexArray(squareVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVBO);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareEBO);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(colourLocation);
  gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.bindVertexArray(null);

  // Draw triangle
  gl.bindVertexArray(triangleVAO);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Draw square
  gl.bindVertexArray(squareVAO);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

try {
  main();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}