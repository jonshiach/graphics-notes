// Compile shader helper function
function compileShader(gl, type, code) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, code);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Error compiling ${shaderType === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:\n`, gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return;
  }

  return shader;
}

// Link shaders into a shader program
function createShaderProgram(gl, vertexShaderCode, fragmentShaderCode) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

  if (!vertexShader || !fragmentShader) {
    console.log(`Error linking shaders`);
    return;
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('Error linking shader program:\n', gl.getProgramInfoLog(shaderProgram));
    gl.deleteProgram(program);
    return;
  }

  return shaderProgram;
}

// Load a texture from a file
function loadTexture(gl, imagePath) {

  // Create texture
  const texture = gl.createTexture();

  // Use a single blue pixel until the image loads
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("crateImage"));
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

}

// Check if a value is a power of 2
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

// Create VAO
function createVAO(gl, vertices, indices, shaderProgram) {

  // Create buffer objects
  const VBO = gl.createBuffer();
  const EBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Get attribute locations
  const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
  const colourLocation = gl.getAttribLocation(shaderProgram, "aColour");
  const texCoordLocation = gl.getAttribLocation(shaderProgram, "aTexCoord");

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

  return VAO;
}