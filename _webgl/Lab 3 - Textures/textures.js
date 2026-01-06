// Define vertex shader
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoord;

out vec3 vColour;
out vec2 vTexCoord;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;

  // Output texture coordinates
  vTexCoord = aTexCoord;
}`;

// Define fragment shader
const fragmentShaderSource = 
`#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoord;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform sampler2D uTexture2;

void main() {
  fragColour = mix(texture(uTexture, vTexCoord), texture(uTexture2, vTexCoord), 0.4);
}`;

// Main function
function main() {

  // Setup WebGL
  const canvas = document.getElementById("canvasId");
  const gl = initWebGL(canvas);
  
  // Create WebGL program 
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Set the shader program
  gl.useProgram(program);

  // Define vertices
  const vertices = new Float32Array([
  //  x     y    z       r    g    b      u  v            
    -0.5, -0.5, 0.0,    1.0, 0.0, 0.0,    0, 0, // vertex 0     3 -- 2
     0.5, -0.5, 0.0,    0.0, 1.0, 0.0,    1, 0, // vertex 1     |  / |    
     0.5,  0.5, 0.0,    0.0, 0.0, 1.0,    1, 1, // vertex 2     | /  | 
    -0.5,  0.5, 0.0,    1.0, 1.0, 1.0,    0, 1, // vertex 3     0 -- 1 
  ]);
  
  // Define indices
  const indices = new Uint16Array([
    0, 1, 2,  // lower-right triangle
    0, 2, 3,  // upper-left triangle
  ]);

  // Create VAOs
  const vao = createVao(gl, program, vertices, indices);

  // Load texture
  const texture = loadTexture(gl, "assets/mario_small.png");
  const texture2 = loadTexture(gl, "assets/crate.png");

  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture2"), 1);

  function render() {
    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the square
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // Render next frame
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();