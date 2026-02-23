(lighting-section)=

# Lab 8: Lighting

In this lab we will be looking at adding a basic lighting model to our application. Lighting modelling is in itself a huge topic within the field of computer graphics and modern games and movies can look very lifelike thanks to some very clever techniques. Here we will be applying one of the simplest lighting models, the <a href="https://en.wikipedia.org/wiki/Phong_reflection_model" target="_blank">Phong lighting model</a>.

:::{admonition} Task
:class: tip

Create a copy of your ***Lab 7 Moving the Camera*** folder, rename it ***Lab 8 Lighting***, rename the file ***moving_the_camera.js*** to ***lighting.js*** and change ***index.html*** so that the page title is "Lab 8 - Lighting" it embeds the ***lighting.js*** file.
:::

To help demonstrate the effects of lighting on a scene we are going to need more objects, so we are going to draw lots of cubes.

:::{admonition} Task
:class: tip

In the ***lighting.js*** file, change the definition of the cubes to the following.

```javascript
// Define cube positions (5x5 grid of cubes)
const cubes = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        cubes.push({
            position  : [3 * i, 0, -3 * j],
        });
    }
}
const numCubes = cubes.length;
```

Move the camera position by adding the following line of code after the camera object has been created.

```javascript
camera.eye = [6, 2, 5];
```

Change the `gl.clearColor()` command in the `initWebGL()` function (in the ***webGLUtils.js*** file).

```javascript
gl.clearColor(0.0, 0.0, 0.0, 1.0);
```

:::

Here we have defined an array called `cubes` that contains JavaScript objects that define the positions of the centre coordinates of a set of cubes. Refresh your browser, and you can see that we have created a $5 \times 5$ grid of cubes. We have also changed the background colour to black so that we can better see the lighting effects.

```{figure} ../_images/08_cubes.png
:width: 80%
:name: 5x5-cubes-figure

Grid of 25 cubes.
```

---

## Phong's lighting model

Phong's lighting model first described by Bui Tuong Phong (1975) is a local illumination model that simulates the interaction of light falling on surfaces. The brightness of a point on a surface is based on three components

- **ambient lighting** -- a simplified model of light that reflects off all objects in a scene
- **diffuse lighting** -- describes the direct illumination of a surface by a light source based on the angle between the light source direction and the normal vector to the surface
- **specular lighting** -- models the shiny highlights on a surface caused by a light source based on the angle between the light source direction, the normal vector and the view direction

The colour intensity of a fragment on the surface is calculated as a sum of these components, i.e.,

$$ \vec{colour} = \vec{ambient} + \vec{diffuse} + \vec{specular},$$

where theses are 3-element vectors of RGB colour values.

### Ambient lighting

Ambient lighting is light that is scatters off of all surfaces in a scene. To model this we make the simplifying assumption that all faces of the object is lit equally.Phong's model for ambient lighting is

$$ \vec{ambient} = k_a \vec{O}_d $$(ambient-lighting-equation)

where $k_a$ is known as the **ambient lighting constant** which takes on a value between 0 and 1 and $\vec{O}_d$ is the object colour. $k_a$ is a property of the object so we specify a value for this for each objects in our scene. The lighting calculations will be performed in the fragment shader and the fragment shader shown below applied ambient lighting to the scene.

```glsl
#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform float uKa;

void main() {

    // Object colour
    vec4 objectColour = texture(uTexture, vTexCoords);

    // Ambient light
    vec3 ambient = uKa * objectColour.rgb;

    // Fragment colour
    fragColour = vec4(ambient, objectColour.a);
}
```

Note that here we are using swizzling to extract the RBG components of the object colour vector when calculating the ambient lighting where `objectColour.rgb` gives the first three components of the `objectColour` vector.

:::{admonition} Task
:class: tip

Edit the fragment shader in the ***lighting.js*** file so that it looks like the fragment shader above.
:::

We need now need to define $k_a$ for the cube objects and send this to the shader.

:::{admonition} Task
:class: tip

Edit the code used to define the cubes so that it looks like the following.

```javascript
cubes.push({
    position  : cubePositions[i],
    ka        : 0.2,
});
```

And add the following code after the model matrix has been sent to the shader in the `render()` loop.

```javascript
// Send object light properties to the shader
gl.uniform1f(gl.getUniformLocation(program, "uKa"), cubes[i].ka);
```

:::

Refresh your web browser and you should see that the cubes are appear duller than compared to {numref}`5x5-cubes-figure`.

```{figure} ../_images/08_cubes_ambient_0.2.png
:width: 80%
:name: cubes-ambient-figure

Ambient lighting with $k_a = 0.2$.
```

Changing the value of $k_a$ will make the colour of the cubes appear lighter or darker.

`````{grid}

````{grid-item}
```{figure} ../_images/08_cubes_ambient_0.5.png
$k_a=0.5$
```
````

````{grid-item}
```{figure} ../_images/08_cubes_ambient_0.8.png
$k_a=0.8$
```
````
`````

### Diffuse lighting

Diffuse lighting is where light is reflected off a rough surface. Consider {numref}`diffuse-lighting-figure` that shows parallel light rays hitting a surface where light is scattered in multiple directions.

```{figure} ../_images/08_diffuse_reflection.svg
:width: 400
:name: diffuse-lighting-figure

Light rays hitting a rough surface are scattered in all directions.
```

