(lighting-section)=

# Lab 7: Lighting

In this lab we will be looking at adding a basic lighting model to our application. Lighting modelling is in itself a huge topic within the field of computer graphics and modern games and movies can look very lifelike thanks to some very clever techniques. Here we will be applying one of the simplest lighting models, the <a href="https://en.wikipedia.org/wiki/Phong_reflection_model" target="_blank">Phong reflection model</a>.

:::{admonition} Task
:class: tip

Create a folder called ***07 Lighting*** and copy the contents of your ***06 Moving the Camera*** folder to it. Rename the ***moving_the_camera.js*** file to ***lighting.js*** and change ***index.html*** so that the page title is "Lab 7 - Lighting" and change the script element so that it uses ***lighting.js***.

:::

To help demonstrate the effects of lighting on a scene we are going to need more objects.

:::{admonition} Task
:class: tip

Change the definition of the cubes to the following.

```javascript
// Define cube positions
const spacing = 3;
const cubes = [];
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    cubes.push({
      position : new Vec3(i * spacing, 0, -j * spacing)
    })
  }
}
const numberCubes = cubes.length;
```

Also, change the background colour to black by changing the `gl.clearColor()` command the `initWebGL()` function.

```javascript
gl.clearColor(0.0, 0.0, 0.0, 1.0);
```

:::

Refresh your browser, and you can see that we have created a grid of 25 cubes. We have also changed the background colour to black so that we can better see the lighting effects.

```{figure} ../_images/07_cubes.png
:width: 80%
:name: 5x5-cubes-figure

Grid of 25 cubes.
```

---

## Phong's lighting model

Phong's lighting model first described by Bui Tuong Phong is a local illumination model that simulates the interaction of light falling on surfaces. The brightness of a point on a surface is based on three components

- **ambient reflection** -- a simplified model of light that reflects off all objects in a scene
- **diffuse reflection** -- describes the direct illumination of a surface by a light source based on the angle between the light source direction and the normal vector to the surface
- **specular reflection** -- models the shiny highlights on a surface caused by a light source based on the angle between the light source direction, the normal vector and the view direction

The colour intensity of a fragment on the surface is calculated as a sum of these components, i.e.,

$$ \vec{colour} = \vec{ambient} + \vec{diffuse} + \vec{specular},$$

where theses are 3-element vectors of RGB colour values.

---

## Ambient reflection

Ambient reflection is light that is scatters off of all surfaces in a scene. To model this we make the simplifying assumption that all faces of the object is lit equally.Phong's model for ambient reflection is

$$ \vec{ambient} = k_a \vec{O}_d $$(ambient-reflection-equation)

where $k_a$ is known as the **ambient reflection constant** which takes on a value between 0 and 1 and $\vec{O}_d$ is the object colour. $k_a$ is a property of the object so we specify a value for this for each objects in our scene. The lighting calculations will be performed in the fragment shader and the fragment shader shown below applied ambient lighting to the scene.

```glsl
#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;

out vec4 fragColour;

uniform sampler2D uTexture;

// Material coefficients
uniform float uKa;

void main() {

  // Object colour
  vec4 objectColour = texture(uTexture, vTexCoords);

  // Ambient
  vec3 ambient = uKa * objectColour.rgb;

  // Fragment colour
  fragColour = vec4(ambient, objectColour.a);
}
```

Note that here we are using swizzling to extract the RBG components of the object colour vector when calculating the ambient reflection where `objectColour.rgb` gives the first three components of the `objectColour` vector.

:::{admonition} Task
:class: tip

Edit the fragment shader in the ***lighting.js*** file so that it looks like the fragment shader above.
:::

We need now need to define $k_a$ for the cube objects and send this to the shader.

:::{admonition} Task
:class: tip

Edit the code used to define the cube positions so that it looks like the following.

```javascript
const cubes = [];
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    cubes.push({
      position : new Vec3(i * spacing, 0, -j * spacing),
      ka       : 0.2,
    })
  }
}
```

And add the following code after the model matrix has been sent to the shader in the `render()` loop.

```javascript
// Send object light properties to the shader
gl.uniform1f(gl.getUniformLocation(program, "uKa"), cubes[i].ka);
```

:::

