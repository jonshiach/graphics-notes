(normal-mapping-section)=

# Normal Mapping

In [Lab 8 on lighting](lighting-section) we saw that the diffuse and specular reflection models used the normal vector to determine the fragment colour. The vertex shader was used to interpolate the normal vectors for each fragment based on the normal vectors at the vertices of a triangle. This works well for smooth objects, but for objects with a rough or patterned surface we don't get the benefits of highlights and shadow. **Normal mapping** is technique that uses a [texture map](textures-section) to define the normal vectors for each fragment so that when a lighting model is applied it gives the appearance of a non-flat surface.

```{figure} ../_images/09_normal_mapping.svg
:width: 600

Normal mapping applies a texture of normals for each fragment giving the appearance of a non-flat surface.
```

A **normal map** is a texture where the RGB colour values of each textel is used for the x, y and z values of a normal vector ({numref}`normal-map-figure`). Since the OpenGL co-ordinate system has the z axis pointing out from the screen the colour of a normal map is mainly blue.

```{figure} ../_images/09_normal_map.svg
:width: 300
:name: normal-map-figure

The RBG values of a normal map give the values of the normal vectors.
```

Download and build the project files for this lab.

Compile and run the project and you will see that we have the scene used at the end of [Lab 9 Lighting](lighting-section) with the teapots lit using a point light, a spotlight and a directional light.

```{figure} ../_images/09_teapots.png
:width: 500
```

A Light class has been created to handle the light sources. Take a look at the `light.hpp` and `light.cpp` files and you will see the following Light class methods

- `addPointLight()`, `addSpotLight()`, `addDirLight()` - these are used to add another light source to the scene
- `toShader()` - sends all of the lighting uniforms to the shader
- `draw()` - draws the light source
- `reorder()` - a private member function that reorders the `lights` vector so that all the point light sources come first, followed by the spotlight sources and then the directional light sources. This means we can avoid if statements in our shader files (this slows down the shaders significantly).

---
## Tangent space

We have already seen in [Lab 6 3D worlds](3D-worlds-section) that we can use transformations to map co-ordinates and vectors between the model, view and screen spaces. To apply normal mapping we need to perform our lighting calculations in a new space called the **tangent space**. The tangent space is a 3D space where vectors are defined in terms of three vectors: **tangent**, **bitangent** and **normal** vectors ({numref}`bitangent-vector-figure`).

```{figure} ../_images/09_bitangent.svg
:name: bitangent-vector-figure
:width: 300

Normal, tangent and the bitangent vectors.
```

- **Normal vector** - we have already met the normal vector which is a vector perpendicular to the surface
- **Tangent vector** - this is a vector that points along the surface so is perpendicular to the normal vector
- **Bitangent vector** - this is a vector that is perpendicular to both the normal and tangent vectors

There are an infinite number of vectors on a plane that is perpendicular to the normal vector so we have a choice for the tangent and bitangent vectors. A natural choice is to use vectors that point along the edges of the normal map, we know these are perpendicular and this also means we are consistent for neighbouring triangles.

```{figure} ../_images/09_TBN.svg
:width: 300
:name: TBN-figure

The tangent space is defined by the tangent, bitangent and normal vectors.
```

The tangent and bitangent vectors are calculated using the model space vertex co-ordinates of the triangle $\mathsf{(x_0,y_0,z_0)}$, $\mathsf{(x_1,y_1,z_1)}$ and $\mathsf{(x_2,y_2,z_2)}$ and their corresponding texture co-ordinates $\mathsf{(u_0,v_0)}$, $\mathsf{(u_1,v_1)}$ and $\mathsf{(u_2,v_2)}$. 

```{figure} ../_images/09_UV_deltas.svg
:width: 700
:name: UV-deltas-figure

The tangent, $\mathsf{T}$, and bitangent, $\mathsf{B}$, vectors are calculated by mapping the model space triangle onto the normal map space.
```

We first calculate vectors that point along two sides of the triangle in the model space

$$ \begin{align*}
    \mathsf{E}_1 &= \mathsf{(x_1, y_1, z_1) - (x_0, y_0, z_0),} \\
    \mathsf{E}_2 &= \mathsf{(x_2, y_2, z_2) - (x_1, y_1, z_1),}
\end{align*}$$