To model diffuse lighting Phong's model assumes that light is reflected equally in all directions ({numref}`diffuse-figure`).

```{figure} ../_images/08_diffuse.svg
:width: 350
:name: diffuse-figure

Diffuse lighting scatters light equally in all directions.
```

The amount of light that is reflected to the viewer is modelled using the angle $\theta$ between the light vector $\vec{L}$ which points from the fragment to the light source and the normal vector $\vec{n}$ which points perpendicular to the surface. If $\theta$ is small then the light source is directly in front of the surface so most of the light will be reflected to the viewer. Whereas if $\theta$ is close to 90$^\circ$ then the light source is nearly in line with the surface and little of the light will be reflected to the viewer. When $\theta > 90^\circ$ the light source is behind the surface so no light is reflected to the viewer. We model this using $\cos(\theta)$ since $\cos(0^\circ) = 1$ and $\cos(90^\circ)=0$. Diffuse lighting is calculated using

$$ \vec{diffuse} = k_d \cos(\theta) \vec{I}_p \vec{O}_d  ,$$(diffuse-lighting-equation)

where $k_d$ is known as the **diffuse lighting constant** which takes a value between 0 and 1, and $\vec{I}_p$ is the colour intensity of the point light source. Recall that the angle between two vectors is related by [dot product](dot-product-section) so if the $\vec{L}$ and $\vec{n}$ vectors are unit vectors then $\cos(\theta) = \vec{L} \cdot \vec{n}$. If $\theta > 90^\circ$ then light source is behind the surface and no light should be reflected to the viewer. When $\theta$ is between 90$^\circ$ and 180$^\circ$, $\cos(\theta)$ is negative so we limit the value of $\cos(\theta )$ to positive values

$$ \cos(\theta) = \max(\vec{L} \cdot \vec{n}, 0). $$

So the equation to calculate diffuse lighting is

$$ \vec{diffuse} = k_a \max(\vec{L} \cdot \vec{n}, 0) \vec{I}_p \vec{O}_d. $$

The world space fragment position is calculated by multiplying the vertex position by the model matrix, however the world space normal vector is calculated using the following transformation

$$ \begin{align*}
    \vec{n} = (Model^{-1})^\mathsf{T} \vec{n}
\end{align*} $$

Recall that $A^\mathsf{T}$ is the [transpose](transpose-section) and $A^{-1}$ is the inverse of the matrix $A$ such that $A^{-1}A = I$. We use this transformation to ensure that the normal vector is perpendicular to the surface after the object vertices have been multiplied by the model matrix. You don't need to know where this comes from but if you are interested, click on the dropdown link below.

````{dropdown} Derivation of the world space normal transformation

Consider the diagram in {numref}`world-space-normal-1-figure` that shows the normal and tangent vectors to a surface in the model space (a tangle vector points along a surface). If the model transformation preserves the scaling of the edge such the equal scaling is used in the $x$, $y$ and $z$ axes then the normal and tangent vectors are perpendicular in the world space.

```{figure} ../_images/08_world_space_normal_1.svg
:width: 250
:name: world-space-normal-1-figure

Normal and tangent vectors in the model space.
```

If the model transformation does not preserve the scaling then the world space normal vector is no longer perpendicular to the tangent vector ({numref}`world-space-normal-2-figure`).

```{figure} ../_images/08_world_space_normal_2.svg
:width: 250
:name: world-space-normal-2-figure

Normal and tangent vectors in the world space.
```

We need to derive a transformation matrix $A$ that transforms the model space normal vector $\vec{n}$ to the world space normal vector $\vec{n}_{world}$ such that it is perpendicular to the world space tangent vector $\vec{t}_{world}$. The world space tangent vector is calculated by multiplying the model space tangent vector by the model matrix $M$

$$ \begin{align*}
    \vec{n}_{world} &= A \vec{n}, \\
    \vec{t}_{world} &= M \vec{t}.
\end{align*} $$

The dot product between two perpendicular vectors is zero, and we want $\vec{n}_{world}$ to be perpendicular to $\vec{t}_{world}$ so

$$\begin{align*}
    \vec{n}_{world} \cdot \vec{t}_{world} &= 0 \\
    \therefore A \vec{n} \cdot M \vec{t} &= 0.
\end{align*}$$

We can replace the dot product by a matrix multiplication by transposing $A \vec{n}$

$$(A \vec{n})^\mathsf{T} M \vec{t} = 0.$$

A property of matrix multiplication is that the transpose of a multiplication is equal to the multiplication of the transposes swapped (i.e., $(AB)^\mathsf{T} = B^\mathsf{T} A^\mathsf{T}$) so we can write this as

$$\vec{n}^\mathsf{T} A^\mathsf{T} M\vec{t} = 0$$

If $A^\mathsf{T}M = I$ then the world space normal and tangent vectors are perpendicular. Solving for $A$ gives

$$ \begin{align*}
    A^\mathsf{T} M &= I \\
    A^\mathsf{T} &= M^{-1} \\
    A &= (M^{-1})^\mathsf{T}.
\end{align*} $$

The matrix $(M^{-1})^\mathsf{T}$ is the transformation matrix to transform the model space normal vectors to the world space that ensures the world space normal vectors are perpendicular to the surface.
````

Each vertex of our cube object needs to have an associated normal vector ({numref}`cube-normals-figure`). The normals for the front face will point in the positive $z$ direction so $\vec{n} = (0, 0, 1)$, the normals for the right face will point in the positive $x$ direction so $\vec{n} = (1, 0, 0)$, and similar for the other faces of the cube.

