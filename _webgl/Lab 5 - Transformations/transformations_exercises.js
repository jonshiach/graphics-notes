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
  const canvas = document.getElementById("canvas");
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
  const texture = loadTexture(gl, "assets/mario.png");

  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

  // Position and velocity vectors
  let pos = [0, 0, 0];
  let vel = [2, 1, 0];
  let lastTime = 0;

  function render(time) {
    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT);

    // // Exercise 1
    // const radius = 0.5;
    // const rotationsPerSecond = 1 / 5;
    // const angle = rotationsPerSecond * time * 0.001 * 2 * Math.PI;
    // pos = [radius * Math.cos(angle), radius * Math.sin(angle), 0];
    // const translate = new Mat4().translate(pos);
    // const scale = new Mat4().scale([0.25, 0.25, 0.25]);
    // const rotate = new Mat4().rotate([0, 0, 1], 0);

    // const model = translate.multiply(rotate).multiply(scale);
    // gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.elements);

    // gl.bindVertexArray(vao);
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // // Exercise 2
    // const radius = 0.5;
    // const rotationsPerSecond = 1 / 5;
    // const angle = rotationsPerSecond * time * 0.001 * 2 * Math.PI;
    // pos = [radius * Math.cos(angle), radius * Math.sin(angle), 0];
    // const translate = new Mat4().translate(pos);
    // const scale = new Mat4().scale([0.25, 0.25, 0.25]);
    // const rotate = new Mat4().rotate([0, 0, 1], -2 * angle);

    // const model = translate.multiply(rotate).multiply(scale);
    // gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.elements);

    // gl.bindVertexArray(vao);
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // // Exercise 3
    // const radius = 0.5;
    // const rotationsPerSecond = 1 / 5;
    // const angle = rotationsPerSecond * time * 0.001 * 2 * Math.PI;
    // pos = [radius * Math.cos(angle), radius * Math.sin(angle), 0];
    // const translate = new Mat4().translate(pos);
    // const scaleVector = [0.5 + 0.3 * Math.sin(4 * angle), 0.5 + 0.3 * Math.sin(4 * angle), 1];
    // const scale = new Mat4().scale(scaleVector);
    // const rotate = new Mat4().rotate([0, 0, 1], -2 * angle);

    // const model = translate.multiply(rotate).multiply(scale);
    // gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.elements);

    // gl.bindVertexArray(vao);
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // Exercise 4
    const dt = (time - lastTime) * 0.001;
    lastTime = time;
    if (Math.abs(pos[0]) > 0.875) vel[0] *= -1;
    if (Math.abs(pos[1]) > 0.875) vel[1] *= -1;
    pos = addVector(pos, scaleVector(vel, dt / 2));

    const translate = new Mat4().translate(pos);
    const scale     = new Mat4().scale([0.25, 0.25, 0.25]);
    const rotate    = new Mat4().rotate([0, 0, 1], 0);

    const model = translate.multiply(rotate).multiply(scale);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.elements);

    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // Render next frame
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();