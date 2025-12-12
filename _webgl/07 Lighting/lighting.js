// Define vertex shader
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoords;
in vec3 aNormal;

out vec3 vColour;
out vec2 vTexCoords;
out vec3 vNormal;
out vec3 vPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;


void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;

  // Output texture coordinates
  vTexCoords = aTexCoords;

  // Output world space normal vectors
  vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);

  // Output world space vertex position
  vPosition = vec3(uModel * vec4(aPosition, 1.0));
}`;

// Define fragment shader
const fragmentShaderSource = 
`#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;
in vec3 vNormal;
in vec3 vPosition;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform vec3 uLightPosition;
uniform vec3 uLightColour;
uniform vec3 uCameraPosition;

// Attenuation parameters
uniform float uConstant;
uniform float uLinear;
uniform float uQuadratic;

// Material coefficients
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;

void main() {

  // Object colour
  vec4 objectColour = texture(uTexture, vTexCoords);

  // Ambient
  vec3 ambient = uKa * objectColour.rgb;

  // Diffuse
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uLightPosition - vPosition);
  vec3 diffuse = uKd * max(dot(N, L), 0.0) * uLightColour * objectColour.rgb;

  // Specular
  vec3 V = normalize(uCameraPosition - vPosition);
  vec3 R = reflect(-L, N);
  vec3 specular = uKs * pow(max(dot(R, V), 0.0), uShininess) * uLightColour;

  // Attenuation
  float dist = length(uLightPosition - vPosition);
  float attenuation = 1.0 / (uConstant + uLinear * dist + uQuadratic * dist * dist);

  // Fragment colour
  // fragColour = vec4(attenuation * (ambient + diffuse + specular), objectColour.a);
  fragColour = objectColour;
}`;

// Define vertex and fragment shaders for the light source
const lightVertexShader = 
`#version 300 es
precision mediump float;

in vec3 aPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`;

const lightFragmentShader = 
`#version 300 es
precision mediump float;

out vec4 fragColour;

uniform vec3 uLightColour;

