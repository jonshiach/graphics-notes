// Define vertex shader
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;

out vec3 vColour;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;
}`;

// Define fragment shader
const fragmentShaderSource = 
`#version 300 es
precision mediump float;

in vec3 vColour;

out vec4 fragColour;

void main() {
  fragColour = vec4(vColour, 1.0);
}`;


// Main function
function main() {

  // Setup WebGL
  const gl = initWebGL("canvas");
  
  // Create WebGL program 
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Set the shader program
  gl.useProgram(program);

  // Define triangle vertices
  const vertices = new Float32Array([
    // x     y    z      r    g    b
    -0.5, -0.5, 0.0,    1.0, 0.0, 0.0, // vertex 0       2
     0.5, -0.5, 0.0,    0.0, 1.0, 0.0, // vertex 1     /   \
     0.0,  0.5, 0.0,    0.0, 0.0, 1.0, // vertex 2    0 --- 1
  ]);

  // Define square vertices
  const squareVertices = new Float32Array([
  // x    y    z       r    g    b             
    0.5, 0.2, 0.0,    1.0, 0.0, 0.0, // vertex 0     3 -- 2
    0.8, 0.2, 0.0,    0.0, 1.0, 0.0, // vertex 1     |  / |    
    0.8, 0.6, 0.0,    0.0, 0.0, 1.0, // vertex 2     | /  | 
    0.5, 0.6, 0.0,    1.0, 1.0, 1.0, // vertex 3     0 -- 1 
  ]);
  
  // Define triangle indices
  const indices = new Uint16Array([
    0, 1, 2
  ]);

  // Define square indices
  const squareIndices = new Uint16Array([
    0, 1, 2,  // lower-right triangle
    0, 2, 3,  // upper-left triangle
  ]);

  // Create VAOs
  const triangleVao = createVao(gl, program, vertices, indices);
  const squareVao = createVao(gl, program, squareVertices, squareIndices);

  // Draw the triangle
  gl.bindVertexArray(triangleVao);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  // Draw the square
  gl.bindVertexArray(squareVao);
  gl.drawElements(gl.TRIANGLES, squareIndices.length, gl.UNSIGNED_SHORT, 0);
}

main();