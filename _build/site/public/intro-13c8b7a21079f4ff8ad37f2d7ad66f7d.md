# Computer Graphics

This site contains the notes used for the lab sessions for the Computer Graphics module. They are designed for students to work through in the labs with the help of the tutors. The content of each of the labs have been organised such that each one uses code from the preceding labs, so you will need to make sure you have completed each lab before moving onto the next one.

| Week | Date (w/c) | Content |
|:--:|:--:|:--|
| 1 | 26/01/2026 | Core Computer Graphics Concepts: WebGL, the graphics pipeline, glossary of terms. Hello Triangle: vertex buffers, vertex and fragment shaders |
| 2 | 02/02/2026 | Vertex Colours, More Shapes & VAOs |
| 3 | 09/02/2026 | Textures |
| 4 | 16/02/2026 | Vectors and Matrices |
| 5 | 23/02/2026 | Transformations |
| 6 | 02/03/2026 | 3D Worlds|
| 7 | 09/03/2026 | Moving the Camera |
| 8 | 16/03/2026 | Lighting Models |
| 9 | 23/03/2026 | Normal Maps |
| 10 | 20/04/2026 | Quaternions |

---

## Core Computer Graphics Concepts

### The Graphics Pipeline

The **graphics pipeline** (or rendering pipeline) is a sequence of steps the GPU takes to convert 3D scene data (e.g., vertices, textures, lighting information, etc.) into a 2D image displayed on the screen. Like many graphics APIs, WebGL uses **vertex shaders** and **fragment shaders**, small programs that are written in **GLSL (OpenGL Shading Language)** which are run directly on the GPU to perform these steps.

The stages of the graphics pipeline are:

1. **Vertex specification** -- the geometry of objects that construct a 3D scene are defined using arrays of vertices. Each vertex is a collection of data, typically the co-ordinates of the vertex position but can also include texture co-ordinates, surface normal vectors and other attributes (more on these later). In WebGL we create **Vertex Buffer Objects (VBO)** to store this data and tell WebGL how to interpret them.

2. **Vertex shader** -- each vertex is processed by a vertex shader whose job it is to transform the 3D co-ordinates from the **model space** (the local object co-ordinates) into **clip space** (the co-ordinate system the GPU uses to determine what is visible on screen). The vertex shader is called once per vertex.

3. **Clipping** -- the vertex outputs from the vertex shader are grouped into **primitives** (usually triangles) and clipped to the clip space such that any primitive that lie outside the clip space are ignored. Primitives that lie partially outside the clip space are cut so that the part that is within the clip space is retained.

4. **Rasterisation** -- the primitives are converted into grids of pixels known as **fragments**. The interior fragments of a primitive are "filled in" by interpolating the vertex data across the surface.

5. **Fragment shader** -- each fragment is processed by the fragment shader which computes the final colour. This can be based on vertex data, texture mapping, lighting models and other visual effects.

6. **Per-fragment operations** -- before a fragment is displayed (i.e., becomes a pixel on the screen), depth testing (is it hidden by something else), alpha testing (for transparency) and stencil testing (for masking). Fragments can be discarded at this stage.

7. **Frame buffer** -- after processing the fragment is written to the **frame buffer** which is then is sent to the display.
