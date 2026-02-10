// Define vertex shader
const vertexShaderSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;

out vec3 vColour;

void main() {
  gl_Position = vec4(aPosition, 1.0);

  // Exercise 1
  // gl_Position = vec4(aPosition.x + 0.75, aPosition.yz, 1.0);

  // Exercise 1b
  // gl_Position = vec4(aPosition.x, -aPosition.y, aPosition.z, 1.0);

  // Exercise 1c
  // gl_Position = vec4(aPosition.yxz, 1.0);

  // Output vertex colour
  vColour = aColour;
}`;

// Define fragment shader
const fragmentShaderSource = 
`#version 300 es
precision mediump float;

in vec3 vColour;

out vec4 fragColour;

void main() {
  fragColour = vec4(vColour, 1.0);
}`;


// Main function
function main() {

  // Setup WebGL
  const gl = initWebGL("canvas");
  
  // Create WebGL program 
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Set the shader program
  gl.useProgram(program);

  // Define triangle vertices
  const vertices = new Float32Array([
    // x     y    z      R    G    B
    -0.5, -0.5, 0.0,    1.0, 0.0, 0.0, // vertex 0       2
     0.5, -0.5, 0.0,    0.0, 1.0, 0.0, // vertex 1     /   \
     0.0,  0.5, 0.0,    0.0, 0.0, 1.0, // vertex 2    0 --- 1
  ]);

  // Define square vertices
  const squareVertices = new Float32Array([
  // x    y    z       R    G    B             
    0.5, 0.2, 0.0,    1.0, 0.0, 0.0, // vertex 0     3 -- 2
    0.8, 0.2, 0.0,    0.0, 1.0, 0.0, // vertex 1     |  / |    
    0.8, 0.6, 0.0,    0.0, 0.0, 1.0, // vertex 2     | /  | 
    0.5, 0.6, 0.0,    1.0, 1.0, 1.0, // vertex 3     0 -- 1 
  ]);
  
  // Define triangle indices
  const indices = new Uint16Array([
    0, 1, 2
  ]);

  // Define square indices
  const squareIndices = new Uint16Array([
    0, 1, 2,  // lower-right triangle
    0, 2, 3,  // upper-left triangle
  ]);

    // Create VAOs
  const triangleVao = createVao(gl, program, vertices, indices);
  const squareVao = createVao(gl, program, squareVertices, squareIndices);

  // Draw the triangle
  gl.bindVertexArray(triangleVao);
  // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  // Exercise 2
  // const rectangleVertices = new Float32Array([
  // // x    y    z         R    G    B             
  //   -0.5, -0.5, 0.0,    0.0, 1.0, 0.0, // vertex 0     3 -- 2
  //    0.5, -0.5, 0.0,    0.0, 1.0, 0.0, // vertex 1     |  / |    
  //    0.5,  0.5, 0.0,    0.0, 1.0, 0.0, // vertex 2     | /  | 
  //   -0.5,  0.5, 0.0,    0.0, 1.0, 0.0, // vertex 3     0 -- 1 
  // ]);
  // const rectangleIndices = new Uint16Array([
  //   0, 1, 2,  // lower-right triangle
  //   0, 2, 3,  // upper-left triangle
  // ]);

  // const rectangleVao = createVao(gl, program, rectangleVertices, rectangleIndices);
  // gl.bindVertexArray(rectangleVao);
  // gl.drawElements(gl.TRIANGLES, rectangleIndices.length, gl.UNSIGNED_SHORT, 0);

  // Exercise 3
  function drawCircle(radius, numSides, r, g, b) {
    let verticesArray = [];
    let indicesArray = [];
    const aspect = 800 / 600;
    let angle = 0;
    const deltaAngle = 2 * Math.PI / numSides;

    for (let i = 0; i < numSides; i++) {
      const x1 = radius * Math.cos(angle);
      const y1 = aspect * radius * Math.sin(angle);
      angle += deltaAngle;
      const x2 = radius * Math.cos(angle);
      const y2 = aspect * radius * Math.sin(angle)

      verticesArray.push(0, 0, 0, r, g, b);
      verticesArray.push(x1, y1, 0, r, g, b);
      verticesArray.push(x2, y2, 0, r, g, b);
      indicesArray.push(3 * i, 3 * i + 1, 3 * i + 2);
    }

    const hexagonVertices = new Float32Array(verticesArray);
    const hexagonIndices = new Uint16Array(indicesArray);
    const hexagonVao = createVao(gl, program, hexagonVertices, hexagonIndices);
    gl.bindVertexArray(hexagonVao);
    gl.drawElements(gl.TRIANGLES, hexagonIndices.length, gl.UNSIGNED_SHORT, 0);
  }
  // drawCircle(0.5, 6, 0, 0, 1);

  // Exercise 4
  drawCircle(0.5, 50, 1, 1, 0);


  

}

main();