// Define vertex shader code
const vertexShaderCode = `#version 300 es
precision mediump float;

in vec3 aPosition; 
in vec3 aColour;
in vec2 aTexCoord;

out vec3 vColour;
out vec2 vTexCoord;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // Output fragment colour
  vColour = aColour;

  // Output texture co-ordinates
  vTexCoord = aTexCoord;
}`;

// Define fragment shader code
const fragmentShaderCode = `#version 300 es
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

  // Define rectangle vertices
  const rectangleVertices = new Float32Array([
    // x     y    z       r    g    b       u    v            
     -0.5, -0.5, 0.0,    1.0, 0.0, 0.0,    0.0, 0.0, // vertex 0     3 -- 2
      0.5, -0.5, 0.0,    0.0, 1.0, 0.0,    1.0, 0.0, // vertex 1     |  / |
      0.5,  0.5, 0.0,    0.0, 0.0, 1.0,    1.0, 1.0, // vertex 2     | /  |
     -0.5,  0.5, 0.0,    1.0, 1.0, 1.0,    0.0, 1.0, // vertex 3     0 -- 1
  ]);

  // Define rectangle indices
  const rectangleIndices = new Uint16Array([
  0, 1, 2,  // lower-right triangle
  0, 2, 3,  // upper-left triangle
  ]);

  // Create rectangle vertex buffer
  const rectangleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, rectangleVertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Create rectangle index buffer
  const rectangleIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, rectangleIndices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
  // Create WebGL shader program
  const shaderProgram = createShaderProgram(gl, vertexShaderCode, fragmentShaderCode);

  // Configure the graphics pipeline
  gl.useProgram(shaderProgram);
  
  // Get attribute locations
  const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
  const colourLocation = gl.getAttribLocation(shaderProgram, "aColour");
  const texCoordLocation = gl.getAttribLocation(shaderProgram, "aTexCoord");

  // Create VAO for the rectangle
  const rectangleVAO = gl.createVertexArray();
  gl.bindVertexArray(rectangleVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleIndexBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(colourLocation);
  gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT); 
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
  gl.bindVertexArray(null);

  // Create a texture
  const texture = gl.createTexture();
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D); 
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  image.src = 'assets/mario.png';


  // const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("marioImage"));
  // gl.generateMipmap(gl.TEXTURE_2D);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);

  // Clear the canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Configure the graphics pipeline
  gl.useProgram(shaderProgram);
  
  // Bind the VAO for the rectangle
  gl.bindVertexArray(rectangleVAO);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Draw the rectangle
  gl.drawElements(gl.TRIANGLES, rectangleIndices.length, gl.UNSIGNED_SHORT, 0);
  
}

try {
  main();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}