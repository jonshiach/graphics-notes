// Compile shader helper function
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Error compiling ${shaderType === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:\n`, gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return;
  }

  return shader;
}

// Link shaders into a shader program
function createShaderProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Error linking shader program:\n', gl.getProgramInfoLog(shaderProgram));
    gl.deleteProgram(program);
    return;
  }

  return shaderProgram;
}