```{figure} ../_images/08_cube_normals.svg
:width: 250
:name: cube-normals-figure

Each vertex of the cube has an associated normal vector.
```

:::{admonition} Task
:class: tip

Add the $x$, $y$ and $z$ components of the normal vector to each cube vertex.

```javascript
// Define cube vertices
    const vertices = new Float32Array([
        // x y   z     R  G  B     u  v     nx  ny  nz                  + ------ +
        // front                                                       /|       /|
        -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //   y        / |      / |
         1, -1,  1,    0, 0, 0,    1, 0,    0,  0,  1,  //   |       + ------ +  |
         1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  //   +-- x   |  + ----|- +
        -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //  /        | /      | /
         1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  // z         |/       |/
        -1,  1,  1,    0, 0, 0,    0, 1,    0,  0,  1,  //           + ------ +
        // right
         1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
         1, -1, -1,    0, 0, 0,    1, 0,    1,  0,  0,
         1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
         1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
         1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
         1,  1,  1,    0, 0, 0,    0, 1,    1,  0,  0,
        // etc.
```

````{dropdown} Click to reveal the vertex coordinates for the cube
```javascript
// Define cube vertices
const vertices = new Float32Array([
    // x y   z     R  G  B     u  v     nx  ny  nz                  + ------ +
    // front                                                       /|       /|
    -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //   y        / |      / |
     1, -1,  1,    0, 0, 0,    1, 0,    0,  0,  1,  //   |       + ------ +  |
     1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  //   +-- x   |  + ----|- +
    -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //  /        | /      | /
     1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  // z         |/       |/
    -1,  1,  1,    0, 0, 0,    0, 1,    0,  0,  1,  //           + ------ +
    // right
     1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
     1, -1, -1,    0, 0, 0,    1, 0,    1,  0,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
     1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
     1,  1,  1,    0, 0, 0,    0, 1,    1,  0,  0,
    // back
     1, -1, -1,    0, 0, 0,    0, 0,    0,  0, -1,
    -1, -1, -1,    0, 0, 0,    1, 0,    0,  0, -1,
    -1,  1, -1,    0, 0, 0,    1, 1,    0,  0, -1,
     1, -1, -1,    0, 0, 0,    0, 0,    0,  0, -1,
    -1,  1, -1,    0, 0, 0,    1, 1,    0,  0, -1,
     1,  1, -1,    0, 0, 0,    0, 1,    0,  0, -1,
    // left
    -1, -1, -1,    0, 0, 0,    0, 0,   -1,  0,  0,
    -1, -1,  1,    0, 0, 0,    1, 0,   -1,  0,  0,
    -1,  1,  1,    0, 0, 0,    1, 1,   -1,  0,  0,
    -1, -1, -1,    0, 0, 0,    0, 0,   -1,  0,  0,
    -1,  1,  1,    0, 0, 0,    1, 1,   -1,  0,  0,
    -1,  1, -1,    0, 0, 0,    0, 1,   -1,  0,  0,
    // bottom
    -1, -1, -1,    0, 0, 0,    0, 0,    0, -1,  0,
     1, -1, -1,    0, 0, 0,    1, 0,    0, -1,  0,
     1, -1,  1,    0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1, -1,    0, 0, 0,    0, 0,    0, -1,  0,
     1, -1,  1,    0, 0, 0,    1, 1,    0, -1,  0,
    -1, -1,  1,    0, 0, 0,    0, 1,    0, -1,  0,
    // top
    -1,  1,  1,    0, 0, 0,    0, 0,    0,  1,  0,
     1,  1,  1,    0, 0, 0,    1, 0,    0,  1,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1,  1,    0, 0, 0,    0, 0,    0,  1,  0,
     1,  1, -1,    0, 0, 0,    1, 1,    0,  1,  0,
    -1,  1, -1,    0, 0, 0,    0, 1,    0,  1,  0,
]);
```
````

Edit the commands used to define the cubes to include the diffuse coefficient $k_d = 0.7$ where we did similar for the ambient coefficient

```javascript
kd        : 0.7,
```

In the `createVao()` function in the ***webGLUtils.js*** file, change the stride to 11 since we now have an additional 3 elements per vertex.

```javascript
const stride = 11 * Float32Array.BYTES_PER_ELEMENT;
```

And in the same function tell WebGL how to read the normal vectors

```javascript
// Normal vectors
offset = 8 * Float32Array.BYTES_PER_ELEMENT;
const normalLocation = gl.getAttribLocation(program, "aNormal");
gl.enableVertexAttribArray(normalLocation);
gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, stride, offset);
```

Now in the ***lighting.js*** file, change the vertex shader to accept the normal vectors as an input attribute and an output.

```glsl
in vec3 aNormal;


out vec3 vNormal;
```

And in the `main()` function calculate the world space normal preserving orthogonality with the face.

```glsl
// Output world space normal vectors
vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);
```

Now change the fragment shader to accept the normal as an input

```glsl
in vec3 vNormal;
```

Lastly, set the fragment colour to the normal vector.

```glsl
// Fragment colour
fragColour = vec4(vNormal, objectColour.a);
```

:::