and calculate the difference in the $\mathsf{(u,v)}$ co-ordinates for these edges

$$ \begin{align*}
    \mathsf{\Delta u_1} &= \mathsf{u_1 - u_0}, \\
    \mathsf{\Delta v_1} &= \mathsf{v_1 - v_0}, \\
    \mathsf{\Delta u_2} &= \mathsf{u_2 - u_1}, \\
    \mathsf{\Delta v_2} &= \mathsf{v_2 - v_1}.
\end{align*} $$

The tangent, $\mathsf{T}$, and bitangent, $\mathsf{B}$, vectors can then be calculated using

$$ \begin{align*}
    \mathsf{T} &= \frac{1}{\mathsf{\Delta u_1\Delta v_2 - \Delta u_2\Delta v_1}}(\mathsf{\Delta v_2 \cdot E_1 - \Delta v_1 \cdot E_2}), \\
    \mathsf{B} &= \frac{1}{\mathsf{\Delta u_1\Delta v_2 - \Delta u_2\Delta v_1}}(\mathsf{\Delta u_1 \cdot E_2 - \Delta u_2 \cdot E_1}).
\end{align*} $$(TB-equation)

To see the derivation of these equations click on the dropdown below.

````{dropdown} Calculating the tangent and bitangent vectors

Consider {numref}`UV-deltas-figure` where a triangle is mapped onto the normal map using texture co-ordinates $\mathsf{(u_0,v_0)}$, $\mathsf{(u_1,v_1)}$ and $\mathsf{(u_2,v_2)}$. If the vectors $\mathsf{T}$ and $\mathsf{B}$ point in the co-ordinate directions of the normal map then the tangle space positions along the triangle edges $\mathsf{E_1}$ and $\mathsf{E_2}$ can be calculated using

$$\begin{align*}
    \mathsf{E_1} &= \mathsf{\Delta u_1 \cdot T + \Delta v_1 \cdot B}, \\
    \mathsf{E_2} &= \mathsf{\Delta u_2 \cdot T + \Delta v_2 \cdot B},
\end{align*}$$

where $\mathsf{\Delta u_1 = u_1 - u_0}$, $\mathsf{\Delta v_1 = v_1 - v_0}$, $\mathsf{\Delta u_2 = u_2 - u_1}$ and $\mathsf{\Delta v_2 = v_2 - v_1}$. We can express this using matrices

$$ \begin{align*}
    \begin{pmatrix} \mathsf{E_1} \\ \mathsf{E_2} \end{pmatrix} &=
    \begin{pmatrix}
        \mathsf{\Delta u_1} & \mathsf{\Delta v_1} \\
        \mathsf{\Delta u_2} & \mathsf{\Delta v_2}
    \end{pmatrix}
  \begin{pmatrix} \mathsf{T} \\ \mathsf{B} \end{pmatrix}.
\end{align*} $$

We want to calculate $\mathsf{T}$ and $\mathsf{B}$ and we know the values of $\mathsf{E_1}$, $\mathsf{E_2}$, $\mathsf{\Delta u_1}$, $\mathsf{\Delta v_1}$, $\mathsf{\Delta u_2}$ and $\mathsf{\Delta v_2}$. Using the [inverse](inverse-matrix-section) of the square matrix we can rewrite this equation as

$$ \begin{align*}
    \begin{pmatrix} \mathsf{T} \\ \mathsf{B} \end{pmatrix} &=
    \begin{pmatrix}
        \mathsf{\Delta u_1} & \mathsf{\Delta v_1} \\
        \mathsf{\Delta u_2} & \mathsf{\Delta v_2}
    \end{pmatrix}^{-1}
    \begin{pmatrix} \mathsf{E_1} \\ \mathsf{E_2} \end{pmatrix} \\
    &= 
    \frac{1}{\mathsf{\Delta u_1\Delta v_2 - \Delta u_2\Delta v_1}}
    \begin{pmatrix}
        \mathsf{\Delta v_2} & \mathsf{-\Delta v_1} \\
        \mathsf{-\Delta u_2} & \mathsf{\Delta u_1}
    \end{pmatrix}
    \begin{pmatrix} \mathsf{E_1} \\ \mathsf{E_2} \end{pmatrix}.
\end{align*} $$

Writing the out for the $\mathsf{T}$ and $\mathsf{B}$ vectors we have

