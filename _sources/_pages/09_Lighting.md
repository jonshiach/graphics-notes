(lighting-section)=

# Lighting

In this lab we will be looking at adding a basic lighting model to our application. Lighting modelling is in itself a huge topic within the field of computer graphics and modern games and movies can look very lifelike thanks to some very clever techniques. Lighting models come in two main types: local illumination and global illumination:

- **local illumination** - the colour and brightness of individual points on a surface are determined by the light emanating from one or more light sources.
- **global illumination** - the colour and brightness of individual points on a surface are determine both by the light emanating from light sources **in addition to** light that is reflected off of other objects in the scene.

```{figure} ../_images/08_local_global_illumination.svg
:width: 500
```

Here we will be applying a local illumination model since they are easier to apply than global illumination and quicker to compute. The downside is that they don't produce a rendering as realistic than with global illumination.

Compile and run the project and you will see the window below showing a wire frame representation of the Utah teapot.

```{figure} ../_images/08_teapot_wireframe.png
:width: 500
```

```{note}
The Utah teapot is a standard test model for computer graphics first created in 1975 by Martin Newell whilst at the University of Utah. It has become a bit of an in-joke in the computer graphics community and has appeared in Pixar's *Toy Story* and in *The Simpsons* episode *Treehouse of Horror VI*.
```

The teapot has been rendered as a wire frame model since in the absence of light and shadow we wouldn't be able to tell that it was in fact a 3D model. We can turn of the wire frame rendering by commenting out the line `glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);`. Do this and you should see the following.

```{figure} ../_images/08_teapot_solid.png
:width: 500
```

## The Model class

If you take a look at the source code in the `Lab10_Lighting/source` folder you will notice that in addition to the classes introduced in previous labs (Texture, Shader and Camera) we have an addition class called Model which is defined in the `model.hpp` and `model.cpp` files. The Model class has been written so that we can load the vertex and texture co-ordinates from external files rather than having to define these in our code. Take a look at the `main.cpp` file where the following Model class methods have been called:

- `Model teapot("../objects/teapot.obj)` - this is the constructor for the Model class and creates an object called `teapot`, loads the vertex co-ordinates, texture co-ordinates and vertex normals from an .obj file (see below) and creates the VAO and relevant buffers.
- `teapot.addTexture("../objects/blue.bmp", "diffuse");` - this method loads a texture map called `blue.bmp` and sets its type to `diffuse`. The texture loader now uses a library so our textures no longer have to be bitmaps. 
- `teapot.draw(shaderID)` - this method binds the objects buffers and textures and instructs OpenGL to draw the model.

### Wavefront (.obj) files

The Model class includes a private member function called `loadObj()` written by contributors of <a href = "https://www.opengl-tutorial.org" target="_blank">opengl-tutorial.org</a> which loads in a <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file" target="_blank">**wavefront (.obj)**</a> file. A wavefront file is one of the many different types of file that is used to describe 3D models in computer graphics. In the `Lab10_Lighting/objects/` folder you will see some `.obj` files. Open the `cube.obj` file using a text editor and you will see the following.

```text
# Blender 4.0.2
# www.blender.org
mtllib cube.mtl
o Cube
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000
v 1.000000 -1.000000 1.000000
v -1.000000 1.000000 -1.000000
v -1.000000 -1.000000 -1.000000
v -1.000000 1.000000 1.000000
v -1.000000 -1.000000 1.000000
vn -0.0000 1.0000 -0.0000
vn -0.0000 -0.0000 1.0000
vn -1.0000 -0.0000 -0.0000
vn -0.0000 -1.0000 -0.0000
vn 1.0000 -0.0000 -0.0000
vn -0.0000 -0.0000 -1.0000
vt 0.875000 0.500000
vt 0.625000 0.750000
vt 0.625000 0.500000
vt 0.375000 0.990255
vt 0.375000 0.750000
vt 0.625000 0.008121
vt 0.375000 0.250000
vt 0.375000 0.008121
vt 0.375000 0.500000
vt 0.125000 0.750000
vt 0.125000 0.500000
vt 0.625000 0.250000
vt 0.875000 0.750000
vt 0.625000 0.988631
s 0
usemtl Material
f 5/1/1 3/2/1 1/3/1
f 3/2/2 8/4/2 4/5/2
f 7/6/3 6/7/3 8/8/3
f 2/9/4 8/10/4 6/11/4
f 1/3/5 4/5/5 2/9/5
f 5/12/6 2/9/6 6/7/6
f 5/1/1 7/13/1 3/2/1
f 3/2/2 7/14/2 8/4/2
f 7/6/3 5/12/3 6/7/3
f 2/9/4 4/5/4 8/10/4
f 1/3/5 3/2/5 4/5/5
f 5/12/6 1/3/6 2/9/6
```

The vertex and face data is given in lines with the following abbreviations:

- `v` - the $\mathsf{(x, y, z)}$ co-ordinates of a vertex
- `vn` - the $\mathsf{(n_x, n_y, n_z)}$ normal vector for the vertex
- `vt` - the $\mathsf{(u, v)}$ texture co-ordinates
- `f` - indices of the vertices of a face. Each face is defined by 3 vertices so we have 3 sets of 3 values. The face vertices are of the form `v/vt/vn` so `3/2/1` refers to a vertex where the co-ordinates are given by the 3rd `v` line, the texture co-ordinates are given by the 2nd `vt` line and the normal vector is given by the 1st `vn` line.

```{note}
The `loadObj()` private member function in the Model class is quite simplistic and we need to make sure our .obj file is in the correct form. There are some model loading libraries available such as <a href="http://www.assimp.org" target="_blank">assimp</a> (open ASSet IMPorter library) that can handle most common object formats but use of this requires compiling source code and configuring the IDE which is a bit too fiddly for what we are doing here.
```

To see how you can use <a href="https://www.blender.org" target="_blank">Blender</a> to create .obj files [see below](blender-section).

---

## Phong's lighting model

Phong's lighting model first described by Bui Tuong Phong is a local illumination model that simulates the interaction of light falling on surfaces. The brightness of a point on a surface is based on three components

- **ambient reflection** - a simplified model of light that reflects off all objects in a scene
- **diffuse reflection** - describes the direct illumination of a surface by a light source based on the angle between the light source direction and the normal vector to the surface
- **specular reflection** - models the shiny highlights on a surface caused by a light source based on the angle between the light source direction, the normal vector and the view direction

The colour of a fragment on the surface is calculated as a sum of these components, i.e.,

