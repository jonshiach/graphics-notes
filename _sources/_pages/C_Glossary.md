# C Glossary

```{glossary}

{term}`Vertex`
    A point where two or more lines intersect. Polygon shapes have the same number of vertices as sides, e.g., a triangle has three vertices.

{term}`Array`
    A linear data structure where elements are arranged sequentially.

{term}`Buffer`
    A region of memory used to store data temporarily whilst it is transferred from one place to another.

{term}`Vertex Array Object (VAO)`
    A container object for storing any data and attributes related to a vertex, e.g., co-ordinates, texture co-ordinates, normal vectors etc.  

{term}`Vertex Buffer Object (VBO)`
    The buffer where the values of the vertex attributes are stored, e.g., $x$, $y$ and $z$ co-ordinates of the vertices.

{term}`Graphics Processing Unit`
    The hardware used by a computer to output graphical information to the display.

{term}`Fragment`
    A pixel or collection of pixels.

{term}`Shader`
    A program that is performed on the GPU that determines how fragments as displayed on the screen.

{term}`Vertex shader`
    A shader program that is used to transform the current vertex to the screen space.

{term}`Fragment shader`
    A shader program that is used to calculate the colour of the fragment.

{term}`Uniform`
    A global shader variable that remains constant for all vertices and fragments.

{term}`RGB`
    A colour model where the colour is defined by levels of *red*, *green* and *blue*. 

{term}`RGBA`
    A colour model where colours are defined by levels of *red*, *green* and *blue* in addition to an opacity value *Alpha*.

{term}`Texture`
    A 2D image that is mapped onto a polygon in the screen space.

{term}`Textel`
    An individual pixel in a texture.

{term}`Texture co-ordinates`
    The co-ordinates of a pixel (textel) in the texture. 

{term}`Texture wrapping`
    Controls how textures are repeated across a surface of a polygon.

{term}`Texture filtering`
    Controls how the colour of a fragment is obtained from the texture.

{term}`Mipmap`
    A duplicate of a texture and successively smaller resolution.

{term}`Vector (math)`
    An object that has length and direction.

{term}`Matrix`
    A rectangular array of elements, e.g., numbers.

{term}`Transformation`
    The process of changing an object, e.g., changing its position, orientation, size etc.

{term}`Origin`
    A point in a space with all zero co-ordinates.

{term}`Normalized Device Co-ordinates (NDC)`
    A 3D right-handed co-ordinate system used by OpenGL where the camera is assumed to be at the origin pointing down the $z$-axis.

{term}`Translation`
    Moving a point or set of points in a space by the same vector.

{term}`Scaling`
    Changing the distance between a point or set of points from the origin. 

{term}`Rotation`
    Changing the orientation of a point or set of points.

{term}`Composite transformations`
    The combination of a sequence of transformations.

{term}`Unit cube`
    A cube with sides of length 2 parallel to the co-ordinate axes where the vertex co-ordinates are combinations of $-1$ and $1$.

{term}`Model space`
    The space in which an individual 3D model is defined (also known as *object space*).

{term}`World space`
    The space which contains the objects that make up the virtual world.

{term}`View space`
    A transformed world space such that the camera is at the origin pointing down the $z$-axis.

{term}`Screen space`
    A transformed view space that represents what is to be displayed on the screen.

{term}`Model matrix`
    A transformation matrix used to transform from the model space to the screen space.

{term}`View matrix`
    A transformation matrix used to transform from the world space to the view space.

{term}`Projection matrix`
    A transformation matrix used to project the view space onto the screen space.

{term}`Z buffer`
    A buffer containing the $z$ co-cordinate of the nearest surface to the viewer (also known as a *depth buffer*).

{term}`Depth test`
    A test applied to each fragment where only fragments that are closer than those currently stored in the Z buffer are computed by the shaders. Used to remove hidden surfaces.

{term}`Orthographic projection`
    Transformation from the view space to the screen space where the $z$ co-ordinate is ignored.

{term}`Perspective projection`
    Transformation from the view space to the screen space which accounts for the distance of objects from the camera.

{term}`Field of View (FOV)`
    The angle between the top and bottom edges of the screen space.

{term}`Aspect`
    The width-to-height aspect ratio of the screen.

{term}`Near projection plane`
    A plane parallel to the $x$ and $y$ axes that defines the nearest points to the camera shown in the screen space.

{term}`Far projection plane`
    A plane parallel to the $x$ and $y$ axes that defines the furthest points to the camera shown in the screen space.

{term}`Pitch, roll and yaw`
    Euler angles used for the rotations in the $x$, $y$ and $z$ axes respectively.

{term}`Back face culling`
    The removal of any surface whose normal vector is pointing away from the camera (known as *back facing*). 

{term}`Local illumination model`
    A lighting model where the colour of a surface is only determined by light emanating directly from light sources (also known as *direct illumination*).

{term}`Global illumination model`
    A lighting model where the colour of a surface is determined by light emanating from light sources and that reflected off other surface in the scene (also known as *indirect illumination*).

{term}`Phong's lighting model`
    A local illumination model where the colour of a fragment is determined by summing ambient, diffuse and specular lighting models.

{term}`Ambient reflection`
    A simplified model of the light reflected off of all objects in the scene. 

{term}`Diffuse reflection`
    A reflection model for light reflecting off rough surfaces.

{term}`Specular reflection`
    A reflection model for light reflecting off smooth surfaces.

{term}`Attenuation`
    The loss of light intensity over distance.

{term}`Normal map`
    A texture map containing information for the normal vectors across a surface.

{term}`Tangent space`
    A 3D space defined using orthogonal tangent, bitangent and normal vectors.

{term}`Tangent vector`
    A vector pointing along a surface.

{term}`Bitangent vector`
    A vector pointing along a surface that is orthogonal to the tangent vector.

{term}`Normal vector`
    A vector pointing perpendicularly away from a surface.

{term}`Orthogonal`
    At right angles to $\ldots$

{term}`TBN matrix`
    The transformation matrix used to transform to the tangent space.

{term}`Specular map`
    A texture map containing the levels or specular reflection across a surface.

{term}`Quaternion`
    A 4D object consisting of a real part and three imaginary parts.

{term}`SLERP`
    Spherical Linear intERPolation used to interpolated between points on a sphere.
```