# Core Computer Graphics Concepts

Computer graphics is the study of how computers generate, manipulate, and display visual images. At its core, the field combines mathematics, programming, and visual perception to transform abstract data into images that can be displayed on a screen. Computer graphics underpins modern applications ranging from video games and films to scientific visualisation, virtual reality, medical imaging, and web-based interactive media.

This course focuses on real-time computer graphics, where images are generated interactively at high frame rates, typically using the graphics processing unit (GPU).

---

## The Graphics Pipeline

The **graphics pipeline** is a sequence of steps the GPU takes to convert 3D scene data (e.g., vertices, textures, lighting information, etc.) into a set of pixels that are displayed on the screen. Like many graphics APIs, WebGL uses **vertex shaders** and **fragment shaders**, small programs that are written in **GLSL (OpenGL Shading Language)** which are run directly on the GPU to perform these steps.

The stages of the graphics pipeline are:

1. **Application stage (CPU)** -- the program running on the CPU prepares the scene by defining geometry, camera parameters, lighting information and material properies.
  
2. **Vertex processing (GPU)** -- each vertex of a geometric object is processed independently. Operations such as coordinate transformations are applied here.

3. **Rasterisation** -- geometric primitives (usually triangles) are converted into fragments corresponding to potential screen pixels.

4. **Fragment processing (GPU)** -- each fragment is shaded to determine its final colour, typically using lighting and texture calculations.

5. **Framebuffer** -- the coloured fragments are written to the framebuffer, which is displayed on the screen.

Understanding this pipeline is fundamental: computer graphics is not about drawing objects directly, but about **transforming and processing data through a series of well-defined stages**.

---

## Geometry and primitives

All complex graphical objects are built from simple **geometric primitives**. In real-time graphics, these primitives are almost always **triangles**.

Triangles are used because:

- Three points always define a plane
- They are efficient for hardware processing
- They can approximate any surface when used in sufficient numbers

More complex shapes -- such as spheres, characters, and landscapes -- are represented as **meshes**, which are collections of vertices connected into triangles.

Each vertex typically contains:

- A position in space
- Texture coordinates
- A surface normal (direction)
- Optional colour or other attributes

---

## Coordinate systems and transformations

A key challenge in computer graphics is managing multiple coordinate systems. Objects must be positioned relative to one another, viewed from a camera, and projected onto a 2D screen.

The main coordinate spaces are:

- **Object (model) space** -- coordinates relative to an object’s local origin
- **World space** -- coordinates within the overall scene
- **View (camera) space** -- coordinates relative to the camera
- **Clip and Normalised Device Coordinates (NDC)** -- standardised coordinates used for rendering
- **Screen space** -- final pixel positions on the display

**Transformations** between these spaces are performed using matrices, which represent operations such as translation, rotation, scaling, and projection. The order in which these transformations are applied is critical and affects the final result.

---

## The Role of the GPU

The GPU is a specialised processor designed for massively parallel computation. Unlike the CPU, which excels at sequential logic and control flow, the GPU performs the same operations on large amounts of data simultaneously.

In graphics programming:

- The CPU sets up data and state
- The GPU executes small programs, called shaders, on many vertices or pixels in parallel

This division of labour enables real-time rendering of complex scenes at high frame rates.

---

## Shaders

**Shaders** are small programs that run on the GPU and define how geometry and pixels are processed. The two most important types are:

- **Vertex shaders**, which process individual vertices
- **Fragment shaders**, which compute the colour of each pixel-sized fragment

Shaders give developers fine-grained control over how objects appear, enabling effects such as lighting, shading, texturing, and animation. Each shader invocation operates independently, with no shared state between executions.

---

## Real-Time Constraints and Performance

Real-time graphics must generate images within a strict time budget, typically 16 milliseconds per frame for 60 frames per second. This constraint influences every design decision in graphics systems.

- Key performance considerations include:
- Minimising data transfer between CPU and GPU
- Reducing the number of draw calls
- Efficient use of shaders and memory

Understanding these constraints helps explain why graphics systems are structured the way they are.

---

## The RGB Colour Model

The **RGB colour model** is a method for representing colours using combinations of red (R), green (G), and blue (B) light. It is the foundation of almost all digital displays, including computer monitors, televisions, mobile phones, and graphics systems used in real-time rendering.

RGB is an additive colour model, meaning that colours are created by adding light together rather than mixing pigments, for example

- Red + Green = Yellow
- Red + Blue = Magenta
- Green + Blue = Cyan
- Red + Green + Blue = White
- No light at all = Black

Each primary colour contributes light to the final result. Increasing the intensity of a channel makes the colour brighter; decreasing it makes the colour darker.

RGB values are represented numerically. If each primary colour is represented using 8-bits then a total of $2^8 \times 2^8 \times 2^8 = 16,777,216$ colours. It is estimated that the human eye can distinguish between approximately 10 million colours so 8-bit colour is sufficient.

The most common numerical representations are:

- 8-bit per channel: integer values range from 0 to 255
  - Example: (255, 0, 0) which is pure red
  - Example: (255, 255, 255) which is pure white

- Normalised floating-point: values range from 0.0 to 1.0
  - Example: (1.0, 0.0, 0.0) which is pure red
  - Example: (0.5, 0.5, 0.5) which is mid-gray

Graphics APIs and shaders typically use the normalised form, while image files and user interfaces often use 8-bit integers.
