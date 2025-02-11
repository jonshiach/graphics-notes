(textures-section)=

# Textures

Texture mapping is a technique for applying a 2D image known as a **texture** onto a 3D surface. Applying a texture adds detail and complexity to the appearance of 3D objects without the need for modelling intricate geometry.

```{figure} ../_images/03_texture_mapping.svg
:width: 600

Mapping a texture to a polygon.
```

The texture is a 2D image where each pixel within the texture, known as a **textel**, is referenced using the **texture coordinates** given as $(u,v)$ where $u$ and $v$ are in the range 0 to 1, i.e., $(0,0)$ corresponds to the textel in the bottom-left corner and $(1,1)$ corresponds to the textel in the top-right corner. When a fragment is created by the shader the corresponding texture coordinates are calculated and the sample colour of the textel is used for the fragment. Fortunately we do not need to write a texture mapper functions since these are in OpenGL.

---

## Texture triangle

Compile and run the **Lab03_Textures** project, and you should be presented with the image of the red triangle from [2. Basic Shapes in OpenGL](basic-shapes-section) shown in {numref}`red-triangle-figure2`

```{figure} ../_images/03_red_triangle.png
:width: 500
:name: red-triangle-figure2

The red triangle from [2. Basic Shapes in OpenGL](basic-shapes-section).
```

We will apply a texture to this triangle.

### Creating a texture

The first thing we need to do is create a texture object and bind it to a target, so we can call upon it later. Enter the following code to the **Lab03_Textures.cpp** file after we tell OpenGL to compile the shader program

```cpp
// Create and bind texture
unsigned int texture;
glGenTextures(1, &texture);
glBindTexture(GL_TEXTURE_2D, texture);
```

Here we have defined a target called `texture` which is an integer used to refer to the texture. The texture is then generated and bound to this target using the `glGenTextures()` and `glBindTexture()` functions.