$$ \begin{align*}
    \mathsf{T} &= \frac{1}{\mathsf{\Delta u_1\Delta v_2 - \Delta u_2\Delta v_1}}(\mathsf{\Delta v_2 \cdot E_1 - \Delta v_1 \cdot E_2}), \\
    \mathsf{B} &= \frac{1}{\mathsf{\Delta u_1\Delta v_2 - \Delta u_2\Delta v_1}}(\mathsf{\Delta u_1 \cdot E_2 - \Delta u_2 \cdot E_1}).
\end{align*} $$
````

Once we have the tangent, bitangent and normal vectors we can form a matrix that transforms from the tangent space to an arbitrary space (e.g., the view space). The matrix that achieves this a 3 $\times$ 3 matrix known as the **TBN matrix** (we don't need a 4 $\times$ 4 matrix since we don't need to perform a translation)

$$ \begin{align*}
    \textsf{TBN} &= 
    \begin{pmatrix}
        \mathsf{T_x} & \mathsf{B_x} & \mathsf{N_x} \\
        \mathsf{T_y} & \mathsf{B_y} & \mathsf{N_y} \\
        \mathsf{T_z} & \mathsf{B_z} & \mathsf{N_z}
    \end{pmatrix}.
\end{align*} $$

However, we will be performing our lighting calculations in the tangent space so we want to transform from the view space to the tangent space. To do this we calculate the [inverse](inverse-matrix-section) of the TBN matrix. Fortunately this is an orthogonal matrix where the inverse is simply the transpose, i.e., $\mathsf{(TBN)^{-1}} = \mathsf{(TBN)^{T}}$, which is an easy calculation.

### Calculating the tangent and bitangent vectors

All of the lighting calculations are performed by the shaders so we calculate the tangent and bitangent vectors in our C++ program and pass them to the vertex shader using uniforms. The model class contains all of the attributes for a model so we create two vectors that will contain the tangents and bitangents for each of the vertices of the model. In `model.hpp` add the following code after we have declared a vector array for the normals.

```cpp
std::vector<glm::vec3> tangents;
std::vector<glm::vec3> bitangents;
```

We are going to send the tangents and bitangents to the GPU using vertex buffers in the same way as we did for the vertices, texture co-ordinates and normal vectors. In `model.hpp` under the `private:` declaration add the identifiers for the tangent and bitangent buffers.

```cpp
GLuint tangentBuffer;
GLuint bitangentBuffer;
```

We now create a private method for our model class to calculate the tangent and bitangent vectors. Add the following method declaration.

```cpp
 // Calculate tangents and bitangents
 void calculateTangents();
 ```

Then in the `model.cpp` we define the `calculateTangents()` method.

```
void Model::calculateTangents()
{
    for (unsigned int i = 0; i < vertices.size(); i += 3)
    {
        // Calculate edge vectors and deltas
        glm::vec3 E1 = vertices[i+1] - vertices[i];
        glm::vec3 E2 = vertices[i+2] - vertices[i+1];
        float deltaU1 = uvs[i+1].x - uvs[i].x;
        float deltaV1 = uvs[i+1].y - uvs[i].y;
        float deltaU2 = uvs[i+2].x - uvs[i+1].x;
        float deltaV2 = uvs[i+2].y - uvs[i+1].y;
        
        // Calculate tangents
        float fact = 1.0f / (deltaU1 * deltaV2 - deltaU2 * deltaV1);
        glm::vec3 tangent = fact * (deltaV2 * E1 - deltaV1 * E2);
        glm::vec3 bitangent = fact * (deltaU1 * E2 - deltaU2 * E1);
        
        // Set the same tangents for the three vertices of the triangle
        tangents.push_back(tangent);
        tangents.push_back(tangent);
        tangents.push_back(tangent);
        bitangents.push_back(bitangent);
        bitangents.push_back(bitangent);
        bitangents.push_back(bitangent);
    }
}
```

This code calculates the tangent and bitangent vectors using equation {eq}`TB-equation` and adds them the `tangents` and `bitangents` lists. We want these to be calculated whenever we create a model so amend the Model class constructor so add the following above `setupBuffers()`.

```cpp 
// Calculate tangent and bitangent vectors
calculateTangents();
```