Phew! If everything has gone ok when you refresh your web browser you should see the three sides of the cubes are rendered in red, green and blue. What we have done here is used the world space normal vector as the fragment colour as a check to see if everything is working as expected. Move the camera around, and you will notice that the sides of facing to the right is red because its normal vector is $(1, 0, 0)$ so in RGB this is pure red. The side facing up is green because its normal vector is $(0, 1, 0)$ and the side facing towards us is blue because its normal vector is $(0, 0, 1)$ as shown in {numref}`cube-normals-screenshot-figure`.

```{figure} ../_images/08_cubes_normals.png
:width: 80%
:name: cube-normals-screenshot-figure

The colours of the cube faces based on the normal vectors.
```

Now we need to define diffuse coefficient for the cubes, the position and colour of our light source and send them to the shaders using uniforms. Eventually, we will be adding multiple light sources with different properties and behaviours so to keep our code organised we are going to create a Light class.

:::{admonition} Task
:class: tip

Create a new file called ***light.js*** and embed this in the ***index.html***. Enter the following class declaration into the ***light.js*** file

```javascript
class Light {
    constructor() {
        this.position = [0, 0, 0];
        this.colour = [1, 1, 1];
    }

    toShader(gl, program) {
        // Light vectors
        gl.uniform3fv(gl.getUniformLocation(program, "uLightPosition"), this.position);
        gl.uniform3fv(gl.getUniformLocation(program, "uLightColour"), this.colour);
    }
}
```

In the ***lighting.js*** file, edit the definition of the cubes objects to include the diffuse coefficient $k_d = 0.7$

```javascript
kd        : 0.7,
```

Create a light object before the render function

```javascript
// Light object
const light = new Light();
light.position = [6, 2, 0];
```

In the render function, send the light source properties to the shader after we have done this for the view and projection matrices

```javascript
// Send light source properties to the shader
light.toShader(gl, program);
```

And send the diffuse coefficient to the shader where we did this for the ambient coefficient

```javascript
gl.uniform1f(gl.getUniformLocation(program, "uKd"), cubes[i].kd);
```

:::

Now we have sent all the information required for diffuse lighting to the shader we now just need to edit the shaders.

:::{admonition} Task
:class: tip

Add output declarations to the vertex shader so that it outputs the world space vertex coordinates.

```glsl
out vec3 vPosition;
```

And add the following code after we output the world space normal vectors.

```glsl
// Output world space vertex position
vPosition = vec3(uModel * vec4(aPosition, 1.0));
```

Add input declarations to the fragment shader to take in the world space fragment coordinates.

```glsl
in vec3 vPosition;
```

Add uniform declarations for the light position and colour and the diffuse coefficient.

```glsl
uniform vec3 uLightPosition;
uniform vec3 uLightColour;

uniform float uKd;
```

Finally, add code to calculate diffuse lighting.

```glsl
// Diffuse
vec3 N = normalize(vNormal);
vec3 L = normalize(uLightPosition - vPosition);
float diff = max(dot(N, L), 0.0);
vec3 diffuse = uKd * diff * uLightColour * objectColour.rgb;

// Fragment colour
fragColour = vec4(diffuse, objectColour.a);
```

:::

It is useful to render an object for the light source so that we can see where it is positioned in the scene. To do this we will use a cube object scaled down to a small size and rendered using a simple shader that colours the cube with the light source colour.

:::{admonition} Task
:class: tip

Define the vertex and fragment shaders for the light source cube at the top of the ***lighting.js*** file.

```javascript
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
```

Compile and link the light source shaders after the main shader program has been created.

```javascript
const lightProgram = createProgram(gl, lightVertexShader, lightFragmentShader);
```

In the `render()` loop, after the for loop used to draw the cubes, add the following code to render the light source cube.

```javascript
// Draw light source
gl.useProgram(lightProgram);

// Calculate model matrix for the light source
const model = new Mat4()
    .translate(light.position)
    .scale([0.1, 0.1, 0.1]);

// Send model, view and projection matrices to the shaders
gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

// Send light colour to the shader
gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), light.colour);

// Draw light source cube
gl.bindVertexArray(vao);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
```

:::

Refresh your web browser, and you will see a black canvas, so something has gone wrong. If you open up the developer console you should see errors stating that the uniform locations are not from the associated program. This is because we now have two shader programs, `program` which is used to render the cubes and `lightProgram` which is used to render the light source. In adding the code above we now have `lightProgram` as our current shader for the light sources, so we need to tell WebGL to use the other shader program for the cubes.

:::{admonition} Task
:class: tip

Add the following code before we bind the textures for the cube objects

```javascript
// Set the shader program
gl.useProgram(program);
```

:::

Now when you refresh your browser you should see the effect of diffuse lighting on the cubes ({numref}`cubes-diffuse-figure`). Here we can see the light source cube in white and the faces of the cubes that are facing towards the light source are brighter than those facing away.

```{figure} ../_images/08_cubes_diffuse.png
:width: 80%
:name: cubes-diffuse-figure

Diffuse lighting: $k_d = 0.7$.
```

If you move the camera around, you will see that the faces of the cubes that are facing away from the light source are black since we have not factored in ambient lighting, so let's include that now.

:::{admonition} Task
:class: tip

Change the fragment shader so that the fragment colour is the sum of the ambient and diffuse lighting.

```glsl
fragColour = vec4(ambient + diffuse, objectColour.a);
```

:::

Refresh your web browser, and you should see the cubes rendered with both ambient and diffuse lighting ({numref}`cubes-diffuse-ambient-figure`).