Refresh your web browser and you should see that the cubes are appear duller than compared to {numref}`5x5-cubes-figure`.

```{figure} ../_images/07_cubes_ambient.png
:width: 80%
:name: cubes-ambient-figure

Ambient reflection with $k_a = 0.2$.
```


Changing the value of $k_a$ will make the colour of the cubes appear lighter or darker.

`````{grid}

````{grid-item}
```{figure} ../_images/07_cubes_ambient_0.5.png
$k_a=0.5$
```
````

````{grid-item}
```{figure} ../_images/07_cubes_ambient_0.8.png
$k_a=0.8$
```
````
`````

---

## Diffuse reflection

Diffuse reflection is the reflection of light off a rough surface. Consider {numref}`diffuse-reflection-figure` that shows parallel light rays hitting a surface where light is scattered in multiple directions.

```{figure} ../_images/07_diffuse_reflection.svg
:width: 400
:name: diffuse-reflection-figure

Light rays hitting a rough surface are scattered in all directions.
```

To model diffuse reflection Phong's model assumes that light is reflected equally in all directions ({numref}`diffuse-figure`).

```{figure} ../_images/07_diffuse.svg
:width: 350
:name: diffuse-figure

Diffuse reflection scatters light equally in all directions.
```

The amount of light that is reflected to the viewer is modelled using the angle $\theta$ between the light vector $\vec{L}$ which points from the fragment to the light source and the normal vector $\vec{n}$ which points perpendicular to the surface. If $\theta$ is small then the light source is directly in front of the surface so most of the light will be reflected to the viewer. Whereas if $\theta$ is close to 90$^\circ$ then the light source is nearly in line with the surface and little of the light will be reflected to the viewer. When $\theta > 90^\circ$ the light source is behind the surface so no light is reflected to the viewer. We model this using $\cos(\theta)$ since $\cos(0^\circ) = 1$ and $\cos(90^\circ)=0$. Diffuse reflection is calculated using

$$ \vec{diffuse} = k_d \vec{I}_p \vec{O}_d \cos(\theta) ,$$(diffuse-reflection-equation)

where $k_d$ is known as the **diffuse reflection constant** which takes a value between 0 and 1, and $\vec{I}_p$ is the colour intensity of the point light source. Recall that the angle between two vectors is related by [dot product](dot-product-section) so if the $\vec{L}$ and $\vec{n}$ vectors are unit vectors then $\cos(\theta) = \vec{L} \cdot \vec{n}$. If $\theta > 90^\circ$ then light source is behind the surface and no light should be reflected to the viewer. When $\theta$ is between 90$^\circ$ and 180$^\circ$, $\cos(\theta)$ is negative so we limit the value of $\cos(\theta )$ to positive values

$$ \cos(\theta) = \max(\vec{L} \cdot \vec{n}, 0). $$

The view space fragment position is calculated by multiplying the vertex position by the $MV$ matrix, however the view space normal vector is calculated using the following transformation

$$ \begin{align*}
    \vec{n}_{world} = (Model^{-1})^\mathsf{T} \vec{n}
\end{align*} $$(view-space-normal-equation)

Recall that $A^\mathsf{T}$ is the [transpose](transpose-section) and $A^{-1}$ is the inverse of the matrix $A$ such that $A^{-1}A = I$. We use this transformation to ensure that the normal vector is perpendicular to the surface after the object vertices have been multiplied by the model matrix. You don't need to know where this comes from but if you are interested, click on the dropdown link below.

````{dropdown} Derivation of the world space normal transformation

Consider the diagram in {numref}`world-space-normal-1-figure` that shows the normal and tangent vectors to a surface in the model space (a tangle vector points along a surface). If the model transformation preserves the scaling of the edge such the equal scaling is used in the $x$, $y$ and $z$ axes then the normal and tangent vectors are perpendicular in the view space.

```{figure} ../_images/07_world_space_normal_1.svg
:width: 250
:name: world-space-normal-1-figure

Normal and tangent vectors in the model space.
```

If the model transformation does not preserve the scaling then the view space normal vector is no longer perpendicular to the tangent vector ({numref}`world-space-normal-2-figure`).

