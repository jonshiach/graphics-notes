# Drawing a Simple Shape in WebGL

For our first WebGL example we are going to display a simple triangle to the screen, this "hello triangle" is the computer graphics version of the classic "hello world!" example.

## Setup HTML and JavaScript Files

To start with we need two files, an HTML file that includes a `<canvas>` element which acts as a rendering surface for WebGL, and JavaScript file that controls everything that happens inside the canvas using the WebGL API.

These notes use a code-along principle in that as you work through these notes you will be tasked to create files, enter text and run code (the first of these tasks is below). Through working this way you will build an understanding of the concepts and techniques used in computer graphics. Where you are asked to enter code into your files, try to avoid the temptation of simply copying and pasting code, instead type out the code. Whilst this does have the risk of making typos and creating bugs, it does have an effect of helping you understand what each line of code is doing.

````{admonition} Task
:class: tip

Create a folder called `01 Hello Triangle` inside which create a HTML file called `index.html` and enter the following code.

```none
<!doctype html>

<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>01 Hello Triangle</title>

    <style>
      html, head, body {
        margin: 0;
        padding: 25px;
        background-color: #000;
      }

      #demo-canvas {
        width: 800px;
        height: 600px;
        background-color: #8AcE00; // 
        image-rendering: crisp-edges;
      }
    </style>
  </head>
  <body>
    <canvas id="demo-canvas" width="800px" height="600px">
      HTML5 canvas not supported in your browser! These demos will not work.
    </canvas>
  </body>
</html>
```
````

If you open your `index.html` file in a web browser you will see that we have created a `<canvas>` element that is 800 pixels wide by 600 pixels high that is a particularly lurid shade of green. The reason for this horrible colour is that we will be clearing the canvas in our WebGL app so if we see this green colour we know something has gone wrong.

```{figure} ../_images/01_Canvas.png
```

````{admonition} Task
:class: tip

Inside your `01 Hello Triangle` folder, create a JavaScript file `hello_triangle.js` that contains the following.

```javascript
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

  // Clear the canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.1, 0.1, 0.1, 1.0); // dark gray background
  gl.clear(gl.COLOR_BUFFER_BIT);
}

try {
  main();
} catch (e) {
  console.error(`Uncaught JavaScript exception: ${e}`);
}
```
````

Here we have created our main function `main()` inside which we have set up the WebGL canvas. Some functions used here are defined below

`gl.viewport(0, 0, canvas.width, canvas.height);`
: Defines the rectangular area of the canvas where rendering will take place that maps to the normalised device co-ordinates (-1 to 1 in the $x$, $y$ and $z$ axes). Here our viewport fills the `<canvas>` element.

`gl.clearColor(0.1, 0.1, 0.1, 1.0);`
: Defines the background colour. Colours are defined using RGBA values (Red, Green, Blue and Alpha) so here our background is dark grey.

`gl.clear(gl.COLOR_BUFFER_BIT);`
: Clears the specified buffer, in this case it's the colour buffer.

Refresh the browser window by pressing <kbd>CTRL</kbd> + <kbd>R</kbd> or <kbd>&#8984;</kbd> + <kbd>R</kbd> if you are using a Mac, and you should still see that the horrible lurid green background. But hang on, haven't we defined our background colour to be dark grey? The reason for this is that we haven't embedded the JavaScript file into our HTML file.

````{admonition} Task
:class: tip

Edit the `<body>` tag near the bottom of the `index.html` file so that it looks like the following.

```
...
<body>
  <canvas id="demo-canvas" width="800px" height="600px">
    HTML5 canvas not supported in your browser! These demos will not work.
  </canvas>

  <script src="hello_triangle.js"></script>
</body>
...
```
````

Now if you refresh your browser you should see a dark grey background. If something has gone wrong, and you still see the green background, open up the JavaScript console using <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>J</kbd> or <kbd>&#8997;</kbd> + <kbd>&#8984;</kbd> + <kbd>J</kbd> on a Mac, and it should give you an indication of what has gone wrong. The life of a graphics programmer is mostly problem-solving and debugging, so get used to doing this.

```{figure} ../_images/01_Colourbuffer.png
```

## Define the Triangle Co-ordinates

We are going to display a simple red triangle on our canvas similar to the one below.

```{figure} ../_images/01_Triangle.svg
:width: 400
```

````{admonition} Task
:class: tip

Enter the following just before we clear the canvas.

```javascript
// Define triangle vertices
const triangleVertices = new Float32Array([
  // x     y    z
   -0.5, -0.5, 0.0, // vertex 0       2
    0.5, -0.5, 0.0, // vertex 1     /   \
    0.0,  0.5, 0.0, // vertex 2    0 --- 1
]);
```
````