```{figure} ../_images/08_cubes_ambient_diffuse.png
:width: 80%
:name: cubes-diffuse-ambient-figure

Ambient and diffuse lighting: $k_a = 0.2$, $k_d = 0.7$.
```

### Specular lighting

Consider {numref}`specular-lighting-figure` that shows parallel light rays hitting a smooth surface where the reflected rays will point mostly in the same direction (think of a mirrored surface).

```{figure} ../_images/08_specular_reflection.svg
:width: 400
:name: specular-lighting-figure

Light rays hitting a smooth surface are reflected in the same direction.
```

{numref}`phongs-specular-model-figure` defines the vectors needed to calculate Phong's specular lighting model. The vector $\vec{R}$ is the reflection such that the angle between the light source vector $\vec{L}$ and the surface normal $\vec{n}$ is the same as that between $\vec{n}$ and $\vec{R}$. The vector $\vec{V}$ is the viewing vector that points from the surface to the viewer (camera).

```{figure} ../_images/08_phong_reflection.svg
:width: 400
:name: phongs-specular-model-figure

Specular lighting scatters light mainly towards the reflection vector.
```

For a perfectly smooth surface the reflected ray will point in the direction of the $\vec{R}$ vector so in order to see the light the viewer would need to be positioned in the direction of the $\vec{R}$ vector. Since most surfaces are not perfectly smooth we add a bit of scattering to the model the amount of specular lighting seen by the viewer. The closer the $\vec{V}$ vector is to the $\vec{R}$ vector, the more specular light will be seen by the viewer.

```{figure} ../_images/08_blinn_phong.svg
:width: 400
:name: blinn-phong-model-figure

The Blinn-Phong lighting model.
```

Phong's model of specular lighting can have problems when the $\vec{V}$ and $\vec{R}$ vectors are more than $90^\circ$ apart, so it is common to use a modification of the model called the **Blinn-Phong lighting model** developed by Jim Blinn (1977). A vector $\vec{H}$ is calculated that is halfway between the $\vec{L}$ and $\vec{V}$ vectors ({numref}`blinn-phong-model-figure`)

$$ \vec{H} = \frac{\vec{L} + \vec{V}}{\| \vec{L} + \vec{V} \|}. $$

The scattering of the reflected light is determined by how far the $\vec{H}$ vector is from the normal vector $\vec{n}$. If $\theta$ is the angle between $\vec{H}$ and $\vec{n}$, then the smaller its value the more specular light is seen by the viewer. The scattering of the specular light is modelled by $\cos(\theta)^s$ where $s$ is known as the **specular exponent** and determines the shininess of the surface. In a similar way that we used for the diffuse terms, we can calculate the using the dot product $(\vec{H} \cdot \vec{n})^s$. The Blinn-Phong model of specular lighting is

$$ \vec{specular} = k_s \max(\vec{H} \cdot \vec{n}, 0)^s \vec{I}_p.$$(specular-lighting-equation)

:::{admonition} Task
:class: tip

In the fragment shader, add uniforms for the camera position, specular coefficient and exponent.

```glsl
uniform vec3 uCameraPosition;

uniform float uKs;
uniform float uShininess;
```

And add code to calculate the specular lighting in the `main()` function.

```glsl
// Specular
vec3 V = normalize(uCameraPosition - vPosition);
vec3 H = normalize(L + V);
float spec = pow(max(dot(H, N), 0.0), uShininess);
vec3 specular = uKs * spec * uLightColour;

// Fragment colour
fragColour = vec4(specular, objectColour.a);
```

Add the specular coefficient and exponent to the cube objects where we did the same for the ambient and diffuse coefficients.

```javascript
ks        : 1.0,
shininess : 32,
```

Send the camera position to the shader after where we send the view and projection matrices

```javascript
// Send camera position to the shader
gl.uniform3fv(gl.getUniformLocation(program, "uCameraPosition"), camera.eye);
```

And send the specular coefficient and exponent to the shader where we did this for the ambient and diffuse coefficients.

```javascript
gl.uniform1f(gl.getUniformLocation(program, "uKs"), cubes[i].ks);
gl.uniform1f(gl.getUniformLocation(program, "uShininess"), cubes[i].shininess);
```

:::

Refresh your web browser and your scene should be very dark. Move the camera so that the cubes are between the camera and the light source and you should start to see the specular highlights where light is being reflected off the cube {numref}`cubes-specular-figure`.

```{figure} ../_images/08_cubes_specular.png
:width: 80%
:name: cubes-specular-figure

Specular lighting: $k_s = 1.0$, $\alpha = 20$.
```

Let's add ambient and diffuse lighting to the specular lighting to complete the Phong lighting model.

:::{admonition} Task
:class: tip

Change the fragment shader so that the fragment colour is the sum of the ambient, diffuse and specular lighting.

```glsl
fragColour = vec4(ambient + diffuse + specular, objectColour.a);
```

:::

```{figure} ../_images/08_cubes_phong.png
:width: 80%
:name: cubes-phong-figure

Ambient, diffuse and specular lighting: $k_a = 0.2$, $k_d = 0.7$, $k_s = 1.0$, $\alpha = 20$.
```

### Attenuation

**Attenuation** is the gradual decrease in light intensity as the distance between the light source and a surface increases. We can use attenuation to model light from low intensity light source, for example, a candle or torch which will only illuminate an area close to the source. Theoretically attenuation should follow the inverse square law where the light intensity is inversely proportional to the square of the distance between the light source and the surface. However, in practice this tends to result in a scene that is too dark so we calculate attenuation using an inverse quadratic function

