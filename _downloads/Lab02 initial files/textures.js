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
  const gl = initWebGL("canvasId");
  
  // Create WebGL program 
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Set the shader program
  gl.useProgram(program);

  // Define square vertices
  const vertices = new Float32Array([
  // x    y    z       r    g    b             
  -0.5, -0.5, 0.0,    1.0, 0.0, 0.0, // vertex 0     3 -- 2
   0.5, -0.5, 0.0,    0.0, 1.0, 0.0, // vertex 1     |  / |    
   0.5,  0.5, 0.0,    0.0, 0.0, 1.0, // vertex 2     | /  | 
  -0.5,  0.5, 0.0,    1.0, 1.0, 1.0, // vertex 3     0 -- 1 
  ]);

  // Define square indices
  const indices = new Uint16Array([
    0, 1, 2,  // lower-right triangle
    0, 2, 3,  // upper-left triangle
  ]);

  // Create VAOs
  const vao = createVao(gl, program, vertices, indices);

  // Draw the square
  gl.bindVertexArray(vao);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

main();