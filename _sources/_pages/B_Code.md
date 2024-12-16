(appendix-code)=

# B. Code and Assets

## B.1 Classes

The code for the various classes used in these materials is provided here. Note that these are minimal working examples and need to be modified to implement all of the methods and techniques covered.

- [camera.hpp](../code/Appendices/source/camera.hpp), [camera.cpp](../code/Appendices/source/camera.cpp) - the Camera class used to compute the view and projection matrices
- [light.hpp](../code/Appendices/source/light.hpp), [light.cpp](../code/Appendices/source/light.cpp) - the Light class used to add light sources
- [maths.hpp](../code/Appendices/source/maths.hpp), [maths.cpp](../code/Appendices/source/maths.cpp) - a Maths class that can be used to replace the glm functions for vector and matrix calculations. The method function definitions in the `maths.cpp` file are incomplete and need to be modified in order to use this.
- [model.hpp](../code/Appendices/source/model.hpp), [model.cpp](../code/Appendices/source/model.cpp), [stb_image.hpp](../code/Appendices/source/stb_image.hpp) - a Model class that can be used to load models defined as .obj files. Note that this class needs the `stb_image.hpp` file to be included in the `source/` folder.
- [shader.hpp](../code/Appendices/source/shader.hpp), [shader.cpp](../code/Appendices/source/shader.cpp) - a Shader class required to compile the shader programs.

## B.2 Models

Wavefront (.obj) files for the various models used in these materials.

- [cube.obj](../code/Appendices/objects/cube.obj) - a unit cube
- [sphere.obj](../code/Appendices/objects/sphere.obj) - a sphere
- [flat_plane.obj](../code/Appendices/objects/flat_plane.obj) - a horizontal flat plane
- [teapot.obj](../code/Appendices/objects/teapot.obj) - the Utah teapot
- [suzanne.obj](../code/Appendices/objects/suzanne.obj) - Suzanne the monkey (the Blender mascot)

## B.3 Textures

Texture files used in these materials

- [crate.bmp](../code/Appendices/textures/crate.bmp) - a basic crate texture
- [bricks_diffuse.png](../code/Appendices/textures/bricks_diffuse.png), [bricks_normal.png](../code/Appendices/textures/bricks_normal.png), [bricks_specular.png](../code/Appendices/textures/bricks_specular.png) - brick wall texture
- [stones_diffuse.png](../code/Appendices/textures/stones_diffuse.png), [stones_normal.png](../code/Appendices/textures/stones_normal.png), [stones_specular.png](../code/Appendices/textures/stones_specular.png) - stone floor texture
- [suzanne_diffuse.png](../code/Appendices/textures/suzanne_diffuse.png) - Suzanne the monkey texture
- [neutral_normal.png](../code/Appendices/textures/neutral_normal.png), [neutral_specular.png](../code/Appendices/textures/neutral_specular.png) - neutral normal and specular maps (default maps used in the Model class)