Here we have defined an array called `triangleVertices` containing 9 values for the co-ordinates of the 3 triangle vertices. WebGL works best with 32-bit floats, and the default JavaScript float precision is 64-bit, so we use the `new Float32Array()` command to convert these into 32-bit float array.

The data in the `triangleVertices` array is stored in the CPU (RAM) and not in the GPU. To move data across to the GPU we create a WebGL buffer object and copy in the data.

````{admonition} Task
:class: tip

Enter the following after we have defined the triangle vertices array.

```javascript
// Create triangle buffer
const triangleVerticesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
```
````

The commands used here are explained below

`const triangleVerticesBuffer = gl.createBuffer();`
: Creates a buffer object on the GPU. Here we have given it the name `triangleVerticesBuffer`.

`gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer);`
: Binds our `triangleVerticesBuffer` buffer object to an array buffer so that WebGL knows where to send the data. The word *bind* in graphics programming means to make it the currently active resource for a particular purpose so subsequent WebGL operations affect it.

`gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);`
: Copies the data from the `triangleVertices` array into the array buffer that is currently bound. The `gl.STATIC_DRAW` input is a performance hint to WebGL, here we are saying that that triangle vertices will not change.

`gl.bindBuffer(gl.ARRAY_BUFFER, null);`
: Here we unbind the current array buffer, so no subsequent commands will mistakenly affect it.

---

## Create a Shader Program

The next step is create a shader program that runs on the GPU and uses WebGL to determine which pixels on the display are to be rendered and in what colour. This shader program comprises two separate programs known as "shaders": the **vertex shader** and the **fragment shader**. Shaders are written in **GLSL (webGL Shader Language)** which is similar to C.

### Write and Compile the Vertex Shader

The vertex shader is called once for each vertex and transforms the vertex co-ordinates from model space (the local object co-ordinates) to the clip space that defines the region that is displayed on the canvas. We have defined our triangle using co-ordinates between $[-1, 1]$, so they are already in clip space and our vertex shader just needs to output each vertex. The shader code for a simple vertex shader is

```c
#version 300 es
precision mediump float;

in vec3 aPosition;

void main() {
  gl_Position = vec4(aPosition, 1.0);
}
```

This code is explained below

`#version 300 es`
: Tells the shader we are using GLSL ES 3.00, the shader language used with WebGL 2.0.

`precision mediump float;`
: Sets the default float precision to medium (16-bit).

`in vec3 aPosition;`
: Tells the shader that we are inputting a 3-element vector for the vertex position. The `a` in `aPosition` is short for attribute.

`gl_Position = vec4(aPosition, 1.0);`
: Outputs a 4-element vector for the clip space co-ordinates of the vertex (there reason why it's a 4-element vector will be covered later when we look at transformations). The `gl_Position` variable is a required output of every vertex shader.

The simplest way of entering shader code into our JavaScript file is to define it as a multiline string.

````{admonition} Task
:class: tip

Add the following after we have created the triangle buffer. Note the use of backticks `` `...` `` to define the string using a literal so that we can use a multiline string.

```javascript
// Define vertex shader code
const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 aPosition;

void main() {
  gl_Position = vec4(aPosition, 1.0);
}`;

// Compile vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.log(`Error compiling vertex shader:\n`, gl.getShaderInfoLog(vertexShader));
  gl.deleteShader(vertexShader);
}
```
````

As well as defining a string for the vertex shader code, we then create a vertex shader object, attach the shader code to it and compile it. There's no easy way to check for errors in shader code, so it is good practice to do a check to see if it has compiled ok, if not a message is logged to the console.

### Write and Compile the Fragment Shader

The other shader we need to write is the fragment shader. This takes in information on a fragment that has been identified as being part of the primitive (i.e., triangle) and determines the colour that it will be rendered. We are going to render all fragments in the triangle as red, so the fragment shader code is as follows.

```c
#version 300 es
precision mediump float;

out vec4 outColour;

void main() {
  outColour = vec4(1.0, 0.0, 0.0, 1.0);
}
```

This is similar to the vertex shader with a couple of exceptions. The vertex shader has a required output of `gl_Position`, so this doesn't need to be declared, fragment shaders can have a number of outputs, so we need to declare these. Here we have declared an output of a 4-element vector using `out vec4 outColour;`. Within the `main()` function, we set the output vector to $(1, 0, 0, 1)$, i.e., all red with no blue or green components and the Alpha value is set to 1 so that it is opaque.

````{admonition} Task
:class: tip

Add the following after we have compiled the vertex shader.

```javascript
// Define fragment shader code
const fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 outColour;

