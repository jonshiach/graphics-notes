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

  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("marioImage"));
  // gl.generateMipmap(gl.TEXTURE_2D);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Load image file
  var image = new Image();
  image.src = imagePath;
  image.crossOrigin = "";
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    console.log("Texture loaded:", image.width, image.height, imagePath);
  };

  return texture
}

// Check if a value is a power of 2
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}
