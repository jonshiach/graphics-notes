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

  // Define vertices
  const vertices = new Float32Array([
  //  x     y    z       R    G    B      u  v            
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
  const texture = loadTexture(gl, "assets/mario.png");

  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

  function render(time) {
    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT);

    // // Calculate transformation matrices
    // const translate = new Mat4().translate([0.4, 0.3, 0]);
    // const scale     = new Mat4().scale([0.5, 0.4, 1]);
    // const angle     = 1/2 * time * 0.001 * 2 * Math.PI;
    // const rotate    = new Mat4().rotate([0, 0, 1], angle);

    // Calculate the model matrix
    const rotationsPerSecond = 1/2;
    const angle = rotationsPerSecond * time * 0.001 * 2 * Math.PI;
    const model = new Mat4()
      .translate([0.4, 0.3, 0])
      .rotate([0, 0, 1], angle)
      .scale([0.5, 0.4, 1]);

    // Send model matrix to the shader
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    // Draw the rectangle
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // Render next frame
    requestAnimationFrame(render);
  }

  render();
}

main();