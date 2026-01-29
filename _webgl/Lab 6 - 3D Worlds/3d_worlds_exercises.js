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
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);

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

  // Define cube positions (5x5 grid of cubes)
  const cubes = [];
  const spacing = 3;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      cubes.push({
        position : [ i * spacing, 0, j * spacing],
        rotation : [Math.random(), Math.random(), Math.random()]
      })
    }
  }
  const numCubes = cubes.length;
  console.log(numCubes);

  // Create VAOs
  const vao = createVao(gl, program, vertices, indices);

  // Load texture
  const texture = loadTexture(gl, "assets/crate.png");

  // Create camera object
  const camera = new Camera();

  // Render function
  function render(time) {

    // Manual init call, no timing yet
    if (time == null) {
        requestAnimationFrame(render);
        return;
    }

    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

    // Update camera vectors
    const offsetRadius = 15;
    const offsetAngle = 1 / 10 * time * 2 * Math.PI *0.001;
    const target = cubes[12].position;
    const offset = scaleVector(
      [ Math.cos(offsetAngle), 0, Math.sin(offsetAngle)], 
      offsetRadius
    );
    offset[1] = 3;
    camera.eye   = addVector(target, offset);
    camera.front = normalize(subtractVector(target, camera.eye));
    camera.right = normalize(cross(camera.front, camera.worldUp));
    camera.up    = normalize(cross(camera.right, camera.front));

    // Calculate view matrix
    const view = camera.getViewMatrix();

    // Calculate projection matrix
    // const projection = camera.getOrthographicMatrix(-2, 2, -2, 2, 0, 100);
    const  projection = camera.getPerspectiveMatrix();

    // Send view and project matrices to the shaders
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection.elements);

    // Draw cubes
    for (let i = 0; i < numCubes; i++){
      
      // Calculate the model matrix
      const translate = new Mat4().translate(cubes[i].position);
      const scale     = new Mat4().scale([0.5, 0.5, 0.5]);
      let angle       = 0;
      if (i % 2 === 0) angle = 1/2 * time * 2 * Math.PI * 0.001;
      let rotate    = new Mat4().rotate(cubes[i].rotation, angle);

      const model     = translate.multiply(rotate).multiply(scale);
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.elements);

      // Draw the rectangle
      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    // Render next frame
    requestAnimationFrame(render);
  }

  render();
}

main();