$$ attenuation = \frac{1}{constant + linear \cdot d + quadratic \cdot d^2}, $$

where $d$ is the distance between the light source and the fragment and $constant$, $linear$ and $quadratic$ are coefficients that determine how quickly the light intensity decreases. The graph in {numref}`attenuation-figure` shows a typical attenuation profile where the light intensity rapidly decreases when the distance is small levelling off as the distance gets larger.

```{figure} ../_images/08_attenuation.svg
:width: 500
:name: attenuation-figure

Attenuation can be modelled by an inverse quadratic function.
```

:::{admonition} Task
:class: tip

Add the uniforms for the attenuation coefficients to the fragment shader.

```glsl
// Attenuation coefficients
uniform float uConstant;
uniform float uLinear;
uniform float uQuadratic;
```

Then calculate and apply attenuation to the fragment colour.

```glsl
// Attenuation
float distance = length(uLightPosition - vPosition);
float attenuation = 1.0 / (
    uConstant +
    uLinear * distance +
    uQuadratic * distance * distance
);

// Fragment colour
fragColour = vec4(attenuation * (ambient + diffuse + specular), objectColour.a);
```

Add the following attenuation coefficients to the Light class constructor.

```javascript
// Attenuation coefficients
this.constant = 1.0;
this.linear = 0.1;
this.quadratic = 0.05;
```

In the `toShader()` method, send the attenuation coefficients to the shaders

```javascript
gl.uniform1f(gl.getUniformLocation(program, "uConstant"), light.constant);
gl.uniform1f(gl.getUniformLocation(program, "uLinear"), light.linear);
gl.uniform1f(gl.getUniformLocation(program, "uQuadratic"), light.quadratic);
```

:::

These values used the attenuation coefficients here depend on the type of light source being modelled. Refresh your web browser, and you should see that the cubes further away from the light source are darker, as shown in {numref}`cubes-attenuation-figure`.

```{figure} ../_images/08_cubes_attenuation.png
:width: 80%
:name: cubes-attenuation-figure

Applying attenuation means that the objects further away from light source appear darker.
```

---

## Multiple light sources

To add more light sources to a scene is simply a matter of calculating the ambient, diffuse and specular lighting for each additional light source and then adding them to the fragment colour. We have seen for a single light source we have to define the light source colours, the position of the light source in the world space and the three attenuation constants. Given that we would like to do this for multiple light sources we need data structure for each light source.

A data structure in GLSL is defined as follows:

```glsl
struct Light {
    vec3 position;
    vec3 colour;
    float constant;
    float linear;
    float quadratic;
};
```

This defines a `Light` structure with attributes for the light source position, colour and attenuation constants. Before we add additional light sources we are going to rewrite our fragment shader to use a data structure.

```glsl
#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;
in vec3 vNormal;
in vec3 vPosition;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform vec3 uCameraPosition;

// Material coefficients
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;

// Light struct
struct Light {
    vec3 position;
    vec3 colour;
    float constant;
    float linear;
    float quadratic;
};

// Number of lights
uniform int uNumLights;

// Array of lights
uniform Light uLights[16];

// Function to compute the lighting
vec3 computeLighting(Light light, vec3 N, vec3 V, vec3 objectColour){

    // Light vector
    vec3 L = normalize(light.position - vPosition);

    // Attenuation
    float attenuation = 1.0;
    if (light.type != 2) {
        float distance = length(light.position - vPosition);
        attenuation = 1.0 /
            (light.constant +
             light.linear * distance +
             light.quadratic * distance * distance);
    }

    // Ambient light
    vec3 ambient = uKa * objectColour;

    // Diffuse light
    float diff = max(dot(N, L), 0.0);
    vec3 diffuse = uKd * max(dot(N, L), 0.0) * light.colour * objectColour;

    // Specular light
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), uShininess);
    vec3 specular = uKs * spec * light.colour;

    // Output fragment colour
    return attenuation * (ambient + diffuse + specular);
}

// Main fragment shader function
void main() {

    // Object colour
    vec4 objectColour = texture(uTexture, vTexCoords);

    // Lighting vectors
    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPosition - vPosition);

    // Calculate lighting for each light source
    vec3 lighting;
    for (int i = 0; i < uNumLights; i++) {
        lighting += computeLighting(uLights[i], N, V, objectColour.rgb);
    }

    // Fragment colour
    fragColour = vec4(lighting, objectColour.a);
}
```

This fragment shader is a little more complex than before but the main changes are:

- A `Light` data structure is defined with attributes for the light source type, position, colour and attenuation constants.
- A uniform array of `Light` structures called `uLights` is defined to hold up to 16 light sources.
- A uniform integer `uNumLights` is defined to specify the number of active light sources.
- A function `computeLighting()` is defined to perform the lighting calculations for a single light source
- In the `main()` function a for loop iterates over the active light sources and calls the `computeLighting()` function for each light source to add its contribution to the fragment colour.

Since this fragment shader not uses an array of light source we need to update the ***more_lights.js*** file to define multiple light sources using the `Light` data structure and send them to the shader.

:::{admonition} Task
:class: tip

Edit the fragment shader in the **more_lights.js** file to use the new fragment shader above.
:::

Now that we have made changes to the fragment shader, we also need to update the Light class and create a new class to manage multiple light sources

