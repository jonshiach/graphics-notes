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
    const cubeVertices = new Float32Array([
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
    const cubeIndices = new Uint16Array([
        0,  1,  2,  3,  4,  5,  // front
        6,  7,  8,  9, 10, 11,  // right
        12, 13, 14, 15, 16, 17,  // back
        18, 19, 20, 21, 22, 23,  // left
        24, 25, 26, 27, 28, 29,  // bottom
        30, 31, 32, 33, 34, 35   // top
    ]);

    // Define pyramid vertices
    const pyramidVertices = new Float32Array([
        // x y   z      R  G  B     u  v
        // base
        -1,  -1, -1,    0, 0, 0,    0, 0,
         1,  -1, -1,    0, 0, 0,    1, 0,
         1,  -1,  1,    0, 0, 0,    1, 1,
        -1,  -1,  1,    0, 0, 0,    0, 1,
        // front
        -1,  -1,  1,    0, 0, 0,    0, 0,
         1,  -1,  1,    0, 0, 0,    1, 0,
         0,   1,  0,    0, 0, 0,    0.5, 1,
        // right
         1,  -1,  1,    0, 0, 0,    0, 0,
         1,  -1, -1,    0, 0, 0,    1, 0,
        // back
         1,  -1, -1,    0, 0, 0,    0, 0,
        -1,  -1, -1,    0, 0, 0,    1, 0,
        // left
        -1,  -1, -1,    0, 0, 0,    0, 0,
        -1,  -1,  1,    0, 0, 0,    1, 0,
    ]);

    // Define pyramid vertices
    const pyramidIndices = new Uint16Array([
        0,   1, 2, 0, 2, 3, // base
        4,   5, 6,          // front
        7,   8, 6,          // right
        9,  10, 6,          // back  
        11, 12, 6,          // left
    ])

    // Define object positions and type
    const objects = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            objects.push({ 
                position : [ 4 * i, 0, 4 * j],
                type : "cube",
                vector : normalize([Math.random(), Math.random(), Math.random()])
            });
        }
    }
    const numObjects = objects.length;

    // Make every even object a pyramid
    for (let i = 0; i < numObjects; i++) {
        if (i % 2 === 0) objects[i].type = "pyramid";
    }

    // Create VAOs
    const cubeVao = createVao(gl, program, cubeVertices, cubeIndices);
    const pyramidVao = createVao(gl, program, pyramidVertices, pyramidIndices);

    // Load texture
    const texture = loadTexture(gl, "assets/crate.png");

    // Camera object
    const camera = new Camera();

    // Render function
    function render(time) {
        
        // Manual init call, no timing yet
        if (time == null) {
            requestAnimationFrame(render);
            return;
        }

        // Clear frame buffers
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

        // Update camera vectors
        const target = objects[12].position;
        const radius = 20;
        const offset = [
            radius * Math.cos(1 / 10 * time * 0.001 * 2 * Math.PI), 
            4, 
            radius * Math.sin(1 / 10 * time * 0.001 * 2 * Math.PI)
        ];
        camera.eye = addVector(target, offset);
        camera.front = normalize(subtractVector(target, camera.eye));
        camera.update();

        // Calculate view matrix
        const view = camera.getViewMatrix();

        // Calculate projection matrix
        // const projection = camera.getOrthographicMatrix(-2, 2, -2, 2, 0, 100);
        const projection = camera.getPerspectiveMatrix();

        // Send view and project matrices to the shaders
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view.m);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection.m);

        // Draw objects
        for (let i = 0; i < numObjects; i++) {

            // Calculate the model matrix
            let angle = 0;
            if (objects[i].type === "cube") {
                angle = 1/2 * time * 0.001 * 2 * Math.PI;
            }
            const model = new Mat4()
                .translate(objects[i].position)
                .rotate(objects[i].vector, angle)
                .scale([0.5, 0.5, 0.5]);
                
            // Send model matrix to the shader
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

            // Draw the objects
            if (objects[i].type === "cube"){
                gl.bindVertexArray(cubeVao);
                gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
            } else if (objects[i].type === "pyramid") {
                gl.bindVertexArray(pyramidVao);
                gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0);
            }
        }

        // Render next frame
        requestAnimationFrame(render);
    }

  render();
}

main();