```{figure} ../_images/07_world_space_normal_2.svg
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

If $A^\mathsf{T}M = I$ then the view space normal and tangent vectors are perpendicular. Solving for $A$ gives

$$ \begin{align*}
    A^\mathsf{T} M &= I \\
    A^\mathsf{T} &= M^{-1} \\
    A &= (M^{-1})^\mathsf{T}.
\end{align*} $$

The matrix $(M^{-1})^\mathsf{T}$ is the transformation matrix to transform the model space normal vectors to the view space that ensures the view space normal vectors are perpendicular to the surface.
````

To apply diffuse lighting we are first going to focus on the normal vectors. Each vertex of our cube object needs to have an associated normal vector ({numref}`cube-normals-figure`). The normals for the front face will point in the positive $z$ direction so $\vec{n} = (0, 0, 1)$, the normals for the right face will point in the positive $x$ direction so $\vec{n} = (1, 0, 0)$, and similar for the other faces of the cube.

```{figure} ../_images/07_cube_normals.svg
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
    // x  y  z      r  g  b     u  v     nx  ny  nz                   + ------ +
    // front                                                         /|       /|
    -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //    y        / |      / |
     1, -1,  1,     0, 0, 0,    1, 0,    0,  0,  1,  //    |       + ------ +  |
     1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //    +-- x   |  + ----|- +
    -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //   /        | /      | /
     1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //  z         |/       |/
    -1,  1,  1,     0, 0, 0,    0, 1,    0,  0,  1,  //            + ------ +
    // right
     1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
     1, -1, -1,     0, 0, 0,    1, 0,    1,  0,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
     1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
     1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
     1,  1,  1,     0, 0, 0,    0, 1,    1,  0,  0,
    // etc.
```

````{dropdown} Reveal for all cube vertices
```javascript
```{code-cell} javascript
// Define cube vertices
const vertices = new Float32Array([
  // x  y  z      r  g  b     u  v     nx  ny  nz                   + ------ +
  // front                                                         /|       /|
  -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //    y        / |      / |
   1, -1,  1,     0, 0, 0,    1, 0,    0,  0,  1,  //    |       + ------ +  |
   1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //    +-- x   |  + ----|- +
  -1, -1,  1,     0, 0, 0,    0, 0,    0,  0,  1,  //   /        | /      | /
   1,  1,  1,     0, 0, 0,    1, 1,    0,  0,  1,  //  z         |/       |/
  -1,  1,  1,     0, 0, 0,    0, 1,    0,  0,  1,  //            + ------ +
  // right
   1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
   1, -1, -1,     0, 0, 0,    1, 0,    1,  0,  0,
   1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
   1, -1,  1,     0, 0, 0,    0, 0,    1,  0,  0,
   1,  1, -1,     0, 0, 0,    1, 1,    1,  0,  0,
   1,  1,  1,     0, 0, 0,    0, 1,    1,  0,  0,
  // back
   1, -1, -1,     0, 0, 0,    0, 0,    0,  0, -1,
  -1, -1, -1,     0, 0, 0,    1, 0,    0,  0, -1,
  -1,  1, -1,     0, 0, 0,    1, 1,    0,  0, -1,
   1, -1, -1,     0, 0, 0,    0, 0,    0,  0, -1,
  -1,  1, -1,     0, 0, 0,    1, 1,    0,  0, -1,
   1,  1, -1,     0, 0, 0,    0, 1,    0,  0, -1,
  // left
  -1, -1, -1,     0, 0, 0,    0, 0,   -1,  0,  0,
  -1, -1,  1,     0, 0, 0,    1, 0,   -1,  0,  0,
  -1,  1,  1,     0, 0, 0,    1, 1,   -1,  0,  0,
  -1, -1, -1,     0, 0, 0,    0, 0,   -1,  0,  0,
  -1,  1,  1,     0, 0, 0,    1, 1,   -1,  0,  0,
  -1,  1, -1,     0, 0, 0,    0, 1,   -1,  0,  0,
  // bottom
  -1, -1, -1,     0, 0, 0,    0, 0,    0, -1,  0,
   1, -1, -1,     0, 0, 0,    1, 0,    0, -1,  0,
   1, -1,  1,     0, 0, 0,    1, 1,    0, -1,  0,
  -1, -1, -1,     0, 0, 0,    0, 0,    0, -1,  0,
   1, -1,  1,     0, 0, 0,    1, 1,    0, -1,  0,
  -1, -1,  1,     0, 0, 0,    0, 1,    0, -1,  0,
  // top
  -1,  1,  1,     0, 0, 0,    0, 0,    0,  1,  0,
   1,  1,  1,     0, 0, 0,    1, 0,    0,  1,  0,
   1,  1, -1,     0, 0, 0,    1, 1,    0,  1,  0,
  -1,  1,  1,     0, 0, 0,    0, 0,    0,  1,  0,
   1,  1, -1,     0, 0, 0,    1, 1,    0,  1,  0,
  -1,  1, -1,     0, 0, 0,    0, 1,    0,  1,  0,
]);
```
````