:::{admonition} Task
:class: tip

Change the `toShader()` Light class method so that it looks like the following

```javascript
toShader(gl, program, index) {
    const prefix = `uLights[${index}]`;

    // Light vectors
    gl.uniform3fv(gl.getUniformLocation(program, `${prefix}.position`), this.position);
    gl.uniform3fv(gl.getUniformLocation(program, `${prefix}.colour`), this.colour);  

    // Attenuation coefficients
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.uConstant`), this.constant);
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.uLinear`), this.linear);
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.uQuadratic`), this.quadratic);
}
```

And add a LightSources class

```javascript
class LightSources {
    constructor(maxLights = 16) {
        this.lights = [];
        this.maxLights = maxLights;
    }

    addLight(light) {
        if (this.lights.length < this.maxLights) {
            this.lights.push(light);
        } else {
            console.warn("Maximum number of lights reached.");
        }
    }

    toShader(gl, program) {
        gl.uniform1i(gl.getUniformLocation(program, "uNumLights"), this.lights.length);

        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].toShader(gl, program, i);
        }
    }
}
```

:::

Here we have added the LightSources class which allows us to add up to 16 light sources to our scene. The `addLight()` method is used to append a Light class object to a `lights` array and the `toShader()` method is used to loop through each light source and send the information to the GLSL Light struct. Now let's add our light sources.

:::{admonition} Task
:class: tip

Add the following after our light object was created

```javascript
// Add light sources
const lightSources = new LightSources();
lightSources.addLight(light);

// Yellow light
const yellowLight = new Light();
yellowLight.position = [9, 3, -9];
yellowLight.colour = [1, 1, 0];
lightSources.addLight(yellowLight);
```

Edit the code where the light source properties are sent to the shader to the following

```javascript
// Send light source properties to the shader
lightSources.toShader(gl, program);
```

And edit the code where the light sources are drawn to loop over the number of light sources

```javascript
// Draw light sources
gl.useProgram(lightProgram);

for (let i = 0; i < lightSources.lights.length; i++) {

    // Calculate model matrix for light source
    const model = new Mat4()
        .translate(lightSources.lights[i].position)
        .scale([0.1, 0.1, 0.1]);

    // Send model, view and projection matrices to the shaders
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

    // Send light colour to the shader
    gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), lightSources.lights[i].colour);

    // Draw light source cube
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}
```

:::

Here we have defined two light sources, with an additional yellow light source positioned further back in the scene. The code to send the light source properties to the shader and to draw the light sources has been updated to loop over the number of light sources. Refresh your web browser, and you should see the following. Move the camera around the scene to see the effects of the light sources on the cubes.

```{figure} ../_images/08_cubes_multiple_lights.png
:width: 80%
:name: cubes-multiple-lights-figure

The cubes lit from two light sources.
```

---

## Spotlights

Our light sources we have in our scene emit light in all directions. A spotlight is a light source that emits light along a specific direction so that only those objects that are within some distance of this vector are illuminated. These are useful for modelling light sources such as flashlights, streetlights, car headlights etc.

```{figure} ../_images/08_spot_light.svg
:width: 350
:name: spot-light-figure

