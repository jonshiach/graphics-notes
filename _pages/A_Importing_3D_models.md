# Importing 3D Models

## Wavefront (OBJ) Files

**Wavefront files** are a simple and widely used format for storing 3D geometry. They were originally development by Wavefront Technologies and are commonly used to exchange models between 3D modelling software such as Blender, Maya etc. and graphics applications.

The most common Wavefront formate is the `.obj` file, which stores the geometry of a model using plain text making it easy to read and parse into JavaScript.

An OBJ file describes a 3D model using several types of entries. Each line begins with a keyword that specifies the type of data that follows.

- `v` -- vertex position $(x, y, z)$
- `vt` -- texture coordinate $(u, v)$
- `vn` -- vertex normal $(n_x, n_y, n_z)$
- `f` -- face
- `o` -- object name
- `usemtl` -- material to use

For example, the OBJ file for a simple unit cube may look like

```text
o cube

v -1 -1  1
v -1  1  1
v -1 -1 -1
v -1  1 -1
v  1 -1  1
v  1  1  1
v  1 -1 -1
v  1  1 -1

vn -1  0  0
vn  0  0 -1
vn  1  0  0
vn  0  0  1
vn  0 -1  0
vn  0  1  0

vt 1 0
vt 0 1 
vt 0 0
vt 1 1

usemtl crate

f 2/1/1 3/2/1 1/3/1
f 4/1/2 7/2/2 3/3/2
f 8/1/3 5/2/3 7/3/3
f 6/1/4 1/2/4 5/3/4
f 7/1/5 1/2/5 3/3/5
f 4/1/6 6/2/6 8/3/6
f 2/1/1 4/4/1 3/2/1
f 4/1/2 8/4/2 7/2/2
f 8/1/3 6/4/3 5/2/3
f 6/1/4 2/4/4 1/2/4
f 7/1/5 5/4/5 1/2/5
f 4/1/6 2/4/6 6/2/6
```

The face of a model indexes the vertex coordinates, texture coordinates and normal vectors

```text
f vertexIndex/textureIndex/normalIndex
```

For the cube example, each face has three sets of indices so these are all triangles. The first vertex of the first triangle is `2/1/1` so

- vertex coordinate is $(-1, 1, 1)$
- texture coordinate is $(1, 0)$
- normal vector is $(-1, 0, 0)$

The second vertex of the first triangle is `3/2/1` so

- vertex coordinate is $(-1, -1, -1)$
- texture coordiante is $(0, 1)$
- normal vector is $(-1, 0, 0)$

and so on.

## Material (MTL) files

A material file `.mtl` describes the surface appearance of the model defined in an OBJ file. Like OBJ files, each line of a MTL file begins with a keyword that specifies the type of data that follows

- `newmtl` -- material name
- `Ka` -- ambient colour
- `Kd` -- diffuse colour
- `Ks` -- specular colour
- `Ns` -- shininess
- `d` -- transparency
- `map_kd` -- diffuse texture map
- `map_ks` -- specular map
- `map_bump` -- normal map

## Loading models from OBJ files

To load a model from an OBJ file so that it can be used with the WebGL programs we have written in these labs you will need to write a function that reads in the data from the OBJ file and writes the vertex coordinates, texture coordinates, normal vectors and vertex indices into the `vertices` and `indices` arrays. These can then be used to create the VAO for the model.