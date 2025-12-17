// Define vertex shader
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoords;

out vec3 vColour;
out vec2 vTexCoords;

uniform mat4 uModel;

void main() {
  gl_Position = uModel * vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;

  // Output texture coordinates
  vTexCoords = aTexCoords;
}`;

// Define fragment shader
const fragmentShaderSource = 
`#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;

out vec4 fragColour;

uniform sampler2D uTexture;

void main() {
  // fragColour = vec4(vColour, 1.0);
  fragColour = texture(uTexture, vTexCoords);
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

  // Create VAOs
  const vao = createVao(gl, program, vertices, indices);

  // Load texture
  const texture = loadTexture(gl, "assets/crate.png");

  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

  // Render function
  function render(time) {
    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Calculate the model matrix
    const translate = new Mat4().translate(0, 0, 0);
    const scale     = new Mat4().scale(1, 1, 1);
    const angle     = 0;
    const rotate    = new Mat4().rotate(0, 1, 0, angle);
    const model     = translate.multiply(rotate).multiply(scale);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    // Draw the rectangle
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // Render next frame
    requestAnimationFrame(render);
  }

  render();
}

main();