The last addition we need to make to the Model class is to setup the buffers for the tangent and bitangent and copy these across to the GPU. In `model.cpp` add the following to the `setupBuffers()` method (before we unbind the VAO).

```cpp
// Create tangent buffer
GLuint tangentBuffer;
glGenBuffers(1, &tangentBuffer);
glBindBuffer(GL_ARRAY_BUFFER, tangentBuffer);
glBufferData(GL_ARRAY_BUFFER, tangents.size() * sizeof(glm::vec3), &tangents[0], GL_STATIC_DRAW);

// Create bitangent buffer
GLuint bitangentBuffer;
glGenBuffers(1, &bitangentBuffer);
glBindBuffer(GL_ARRAY_BUFFER, bitangentBuffer);
glBufferData(GL_ARRAY_BUFFER, bitangents.size() * sizeof(glm::vec3), &bitangents[0], GL_STATIC_DRAW);

// Bind the tangent buffer
glEnableVertexAttribArray(3);
glBindBuffer(GL_ARRAY_BUFFER, tangentBuffer);
glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 0, (void*)0);

// Bind the bitangent buffer
glEnableVertexAttribArray(4);
glBindBuffer(GL_ARRAY_BUFFER, bitangentBuffer);
glVertexAttribPointer(4, 3, GL_FLOAT, GL_FALSE, 0, (void*)0);
```

These are essentially the same as what we've done previously for the vertices, texture co-ordinates and normal vectors. Note that the tangent and bitangent buffers are bound to attributes 3 and 4 respectively.

---
## Shaders

### Vertex shader

In the vertex shader we need to calculate the tangent space fragment position, light position and light direction. We could do this in the fragment shader but since that is called for each fragment in the triangle and the vertex shader is just called 3 times per triangle it is much more efficient to do it in the vertex shader. Create a new shader file called `normalMapVertexShader.vert` in the `source/` folder and copy in the code from the `vertexShader.vert` file.

The first change we need to make to the vertex shader is to declare the new tangent and bitangent inputs. The `createBuffers()` model class bound these to attributes 3 and 4 respectively so edit your file so it looks like the following.

```cpp
// Input vertex data
layout(location = 0) in vec3 position;
layout(location = 1) in vec2 texCoord;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec3 tangent;
layout(location = 4) in vec3 bitangent;
```

We need to transform the fragment position, light position and direction vector to the tangent space and to do so we calculate the TBN matrix. After the (u,v) co-ordinates have been outputted add the following code.

```cpp
// Calculate the TBN matrix that transforms view space to tangent space
mat3 normalMatrix = transpose(inverse(mat3(view * model)));
vec3 T = normalize(normalMatrix * tangent);
vec3 B = normalize(normalMatrix * bitangent);
vec3 N = normalize(normalMatrix * normal);
mat3 TBN = transpose(mat3(T, B, N));
```

Here we transform the tangent, bitangent and normal vectors to the view space using the matrix from equation {eq}`view-space-normal-equation` which are then used to calculate the TBN matrix. Remember that by transposing the TBN matrix we are calculating its inverse so here the TBN matrix will transform from the view space to the tangent space.

```{note}
Some people transform the vectors to the world space instead of the view space, however, this means that we need to also calculate the tangent space position of the camera for the eye vector calculation in the fragment shader. Doing this would mean we have additional uniforms and vector calculations. Since the camera position in the view space is (0,0,0) then it is also (0,0,0) in the tangent space so by transforming the vectors to the view space we don't need to worry about this.
```

All that remains for us to do to the vertex shader is to calculate the tangent space fragment position, light position and direction vector using the TBN matrix. Replace the code used to calculate the view space vectors with the following code.

```cpp
// Output tangent space fragment position
fragmentPosition = TBN * vec3(view * model * vec4(position, 1.0));

// Output tangent space light positions and directions
for (int i = 0; i < numPoint + numSpot + numDir; i++)
{
    lightPositions[i] = TBN * vec3(view * vec4(lights[i].position, 1.0));
    lightDirections[i] = TBN * vec3(view * vec4(lights[i].direction, 0.0));
}
```

### Fragment shader

Now that we have transformed the vectors to the tangent space in the vertex shader we need to make a few changes to the fragment shader. The beauty of the tangent space is that it is orthogonal (T, B and N vectors are at right angles) so we don't need to change any of our lighting calculations. This means we only need to make two changes to the fragment shader. Create a new shader file called `normalMapFragmentShader.frag` in the `source/` folder and copy in the contents of the `fragmentShader.frag` file.