$$ \texttt{fragment colour}  = \texttt{ambient} + \texttt{diffuse} + \texttt{specular}.$$

All colours are defined as 3-element vectors containing the RGB colour values. 

### Ambient reflection

Ambient reflection is light that is scatters off of all surfaces in a scene. To model this we use a massive cheat, we assume that all fragments of the object are lit equally with the same amount of intensity. The equation to do this is

$$ \texttt{ambient} = k_a * \texttt{light colour} * \texttt{object colour}$$

where $k_a$ is the **ambient reflection constant** that determines the amount of ambient lighting used, $\texttt{light colour}$ is the colour of the light source and $\texttt{object colour}$ is the colour of the fragment (usually determined by a texture map). Lets create a light source and calculate the ambient lighting. We need to create a vector for the light colour and send it to the shaders using a uniform. Add the following code to the `main.cpp` file just before the render loop.

```cpp
// Define object properties
float ka = 0.2f;    // ambient constant

// Define light colours
glm::vec3 white = glm::vec3(1.0f, 1.0f, 1.0f);
glm::vec3 lightAmbient = ka * white;                    // ambient light colour
```

Here we have defined the ambient constant for the teapot as $k_a=0.2$ and the $\texttt{light colour}$ as white. In the render loop add the following code just before we calculate the model matrix to send the `lightAmbient` to the shaders.

```cpp
// Send light source properties to the shader
glUniform3fv(glGetUniformLocation(shaderID, "lightAmbient"), 1, &lightAmbient[0]);
```

Then edit `fragmentShader.frag` so that it takes in the `lightAmbient` uniform and calculates the ambient reflection.

```cpp
#version 330 core

// Interpolated values from the vertex shaders
in vec2 texCoord;

// Output data
out vec3 fragmentColour;

// Uniforms
uniform sampler2D diffuse1;
uniform vec3 lightAmbient;

void main ()
{
    // Object colour
    vec3 objectColour = vec3(texture(diffuse1, UV));

    // Ambient reflection
    vec3 ambient = lightAmbient * objectColour;
    
    // Fragment colour
    fragmentColour = ambient;
}
```

Changing the value of $k_a$ will make the colour of the teapot lighter or darker.

`````{grid}
````{grid-item}
```{figure} ../_images/08_teapot_ambient_0.2.png
$k_a=0.2$
```
````

````{grid-item}
```{figure} ../_images/08_teapot_ambient_0.5.png
$k_a=0.5$
```
````

````{grid-item}
```{figure} ../_images/08_teapot_ambient_0.8.png
$k_a=0.8$
```
````

`````

### Diffuse reflection

Diffuse and specular reflection depend upon the position of the light source and the fragment in the view space. Introducing a $\tt light$ vector that points from the position of the fragment to the light source and $\tt normal$ which is the surface normal for the fragment. The direction that light is reflected off the surface is described by the $\tt reflection$ vector which makes the same angle $\theta$ to the $\tt normal$ vector that the $\tt light$ vector does.

```{figure} ../_images/08_reflection.svg
:width: 350
:name: reflection-figure

The light vector is reflected about the normal vector.
```

If $\texttt{normal}$ and $\texttt{light}$ are unit vectors then the $\tt reflection$ vector is calculated using

$$ \begin{align*}
    \texttt{reflection} = - \texttt{light} + 2 (\texttt{light} \cdot \texttt{normal}) \texttt{normal}.
\end{align*} $$

Diffuse reflection is the reflection of light off a rough surface. Consider {numref}`diffuse-reflection-figure` that shows parallel light rays hitting a surface. Since the the normal vectors vary across a rough surface then the light rays are scattered in multiple directions.

```{figure} ../_images/08_diffuse_reflection.svg
:width: 400
:name: diffuse-reflection-figure

Light rays hitting a rough surface are scattered in all directions.
```

To model diffuse reflection we assume that light is reflected equally in all directions ({numref}`diffuse-figure`).

```{figure} ../_images/08_diffuse.svg
:width: 350
:name: diffuse-figure

Diffuse reflection scatters light equally in all directions.
```

The amount of light that is reflected to the viewer is modelled using the angle $\theta$ between the $\tt light$ and $\tt normal$ vectors. If $\theta$ is small then the light source is directly in front of the surface so most of the light will be reflected to the viewer. Whereas if $\theta$ is close to 90$^\circ$ then the light source is nearly in line with the surface and little of the light will be reflected to the viewer. When $\theta > 90^\circ$ the light source is behind the surface so no light is reflected to the viewer. We model this using the cosine of $\theta$ since $\cos(0^\circ) = 1$ and $\cos(90^\circ)=0$. Diffuse reflection is calculated using

$$ \texttt{diffuse} = k_d * \texttt{light colour} * \texttt{object colour} * \cos(\theta),$$

where $k_d$ is the **diffuse reflection constant** that determines the amount of diffuse lighting seen by the viewer. Recall that the angle between two vectors is related by [dot product](dot-product-section) so if the $\tt light$ and $\tt normal$ vectors are unit vectors then $\cos(\theta) = \tt light \cdot normal$. If $\theta > 90^\circ$ then light source is behind the surface and no light should be reflected to the viewer. When $\theta$ is between 90$^\circ$ and 180$^\circ$, $\cos(\theta)$ is negative so we limit the value of $\cos(\theta )$ between 0 and 1.

Lets define a position for a light source and the colour of the diffuse light. Define a float for the the diffuse constant and set its value to $k_d = 0.7$

```cpp
float kd = 0.7f;    // diffuse constant
```

and add the following after where we defined the ambient light colour.

```cpp
glm::vec3 lightDiffuse = kd * white;
glm::vec3 lightPosition = glm::vec3(2.0f, 2.0f, 2.0f);
```

So the light source is positioned at (2,2,2) and the diffuse light is pure white.

All calculations performed in the fragment shader is done in the view space and the `gl_Position` which is calculated in the vertex shader is the screen space vertex position so we also need to calculate the view space co-ordinates of the light source position. We could do this in the vertex shader but since the light position is the same for all fragments it is better do this in the `main.cpp` file rather than recalculating it for each fragment in the shaders. Add the following code just after we sent the colour of the ambient light to the shader to do the same for the diffuse light and the light position.

```cpp
glm::vec3 viewSpaceLightPosition = glm::vec3(view * glm::vec4(lightPosition, 1.0f));
glUniform3fv(glGetUniformLocation(shaderID, "lightDiffuse"), 1, &lightDiffuse[0]);
glUniform3fv(glGetUniformLocation(shaderID, "lightPosition"), 1, &viewSpaceLightPosition[0]);
```

