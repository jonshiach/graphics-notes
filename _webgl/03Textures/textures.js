// Define vertex shader code
const vertexShaderSource = `#version 300 es
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

  // Output texture co-ordinates
  vTexCoord = aTexCoord;
}`;

// Define fragment shader code
const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoord;

out vec4 outColour;

uniform sampler2D uSampler;

void main() {
  outColour = texture(uSampler, vTexCoord);
}`;


// Main function
function main() {

  // Setup WebGL
  const canvas = document.getElementById('demo-canvas');
  if (!canvas) {
    showError('Could not find HTML canvas element - check for typos, or loading JavaScript file too early');
    return;
  }
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    const isWebGL1Supported = !!(document.createElement('canvas')).getContext(`webgl`);
    if (isWebGL1Supported) {
      showError('WebGL 1 is supported, but not v2 - try using a different device or browser');
    } else {
      showError('WebGL is not supported on this device - try using a different device or browser');
    }
    return;
  }

  // Define vertices
  const vertices = new Float32Array([
    // x    y    z       r    g    b       u    v     
    -0.5, -0.5, 0.0,    1.0, 0.0, 0.0,    0.0, 0.0, // vertex 0     3 -- 2
     0.5, -0.5, 0.0,    0.0, 1.0, 0.0,    1.0, 0.0, // vertex 1     |  / |    
     0.5,  0.5, 0.0,    0.0, 0.0, 1.0,    1.0, 1.0, // vertex 2     | /  | 
    -0.5,  0.5, 0.0,    0.0, 0.0, 0.0,    0.0, 1.0, // vertex 3     0 -- 1 
  ]);

  // Create vertex buffer object
  const VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Define triangle indices
  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3,
  ]);

  // Create element buffer object
  const EBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Define the pixels for a 4x4 texture
  const pixels = new Uint8Array([
    255, 255, 255,    0, 0, 0,          255, 255, 255,    0, 0, 0,
    0, 0, 0,          255, 255, 255,    0, 0, 0,          255, 255, 255,
    255, 255, 255,    0, 0, 0,          255, 255, 255,    0, 0, 0,
    0, 0, 0,          255, 255, 255,    0, 0, 0,          255, 255, 255,
  ]);

  // Create texture
  // const texture = gl.createTexture();
  // gl.bindTexture(gl.TEXTURE_2D, texture);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 4, 4, 0, gl.RGB, gl.UNSIGNED_BYTE, pixels);
  // gl.generateMipmap(gl.TEXTURE_2D);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

   // Create WebGL program 
  const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  
  // Load texture from file
  // loadTexture(gl, "assets/mario_small.png");
  loadTexture(gl, "assets/crate.jpg")

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
  const texCoordLocation = gl.getAttribLocation(shaderProgram, "aTexCoord");

  // Tell the shader that uSampler uses texture unit 0:
  const uSamplerLocation = gl.getUniformLocation(shaderProgram, "uSampler");
  gl.uniform1i(uSamplerLocation, 0); // MUST set while program is in use

  // Create VAO
  const VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(colourLocation);
  gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);    
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);    
  gl.bindVertexArray(null);

  // Draw triangle
  gl.bindVertexArray(VAO);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

try {
  main();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}