We have an addition texture for the normal map so we use a sampler uniform to send this to the shader. Add the following where we declared the diffuse map uniform.

```cpp
uniform sampler2D normalMap;
```

Within the main function we obtain the normal vector from the normal map. Since the values in a texture are between 0 and 1 and we need the values of a normal vector to be between -1 and 1 we scale using the following

$$ \mathsf{normal} = \mathsf{normalise}(2 * \textsf{textel colour} - 1). $$

So change the `normal` calculation to the following.

```cpp
// Get the normal vector from the normal map
vec3 normal = normalize(2.0 * texture(normalMap, UV).rgb - 1.0);
```

We only have a couple of things we need to add to the `main.cpp` file. First tell the shader program we want to use our new vertex and fragment shaders.

```cpp
GLuint shaderID = LoadShaders("normalMapVertexShader.vert", "normalMapFragmentShader.frag");
```

Then add the normal map texture to the `teapot` object.

```cpp
// Add textures to teapot object
teapot.addTexture("../objects/blue_diffuse.bmp", "diffuse");
teapot.addTexture("../objects/diamond_normal.png", "normal");
```

Compile and run the program and you should see the following.

```{figure} ../_images/09_normal_map.png
:width: 500
:name: 09-normal-map-figure

Normal map applied to teapot objects.
```

The surfaces of the teapots which are smooth now have the appearance of bumpy diamond plate simply by getting the normal vectors from a texture and performing the lighting calculations in the tangent space. {numref}`09-normal-map-closeup-figure` shows a closeup of the surface so we can see the detail.

```{figure} ../_images/09_normal_map_closeup.png
:width: 500
:name: 09-normal-map-closeup-figure

Close up of the normal map applied to teapot objects.
```

---
## Re-orthogonalising the tangent space vectors

In the close up view of the normal mapped teapot in {numref}`09-normal-map-closeup-figure` we can see a distinct line in the specular highlights where polygons that form the surface of the teapot join. The reason for this is that the tangent vector is not exactly perpendicular to the normal vector.

When a vertex is shared by multiple triangles the 3D modelling software (e.g., Blender) calculates a single normal vector for the vertex by averaging of the normal vectors for the triangles ({numref}`averaged-normal-figure`). This saves memory and ensures that there is a smooth transition between the normal vectors across the surface. 

```{figure} ../_images/09_averaged_normal.svg
:width: 350
:name: averaged-normal-figure

The vertex normal is the average of the normal of the triangles sharing that vertex. 
```

A problem with this is that when using a normal map we assume that the vertex normals are perpendicular to the triangle we are rendering. Since this is not the case so calculating the tangents and bitangents using equation {eq}`TB-equation` will not give an orthogonal set of vectors. We can get around this problem by **re-orthogonalising** the three vectors by adjusting the tangent vector a bit so that it is orthongonal to the normal vector.

```{figure} ../_images/09_reorthogonalise_T.svg
:width: 300
:name: reorthogonalise-T-figure

Re-orthogonalising T using the Gram-Schmidt process.
```

Consider {numref}`reorthogonalise-T-figure` where the tangent vector T is non-orthogonal to the normal vector N. If N and T are unit vectors then if we subtract $\mathsf{(T \cdot N)N}$ from T then this creates a vector that is orthogonal to N (this is known as the <a href="https://en.wikipedia.org/wiki/Gram–Schmidt_process" target="_blank">Gram-Schmidt process</a>). We can use the cross product between N and T to calculate the bitangent vector B.

Edit the vertex shader so that we re-orthogonalise T and B

```cpp
// Calculate the TBN matrix that transforms view space to tangent space
mat3 normalMatrix = transpose(inverse(mat3(view * model)));
vec3 T = normalize(normalMatrix * tangent);
vec3 N = normalize(normalMatrix * normal);
T = normalize(T - dot(T, N) * N);
vec3 B = cross(N, T);
mat3 TBN = transpose(mat3(T, B, N));
```

You may notice that here we have calculated the bitangent in the vertex shader using normal and tangent vectors without needed to access the bitangent buffer. To save on memory you could remove the `bitangents` buffer from the Model class since we don't need these anymore.