As well as the view space light position co-ordinates we also need view space versions of the fragment position and normal vector. OpenGL interpolates the outputs from the vertex shader and passes the interpolated values for each fragment to the fragment shader so we calculate view space fragment position and normal in the vertex shader.The view space fragment position is calculated by multiplying `position` by the `view` and `model` matrices. The view space normal vector is calculated using

$$ \begin{align*}
    \texttt{view space normal} = ((\textsf{view matrix} * \textsf{model matrix})^{-1})^\mathsf{T} * \tt normal.
\end{align*} $$(view-space-normal-equation)

Recall that $A^\mathsf{T}$ is the [transpose](transpose-section) and $A^{-1}$ is the [inverse](inverse-matrix-section) of the matrix $A$. You don't need to know why we use this equation but if you are curious click on the download link below.

````{dropdown} Derivation of the view space normal transformation

Consider the diagram in {numref}`view-space-normal-1-figure` that shows the normal and tangent vectors to a surface in the object space. If the combined model and view transformations preserves the scaling of the edge such the equal scaling is used in the $x$, $y$ and $z$ axes then the normal and tangent vectors are perpendicular in the view space.

```{figure} ../_images/08_view_space_normal_1.svg
:width: 200
:name: view-space-normal-1-figure

Normal and tangent vectors in the object space.
```

If the model and view transformations do not preserve the scaling then the the view space normal vector is no longer perpendicular to the tangent vector ({numref}`view-space-normal-2-figure`).

```{figure} ../_images/08_view_space_normal_2.svg
:width: 300
:name: view-space-normal-2-figure

Normal and tangent vectors in the view space.
```