In the `createVao()` method in the ***webGLUtils.js*** file, change the stride to 11 since we now have an additional 3 elements per vertex.

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

Now change the vertex shader to accept the normals as an input attribute and an output.

```c
in vec3 aNormal;

out vec3 vNormal;
```

And in the `main()` funtion calculate the world space normal preserving orthogonality with the face.

```c
// Output world space normal vectors
vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);
```

Now change the fragment shader to accept the normal as an input

```c
in vec3 aNormal;
```

Lastly, set the fragment colour to the normal vector.

```c
// Fragment colour
fragColour = vec4(vNormal, objectColour.a);
```

:::

Phew! If everything has gone ok when you refresh your web browser you should see the three sides of the cubes are rendered in Red, Green or Blue. What we have done here is used the world space normal vector as the fragment colour as a check to see if everything is working as expected. Move the camera around, and you will notice that the sides facing to the right are red because their normal vectors are $(1, 0, 0)$ so in RGB this is pure red. The sides facing up are green because their normal vectors are $(0, 1, 0)$ and the side facing towards us are blue because their normal vectors are $(0, 0, 1)$ as shown in {numref}`cube-normals-screenshot-figure`.

```{figure} ../_images/07_cubes_normals.png
:width: 80%
:name: cube-normals-screenshot-figure

The colours of the cube faces based on the normal vectors.
```

Now we just need to define diffuse coefficient for the cubes, the position and colour of our light source and send them to the shaders using uniforms.

:::{admonition} Task
:class: tip

Edit the commands used to define the cubes to include the diffuse coefficient $k_d = 0.7$.

```javascript
const cubes = [];
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    cubes.push({
      position : new Vec3(i * spacing, 0, -j * spacing),
      ka       : 0.5,
      kd       : 0.7,
    })
  }
}
```

Now define a JavaScript object for the light source properties just after where we have defined the cube positions and lighting coefficients.

```javascript
// Define light source properties
const light = {
  position : new Vec3(4, 2, 4),
  colour   : new Vec3(1, 1, 1),
}
```

Send the light position and colour vectors to the shaders after we have done this for the view and projection matrices.

```javascript
// Send light source properties to the shader
gl.uniform3fv(gl.getUniformLocation(program, "uLightPosition"), light.position.array);
gl.uniform3fv(gl.getUniformLocation(program, "uLightColour"), light.colour.array);
```

Send the diffuse coefficient to the shader where we did this for the ambient coefficient.

```javascript
gl.uniform1f(gl.getUniformLocation(program, "uKd"), cubes[i].kd);
```
:::

Now we have sent all the information required for diffuse lighting to the shader we now just need to edit the shaders.

:::{admonition} Task
:class: tip

Edit the vertex shader so that it outputs the world space vertex position.

```c
#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoords;
in vec3 aNormal;

out vec3 vColour;
out vec2 vTexCoords;
out vec3 vNormal;
out vec3 vPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);

  // Output vertex colour
  vColour = aColour;

  // Output texture coordinates
  vTexCoords = aTexCoords;

  // Output world space normal vectors
  vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);

  // Output world space vertex position
  vPosition = vec3(uModel * vec4(aPosition, 1.0));
}
```

And edit the fragment shader to calculate diffuse reflection.

