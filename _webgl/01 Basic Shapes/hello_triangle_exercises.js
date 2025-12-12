// Define vertex shader
const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 aPosition;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // Exercise 1(a) - move triangle 0.75 to the right
  // gl_Position = vec4(aPosition.x + 0.75, aPosition.y, aPosition.z, 1.0);

  // Exercise 1(b) - draw triangle upside down
  // gl_Position = vec4(aPosition.x, -aPosition.y, aPosition.z, 1.0);

  // Exercise 1(c) - swap x and y co-ordinates
  // gl_Position = vec4(aPosition.yxz, 1.0);
}`;

// Define fragment shader
const fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColour;

void main() {
  // fragColour = vec4(1.0, 0.0, 0.0, 1.0);

  // Exercise 2 - green rectangle
  // fragColour = vec4(0.0, 1.0, 0.0, 1.0);

  // Exercise 3 - blue hexagon
  // fragColour = vec4(0.0, 0.0, 1.0, 1.0);

  // Exercise 4 - yellow circle
  fragColour = vec4(1.0, 1.0, 0.0, 1.0);
}`;


// Main function
function helloTriangle() {

  // Setup WebGL
  const canvas = document.getElementById('demo-canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return alert("WebGL not supported");

  // Define triangle vertices
  // const triangleVertices = new Float32Array([
  //   // x    y    z
  //   -0.5, -0.5, 0.0, // vertex 0       2
  //    0.5, -0.5, 0.0, // vertex 1     /   \
  //    0.0,  0.5, 0.0, // vertex 2    0 --- 1
  // ]);

  // Exercise 2 - rectangle
  // const triangleVertices = new Float32Array([
  //   // x y z
  //   -0.5, -0.5, 0.0,
  //    0.5, -0.5, 0.0,
  //    0.5,  0.5, 0.0,
  //   -0.5, -0.5, 0.0,
  //    0.5,  0.5, 0.0,
  //   -0.5,  0.5, 0.0,
  // ])

  // Exercise 3 - blue hexagon
  // const radius = 0.5;
  // const triangleCount = 6;
  // const triangleVertices = new Float32Array(triangleCount * 9);
  // const aspectRatio = 800 / 600;
  // let idx = 0;
  // for (let i = 0; i < triangleCount; i++) {
  //   const angle1 = i * Math.PI * 2 / triangleCount;
  //   const angle2 = (i + 1) * Math.PI * 2 / triangleCount;

  //   // Center vertex
  //   triangleVertices[idx++] = 0.0;
  //   triangleVertices[idx++] = 0.0;
  //   triangleVertices[idx++] = 0.0;

  //   // First outer vertex
  //   triangleVertices[idx++] = radius * Math.cos(angle1);
  //   triangleVertices[idx++] = aspectRatio * radius * Math.sin(angle1);
  //   triangleVertices[idx++] = 0.0;

  //   // Second outer vertex
  //   triangleVertices[idx++] = radius * Math.cos(angle2);
  //   triangleVertices[idx++] = aspectRatio * radius * Math.sin(angle2);
  //   triangleVertices[idx++] = 0.0;
  // }

  // Exercise 4 - yellow circle
  const radius = 0.5;
  const triangleCount = 50;
  const triangleVertices = new Float32Array(triangleCount * 9);
  const aspectRatio = 800 / 600;
  let idx = 0;
  for (let i = 0; i < triangleCount; i++) {
    const angle1 = i * Math.PI * 2 / triangleCount;
    const angle2 = (i + 1) * Math.PI * 2 / triangleCount;

    // Center vertex
    triangleVertices[idx++] = 0.0;
    triangleVertices[idx++] = 0.0;
    triangleVertices[idx++] = 0.0;

    // First outer vertex
    triangleVertices[idx++] = radius * Math.cos(angle1);
    triangleVertices[idx++] = aspectRatio * radius * Math.sin(angle1);
    triangleVertices[idx++] = 0.0;

    // Second outer vertex
    triangleVertices[idx++] = radius * Math.cos(angle2);
    triangleVertices[idx++] = aspectRatio * radius * Math.sin(angle2);
    triangleVertices[idx++] = 0.0;
  }

  // Create triangle vertex buffer
  const VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Create WebGL program 
  const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Clear the canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // dark gray background
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set the shader program
  gl.useProgram(shaderProgram);

  // Tell WebGL how to read data from the vertex buffer
  const positionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.vertexAttribPointer(
    positionLocation, // index
    3,                // size
    gl.FLOAT,         // type
    false,            // normalized
    0,                // stride
    0);               // offset

  // Draw the triangle
  // gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Exercise 2 - green rectangle
  // Draw the triangle
  // gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Exercise 3 - blue hexagon
  // Draw the triangles
  gl.drawArrays(gl.TRIANGLES, 0, 3 * triangleCount);
}

try {
  helloTriangle();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}