Let $M$ be the first 3 rows and columns of the $\textsf{view matrix} * \textsf{model matrix}$ then the view space tangent vector is calculated using $M * {\tt tangent}$ (here I've used $*$ to denote column major matrix multiplication so that it is consistent with our code). We need to derive a $3\times 3$ transformation matrix $A$ such that the view space normal vector is calculated using $A * {\tt normal}$ where this is perpendicular to the view space tangent vector, i.e.,

$$(A * {\tt normal}) \cdot (M * {\tt tangent}) = 0.$$

We can replace the dot product by a matrix multiplication by transposing $(A * {\tt normal})$

$$(A * {\tt normal})^\mathsf{T} * (M * {\tt tangent} )= 0.$$

A property of matrix multiplication is that the transpose of a multiplication is equal to the multiplication of the transposes swapped (i.e., $(A * B)^\mathsf{T} = B^\mathsf{T} * A^\mathsf{T}$) so we can write this as

$${\tt normal}^\textsf{T} * A^\mathsf{T} * M * {\tt tangent} = 0.$$

If $A^\mathsf{T} * M = I$ then the view space normal and tangent vectors are perpendicular. Solving for $A$ gives

$$ \begin{align*}
    A^\mathsf{T} * M &=  I \\
    A^\mathsf{T} &=  M^{-1} \\
    A &=  (M^{-1})^\mathsf{T}.
\end{align*} $$

Since $M = \textsf{view} * \textsf{model}$ then the matrix that transforms a model space normal vector to the view space is $A = ((\textsf{view matrix} * \textsf{model matrix})^{-1})^\mathsf{T}$

````

Edit `vertexShader.vert` so that is looks like the following.

```cpp
#version 330 core

// Input vertex data
layout(location = 0) in vec3 position;
layout(location = 1) in vec2 texCoord;
layout(location = 2) in vec3 normal;

// Output data
out vec2 texCoord;
out vec3 fragmentPosition;
out vec3 Normal;

// Uniforms
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    // Output vertex position
    gl_Position = projection * view * model * vec4(position, 1.0);
    
    // Output (u,v) co-ordinates
    UV = texCoord;
    
    // Output view space fragment position and normal
    fragmentPosition = vec3(view * model * vec4(position, 1.0));
    Normal = mat3(transpose(inverse(view * model))) * normal;
}
```

In `fragmentShader.frag` we need let OpenGL know we are importing `fragmentPosition` and `Normal` from the vertex shader so add the following at the top where we import the `UV` co-ordinates.

```cpp
in vec3 Normal;
in vec3 fragmentPosition;
```

Add `vec3` uniforms for the `lightPosition` and `lightDiffuse` vectors

```cpp
uniform vec3 lightDiffuse;
uniform vec3 lightPosition;
```

and in the `main()` function add the following to calculate diffuse reflection.

```cpp
// Diffuse reflection
vec3 normal = normalize(Normal);
vec3 light = normalize(lightPosition - fragmentPosition);
float cosTheta = max(dot(normal, light), 0);
vec3 diffuse = lightDiffuse * objectColour * cosTheta;
```

Finally add the diffuse reflection to the ambient reflection to calculate the fragment colour.

```cpp
// Fragment colour
fragmentColour = ambient + diffuse;
```

The result of applying ambient and diffuse reflection is shown in {numref}`teapot-diffuse-figure`.

```{figure} ../_images/08_teapot_diffuse.png
:width: 500
:name: teapot-diffuse-figure

Ambient and diffuse reflection: $k_a = 0.2$, $k_d = 0.7$.
```

Use the keyboard and mouse to view the teapot from different angles. You should notice that the side of the teapot facing away from the light source is darker.

### Specular reflection

Consider {numref}`specular-reflection-figure` that shows parallel light rays hitting a smooth surface. The normal vectors will be similar across the surface so the reflected rays will point mostly in the same directions. This is known as **specular reflection**.

```{figure} ../_images/08_specular_reflection.svg
:width: 400
:name: specular-reflection-figure

Light rays hitting a smooth surface are reflected in the same direction.
```

For a perfectly smooth surface the reflected ray will point in the direction of the $\tt reflection$ vector so in order to see the light the viewer would need to be positioned in the direction of the $\tt reflection$ vector. The position of the viewer is represented by the $\texttt{eye}$ vector with points from the fragment to the camera (which is at (0,0,0). Since most surfaces are not perfectly smooth we add a bit of scattering to the model the amount of specular reflection seen by the viewer. This is determined by the angle $\alpha$ between the $\tt reflection$ vector and the $\tt eye$ vector. The closer the viewer is to the reflection vector, the smaller the value of $\alpha$ will be and the more of the reflected light will be seen.

```{figure} ../_images/08_specular.svg
:width: 350
:name: specular-figure

Specular reflection scatters light mainly towards the reflection vector.
```

We model the scattering of the reflected light rays using $\cos(\alpha)$ raised to power

$$ \texttt{specular} = k_s * \texttt{light colour} * \cos(\alpha)^{N_s},$$

where $k_s$ is the **specular reflection constant** similar to its ambient and diffuse counterparts and $N_s$ is the **specular exponent** that determines the size of the specular highlights (i.e., the shininess of the object). The angle $\alpha$ is calculated using a dot product between the $\tt reflection$ vector and the $\tt eye$ vector. 

In `main.cpp` define a float for the specular constant and exponent with values $k_s = 1.0$ and $N_s = 20.0$ 

```cpp
float ks = 1.0f;    // specular constant
float Ns = 20.0f;   // specular exponent
```

and define the colour of the specular light where we defined the colours of the ambient and diffuse light.

```cpp
glm::vec3 lightSpecular = ks * white;
```

Send the specular colour to the shader where we did this for the ambient and diffuse colours.

```cpp
glUniform3fv(glGetUniformLocation(shaderID, "lightSpecular"), 1, &lightSpecular[0]);
glUniform1f(glGetUniformLocation(shaderID, "Ns"), Ns);
```

In the fragment shader add a vec3 uniform for `Ns` and `lightSpecular`

```cpp
uniform vec3 lightSpecular;
uniform float Ns;
```

and in the `main()` function add specular refection to our teapot.

```cpp
// Specular reflection
vec3 eye = normalize(-fragmentPosition);
vec3 reflection = -light + 2 * dot(light, normal) * normal;
float cosAlpha = max(dot(eye, reflection), 0);
vec3 specular = lightSpecular * pow(cosAlpha, Ns);
```

Don't forget to add the specular reflection to the fragment colour.

```cpp
// Fragment colour
fragmentColour = ambient + diffuse + specular;
```

The result of applying ambient, diffuse and specular reflection is shown in {numref}`teapot-specular-figure`.

```{figure} ../_images/08_teapot_specular.png
:width: 500
:name: teapot-specular-figure

Ambient, diffuse and reflection: $k_a = 0.2$, $k_d = 0.7$, $k_s = 1.0$, $N_s = 20$.
```

Move the camera around the teapot and watch what happens to the specular highlights.

### Attenuation

**Attenuation** is the gradual decrease in light intensity as the distance between the light source and a surface increases. We can use attenuation to model light from low intensity light source, for example, a candle or torch which will only illuminate an area close to the source. Theoretically attenuation should follow the inverse square law where the light intensity is inversely proportional to the square of the distance between the light source and the surface. However, in practice this tends to result in a scene that is too dark so we calculate attenuation using the following

$$ \textsf{attenuation} = \frac{1}{\textsf{constant} + \textsf{linear} * \textsf{distance} + \textsf{quadratic} * \textsf{distance}^2}, $$

where constant, linear and quadratic are values that determine who quickly the light intensity decreases, the values of which are set to model the type of light source, and distance is the distance of the fragment from the light source. The graph in {numref}`attenuation-figure` shows a typical attenuation profile where the light intensity rapidly decreases when the distance is small levelling off as the distance gets larger.

```{figure} ../_images/08_attenuation.svg
:width: 500
:name: attenuation-figure

Attenuation can be modelled by an inverse quadratic function.
```

To model attenuation edit the fragment shader so that constant values are defined before the `main()` function.

```cpp
float constant = 1.0;
float linear = 0.1;
float quadratic = 0.02;
```

The values of these will depend on the type of light source being modelled. We want a weak light source to demonstrate the attenuation but for stronger light sources you may wish to experiment with these values. In the `main()` function and the following to apply attenuation.

```cpp
// Attenuation
float distance = length(lightPosition - fragmentPosition);
float attenuation = 1.0 / (constant + linear * distance + quadratic * distance * distance);

// Fragment colour
fragmentColour = (ambient + diffuse + specular) * attenuation;
```

To demonstrate the affects of applying attenuation we are going to need some more objects that are further away from the light source. In your `main.cpp` file before the render loop define an array of position vectors

```cpp
// Specify world space object positions
glm::vec3 positions[] = {
    glm::vec3( 0.0f,  0.0f,  0.0f),
    glm::vec3( 2.0f,  5.0f, -10.0f),
    glm::vec3(-3.0f, -2.0f, -4.0f),
    glm::vec3(-4.0f, -2.0f, -8.0f),
    glm::vec3( 2.0f, -1.0f, -4.0f),
    glm::vec3(-4.0f,  3.0f, -10.0f),
    glm::vec3( 0.0f, -2.0f, -8.0f),
    glm::vec3( 4.0f,  2.0f, -6.0f),
    glm::vec3( 3.0f,  0.0f, -1.0f),
    glm::vec3(-1.0f,  1.0f, -2.0f)
};
```

and then replace the `model` matrix and drawing commands with the following (it should be fairly obvious what we are doing here).

```cpp
// Loop through objects
for (unsigned int i = 0; i < 10; i++)
{
    // Calculate model matrix
    glm::mat4 translate = glm::translate(glm::mat4(1.0f), positions[i]);
    glm::mat4 scale = glm::scale(glm::mat4(1.0f), glm::vec3(1.0f));
    glm::mat4 rotate = glm::rotate(glm::mat4(1.0f), 30.0f * i, glm::vec3(1.0f));
    glm::mat4 model = translate * rotate * scale;
    
    // Send the model matrix to the shader
    glUniformMatrix4fv(glGetUniformLocation(shaderID, "model"), 1, GL_FALSE, &model[0][0]);
    
    // Draw the model
    teapot.draw(shaderID);
}
```

It would also be useful to render the light source. After you've drawn the teapots add the following code.

```cpp
// Draw light sources
// Activate light source shader
glUseProgram(lightShaderID);

// Calculate model matrix
glm::mat4 translate = glm::translate(glm::mat4(1.0f), lightPosition);
glm::mat4 scale = glm::scale(glm::mat4(1.0f), glm::vec3(0.1f));
glm::mat4 model = translate * scale;

// Send model, view, projection matrices and light colour to light shader
glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "model"), 1, GL_FALSE, &model[0][0]);
glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "view"), 1, GL_FALSE, &view[0][0]);
glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "projection"), 1, GL_FALSE, &projection[0][0]);
glUniform3fv(glGetUniformLocation(lightShaderID, "lightColour"), 1, &lightSpecular[0]);

// Draw light source
sphere.draw(lightShaderID);
```

Moving the camera to a different position allows us to see the affects of attenuation ({numref}`teapot-attenuation-figure`). Note how the teapots further away from the light source are darker as the light intensity has been reduced.

```{figure} ../_images/08_teapot_attenuation.png
:width: 500
:name: teapot-attenuation-figure

The affects of applying attenuation.
```

If you are having difficulty with this check out the source code [Lab10_single_light.cpp](../code/Lab10_Lighting/Lab10_single_light.cpp) and the shaders [vertexShader.vert](../code/Lab10_Lighting/vertexShader.vert) and [fragmentShader.frag](../code/Lab10_Lighting/fragmentShader.frag).

## Multiple light sources

In theory to add another light sources to a scene is simply a matter of calculating the ambient, diffuse and specular reflection for the additional light source and then adding them to the fragment colour. We have seen for a single light source we have to define the three light source colours, the position of the light source in the world space and the three attenuation constants. Given that we would like to do this for multiple light sources we need data structure for each light source.

A data structure in C++ and GLSL is defined in a similar way using the <a href="https://cplusplus.com/doc/tutorial/structures/" target="_blank">struct</a> declaration.

```cpp
// Structs
struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float linear, constant, quadratic;
};
```

This defines a data structure called `Light` that contains the information required to calculate the lighting model for a single light source. In the fragment shader we can create a uniform for an array of `Light` data structures.

```cpp
#define maxLights 10;
uniform Light lights[maxLights];
uniform int numLights;
```

This defines a 10 element array of `Light` data structures (hopefully we will not need more than 10 light sources but if you then simply increase the number of `maxLights`) and the actual number of lights we have is passed in using the `numLights` uniform. Then all we need to do is loop through each of the light sources, calculate the fragment colour for the current source and add it to the total fragment colour. The fragment shader for multiple light sources is given below. Create a new file called `multipleLightsFragmentShader.frag` in the `source/` directory and paste this code.

```cpp
#version 330 core

// Interpolated values from the vertex shaders
in vec2 texCoord;
in vec3 fragmentPosition;
in vec3 Normal;

// Output data
out vec3 fragmentColour;

// Structs
struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float linear, constant, quadratic;
};

// Uniforms
#define maxLights 10
uniform sampler2D diffuse1;
uniform Light lights[maxLights];
uniform int numLights;
uniform float Ns;

// Function prototypes
vec3 calculatePointLight(Light ptLight, vec3 fragmentPosition, vec3 normal, vec3 eye);

void main ()
{

    // Calculate normal and eye vectors (these are the same for all light sources)
    vec3 normal = normalize(Normal);
    vec3 eye = normalize(-fragmentPosition);

    // Loop through the point light sources
    fragmentColour = vec3(0.0, 0.0, 0.0);
    for (int i = 0; i < numLights; i++)
    {
        fragmentColour += calculatePointLight(lights[i], fragmentPosition, normal, eye);
    }
}

// Calculate point light
vec3 calculatePointLight(Light ptLight, vec3 fragmentPosition, vec3 normal, vec3 eye)
{
    // Object colour
    vec3 objectColour = vec3(texture(diffuse1, UV));
    
    // Ambient reflection
    vec3 ambient = ptLight.ambient * objectColour;
    
    // Diffuse reflection
    vec3 light = normalize(ptLight.position - fragmentPosition);
    float cosTheta = max(dot(normal, light), 0);
    vec3 diffuse = ptLight.diffuse * objectColour * cosTheta;
    
    // Specular reflection
    vec3 reflection = -light + 2 * dot(light, normal) * normal;
    float cosAlpha = max(dot(eye, reflection), 0);
    vec3 specular = ptLight.specular * pow(cosAlpha, Ns);
    
    // Attenuation
    float distance = length(ptLight.position - fragmentPosition);
    float attenuation = 1.0 / (ptLight.constant + ptLight.linear * distance + ptLight.quadratic * distance * distance);
    
    // Return fragment colour
    return (ambient + diffuse + specular) * attenuation;
}
```

Here we have defined a function called `calculatePointLight()` that contains the commands used to calculate the fragment colour for a single light source. In the `main()` function we have a for loop to loop through each light source, perform the light calculations for the current light source and add it to the fragment colour. Note the the $\texttt{normal}$ and $\texttt{eye}$ vectors are the same for all light sources so these are calculated outside of the for loop.

We also need to make changes to the `main.cpp` file. Add the `Light` data structure before the `main()` function declaration

```cpp
// Light structs
struct Light
{
    glm::vec3 position;
    glm::vec3 ambient;
    glm::vec3 diffuse;
    glm::vec3 specular;
    float constant, linear, quadratic;
};
```

Since we are using a different file for the fragment shader we need to tell OpenGL to use our new fragment shader which it compiles the shader program.

```cpp
// Compile shader programs
GLuint shaderID = LoadShaders("vertexShader.vert", "multipleLightsFragmentShader.frag");
```

We want to define the lighting properties for multiple lights sources so we are going to store our `Light` structures in a <a href="https://en.cppreference.com/w/cpp/container/vector" target="_blank">vector</a>. Where we defined the colour and position of the single light source, replace the code with the following.

```cpp
// Define light colours
glm::vec3 white = glm::vec3(1.0f, 1.0f, 1.0f);

// Create vector of Light structs
std::vector<Light> lights;

// Add first light source
Light light;
light.position = glm::vec3(2.0f, 2.0f, 2.0f);
light.ambient = ka * white;
light.diffuse = kd * white;
light.specular = ks * white;
light.constant = 1.0f;
light.linear = 0.1f;
light.quadratic = 0.02f;
lights.push_back(light);

// Add second light source
light.position = glm::vec3(1.0f, 1.0f, -8.0f);
light.ambient = ka * white;
light.diffuse = kd * white;
light.specular = ks * white;
light.constant = 1.0f;
light.linear = 0.1f;
light.quadratic = 0.02f;
lights.push_back(light);
```

This code creates two light sources, defines the values of the data structures and stores then in the vector `lights`. The `lights.push_back(light)` adds the current `light` to the end of the `lights` vector. Now we need to send the light and material values to the shader using uniforms, replace the existing code with the code below.

```cpp
// Send light source properties to the shader
glUniform1i(glGetUniformLocation(shaderID, "numLights"), static_cast<unsigned int>(lights.size()));
for (unsigned int i = 0; i < lights.size(); i++)
{
    std::string number = std::to_string(i);
    glm::vec3 viewSpaceLightPosition = glm::vec3(view * glm::vec4(lights[i].position, 1.0f));
    glUniform3fv(glGetUniformLocation(shaderID, ("lights[" + number + "].ambient").c_str()), 1, &lights[i].ambient[0]);
    glUniform3fv(glGetUniformLocation(shaderID, ("lights[" + number + "].diffuse").c_str()), 1, &lights[i].diffuse[0]);
    glUniform3fv(glGetUniformLocation(shaderID, ("lights[" + number + "].specular").c_str()), 1, &lights[i].specular[0]);
    glUniform3fv(glGetUniformLocation(shaderID, ("lights[" + number + "].position").c_str()), 1, &viewSpaceLightPosition[0]);
    glUniform1f(glGetUniformLocation(shaderID, ("lights[" + number + "].constant").c_str()), lights[i].constant);
    glUniform1f(glGetUniformLocation(shaderID, ("lights[" + number + "].linear").c_str()), lights[i].linear);
    glUniform1f(glGetUniformLocation(shaderID, ("lights[" + number + "].quadratic").c_str()), lights[i].quadratic);
}

// Send material (object) properties to the shader
glUniform1f(glGetUniformLocation(shaderID, "Ns"), 20.0f);
```

Here we simply loop through the `lights` vector and send the values for each individual light to the shader (unfortunately we can't send a vector of structs using a uniform, we could use <a href="https://www.khronos.org/opengl/wiki/Interface_Block_(GLSL)" target="_blank">GLSL interface blocks</a> but I wanted to keep things simple here).

Finally to draw each light source replace the code to draw the single one with the following.

```cpp
// Draw light sources
glUseProgram(lightShaderID);
for (unsigned int i = 0; i < lights.size(); i++)
{
    // Calculate model matrix
    glm::mat4 translate = glm::translate(glm::mat4(1.0f), lights[i].position);
    glm::mat4 scale = glm::scale(glm::mat4(1.0f), glm::vec3(0.2f));
    glm::mat4 model = translate * scale;
    
    // Send model, view, projection matrices and light colour to light shader
    glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "model"), 1, GL_FALSE, &model[0][0]);
    glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "view"), 1, GL_FALSE, &view[0][0]);
    glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "projection"), 1, GL_FALSE, &projection[0][0]);
    glUniform3fv(glGetUniformLocation(lightShaderID, "lightColour"), 1, &lights[i].specular[0]);
    
    // Draw light source
    sphere.draw(lightShaderID);
}    
```

Hopefully once you've made all of the changes it compiles and runs to show the following

```{figure} ../_images/08_teapot_multiple_lights.png
:width: 500
:name: multiple-lights-figure

Teapots lit using 2 light sources.
```

Use the keyboard and mouse to move the camera around the teapots to see the affects of the light sources.

## Spotlights

A spotlight is a light source that emits light along a specific direction vector so that only those objects that are within some distance of this vector are illuminated. These are useful for modelling light sources such as flashlights, street lights, car headlights etc.

```{figure} ../_images/08_spot_light.svg
:width: 300
:name: spot-light-figure

A spotlight only illuminates fragments close to the light $\tt direction$ vector.
```

Consider {numref}`spot-light-figure` that shows a spotlight located at $\tt position$ emitting light in the direction given by the $\tt direction$ vector. The $\tt light$ vector points from the light source position to the position of the fragment and the angle $\phi$ determines the spread of the light. If the angle $\theta$ between the $\tt light$ vector and the $\tt direction$ vector is less than $\phi$ then the fragment is illuminated by the spotlight.

To add spotlights to our scene we declare a data structure for a spotlight in the fragment shader and the `main.cpp` file. Add the following to the top of the `multipleLightsFragmentShader.frag` file.

```cpp
struct SpotLight
{
    vec3 position;
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float cosPhi;
    float linear, constant, quadratic;
};
```

We will be using uniforms very similar to that for our point light sources so add the following to the fragment shader.

```cpp
uniform SpotLight spotLights[maxLights];
uniform int numSpotLights;
```

We will be defining a function called `calculateSpotLight()` to calculate our spotlight but first we need to declare the function prototype before the `main()` function.

```cpp
vec3 calculateSpotLight(SpotLight spotLight, vec3 fragmentPosition, vec3 normal, vec3 eye);
```

The `calculateSpotLight()` function is below, copy and paste this after the `calculatePointLight()` function.

```cpp
// Calculate spotlight
vec3 calculateSpotLight(SpotLight spotLight, vec3 fragmentPosition, vec3 normal, vec3 eye)
{
    // Object colour
    vec3 objectColour = vec3(texture(diffuse1, UV));
    
    // Ambient reflection
    vec3 ambient = spotLight.ambient * objectColour;
    
    // Diffuse reflection
    vec3 light = normalize(spotLight.position - fragmentPosition);
    float cosTheta = max(dot(normal, light), 0);
    vec3 diffuse = spotLight.diffuse * objectColour * cosTheta;
    
    // Specular reflection
    vec3 reflection = -light + 2 * dot(light, normal) * normal;
    float cosAlpha = max(dot(eye, reflection), 0);
    vec3 specular = spotLight.specular * pow(cosAlpha, Ns);
    
    // Attenuation
    float distance = length(spotLight.position - fragmentPosition);
    float attenuation = 1.0 / (spotLight.constant + spotLight.linear * distance + spotLight.quadratic * distance * distance);
    
    // Spotlight intensity
    vec3 direction = normalize(spotLight.direction);
    cosTheta = dot(light, -direction);
    float intensity = 0.0;
    if (cosTheta > spotLight.cosPhi)
        intensity = 1.0;
    
    // Return fragment colour
    return ambient * attenuation + (diffuse + specular) * attenuation * intensity;
}
```

After calculating the ambient, diffuse and specular reflection and the attenuation in the same way as for the point light sources we have additional code to calculate $\cos(\theta)$ between the $\texttt{light}$ and $\texttt{direction}$ vectors. A float $\tt intensity$ is calculated so that its value is 1 if the fragment is within the boundary of the spotlight and 0 otherwise. The diffuse and specular components are then multiplied by $\tt intensity$ so they are turned on or off depending on the position of the fragment. The ambient component isn't multiplied by $\tt intensity$ so that we can still see the objects not illuminated by the spotlight.

In the `main()` function of the fragment shader add the following code to apply the spotlights as well as the point lights.

```cpp
// Loop through the spotlight sources
for (int i = 0; i < numSpotLights; i++)
{
    fragmentColour += calculateSpotLight(spotLights[i], fragmentPosition, normal, eye);
}
```

Now we need to define our spotlight source values in the `main.cpp` file which is done in a similar way to the point light sources. Declare a data structure called `SpotLight` by adding the following before the `main()` function

```cpp
struct SpotLight
{
    glm::vec3 position;
    glm::vec3 direction;
    glm::vec3 ambient;
    glm::vec3 diffuse;
    glm::vec3 specular;
    float cosPhi;
    float linear, constant, quadratic;
};
```

and after we defined our point light sources add the following code.

```cpp
// Create vector of SpotLight structs
std::vector<SpotLight> spotLights;

// Add spotlight
SpotLight spotLight;
spotLight.position = glm::vec3(0.0f, 3.0f, 0.0f);
spotLight.direction = glm::vec3(0.0f, -1.0f, 0.0f);
spotLight.ambient = ka * white;
spotLight.diffuse = kd * white;
spotLight.specular = ks * white;
spotLight.cosPhi = cos(glm::radians(45.0f));
spotLight.constant = 1.0f;
spotLight.linear = 0.1f;
spotLight.quadratic = 0.02f;
spotLights.push_back(spotLight);
```

Here we have defined a single spotlight with the same properties as our point lights the light spread angle of 45$^\circ$. Note that we are only going to use one spotlight for now but have the ability to add more if we want. The spotlights are sent to the shader in the same was as per the point lights.

```cpp
// Send spotlights to the shader
glUniform1i(glGetUniformLocation(shaderID, "numSpotLights"), static_cast<unsigned int>(spotLights.size()));
for (unsigned int i = 0; i < spotLights.size(); i++)
{
    std::string number = std::to_string(i);
    glm::vec3 viewSpaceSpotLightPosition = glm::vec3(view * glm::vec4(spotLights[i].position, 1.0f));
    glm::vec3 viewSpaceSpotLightDirection = glm::mat3(view) * spotLights[i].direction;
    glUniform3fv(glGetUniformLocation(shaderID, ("spotLights[" + number + "].position").c_str()), 1, &viewSpaceSpotLightPosition[0]);
    glUniform3fv(glGetUniformLocation(shaderID, ("spotLights[" + number + "].direction").c_str()), 1, &viewSpaceSpotLightDirection[0]);
    glUniform3fv(glGetUniformLocation(shaderID, ("spotLights[" + number + "].ambient").c_str()), 1, &spotLights[i].ambient[0]);
    glUniform3fv(glGetUniformLocation(shaderID, ("spotLights[" + number + "].diffuse").c_str()), 1, &spotLights[i].diffuse[0]);
    glUniform3fv(glGetUniformLocation(shaderID, ("spotLights[" + number + "].specular").c_str()), 1, &spotLights[i].specular[0]);
    glUniform1f(glGetUniformLocation(shaderID, ("spotLights[" + number + "].cosPhi").c_str()), spotLights[i].cosPhi);
    glUniform1f(glGetUniformLocation(shaderID, ("spotLights[" + number + "].constant").c_str()), spotLights[i].constant);
    glUniform1f(glGetUniformLocation(shaderID, ("spotLights[" + number + "].linear").c_str()), spotLights[i].linear);
    glUniform1f(glGetUniformLocation(shaderID, ("spotLights[" + number + "].quadratic").c_str()), spotLights[i].quadratic);
}
```

If we want to render the spotlight sources we replicate the code for the point lights.

```cpp
for (unsigned int i = 0; i < spotLights.size(); i++)
{
    // Calculate model matrix
    glm::mat4 translate = glm::translate(glm::mat4(1.0f), spotLights[i].position);
    glm::mat4 scale = glm::scale(glm::mat4(1.0f), glm::vec3(0.2f));
    glm::mat4 model = translate * scale;
    
    // Send model, view, projection matrices and light colour to light shader
    glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "model"), 1, GL_FALSE, &model[0][0]);
    glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "view"), 1, GL_FALSE, &view[0][0]);
    glUniformMatrix4fv(glGetUniformLocation(lightShaderID, "projection"), 1, GL_FALSE, &projection[0][0]);
    glUniform3fv(glGetUniformLocation(lightShaderID, "lightColour"), 1, &spotLights[i].specular[0]);
    
    // Draw light source
    sphere.draw(lightShaderID);
}
```

Comment out the code where we add the two point light sources so that they are not used. Fingers crossed everything compiles and runs ok and you are presented with the following.

```{figure} ../_images/08_teapot_spotlight_harsh.png
:width: 500
:name: spot-light-harsh-figure

Teapots lit using a spotlight.
```

Use the keyboard and mouse to move the camera around the teapots. You may notice that there is an abrupt cutoff between the region illuminated by the spotlight and the region in darkness. In the real world this doesn't usually happen as light on this edge gets softened by various effects. We can model this softening by dividing the difference between $\theta$ and $\phi$ by some small angle $\delta$ and limiting the values to between 0 and 1. The effect of this can be seen in {numref}`soft-edge-figure` where the intensity is 1 until $\phi - \delta$ where it reduces to 0 at $\phi$. So using this will gradually reduce the intensity are the edge of the illuminated region.

```{figure} ../_images/08_soft_edge.svg
:width: 500
:name: soft-edge-figure

Intensity value over a range of $\theta$.
```

Replace the `intensity` calculation with the following to soften the edge of the spotlight.

```cpp
float delta = radians(2.0);
float intensity = clamp((cosTheta - spotLight.cosPhi) / delta, 0.0, 1.0);
```

```{figure} ../_images/08_teapot_spotlight_soft.png
:width: 500
:name: spot-light-soft-figure

Teapots lit using a spotlight with softened edges.
```

## Directional light

The final light source type we will look at is **directional light**. When modelling a light source that is far away, for example the sun, the light rays are very close to being parallel. It does not matter where the object is in the view space as all objects are lit from the same direction.

```{figure} ../_images/08_directional_light.svg
:width: 400
:name: directional-light-figure

Directional lighting
```

The lighting calculations are the same as for the other light sources seen above with the exception that we do not need the light source position and we do not apply the attenuation. We will use another struct for the directional light source, add the following to the `multipleFragmentShader.frag` file

```cpp
struct DirLight
{
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
```

and import the corresponding uniform.

```cpp
uniform DirLight dirLight;
```

We are going to use a function to calculate the directional lighting first add the function prototype before the `main()` function

```cpp
vec3 calculateDirectionalLight(DirLight dirLight, vec3 normal, vec3 eye);
```

and then copy and paste the following code after the `calculateSpotLight()` function.

```cpp
// Calculate directional light
vec3 calculateDirectionalLight(DirLight dirLight, vec3 normal, vec3 eye)
{
    // Object colour
    vec3 objectColour = vec3(texture(diffuse1, UV));
    
    // Ambient reflection
    vec3 ambient = dirLight.ambient * objectColour;
    
    // Diffuse refection
    vec3 light = normalize(-dirLight.direction);
    float cosTheta = max(dot(normal, light), 0);
    vec3 diffuse = dirLight.diffuse * objectColour * cosTheta;
    
    // Specular reflection
    vec3 reflection = -light + 2 * dot(light, normal) * normal;
    float cosAlpha = max(dot(eye, reflection), 0);
    vec3 specular = dirLight.specular * pow(cosAlpha, Ns);
    
    // Return fragment colour
    return ambient + diffuse + specular;
}
```

Once we've defined the function to calculate the directional light we need to tell our `main()` function to use it and add the directional light colour to the fragment colour. Add the following code to after where we calculated the spotlight. 

```cpp
// Calculate the directional light
fragmentColour += calculateDirectionalLight(dirLight, normal, eye);
```

Now we need to define a directional light source in the `main.cpp` file and send to to the shader, define a data structure before the `main()` function

```cpp
struct DirLight
{
    glm::vec3 direction;
    glm::vec3 ambient;
    glm::vec3 diffuse;
    glm::vec3 specular;
};
```

and after we have defined the point light sources add the following code.

```cpp
// Define directional light
glm::vec3 yellow = glm::vec3(1.0f, 1.0f, 0.0f);
DirLight dirLight;
dirLight.direction = glm::vec3(1.0f, -1.0f, 0.0f);
dirLight.ambient = ka * yellow;
dirLight.diffuse = kd * yellow;
dirLight.specular = ks * yellow;
```

Here we define a directional light source with rays coming down from the top left as we look down the $z$-axis. Colour of the light source is yellow (i.e., equal red and green mixed with zero blue) and the ambient, diffuse and specular colours have been scaled similarly to the point light sources above. The directional light values are sent to the shader in the same was as per the point light sources (although we only have one of these). Note that the `direction` vector is defined in the world space so we need to multiply it by the `view` matrix before sending it to the shader.

```cpp
// Send directional light to the shader
glm::vec3 viewSpaceLightDirection = glm::mat3(view) * dirLight.direction;
glUniform3fv(glGetUniformLocation(shaderID, "dirLight.direction"), 1, &viewSpaceLightDirection[0]);
glUniform3fv(glGetUniformLocation(shaderID, "dirLight.ambient"), 1, &dirLight.ambient[0]);
glUniform3fv(glGetUniformLocation(shaderID, "dirLight.diffuse"), 1, &dirLight.diffuse[0]);
glUniform3fv(glGetUniformLocation(shaderID, "dirLight.specular"), 1, &dirLight.specular[0]);
```

Make these changes and run the code and you should see something similar to this.

```{figure} ../_images/08_teapot_directional_light.png
:width: 500
:name: teapot-directional-light-figure

Directional and point light sources.
```

Note that we can see that the teapots have been illuminated from a directional light source from the left hand side in addition to the two point light sources and the spotlight (you may need to uncomment code for the point light sources). Since the directional light source colour was yellow our blue teapots take on a slightly green appearance.

---
## Exercises

1. Experiment with the positions, colours and material properties of the various light sources to see what effects they have.

2. Use a spotlight to model a flashlight controlled by the user such that the light is positioned at `camera.position`, is pointing in the same direction as `camera.direction` and has a spread of $\phi = 20^\circ$. Turn off all other light sources (either by commenting out code or setting the colours to zero) for extra spookiness.
   
<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_exercise_2.mp4" type="video/mp4">
</video>
</center>

3. Change the colour of the second point light source to magenta and rotate its position in a circle centred at (0,0,-5) with radius 5. Turn off any spotlights and directional lighting. Hint: the co-ordinates of points on a circle can be calculated using $(x, y, z) = (0,0,-5) + 5 * (\cos({\tt time}), 0, \sin(\tt time))$.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_exercise_3.mp4" type="video/mp4">
</video>
</center>

4. The planet Narkov has a red sun and a single day lasts for just 5 of our seconds. Use directional lighting to model the illumination of the sun as it passes through the sky and also beneath the horizon (fortunately Narkovians like tea so using our teapots would not seem unusual). The background colour can also be changed to match the colour of the light source.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_exercise_4.mp4" type="video/mp4">
</video>
</center>

--- 
## Source code

The source code for this lab, including the exercise solutions, can be downloaded using the links below.

- [Lab10_single_light.cpp](../code/Lab10_Lighting/Lab10_single_light.cpp)
- [vertexShader.vert](../code/Lab10_Lighting/vertexShader.vert)
- [fragmentShader.frag](../code/Lab10_Lighting/fragmentShader.frag)
- [main.cpp](../code/Lab10_Lighting/main.cpp) - multiple point light sources and directional light
- [multipleLightsFragmentShader.frag](../code/Lab10_Lighting/multipleLightsFragmentShader.frag)
- [Lab10_Exercises.cpp](../code/Lab10_Lighting/Lab10_Exercises.cpp) - solutions to the exercises

---
(blender-section)=
## Creating an .obj file in Blender

To create an .obj file we can use the popular open source application <a href="https://www.blender.org" target="_blank">Blender</a> (this is installed on the machines in the Dalton building).

1. Create your object in blender and sort out the material textures, UV co-ordinates etc. (lots of tutorials on youtube to help you with this). Or you can import a model produced by someone else (be sure to give credit if doing this).
   
2. Click on **File > Export > Wavefront (.obj)**

```{figure} ../_images/08_blender_export_obj_1.png
:width: 600
```

3. Make sure **Include Normals**, **Include UVs** and **Triangular Faces** are selected.


```{figure} ../_images/08_blender_export_obj_2.png
:width: 600
```

4. Navigate to your chosen folder e.g., `Lab10_Lighting/objects/`, and give it an appropriate name.

```{note}
The Model class that we are using here is very simple and will only work with simple models. 
```

---

## Video walkthrough

The video below walks you through these lab materials.

<iframe width="560" height="315" src="https://www.youtube.com/embed/v9e_557Wl_U?si=6fLfaMWJL5s3P5Qs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>