```c
#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;
in vec3 vNormal;
in vec3 vPosition;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform vec3 uLightPosition;
uniform vec3 uLightColour;

// Material coefficients
uniform float uKa;
uniform float uKd;

void main() {

  // Object colour
  vec4 objectColour = texture(uTexture, vTexCoords);

  // Ambient
  vec3 ambient = uKa * objectColour.rgb;

  // Lighting vectors
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uLightPosition - vPosition);

  // Diffuse
  vec3 diffuse = uKd * max(dot(N, L), 0.0) * uLightColour * objectColour.rgb;

  // Fragment colour
  fragColour = vec4(diffuse, objectColour.a);
}
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

In the `render()` loop, after rendering the cubes, add the following code to render the light source cube.

```javascript
// Render light source
gl.useProgram(lightProgram);

// Calculate model matrix for light source
const translate = new Mat4().translate(...light.position.array);
const scale     = new Mat4().scale(0.1, 0.1, 0.1);
const model     = translate.multiply(scale);
gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

// Send light colour to the shader
gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), light.colour.array);

// Draw light source cube
gl.bindVertexArray(vao);
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
```

:::

Refresh your web browser, and you should see the effect of diffuse lighting on the cubes ({numref}`cubes-diffuse-figure`). Here we can see the light source cube in white and the faces of the cubes that are facing towards the light source are brighter than those facing away. 

```{figure} ../_images/07_cubes_diffuse.png
:width: 80%
:name: cubes-diffuse-figure

Diffuse reflection: $k_d = 0.7$.
```

If you move the camera around, you will see that the faces of the cubes that are facing away from the light source are black since we have not factored in ambient lighting, so let's include that now.

:::{admonition} Task
:class: tip

Change the fragment shader so that the fragment colour is the sum of the ambient and diffuse reflection.

```c
fragColour = vec4(ambient + diffuse, objectColour.a);
```

:::

Refresh your web browser, and you should see the cubes rendered with both ambient and diffuse reflection ({numref}`cubes-diffuse-ambient-figure`).

```{figure} ../_images/07_cubes_ambient_diffuse.png
:width: 80%
:name: cubes-diffuse-ambient-figure

Ambient and diffuse reflection: $k_a = 0.2$, $k_d = 0.7$.
```

---

## Specular reflection

Consider {numref}`specular-reflection-figure` that shows parallel light rays hitting a smooth surface where the reflected rays will point mostly in the same direction (think of a mirrored surface).

```{figure} ../_images/07_specular_reflection.svg
:width: 400
:name: specular-reflection-figure

Light rays hitting a smooth surface are reflected in the same direction.
```

Specular reflection depends upon the position of the light source and the fragment in the view space. Consider {numref}`reflection-figure` that shows a surface with a normal vector $\vec{n}$, a vector $\vec{L}$ pointing from the surface to a light source and a vector $\vec{R}$ pointing in the direction of reflected light off the surface. The angle between $\vec{L}$ and $\vec{n}$, $\theta$ which is known as the incidence angle, and the angle between $\vec{R}$ and $\vec{n}$ are the same.

```{figure} ../_images/07_reflection.svg
:width: 350
:name: reflection-figure

The light vector is reflected about the normal vector.
```

If $\vec{n}$ and $\vec{L}$ are unit vectors then the $\vec{R}$ vector is calculated using

$$ \begin{align*}
    \vec{R} = - \vec{L} + 2 (\vec{L} \cdot \vec{n}) \vec{n}
\end{align*} $$

If you are interested in the derivation of this formula, click on the dropdown below.

````{dropdown} Derivation of the reflection vector
The <a href="https://en.wikipedia.org/wiki/Vector_projection" target="_blank">vector projection</a> of a vector $\vec{a}$ onto another vector $\vec{b}$ is the vector $\operatorname{proj}_\vec{b} \vec{a}$ that points in the same direction as $\vec{b}$ with a length that is equal to the adjacent side of a right-angled triangle where $\vec{a}$ is the hypotenuse and the vector $\operatorname{proj}_\vec{b} \vec{a}$ is the adjacent side {numref}`vector-projection-figure`.

```{figure} ../_images/07_vector_projection.svg
:width: 250
:name: vector-projection-figure