```{figure} ../_images/09_normal_map_orthogonalised.png
:width: 500
:name: 09-normal-map-orthogonalised-figure

A normal map with orthogonalised tangent and bitangent vectors.
```

If you are having difficulty getting to this stage check out the source code files [Lab08_Normal_maps](../code/Lab08_Normal_maps/Lab08_Normal_maps.cpp) and the shader files [normalMapVertexShader.vert](../code/Lab08_Normal_maps/normalMapVertexShader.vert) and [normalMapFragmentShader.frag](../code/Lab08_Normal_maps/normalMapFragmentShader.frag).

---
## Specular maps

In addition to diffuse (texture) and normal maps we can also apply a **specular map** which can be used to control the specular highlights across a surface. Lets say we want to add a stone floor to our scene. We can add a horizontal polygon object for the floor and use a texture map {numref}`stones-diffuse-map-figure` to give the impression of stones and a normal map {numref}`stones-normal-map-figure` so that the stones are lit by the light sources.

`````{grid}

````{grid-item}
```{figure} ../_images/09_stones_diffuse.png
:name: stones-diffuse-map-figure

Diffuse map
```
````

````{grid-item}
```{figure} ../_images/09_stones_normal.png
:name: stones-normal-map-figure

Normal map
```
````

````{grid-item}
```{figure} ../_images/09_stones_specular.png
:name: stones-specular-map-figure

Specular map
```
````
`````

To apply our stone floor we are going to have a different object than our old friend the teapot. We will also want to add multiple different objects in the future so it we are going to use a data structure to contain the world space position, rotation and scaling of our objects and then store this in a vector. Add the following code to the `main.cpp` file before the `main()` function.

```cpp
// Data structures
struct Object
{
    glm::vec3 position = glm::vec3(0.0f, 0.0f, 0.0f);
    glm::vec3 rotation = glm::vec3(0.0f, 1.0f, 0.0f);
    glm::vec3 scale = glm::vec3(1.0f, 1.0f, 1.0f);
    float angle = 0.0f;
    float ka = 0.2f;
    float kd = 0.7f;
    float ks = 1.0f;
    float Ns = 20.0f;
    std::string name;
};
```

When we create an `Object` data structure the objects will have a default position at (0,0,0), the rotation and scale are unchanged and the object lighting properties are the same as what we have using so far (we can change these later if we want). Load the `floor` model and give it diffuse and normal textures where we load the `teapot` and `lightModel` models.

```cpp
// Load models
Model teapot("../objects/teapot.obj");
Model lightModel("../objects/sphere.obj");
Model floor("../objects/flat_plane.obj");
    
// Add textures to models
teapot.addTexture("../objects/blue_diffuse.bmp", "diffuse");
teapot.addTexture("../objects/diamond_normal.png", "normal");
floor.addTexture("../objects/stones_diffuse.png", "diffuse");
floor.addTexture("../objects/stones_normal.png", "normal");
```

We are going to create a vector to contain the different objects. Add the following code after we have added the textures to the models.

```cpp
// Define objects
std::vector<Object> objects;
Object object;
object.name = "teapot";
objects.push_back(object);

object.name = "floor";
object.position = glm::vec3(0.0f, -0.85f, 0.0f);
objects.push_back(object);
```

Here we have created a `teapot` object with default position, rotation and scaling and a `floor` object positioned at (0, -0.85, 0) and have added both objects to the `objects` vector. Now all we need to do is loop through the `objects` vector, calculate the `model` matrix for each object, send it to the shader and draw the model. Replace the previous code used to draw the multiple teapots with the following.

```cpp
// Loop through objects
for (unsigned int i = 0; i < objects.size(); i++)
{
    // Calculate model matrix
    glm::mat4 translate = glm::translate(glm::mat4(1.0f), objects[i].position);
    glm::mat4 scale = glm::scale(glm::mat4(1.0f), objects[i].scale);
    glm::mat4 rotate = glm::rotate(glm::mat4(1.0f), objects[i].angle, objects[i].rotation);
    glm::mat4 model = translate * rotate * scale;
    
    // Send the model matrix to the shader
    glUniformMatrix4fv(glGetUniformLocation(shaderID, "model"), 1, GL_FALSE, &model[0][0]);
    
    // Send material properties to the shader
    glUniform1f(glGetUniformLocation(shaderID, "ka"), objects[i].ka);
    glUniform1f(glGetUniformLocation(shaderID, "kd"), objects[i].kd);
    glUniform1f(glGetUniformLocation(shaderID, "ks"), objects[i].ks);
    glUniform1f(glGetUniformLocation(shaderID, "Ns"), objects[i].Ns);
    
    // Draw the model
    if (objects[i].name == "teapot")
        teapot.draw(shaderID);
    if (objects[i].name == "floor")
        floor.draw(shaderID);
}
```

