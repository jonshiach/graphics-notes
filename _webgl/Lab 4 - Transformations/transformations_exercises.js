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
  const gl = initWebGL(canvasId);
  
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
  const texture = loadTexture(gl, "assets/mario.png");

  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

  // Exercise 4
  // Position and velocity
  let pos = new Vec3(0, 0, 0);
  let vel = new Vec3(2, 1, 0);
  let lastTime = 0;

  function render(time) {
    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Calculate transformation matrices
    // const radius = 0.5;
    // let angle = 1/5 * time * 0.001 * 2 * Math.PI;
    // const translate = new Mat4().translate(
    //   radius * Math.cos(angle), 
    //   radius * Math.sin(angle), 
    //   0
    // );
    // angle = time * 0.001 * 2 * Math.PI;;
    // const scale     = new Mat4().scale(
    //   0.5 + 0.25 * Math.sin(angle), 
    //   0.5 + 0.25 * Math.sin(angle), 
    //   1);
    // const scale = new Mat4().scale(0.5, 0.5, 0.5);
    // angle = -2/5 * time * 0.001 * 2 * Math.PI;
    // const rotate    = new Mat4().rotate(0, 0, 1, 0);

    // Exercise 4
    // Calculate transformation matrices
    const dt = (time - lastTime) * 0.001;
    lastTime = time;
    if (pos.x < -0.75 || pos.x > 0.75) vel.x *= -1;
    if (pos.y < -0.75 || pos.y > 0.75) vel.y *= -1;
    pos = pos.add(vel.scale(dt / 2));

    console.log(pos.array);

    const translate = new Mat4().translate(pos.x, pos.y, pos.z);
    const scale = new Mat4().scale(0.5, 0.5, 0.5);
    const rotate    = new Mat4().rotate(0, 0, 1, 0);

    // Send transformation matrices to the shader
    const model = translate.multiply(rotate).multiply(scale);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    // Draw the rectangle
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // Render next frame
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();