void main() {
  fragColour = vec4(uLightColour, 1.0);
}`;

// Main function
function main() {

  // Setup WebGL
  const canvas = document.getElementById("canvasId");
  const gl = initWebGL(canvas);
  
  // Create WebGL program 
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const lightProgram = createProgram(gl, lightVertexShader, lightFragmentShader);

  // Set the shader program
  gl.useProgram(program);

// Define cube vertices
  const vertices = new Float32Array([
    // x  y  z      r  g  b     u  v     nx  ny  nz                   + ------ +
    // front                                                         /|       /|
    -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //    y        / |      / |
     1, -1,  1,     0, 0, 0,    1, 0,    0,  0,  1,  //    |       + ------ +  |
     1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //    +-- x   |  + ----|- +
    -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //   /        | /      | /   
     1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //  z         |/       |/
    -1,  1,  1,     0, 0, 0,    0, 1,    0,  0,  1,  //            + ------ +   
    // right                        
     1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
     1, -1, -1,     0, 0, 0,    1, 0,    1,  0,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
     1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
     1,  1,  1,     0, 0, 0,    0, 1,    1,  0,  0,
    // back
     1, -1, -1,     0, 0, 0,    0, 0,    0,  0, -1,
    -1, -1, -1,     0, 0, 0,    1, 0,    0,  0, -1,
    -1,  1, -1,     0, 0, 0,    1, 1,    0,  0, -1,
     1, -1, -1,     0, 0, 0,    0, 0,    0,  0, -1,
    -1,  1, -1,     0, 0, 0,    1, 1,    0,  0, -1,
     1,  1, -1,     0, 0, 0,    0, 1,    0,  0, -1,
    // left
    -1, -1, -1,     0, 0, 0,    0, 0,   -1,  0,  0,
    -1, -1,  1,     0, 0, 0,    1, 0,   -1,  0,  0,
    -1,  1,  1,     0, 0, 0,    1, 1,   -1,  0,  0,
    -1, -1, -1,     0, 0, 0,    0, 0,   -1,  0,  0,
    -1,  1,  1,     0, 0, 0,    1, 1,   -1,  0,  0,
    -1,  1, -1,     0, 0, 0,    0, 1,   -1,  0,  0,
    // bottom
    -1, -1, -1,     0, 0, 0,    0, 0,    0, -1,  0,
     1, -1, -1,     0, 0, 0,    1, 0,    0, -1,  0,
     1, -1,  1,     0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1, -1,     0, 0, 0,    0, 0,    0, -1,  0,
     1, -1,  1,     0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1,  1,     0, 0, 0,    0, 1,    0, -1,  0,
    // top
    -1,  1,  1,     0, 0, 0,    0, 0,    0,  1,  0,
     1,  1,  1,     0, 0, 0,    1, 0,    0,  1,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1,  1,     0, 0, 0,    0, 0,    0,  1,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1, -1,     0, 0, 0,    0, 1,    0,  1,  0,
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

  // Define cube positions
  cubePositions = [
     0.0,  0.0,   0.0,
     2.0,  5.0, -10.0,
    -3.0, -2.0,  -3.0,
    -4.0, -2.0,  -8.0,
     2.0,  2.0,  -6.0,
    -4.0,  3.0,  -8.0,
     0.0, -2.0,  -5.0,
     4.0,  2.0,  -4.0,
     2.0,  0.0,  -2.0,
    -1.0,  1.0,  -2.0,
  ];

  // Define cubes
  const numCubes = cubePositions.length;
  const cubes = [];
  for (let i = 0; i < numCubes; i++) {
    cubes.push({
      position  : cubePositions.slice(3 * i, 3 * i + 3),
      vector    : [1, 1, 1],
      angle     : 20 * i * Math.PI / 180,
      ka        : 0.2,
      kd         : 0.7,
      ks        : 1.0,
      shininess : 20,
    });
  }

  // Define light source properties
  const light = {
    position  : [2, 2, 2],
    colour    : [1, 1, 1],
    constant  : 1.0,
    linear    : 0.1,
    quadratic : 0.02,
  }

  // Create VAOs
  const vao = createVao(gl, program, vertices, indices);

  // Load texture
  const texture = loadTexture(gl, "assets/crate.png");

  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

  // Create camera object
  const camera = new Camera(canvas);
  camera.eye = new Vec3(0, 0, 5);

  // Timer
  let lastTime = 0;

  // Render function
  function render(time) {
    // Clear frame buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update camera vectors
    const dt = (time - lastTime) * 0.001;
    lastTime = time;
    camera.update(dt);

    // Use shader program
    gl.useProgram(program);

    // Calculate view and projection matrices
    const view       = camera.lookAt();
    const projection = camera.perspective();
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view.m);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection.m);

    // Send camera position to the shader
    gl.uniform3fv(gl.getUniformLocation(program, "uCameraPosition"), camera.eye.array);

    // Send light source properties to the shader
    gl.uniform3fv(gl.getUniformLocation(program, "uLightPosition"), light.position);
    gl.uniform3fv(gl.getUniformLocation(program, "uLightColour"), light.colour);   
    gl.uniform1f(gl.getUniformLocation(program, "uConstant"), light.constant);
    gl.uniform1f(gl.getUniformLocation(program, "uLinear"), light.linear);
    gl.uniform1f(gl.getUniformLocation(program, "uQuadratic"), light.quadratic);

    // Draw cubes
    for (let i = 0; i < numCubes; i++){
      
      // Calculate the model matrix
      const translate = new Mat4().translate(...cubes[i].position);
      const scale     = new Mat4().scale(0.5, 0.5, 0.5);
      const rotate    = new Mat4().rotate(...cubes[i].vector, cubes[i].angle);
      const model     = translate.multiply(rotate).multiply(rotate).multiply(scale);
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

      // Send object light properties to the shader
      gl.uniform1f(gl.getUniformLocation(program, "uKa"), cubes[i].ka);
      gl.uniform1f(gl.getUniformLocation(program, "uKd"), cubes[i].kd);
      gl.uniform1f(gl.getUniformLocation(program, "uKs"), cubes[i].ks);
      gl.uniform1f(gl.getUniformLocation(program, "uShininess"), cubes[i].shininess);

      // Draw the rectangle
      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    // Render light source
    gl.useProgram(lightProgram);

    // Calculate model matrix for light source
    const translate = new Mat4().translate(...light.position);
    const scale     = new Mat4().scale(0.1, 0.1, 0.1);
    const model     = translate.multiply(scale);
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

    // Send light colour to the shader
    gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), light.colour);

    // Draw light source cube
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // Render next frame
    requestAnimationFrame(render);
  }

  render();
}

main();