Compile and run the program and you should see a scene resembling the following.

```{figure} ../_images/09_floor_no_specular.png
:width: 500
:name: stone-floor-no-specular-figure

Stone floor with no specular map applied.
```

Move the camera around the floor and note how the mortar between the stones have specular highlights (an example of this can be seen in the bottom left-hand corner of {numref}`stone-floor-no-specular-figure`). This isn't very realistic as in real life mortar is rough and does not appear shiny. To overcome this we can apply a specular map to switch off the specular highlights for certain fragments.

To apply the specular map we added to the `floor` object we first need to add a specular map to the `floor` model. Where we added the diffuse and normal maps add a specular map using the following code

```cpp
floor.addTexture("../objects/stones_specular.png", "specular");
```

We now need to make minor changes to the fragment shader. First, declare a sampler uniform for the specular map near to where we did the same for the diffuse and normal maps.

```cpp
uniform sampler2D specularMap;
```

Then, whenever we calculate the specular lighting in the `calculatePointLight()`, `calculateSpotlight()` and `calculateDirectionalLight()` functions multiply by the colour of the textel from the specular map.

```cpp
vec3 specular = ks * light.colour * pow(cosAlpha, Ns) * texture(specularMap, UV).rgb;
```

Compile and run the program and now you will notice that the mortar between the stones no longer have specular highlights.

```{figure} ../_images/09_floor_specular.png
:width: 500
:name: stone-floor-specular-figure

Stone floor with specular map applied.
```

### Neutral maps

We may not always want to apply a normal map or specular map to an object. Rather than writing a fragment shader for each case we can apply **neutral maps** which is a texture that when normal and specular mapping is applied it has no affect. Since the normal vector is calculated using

$$ \mathsf{normal} = \mathsf{normalise}(2.0 * \textsf{textel colour} - 1.0), $$

then if the normal maps has pixels with the RGB colour code (0.5, 0.5, 1) then all fragments will have a normal vector of (0, 0, 1) which is perpendicular to the surface.

A neutral specular map is simply a texture with all white pixels that have the RGB colour code (1, 1, 1) so multiplying this by the specular colour has no affect.

The neutral maps for normal and specular mapping are contained in the `neutral_normal.png` and `neutral_specular.png` files in the `objects/` folder and are applied to a model when it is created. When we use the `addTexture()` Model class method the neutral maps are replaced.

---
## Exercises

1. Add another object using the .obj model `../objects/wall.obj` to your scene and position it at (0, 4, -2), scale it up by a factor of 5 in the x and z directions and rotate it 90$^\circ$ about the x axis. Apply the diffuse map `../objects/bricks_diffuse.png`.

```{figure} ../_images/09_ex1.png
:width: 500
```

2. Apply the normal map `../objects/bricks_normal.png` to the wall object.

```{figure} ../_images/09_ex2.png
:width: 500
```

3. Apply the specular map `../objects/bricks_specular.png` to the wall object.

```{figure} ../_images/09_ex3.png
:width: 500
```

--- 
## Source code

The source code for this lab, including the exercise solutions, can be downloaded using the links below.

- [Lab08_Normal_maps.cpp](../code/Lab08_Normal_maps/Lab08_Normal_maps.cpp) - normal map applied to a single teapot object
- [normalMapVertexShader.vert](../code/Lab08_Normal_maps/normalMapVertexShader.vert)
- [normalMapFragmentShader.vert](../code/Lab08_Normal_maps/normalMapFragmentShader.frag)
- [main.cpp](../code/Lab08_Normal_maps/main.cpp) - solutions to the exercises

---
## Video walkthrough

The video below walks you through these lab materials.

<iframe width="560" height="315" src="https://www.youtube.com/embed/TVsZjf1Gwu4?si=ezQkt9g-UwzWfnxM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>