A spotlight only illuminates fragments where $\theta < \phi$.
```

Consider {numref}`spot-light-figure` that shows a spotlight emitting light in the direction given by the $\vec{D}$ vector. The $\vec{L}$ vector points from the light source position to the position of the fragment and the spread of the spotlight is determined by the cutoff angle. If the angle $\theta$ between $\vec{L}$ and $\vec{D}$ is less than the cutoff angle then the fragment is illuminated by the spotlight.

The angle between $\vec{L}$ and $\vec{D}$ is related to the dot product of the two vectors by

$$ \cos(\theta) = \vec{L} \cdot \vec{D}. $$

So to determine if a fragment is illuminated by the spotlight we can calculate $\cos(\theta)$ and compare it to $\cos(\textsf{cutoff})$. If $\cos(\theta) < \cos(\textsf{cutoff})$ then $\theta > \textsf{cutoff}$ and the fragment is not illuminated.

:::{admonition} Task
:class: tip

Add attributes for the light direction vector and the value of $\cos(\textsf{cutoff})$ to the Light data structure in the fragment shader.

```glsl
int type;
vec3 direction;
float cutoff;
```

In the `computLighting()` function, add the following code after the attenuation calculation to turn off the light contribution if the fragment is outside the spotlight cone.

```glsl
// Spotlight intensity
float intensity = 1.0;
if (light.type == 1) {
    float theta = dot(-L, normalize(light.direction));
    if (theta < light.cutoff) {
        intensity = 0.0;
    }
}
```

And edit the return command to apply the intensity to the diffuse and specular light

```glsl
// Output fragment colour
return attenuation * (ambient + intensity * (diffuse + specular));
```

In the Light class constructor, add an input parameter to define the type of light source

```javascript
class Light {
    constructor(type = 0) {
        this.type = type; // 0 = point, 1 = spot, 2 = directional
```

And add the light source vector and cutoff angle to the constructor

```javascript
this.direction = [0, -1, 0];
this.cutoff = Math.cos(50 * Math.PI / 180);
```

Send the additional light source properties to the shader by adding the following code where the other light source properties are sent.

```javascript
gl.uniform1i(gl.getUniformLocation(program, `${prefix}.type`), this.type);
gl.uniform3fv(gl.getUniformLocation(program, `${prefix}.direction`), this.direction);
gl.uniform1f(gl.getUniformLocation(program, `${prefix}.cutoff`), this.cutoff);
```

Finally in the ***lighting.js*** file, change the type of the yellow light source to 1 so that the shader interprets it as a spotlight

```javascript
const yellowLight = new Light(1);
```

:::

Here we have changed the first light source to be a spotlight that is pointing downwards and slightly towards the back of the scene. The cutoff angle is set to $40^\circ$ by calculating $\cos(40^\circ)$. The second light source has been switched off by commenting out the code that defines it. Refresh your web browser and you should see the following.

```{figure} ../_images/08_cubes_spotlight_harsh.png
:width: 80%
:name: directional-light-harsh-figure

Cubes lit using a spotlight.
```

Use the keyboard and mouse to move the camera around the cubes and see the effect of the spotlight. You may notice that there is an abrupt cutoff between the region illuminated by the spotlight and the region in darkness. In the real world this doesn't usually happen as light on this edge gets softened by various effects.

Introducing a new outer cutoff angle that is slightly more than the cutoff angle then we can go from full intensity for angles less than the cutoff angle and gradually decrease to zero intensity for angles greater than the outer cutoff angle.

```{figure} ../_images/08_soft_edge.svg
:width: 500
:name: soft-edge-figure

Intensity value over a range of $\theta$.
```

:::{admonition} Task
:class: tip

Add an attribute for the outer cutoff angle to the Light data structure in the fragment shader

```glsl
float outerCutoff;
```

And in the `computLighting()` function, replace the spotlight code with the following code to soften the edges of the spotlight.

```glsl
// Spotlight intensity
float intensity = 1.0;
if (light.type == 1) {
    float theta = dot(-L, normalize(light.direction));
    float epsilon = light.cutoff - light.outerCutoff;
    intensity = clamp((theta - light.outerCutoff) / epsilon, 0.0, 1.0);
}
```

Now add an outer cutoff property to the Light class constructor

```javascript
this.outerCutoff = Math.cos(52 * Math.PI / 180);
```

And send the additional light source property to the shader by adding the following code to the `toShader()` method

```javascript
gl.uniform1f(gl.getUniformLocation(program, `${prefix}.outerCutoff`), this.outerCutoff);
```

:::

Here we have defined an outer cutoff angle of $52^\circ$ which is slightly more than the cutoff angle of $50^\circ$. Refresh your web browser and you should see that there is now a soft edge to the spotlight.

```{figure} ../_images/08_cubes_spotlight_soft.png
:width: 500
:name: spotlight-soft-figure

The edges of the spotlight have been softened.
```

---

## Directional light

The final light source type we will look at is **directional light**. When a light source is far away the light rays are very close to being parallel. It does not matter where the object is in the view space as all objects are lit from the same direction.

```{figure} ../_images/08_directional_light.svg
:width: 400
:name: directional-light-figure

Directional lighting
```

The lighting calculations are the same as for the other light sources seen above with the exception that we do not need the light source position and we do not apply the attenuation. The light vector $\vec{L}$ is simply the light direction vector negated.

:::{admonition} Task
:class: tip

Add the following code to the `computerLighting()` fragment shader function before we calculate the ambient light

```glsl
// Directional light
if (light.type == 2) {
    L = normalize(-light.direction);
    attenuation = 1.0;
}
```

In the ***lighting.js*** file, add the following to add a direction light source after we have added the yellow light source

```javascript
// Directional light
const directionalLight = new Light(2);
directionalLight.colour = [1, 0, 1];
directionalLight.direction = [2, -1, -1];
lightSources.addLight(directionalLight);
```

Finally, add the following code at the start of the for loop used to draw the light sources.

```javascript
// Don't draw directional light source
if (lightSources.lights[i].type == 2) continue;
```

:::

Here we have defined a directional light source with the colour magenta and direction vector $(2, -1, -1)$ which will produce light rays coming down from the top right as we look down the $z$-axis. Refresh your web browser and you should see the following.

```{figure} ../_images/08_cubes_directional_light.png
:width: 80%
:name: cubes-directional-light-figure

Cubes lit using a point light, spotlight and directional light.
```

---

## Exercises

1. Experiment with the positions, colours and material properties of the various light sources to see what effects they have.

2. Use a spotlight to model a flashlight controlled by the user such that the light is positioned at the camera $\vec{eye}$ vector and is pointing in the same direction as the camera $\vec{front}$ vector. Set the cutoff angles so that the spread of the light is $20^\circ$ and turn off all other light sources for extra spookiness.

```{figure} ../_images/08_Ex2.png
:width: 60%
```

1. Add a green point light source that moves in a horizontal circle centred at $(6,2,-6)$ with radius 5. Hint: the coordinates of points on a circle can be calculated using $(x, y, z) = (c_x, c_y, c_z) + r (\cos(t), 0, \sin(t))$ where $r$ is the radius $t$ is some parameter.

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/videos/08_Ex3.mp4" type="video/mp4">
</video>
</center>

---

## Video walkthrough

The video below walks you through these lab materials.

---

## References

J. F. Blinn (1977) "Models of light reflection for computer synthesized pictures". Proceedings of the 4th annual conference on Computer graphics and interactive techniques. pp. 192-198.

B. T. Phong (1975) "Illumination for Computer Generated Pictures" Comm. ACM. Vol 18(6): 311-317.