The vector $\operatorname{proj}_\vec{b} \vec{a}$ is the projection of the vector $\vec{a}$ onto $\vec{b}$.
```

$\operatorname{proj}_\vec{b} \vec{a}$ is represented by the green vector in {numref}`vector-projection-figure` and is calculated by multiplying the unit vector $\hat{\vec{b}}$ by the length of the adjacent side of the right-angled triangle. Using trigonometry this gives

$$ \operatorname{proj}_\vec{b} \vec{a} = \| \vec{a} \| \cos(\theta) \hat{\vec{b}}. $$

Recall that the geometric definition of the dot product is

$$\vec{a} \cdot \vec{b} = \| \vec{a} \| \| \vec{b} \| \cos(\theta)$$ 

which can be rearranged to

$$ \cos(\theta) = \frac{\vec{a} \cdot \vec{b}}{\| \vec{a} \| \| \vec{b} \|} $$

so

$$ \begin{align*}
    \operatorname{proj}_\vec{b} \vec{a} = \| \vec{a} \| \frac{\vec{a} \cdot \vec{b}}{\| \vec{a} \| \| \vec{b} \|} \hat{\vec{b}} = (\vec{a} \cdot \hat{\vec{b}}) \hat{\vec{b}}
\end{align*} $$

Consider {numref}`reflection-vector-figure` that shows a surface with a normal vector $\vec{n}$, a light source vector $\vec{L}$ and a reflection vector $\vec{R}$. 

```{figure} ../_images/07_reflection_vector.svg
:width: 325
:name: reflection-vector-figure

Calculating the reflection vector $\vec{R}$.
```

If $\vec{n}$ and $\vec{L}$ are unit vectors, then the reflection vector $\vec{R}$ can be calculated by reversing $\vec{L}$ and adding the two projections, $\operatorname{proj}_{\vec{n}} \vec{L} = (\vec{L} \cdot \vec{n}) \vec{n}$

$$ \vec{R} = - \vec{L} + 2 (\vec{L} \cdot \vec{n}) \vec{n} $$
````

For a perfectly smooth surface the reflected ray will point in the direction of the $\vec{R}$ vector so in order to see the light the viewer would need to be positioned in the direction of the $\vec{R}$ vector. The viewing vector $\vec{V}$ is the vector that points from the surface to the viewer (camera). Since most surfaces are not perfectly smooth we add a bit of scattering to the model the amount of specular reflection seen by the viewer. This is determined by the angle $\alpha$ between the $\vec{R}$ vector and the $\vec{V}$ vector. The closer the viewing vector is to the reflection vector, the smaller the value of $\alpha$ will be and the more of the light will be reflected towards the camera.

```{figure} ../_images/07_specular.svg
:width: 400
:name: specular-figure

Specular reflection scatters light mainly towards the reflection vector.
```

Phong modelled the scattering of the reflected light rays using $\cos(\alpha)$ raised to a power

$$\vec{specular} = k_s \vec{I}_p \cos(\alpha)^{N_s},$$(specular-reflection-equation)

where $k_s$ is the **specular reflection constant** similar to its ambient and diffuse counterparts and $N_s$ is the **specular exponent** that determines the shininess of the object. If $\vec{R}$ and $\vec{eye}$ are unit vectors, then $\cos(\alpha)$ can be calculated using the dot product between the $\vec{R}$ and $\vec{eye}$ vector limited to positive values

$$ \cos(\alpha) = \max(\vec{eye} \cdot \vec{R}, 0)^{N_s}.$$

:::{admonition} Task
:class: tip

Add the specular coefficient and exponent to the cube objects where we did the same for the ambient and diffuse coefficients.

```javascrtip
ks        : 1.0,
shininess : 20,
```

And send them to the shader where we did this for the ambient and diffuse coefficients.

```javascript
gl.uniform1f(gl.getUniformLocation(program, "uKs"), cubes[i].ks);
gl.uniform1f(gl.getUniformLocation(program, "uShininess"), cubes[i].shininess);
```

Send the camera position to the shader after we calculate the view and projection matrices.

```javascript
// Send camera position to the shader
gl.uniform3fv(gl.getUniformLocation(program, "uCameraPosition"), camera.eye.array);
```

And send the specular coefficient and exponent to the shader where we did this for the ambient and diffuse coefficients.

```javascript
gl.uniform1f(gl.getUniformLocation(program, "uKs"), cubes[i].ks);
gl.uniform1f(gl.getUniformLocation(program, "uShininess"), cubes[i].shininess);
```

Now in the fragment shader, add uniforms for the camera position, specular coefficient and exponent.

```c
uniform vec3 uCameraPosition;