We now need to load an image into our texture. To do this we are going to make use of the <a href="https://github.com/nothings/stb/tree/master" target="_blank">stb_image</a> library, the header file for which can be found in the **common/** folder. Enter the following code into your program.

```cpp
// Load texture image from file
const char *path = "../assets/crate.jpg";
int width, height, nChannels;
stbi_set_flip_vertically_on_load(true);
unsigned char *data = stbi_load(path, &width, &height, &nChannels, 0);

if (data)
    std::cout << "Texture loaded." << std::endl;
else
    std::cout << "Texture not loaded. Check the path." << std::endl;
```

The functions used here are:

- `stbi_set_flip_vertically_on_load()` flips the image vertically since the $(0,0)$ coordinate on an image is the top-left corner and OpenGL expects it to be the bottom-right corner
- `stbi_load()` loads the image specified in the `path` string into the `data` variable and the stores the width, height and number of colour channels into the appropriate variables 

The texture we are using here is **crate.jpg** which is stored in the **assets/** folder and represents a side of a wooden crate.

```{figure} ../_images/03_crate.jpg
:width: 300

The crate texture.
```

After getting the texture data from the image file we tell OpenGL we that have a texture. Enter the following code into your program.

```cpp
// Specify 2D texture
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
glGenerateMipmap(GL_TEXTURE_2D);
```

The `glTexImage2D()` function tells OpenGL we have a 2D texture which is contained in `data`. `GL_RGB` is the format that specifies the number of colours in the texture. Here we are using a JPEG file so the colour each textel is represented by the RGB model. The `glGenerateMipmap` generates mipmaps for the texture (mipmaps are explained [below](mipmaps-section)).

Now that the texture data has been copied to the GPU we can free up memory by adding the following to the program.

```cpp
// Free the image from the memory
stbi_image_free(data);
```

### Texture coordinates

So we have created a texture and told OpenGL all about it. Now we need to specify how we want to use the texture. To do this for each of the vertices of the triangle we need to define the corresponding $(u, v)$ texture coordinates. This is done in the same way as the triangle vertices, i.e., define an array containing the coordinates, create a buffer and copy the coordinates to this buffer.

Enter the following code after we defined the `vertices` array (you may need to scroll up a bit).

```cpp
// Define texture coordinates
const float uv[] = {
    // u   v
    0.0f, 0.0f,
    1.0f, 0.0f,
    0.5f, 1.0f
};
```

Here we have defined an array of float values called `uv` and specified the texture coordinates so that the bottom-left triangle vertex is mapped to the texture coordinate $(0, 0)$ in the bottom-left corner of the texture, the bottom-right vertex is mapped to $(1,0)$ in the bottom-right corner of the texture and the top vertex is mapped to $(0.5, 1)$ in the middle of the top edge of the texture.

The buffer for the texture coordinates is created in the same was as for the triangle vertices. Enter the following code after the VBO was created.

```cpp
// Create texture buffer
unsigned int uvBuffer;
glGenBuffers(1, &uvBuffer);
glBindBuffer(GL_ARRAY_BUFFER, uvBuffer);
glBufferData(GL_ARRAY_BUFFER, sizeof(uv), uv, GL_STATIC_DRAW);
```

After we have created the texture we need to bind it to the VAO by adding the following code.

```cpp
// Bind the texture to the VAO
glBindTexture(GL_TEXTURE_2D, texture);
glBindVertexArray(VAO);
```

Sending the texture coordinates to the GPU is done in the same way as for the VBO. Enter the following code after we send the VBO to the GPU (this is in the render loop so scroll down a bit).

```cpp
// Send the UV buffer to the shaders
glEnableVertexAttribArray(1);
glBindBuffer(GL_ARRAY_BUFFER, uvBuffer);
glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 0, (void*)0);
```

Note that since each texture coordinates requires just 2 floats for $(u,v)$ instead of 3 for the vertex coordinates $(x,y,z)$ the second argument in the `glVertexAttribPointer()` function is `2` instead of `3`.

### Shaders

#### Vertex shader

Recall that the [vertex shader](vertex-shader-section) deals with the vertex coordinates and is used by OpenGL to calculate the coordinates of the fragment. So in addition to passing the $(x, y, z)$ coordinates of the vertices we must also pass the $(u, v)$ coordinates of the textels that correspond to the triangle vertices.

Edit the **vertexShader.glsl** file in the **Lab03_Textures** project so that it looks like the following.

```glsl
#version 330 core

// Inputs
layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;

// Outputs
out vec2 UV;

void main()
{
    // Output vertex position
    gl_Position = vec4(position, 1.0);
    
    // Output texture coordinates
    UV = uv;
}

```

You may notice some changes from our vertex shader from [2. Basic Shapes in OpenGL](vertex-shader-section). We now have a second input `uv` which is a 2-element vector which are the $(u,v)$ texture coordinates which are outputted as the 2-element vector `UV` (remember that the `gl_Position` vector is passed to the fragment shader by default).

#### Fragment shader

The fragment shader is where we need to retrieve the sample colour from the texture. Edit the **fragmentShader.glsl** file so that it looks like the following.

```glsl
#version 330 core

// Input
in vec2 UV;

// Output
out vec3 colour;

// Uniforms
uniform sampler2D textureMap;

void main()
{
    colour = vec3(texture(textureMap, UV));
}

```

Here we now have an input of the 2-element vector `uv` which has been outputted from the vertex shader. Since our texture is a 2D image then we use the <a href="https://www.khronos.org/opengl/wiki/Sampler_(GLSL)" target="_blank">`sampler2D`</a> GLSL type to declare the uniform `textureMap` (uniforms are explained [below](uniforms-section)). The colour of the fragment is taken from the texture using the `texture()` function where the first argument is the name of the texture uniform and the second argument is the $(u,v)$ texture coordinates of the fragment.

Compile and run program and, after sending a prayer to the programming gods, you should be presented with your triangle which has now been textured using the crate texture.

```{figure} ../_images/03_texture_triangle.png
:width: 500
```

---

## Texture rectangle

Our texture triangle is great and all but doesn't really look like a realistic object. Since the original texture is rectangular, let's create a rectangle out of two triangles with the appropriate texture mapping.

```{figure} ../_images/03_rectangle.svg
:width: 450

A rectangle constructed using two triangles.
```

So the lower-right (blue) triangle has vertex coordinates $(-0.5, -0.5, 0)$, $(0.5, -0.5, 0)$ and $(0.5, 0.5, 0)$ and the upper-left (red) triangle has vertex coordinates $(-0.5, -0.5, 0)$, $(0.5, 0.5, 0)$ and $(-0.5, 0.5, 0)$. Change the `vertices` and `uv` arrays to the following.

```cpp
// Define vertex positions
static const float vertices[] = {
    // x     y     z
    -0.5f, -0.5f, 0.0f, 
     0.5f, -0.5f, 0.0f,
     0.5f,  0.5f, 0.0f, 
    -0.5f, -0.5f, 0.0f,
     0.5f,  0.5f, 0.0f,
    -0.5f,  0.5f, 0.0f
};

// Define texture coordinates
static const float uv[] = {
    // u    v
    0.0f,  0.0f,    // triangle 1
    1.0f,  0.0f,
    1.0f,  1.0f,
    0.0f,  0.0f,    // triangle 2
    1.0f,  1.0f,
    0.0f,  1.0f
};
```

Compile and run the program, and you should be presented with the more realistic image in {numref}`texture-rectangle-figure`.

```{figure} ../_images/03_texture_rectangle.png
:width: 500
:name: texture-rectangle-figure

Texture mapped onto two triangles that form a rectangle.
```

### Element Buffer Objects (EBO)

Our rectangle is defined using 6 sets of $(x,y,z)$ coordinates for the 2 triangles, but a rectangle only has 4 vertices. This means we are using 2 extra coordinates than we really need to as both of the triangles share the vertices at $(-0.5, -0.5, 0)$ and $(0.5, 0.5, 0)$. This isn't too bad for our simple rectangle example but for more sophisticated scenes that use thousands of triangles it can be inefficient.

To improve on this we can use an **Element Buffer Object (EBO)** that contains **indices** that map a vertex of the rectangle to the `vertices` array. Consider {numref}`rectangle-indices-figure` that shows a rectangle drawn using two triangles. The lower-right triangle is formed using the vertices with indices 0, 1 and 2 and the upper-left triangle is formed using vertices with indices 0, 2 and 3.

```{figure} ../_images/03_indices.svg
:width: 200
:name: rectangle-indices-figure

The mapping of indices to the rectangle vertices.
```

Comment out the code used to define the `vertices` and `uv` arrays and enter the following code.

```cpp
// Define vertex positions
static const float vertices[] = {
    // x     y     z      index
    -0.5f, -0.5f, 0.0f,  // 0       3 -- 2
     0.5f, -0.5f, 0.0f,  // 1       |  / |  
     0.5f,  0.5f, 0.0f,  // 2       | /  |
    -0.5f,  0.5f, 0.0f   // 3       0 -- 1
};

// Define texture coordinates
static const float uv[] = {
    // u    v      index
    0.0f,  0.0f,  // 0
    1.0f,  0.0f,  // 1
    1.0f,  1.0f,  // 2
    0.0f,  1.0f,  // 3
};

// Define indices
static const unsigned int indices[] = {
    0, 1, 2,  // lower-right triangle
    0, 2, 3   // upper-left triangle
};
```

As with the other buffer objects we need to create a buffer for the indices, bind it and copy the data across. Enter the following code after we've created the texture buffer.

```cpp
// Create Element Buffer Object (EBO)
unsigned int EBO;
glGenBuffers(1, &EBO);
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
```

This is similar to the code used to create the other buffer objects with the exception we are creating a `GL_ELEMENT_ARRAY_BUFFER` instead of a `GL_ARRAY_BUFFER`. The last change we need to make in order to use our EBO is to change the function used to draw the triangles from `glDrawArrays()` to `glDrawElements()`

```cpp
// Draw the triangles
glDrawElements(GL_TRIANGLES, sizeof(indices) / sizeof(unsigned int), GL_UNSIGNED_INT, 0);

glDisableVertexAttribArray(0);
glDisableVertexAttribArray(1);
```

Make this change, compile and run the program, and you should see the window from {numref}`texture-rectangle-figure`. You may be thinking you've gone to all of that trouble only for the rectangle to look exactly the same. Well, now we are using fewer floats in the `vertices` array, and we can now use EBOs to draw more sophisticated shapes and 3D models.

---

## Texture wrapping and filtering

### Texture wrapping

In our examples above, all the texture coordinates have been in the range from 0 to 1. What happens if we use textures coordinates outside this range? To test this we are going to change our texture to something less symmetrical (you will see why in a minute). Change the `path` variable to the following

```cpp
// Load texture image from file
const char *path = "../assets/mario.png";
```

PNG (Portable Network Graphics) files use the RGBA colour model which is the standard RGB model with an addition Alpha value that determines the opacity of the colours. We need to let OpenGL know that our texture is defined using RGBA so change instances `GL_RGB` in the `glTexImage2D()` function to `GL_RGBA`, i.e.,

```cpp
// Specify 2D texture
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
```

Compile and run the program, and you should be presented with a (hopefully) familiar face.

```{figure} ../_images/03_mario_rectangle.png
:width: 500
:name: mario-rectangle-figure

Its a me, Mario!
```

Now we can experiment with specifying texture coordinates outside the range 0 to 1. Edit the `uv` array to change all the `1.0f` values to `2.0f`. Compile and run the program, and you should see the image shown in {numref}`GL_REPEAT-figure`

```{figure} ../_images/03_GL_REPEAT.png
:width: 500
:name: GL_REPEAT-figure

Texture wrapping using `GL_REPEAT`.
```

Here OpenGL has used **texture wrapping** to repeat the texture over the rectangle. This can be useful if we want to use a small texture containing a pattern over a larger polygon, e.g., think of brick wall where the pattern repeats itself.

OpenGL offers other options for texture wrapping;

- `GL_REPEAT` - the texture repeats over the fragment (default);
- `GL_MIRRORED_REPEAT` - same as `GL_REPEAT` but the texture is mirrored with each repeat;
- `GL_CLAMP_TO_EDGE` - clamps the texture coordinates to between 0 and 1, coordinates outside this range are clamped to the edge so that the textels on the edge are stretched to the edge of the fragment;
- `GL_CLAMP_TO_BORDER` - coordinates outside the range $(0,0)$ to $(1,1)$ are given a used defined border colour.

We can specify the texture wrapping using the `glTexParameteri()` function. To apply `GL_MIRRORED_REPEAT` add the following code after the texture as been specified.

```cpp
// Set texture wrapping options
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_MIRRORED_REPEAT);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_MIRRORED_REPEAT);
```

Here we have specified the wrapping in the horizontal (`S`) and vertical (`T`) directions (some people use $(s,t)$ for the vertex coordinates instead of $(u,v)$) to `GL_MIRRORED_REPEAT`. Compile and run the program, and you should see the image shown in {numref}`GL_MIRRORED_REPEAT-figure`.

```{figure} ../_images/03_GL_MIRRORED_REPEAT.png
:width: 500
:name: GL_MIRRORED_REPEAT-figure

Texture wrapping using `GL_MIRRORED_REPEAT`.
```

Using `GL_CLAMP_TO_EDGE` and `GL_CLAMP_TO_BORDER` instead results in the images shown in {numref}`GL_CLAMP_TO_EDGE-figure` and {numref}`GL_CLAMP_TO_EDGE-figure`.

`````{grid}
````{grid-item}
```{figure} ../_images/03_GL_CLAMP_TO_EDGE.png
:name: GL_CLAMP_TO_EDGE-figure

Texture wrapping using `GL_CLAMP_TO_EDGE`.
```
````
````{grid-item}
```{figure} ../_images/03_GL_CLAMP_TO_BORDER.png
:name: GL_CLAMP_TO_BORDER-figure

Texture wrapping using `GL_CLAMP_TO_BORDER`.
```
````
`````

### Texture filtering

**Texture filtering** is method of determining the colour of the fragment, known as the **colour sample**, from the texture. OpenGL maps the coordinates of the fragment to the texture coordinates and in most cases this will not align exactly to a textel centre, so what does OpenGL do? OpenGL provides two main options : nearest-neighbour interpolation and bilinear interpolation.

#### Nearest neighbour interpolation

**Nearest neighbour interpolation** is the default in OpenGL uses the colour of the nearest textel to the texture coordinates as the colour sample. This is illustrated in the diagram shown in {numref}`nearest-neighbour-interpolation-figure` where the texture coordinates represented by the black circle is mapped in a region on the texture with four neighbouring textels with the textel centres represented by the crosses. The texture coordinates are closest to the centre of the textel in the top-left so the colour of that textel is used for the colour sample.

```{figure} ../_images/03_nearest_neighbour.svg
:width: 500
:name: nearest-neighbour-interpolation-figure

Nearest neighbour interpolation.
```

To apply texture filtering we specify the type of interpolation we want in using `glTexParameteri()` functions. To apply nearest neighbour interpolation add the following code to your program.

```cpp
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
```

The `GL_TEXTURE_MIN_FILTER` and `GL_TEXTURE_MAG_FILTER` arguments refer to **minification** and **magnification**. Minification is where the texture is larger than the polygon it is being mapped to so a fragment covers multiple textels. Magnification is the opposite where the texture is smaller than the polygon so that a single textel takes up multiple fragments. We can set different interpolation for magnification and minification. 

To demonstrate the affects of minification lets use a low resolution texture. Change the `path` variable to the following

```cpp
// Load texture image from file
const char *path = "../assets/mario_small.png";
```

And change the $(u, v)$ coordinates back so that the texture fills the rectangle. Compile and run the program, and you should see the image shown in {numref}`GL_NEAREST-figure`.

```{figure} ../_images/03_GL_NEAREST.png
:width: 500
:name: GL_NEAREST-figure

Nearest neighbour interpolation
```

As you can see the texture mapped rectangle has a block **aliased** look since multiple fragments share the same textel.

#### Bilinear interpolation

Another method is to calculate the sample colour using <a href="https://en.wikipedia.org/wiki/Bilinear_interpolation" target="_blank">**bilinear interpolation**</a> where the distance between $(u,v)$ coordinate and the centre of a textel determines how much that textel contributes to the sample colour, i.e., the closer the textel the more of the textel colour is contained in the colour sample.

```{figure} ../_images/03_bilinear.svg
:width: 500
:name: bilinear-interpolation-figure

Bilinear interpolation.
```

To see the affects of bilinear interpolation, change `GL_NEAREST` to `GL_LINEAR` in the `glTexParameteri()` functions. Compile and run the program, and you should see the image shown in {numref}`GL_LINEAR-figure`.

```{figure} ../_images/03_GL_LINEAR.png
:width: 500
:name: GL_LINEAR-figure

Nearest neighbour interpolation
```

Here we have an improved texture mapping where the aliasing is less noticeable.

---
(mipmaps-section)=

## Mipmaps

Another issue that may occur is when the fragment is a lot smaller than the texture which can happen when an object that is far away from the viewer. In these cases OpenGL will struggle to get the colour sample from a high resolution texture since a single fragment covers a large part of the texture.

To solve this issue OpenGL uses <a href="https://www.khronos.org/opengl/wiki/Texture#Mip_maps" target="_blank">**mipmaps**</a> (mip is short for the latin phrase *"multum in parvo"* or "much in little") which are a series of textures, each one half the size of the previous one. OpenGL will use a mipmap texture most suitable based on the distance of the fragment from the viewer. This way the fragment does not span a large part of the texture, and it also cuts down on memory.

```{figure} ../_images/03_mipmaps.svg
:width: 500

Mipmaps
```

The good news is that we do not need to create lots of new different size textures because OpenGL has a function `glGenerateMipmap()` to do this for us which we have been using for a while.

One issue we may encounter is that when we switch between two mipmaps, e.g., when the viewer is moving towards or away from an object, there can be a notable change in appearance of the object. This is known as **texture popping** and is caused by switching between two mipmaps. To overcome this OpenGL gives the option to sample the texture from a linear interpolation between the two nearest mipmaps. So we have two main texture filtering options and two mipmap options giving four main mipmap options:

- `GL_NEAREST_MIPMAP_NEAREST` - uses nearest texture filtering on the nearest mipmap;
- `GL_LINEAR_MIPMAP_NEAREST` - uses linear texture filtering on the nearest mipmap;
- `GL_NEAREST_MIPMAP_LINEAR` - uses nearest texture filtering on a linear interpolation between two mipmaps;
- `GL_LINEAR_MIPMAP_LINEAR` - uses linear texture filtering on a linear interpolation between two mipmaps.

Like with the texture filtering methods we can use different options for magnifying and minifying the texture. A popular combination is to use `GL_LINEAR` for the magnification filter and `GL_LINEAR_MIPMAP_LINEAR` for the minification filter to avoid textures popping as we zoom into a polygon.

```cpp
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
```

---

## Multiple textures

OpenGL allows us to use multiple textures in a single fragment shader (up to 16 in fact). For each new texture we use we need to create and bind the texture to a target, load the texture data from an image file and set the texture wrapping and filtering options. Rather than copying and pasting all the code we have done for each new texture it makes sense to write a function that does this for us. Well if you look in the **Lab03_Textures** project, hidden away in the **Header files** folder is the file **texture.hpp** that contains a function `loadTexture()` that does all the hard work for us.

Comment out the code used to load the texture and specify the texture options and enter the following code before the render loop.

```cpp
// Load the textures
unsigned int texture = loadTexture("../assets/crate.jpg");
```

This creates a texture, loads in the data from the image file into the texture and sets the texture parameters. Compile and run the program, and you should see the image from {numref}`texture-rectangle-figure`.

We want to work with more than one texture so replace the code above with the following.

```cpp
// Load the textures
unsigned int texture1 = loadTexture("../assets/crate.jpg");
unsigned int texture2 = loadTexture("../assets/mario.png");
```

This loads the crate and Mario textures and assigns them to the targets `texture1` and `texture2`. We now want to deal with two textures in the fragment shader, so we need a way of telling OpenGL which texture is which, we do this using uniforms.

(uniforms-section)=

### Uniforms

A <a href="https://www.khronos.org/opengl/wiki/Uniform_(GLSL)" target="_blank">**uniform**</a> is a shader variable that remains constant during the execution of the rendering pass and has the same value for all vertices and fragments. Uniforms provide a way to passing data to the shaders, so we will use one for passing the texture target to the fragment shader.

Add the following code to your program before the render loop (since the textures are the same for every frame).

```cpp
// Send the texture uniforms to the fragment shader
glUseProgram(shaderID);
glUniform1i(glGetUniformLocation(shaderID, "texture1"), 0);
glUniform1i(glGetUniformLocation(shaderID, "texture2"), 1);
```

Here we let OpenGL know we are using our shader program with the `glUseProgram()` function. We then create uniforms for the two texture and assign them values of `0` and `1` using the `glUniform1i()` function. These values are the texture units that OpenGL uses to distinguish between the different textures in the fragment shader.

### Texture units

A **texture unit** is a location value used by fragment shader for the texture sampler we are using. The default texture unit for a texture is `GL_TEXTURE0` which is what we have been using up to now. We can have up to 16 texture units, `GL_TEXTURE0`, `GL_TEXTURE1` up to `GL_TEXTURE15`. Alternatively we could use `GL_TEXTURE0`, `GL_TEXTURE0 + 1`, `GL_TEXTURE0 + 2` up to `GL_TEXTURE + 15`.

Add the following code before the render loop.

```cpp
// Bind the textures
glActiveTexture(GL_TEXTURE0);
glBindTexture(GL_TEXTURE_2D, texture1);
glActiveTexture(GL_TEXTURE1);
glBindTexture(GL_TEXTURE_2D, texture2);
```

The `glActiveTexture()` function lets OpenGL know what texture unit we are currently dealing with, and then we bind the texture to that unit using then `glBindTexture()` function.

### Fragment shader

The last thing we need to do is update the fragment shader so that it uses both textures. Modify **fragmentShader.glsl**, so that is looks like the following.

```glsl
#version 330 core

// Input
in vec2 UV;

// Output
out vec3 colour;

// Uniforms
uniform sampler2D texture1;
uniform sampler2D texture2;

void main()
{
    colour = vec3(mix(texture(texture1, UV), texture(texture2, UV), 0.7));
}
```

Here we have defined the two `sampler2D` uniforms `texture1` and `texture2`, these need to be the same as what we called them in the `glGetUniformLocation()` functions. We then use the `mix()` function to combine the two textures so that 30% of the fragment colour is from the first texture (the crate) and the remaining 70% is from the second texture (Mario). Compile and run the program, and you should see the image shown in {numref}`two-textures-figure`.

```{figure} ../_images/03_two_textures.png
:width: 500
:name: two-textures-figure

A rectangle with a mix of two textures applied.
```

---

## Exercises

1. Change the `uv` array to create a texture rectangle consisting of a 6 by 4 grid of Mario's.

```{figure} ../_images/03_Ex1.png
:width: 400
```

2. Modify the fragment shader so that Mario is facing to the right instead of the left. Hint: the command `vec2(vector.x, vector.y)` creates a 2-element vector using the elements of `vector`.

```{figure} ../_images/03_Ex2.png
:width: 400
```

3. Modify the fragment shader so that the red and green colour components of the pixel are switched.
   
```{figure} ../_images/03_Ex5.png
:width: 400
```

4. Apply a texture of your choice to the rectangle (e.g., a selfie).

```{figure} ../_images/03_Ex3.png
:width: 400
```

5. Change the $(u,v)$ coordinates so that the textured rectangle shows a zoomed in image of Mario's eye.

```{figure} ../_images/03_Ex4.png
:width: 400
```

---

## Video walkthrough

The video below walks you through these lab materials.

<iframe width="560" height="315" src="https://www.youtube.com/embed/w0e3H40TsQA?si=OWycaeQlo_6ezT3G" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>