void main() {
 outColour = vec4(1.0, 0.0, 0.0, 1.0);
}`;

// Compile fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.log(`Error compiling fragment shader:\n`, gl.getShaderInfoLog(fragmentShader));
  gl.deleteShader(fragmentShader);
}
```
````

This code is very similar to the one used for the vertex shader. Later we will be using a helper function for DRY (Don't Repeat Yourself).

### Link the Shaders into a WebGL Program

The next step is to create a WebGL program and link the vertex and fragment shader to it. In doing this it manages the inputs and outputs, attributes and uniforms between our two shaders.

````{admonition} Task
:class: tip

Add the following to the `main()` function

```javascript
// Create WebGL shader program and link the vertex and fragment shaders
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
 console.log(`Failed to link WebGL program : ${gl.getProgramInfoLog(shaderProgram)}`);
 return;
}
```
````

The commands used here are similar to those used for the vertex and fragment shader. Instead of compiling the program we are simply linking the two shaders using the `gl.linkProgram()` function. We also do a check to see if the linking has been successful.

### Draw the Triangle

So far we have done a fair bit of work creating a buffer object for the triangle vertices, written and compiled the vertex and fragment shader and linked these into a WebGL program. But we haven't drawn anything yet! To do this we need to tell WebGL which shader program to use, tell it how to interpret the vertex data and then tell it to draw the triangle.

````{admonition} Task
:class: tip

Enter the following after we have cleared the canvas.

```javascript
// Set the shader program
gl.useProgram(shaderProgram);
```
````

The `gl.useProgram()` function tells WebGL which shader program to use. It will use the currently selected program until told differently by another call to this function.

Earlier we created the vertex buffer `triangleVerticesBuffer` in the GPU and copied across our vertex data. We now need to tell WebGL where this data is and how to read it, so it can work its magic with the shaders.

````{admonition} Task
:class: tip

Enter the following after the you have set the shader program. 

```javascript
// Tell WebGL how to read data from the vertex buffer  
const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
gl.enableVertexAttribArray(0);
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer);
gl.vertexAttribPointer(
  positionLocation, // index
  3,                // size
  gl.FLOAT,         // type
  false,            // normalised
  0,                // stride
  0);               // offset
```
````

The functions used here are explained below;

`const positionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');`
: Gets the location of the `aPosition` attribute from the WebGL shader program.

`gl.enableVertexAttribArray(0);`
: Enables a vertex attribute so that WebGL know to read data form a buffer and pass it to the vertex shader.

`gl.bindBuffer(gl.Array_BUFFER, triangleVerticesBuffer);`
: Make the triangle buffer the currently active buffer.

`gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);`
: Tells WebGL how to read the data from the currently bound buffer and pass it to the vertex shader. The inputs are explained in the table below.

| Input | Description |
|:--|:--|
| `index` | Attribute location. We stored this in the `positionLocation` variable using the `gl.getAttribLocation()` function. |
| `size` | Number of components per vertex, We have 3D $(x, y, z)$ co-ordinates, so this is 3. |
| `type` | Data type. We are using floats. |
| `normalised` | Whether integer values should be mapped to $[0, 1]$ or $[-1, 1]$. Our vertex co-ordinates are in NDC, so we don't need to do this. |
| `stride` | Number of bytes between first attribute of each vertex. Our data is tightly packed, so we can set the stride to 0, if the array buffer contained other data, e.g., colours, then we would need to determine the number of bytes between the first attribute, e.g., the $x$ co-ordinates. |
| `offset` | Number of bytes from the start of the buffer the attribute of the first vertex. Our first vertex co-ordinate is the first element in the buffer, so this is 0. |

The last thing we need to do is actually tell WebGL to draw the triangle.

````{admonition} Task
:class: tip

Enter the following after the you have told WebGL how to read the data from the vertex buffer.

```javascript
// Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, 3);
```
````

The `gl.drawArrays()` function tells the GPU to draw the primitives. The inputs are the type of primitive (we have a triangle), the index of the first vertex and the number of vertices to draw (we have one triangle, so we want to draw 3 vertices). Refresh your browser window, pray to the programming gods and if everything has gone to plan you should see the red triangle displayed on the canvas.

```{figure} ../_images/01_hello_triangle.png
```

---

## Shader Compiler Utility Functions

Looking at our `main()` function we see that the code to compile and link the shaders is very similar for the vertex and fragment shaders. In the spirit of DRY, we will now write some utility functions to simplify the code.

````{admonition} Task
:class: tip

Create a new JavaScript files called `utils.js` within the `01 Hello Triangle/` folder and enter the following code.

```javascript
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
function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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
```
````

This new file `utils.js` is used to contain any utility (helper) functions. Here we have defined the functions `compileShader()` which compiles a vertex or fragment shader depending on the `type` input, and `createShaderProgram()` that calls `compileShader()` to create the vertex and fragment shaders and links them to create a WebGL program. If you compare them to the equivalent code in the `main()` function you can see that they are similar. To enable our main file to use these functions we also need to add `utils.js` to the `index.html` file using a script tag.

````{admonition} Task
:class: tip

Add the following just before the `hello_triangle.js` script tag.

```
 <script src="utils.js"></script>
```
````

We can now tidy up the `main()` function and make a call to out new `createShaderProgram()` function.

````{admonition} Task
:class: tip

Cut and paste the `vertexShaderSource` and `fragmentShaderSource` to the top of the `hello_triangle.js` file. Delete the code in the `main()` function that compiles and links the shaders and replace it with the following.

```javascript
// Create WebGL program 
const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
```
````

Refresh your browser window and if everything has gone to plan you should see your red triangle as before. This effort is not wasted, we can now easily create WebGL programs from the source code without lots of copying and pasting of existing code. We will be using the `utils.js` and other JavaScript files to help organise and simplify our code in the future.

---

## Exercises

1. Change the vertex shader so that the following results are achieved.

&emsp; (a) The triangle is shifted by 0.75 to the right.

```{figure} ../_images/01_Q1a.png
:width: 400
```

```{dropdown} Hint
We can access individual elements of the `aPosition` vectors using `aPosition.x`, `aPosition.y` and `aPosition.z` -- this is known as <a href="https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)" target="_blank">swizzling</a>.
```

&emsp; (b) The triangle is drawn upside-down.

```{figure} ../_images/01_Q1b.png
:width: 400
```

&emsp; (c) The $x$ and $y$ co-ordinates are swapped.

```{figure} ../_images/01_Q1c.png
:width: 400
```

2. Use two triangles to draw a green rectangle with lower-left vertex at $(-0.5, -0.5, 0)$ and the upper-right vertex at $(0.5, 0.5, 0)$.
  
```{figure} ../_images/01_Q2.png
:width: 400
```

3. Use multiple triangles to draw a circle.

```{figure} ../_images/01_Q3.png
:width: 400
```

````{dropdown} Hint
We can draw and approximation of a circle using multiple triangles with one vertex at the $(0, 0)$ and the other two vertices at points on the circle.

```{figure} ../_images/01_circle.svg
:width: 500
```

The $(x, y)$ co-ordinates of a point on a circle centred at $(0, 0)$ with radius $r$ can be calculated using


$$ \begin{align*}
  x &= r \cos(\theta), &
  y &= r \sin(\theta),
\end{align*} $$

where $\theta$ is the angle between the $x$-axis and a line pointing from $(0,0)$ to the point. Therefore, if we want a circle constructed using $n$ triangles the co-ordinates of the 3 triangle vertices are

$$ \begin{align*}
&( 0, 0 ), &
&( r\cos(\theta_1), r\sin(\theta_2)), &
&( r\cos(\theta_2), r\sin(\theta_2)),
\end{align*} $$

where $\theta_1 = \dfrac{2i\pi}{n}$ and $\theta_2 = \dfrac{2(i+1)\pi}{n}$ for the $i$-th triangle. You may also need to scale the $y$ co-ordinates to preserve the aspect ratio of the circle.
````

<!-- ---

## Code

If you are having difficulty with a particular task, you can use the following files to help you.

- [`index_base.html`](../_webgl/01%20Hello%20Triangle/index_base.txt), [`hello_triangle_base.js`](../_webgl/01%20Hello%20Triangle/01_hello_triangle_base.js) -- base versions of the HTML and JavaScript files that draw a blank canvas.
- [`index.html`](../_webgl/01%20Hello%20Triangle/index_no_utils.txt), [`hello_triangle.js`](../_webgl/01%20Hello%20Triangle/hello_triangle_no_utils.js) -- HTML and JavaScript file to draw the hello triangle example.
-  [`index.html`](../_webgl/01%20Hello%20Triangle/index.txt), [`hello_triangle.js`](../_webgl/01%20Hello%20Triangle/hello_triangle.js), [`utils.js`](../_webgl/01%20Hello%20Triangle/utils.js) -- HTML and JavaScript files to draw hello triangle example using utility functions.

### Exercise solutions

-  [`Q1a.js`](../_webgl/01%20Hello%20Triangle/Q1a.js)
-  [`Q1b.js`](../_webgl/01%20Hello%20Triangle/Q1b.js)
-  [`Q1c.js`](../_webgl/01%20Hello%20Triangle/Q1c.js)
-  [`Q2.js`](../_webgl/01%20Hello%20Triangle/Q2.js)
-  [`Q3.js`](../_webgl/01%20Hello%20Triangle/Q3.js) -->