// other uniforms...

uniform float uKs;
uniform float uShininess;
```

And calculate the specular reflection in the `main()` function.

```c
// Specular
vec3 V = normalize(uCameraPosition - vPosition);
vec3 R = reflect(-L, N);
vec3 specular = uKs * pow(max(dot(R, V), 0.0), uShininess) * uLightColour;

// Fragment colour
fragColour = vec4(specular, objectColour.a);
```

:::

Refresh your web browser and move the camera so that the cubes are between the camera and the light source and you should see the image shown in {numref}`cubes-specular-figure`.

```{figure} ../_images/07_cubes_specular.png
:width: 80%
:name: cubes-specular-figure

Specular reflection: $k_s = 1.0$, $N_s = 20$.
```

Move the camera around the cubes and notice how the specular highlights (the white bits) change due to the position of the camera and the normal vectors of the cube surfaces. Let's add ambient and diffuse relfection to the specular reflection to complete the Phong reflection model.

:::{admonition} Task
:class: tip

Change the fragment shader so that the fragment colour is the sum of the ambient, diffuse and specular reflection.

```c
fragColour = vec4(ambient + diffuse + specular, objectColour.a);
```

:::

```{figure} ../_images/07_cubes_phong.png
:width: 80%
:name: cubes-phong-figure

Ambient, diffuse and specular reflection: $k_a = 0.2$, $k_d = 0.7$, $k_s = 1.0$, $N_s = 20$.
```

---

## Attenuation

**Attenuation** is the gradual decrease in light intensity as the distance between the light source and a surface increases. We can use attenuation to model light from low intensity light source, for example, a candle or torch which will only illuminate an area close to the source. Theoretically attenuation should follow the inverse square law where the light intensity is inversely proportional to the square of the distance between the light source and the surface. However, in practice this tends to result in a scene that is too dark so we calculate attenuation using an inverse quadratic function

$$ attenuation = \frac{1}{constant + linear \cdot d + quadratic \cdot d^2}, $$

where $d$ is the distance between the light source and the fragment and $constant$, $linear$ and $quadratic$ are coefficients that determine how quickly the light intensity decreases. The graph in {numref}`attenuation-figure` shows a typical attenuation profile where the light intensity rapidly decreases when the distance is small levelling off as the distance gets larger.

```{figure} ../_images/07_attenuation.svg
:width: 500
:name: attenuation-figure

Attenuation can be modelled by an inverse quadratic function.
```

:::{admonition} Task
:class: tip

Add the following attenuation coefficients to the light source.

```javascript
constant  : 1.0,
linear    : 0.1,
quadratic : 0.02,
```

And send them to the shader where we did this for the light source position and colour.

```javascript
gl.uniform1f(gl.getUniformLocation(program, "uConstant"), light.constant);
gl.uniform1f(gl.getUniformLocation(program, "uLinear"), light.linear);
gl.uniform1f(gl.getUniformLocation(program, "uQuadratic"), light.quadratic);
```

Add the uniforms to the fragment shader.

```c
// Attenuation parameters
uniform float uConstant;
uniform float uLinear;
uniform float uQuadratic;
```

Then calculate and apply attenuation to the fragment colour.

```c
// Attenuation
float dist = length(uLightPosition - vPosition);
float attenuation = 1.0 / (uConstant + uLinear * dist + uQuadratic * dist * dist);

// Fragment colour
fragColour = vec4(attenuation * (ambient + diffuse + specular), objectColour.a);
```

:::

These values used the attenuation ceofficients here depend on the type of light source being modelled. In this case we have a weak light source to demonstrate the loss of light intensity over space but for stronger light sources you may wish to experiment with these values. Refresh your web browser and you should see that the cubes further away from the light source are darker as shown in {numref}`cubes-attenuation-figure`.

```{figure} ../_images/07_cubes_attenuation.png
:width: 80%
:name: cubes-attenuation-figure

Applying attenuation means that the objects further away from light source appear darker.
```
