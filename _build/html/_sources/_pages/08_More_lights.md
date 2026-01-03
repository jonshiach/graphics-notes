(more-lights-section)=

# Lab 8: More Lights

In [Lab 8: Lighting](lighting-section) we saw how to add a single point light source to a scene using the Phong reflection model. In this lab we will extend this to multiple light sources of different types including point lights, spotlights and directional lights.

:::{admonition} Task
:class: tip

Create a copy of your ***Lab 8 Lighting*** folder, rename it ***Lab 8 More Lights***, rename the file ***lighting.js*** to ***more_lights.js*** and change ***index.html*** so that the page title is "Lab 8 - More Lights" and it uses the ***more_lights.js*** file.
:::

Open the ***index.html*** file in a live server to check everything is working as expected.

```{figure} ../_images/08_cubes.png
:width: 80%
:name: cubes-attenuation-figure-2

The cubes lit from a single light source.
```

---

(multiple-light-sources-section)=

## Multiple light sources

To add another light sources to a scene is simply a matter of calculating the ambient, diffuse and specular reflection for the additional light source and then adding them to the fragment colour. We have seen for a single light source we have to define the light source colours, the position of the light source in the world space and the three attenuation constants. Given that we would like to do this for multiple light sources we need data structure for each light source.

A data structure in GLSL is defined as follows:

```glsl
struct Light {
  int type;
  vec3 position;
  vec3 colour;
  float constant;
  float linear;
  float quadratic;
};
```

This defines a `Light` structure with attributes for the light source type, position, colour and attenuation constants. The `type` attribute will be used later to specify different types of light sources. Before we add additional light sources we are going to rewrite our fragment shader to use a data structure.

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
  int type;
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

// Function to calculate diffuse and specular reflection
vec3 computeLight(Light light, vec3 N, vec3 V, vec3 objectColour){
 
  // Light vector
  vec3 L = normalize(light.position - vPosition);

  // Reflection vector
  vec3 R = reflect(-L, N);

  // Attenuation
  float dist = length(light.position - vPosition);
  float attenuation = 1.0 / (light.constant + light.linear * dist + light.quadratic * dist * dist);

  // Ambient reflection
  vec3 ambient = uKa * objectColour;

  // Diffuse
  vec3 diffuse = uKd * max(dot(N, L), 0.0) * light.colour * objectColour;

  // Specular
  vec3 specular = uKs * pow(max(dot(R, V), 0.0), uShininess) * light.colour;

  // Output fragment colour
  return attenuation * (ambient + diffuse + specular);
}

// Main function
void main() {

  // Object colour
  vec4 objectColour = texture(uTexture, vTexCoords);

  // Lighting vectors
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCameraPosition - vPosition);

  // Calculate lighting for each light source
  vec3 result;
  for (int i = 0; i < 16; i++) {
    if (i >= uNumLights) break;
    result += computeLight(uLights[i], N, V, objectColour.rgb);
  }

  // Fragment colour
  fragColour = vec4(result, objectColour.a);
}
```

This fragment shader is a little more complex than before but the main changes are:

- A `Light` data structure is defined with attributes for the light source type, position, colour and attenuation constants.
- An array of `Light` structures called `uLights` is defined to hold up to 16 light sources.
- A uniform integer `uNumLights` is defined to specify the number of active light sources.
- A function `computeLight()` is defined to calculate the diffuse and specular reflection for a given light source.
- In the `main()` function a for loop iterates over the active light sources and calls the `computeLight()` function for each light source to add its contribution to the fragment colour.

Since this fragment shader not uses an array of light source we need to update the ***more_lights.js*** file to define multiple light sources using the `Light` data structure and send them to the shader.

:::{admonition} Task
:class: tip

Edit the fragment shader in the **more_lights.js** file to use the new fragment shader above.

Define an array containing the properties of two light sources.

```javascript
// Create vector of light sources
const lightSources = [ 
  {
    type        : 1,
    position    : [6, 2, 0],
    colour      : [1, 1, 1],
    direction   : [0, -1, -2],
    constant    : 1.0,
    linear      : 0.1,
    quadratic   : 0.02,
  },
  {
    type        : 1,
    position    : [9, 2, -9],
    direction   : [0, 0, 0],
    colour      : [1, 1, 0],
    constant    : 1.0,
    linear      : 0.1,
    quadratic   : 0.02,
  },
];
```

Edit the code where the light source properties are sent to the shader to loop over the `lightSources` array and send each light source's properties to the shader.

```javascript
// Send light source properties to the shader
gl.uniform1i(gl.getUniformLocation(program, "uNumLights"), numLights);
for (let i = 0; i < numLights; i++) {
  gl.uniform1i(gl.getUniformLocation(program, `uLights[${i}].type`), lightSources[i].type);
  gl.uniform3fv(gl.getUniformLocation(program, `uLights[${i}].position`), lightSources[i].position);
  gl.uniform3fv(gl.getUniformLocation(program, `uLights[${i}].colour`), lightSources[i].colour);  
  gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].constant`), lightSources[i].constant);
  gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].linear`), lightSources[i].linear);
  gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].quadratic`), lightSources[i].quadratic);
}
```

And edit the code where the light sources are drawn to loop over the number of light sources.

```javascript
// Render light sources
gl.useProgram(lightProgram);

for (let i = 0; i < numLights; i++) {
  // Calculate model matrix for light source
  const translate = new Mat4().translate(...lightSources[i].position);
  const scale     = new Mat4().scale(0.1, 0.1, 0.1);
  const model     = translate.multiply(scale);
  gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
  gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
  gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

  // Send light colour to the shader
  gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), lightSources[i].colour);

  // Draw light source cube
  gl.bindVertexArray(vao);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}
```

:::

Here we have defined two light sources, with an additional yellow light source positioned further back in the scene. The code to send the light source properties to the shader and to draw the light sources has been updated to loop over the number of light sources defined in the `lightSources` array. Refresh your web browser, and you should see the following. Move the camera around the scene to see the effects of the light sources on the cubes.

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
vec3 direction;
float cutoff;
```

In the `computeLight()` function, add the following code to turn off the light contribution if the fragment is outside the spotlight cone.

```glsl
// Spotlight
vec3 D = normalize(light.direction);
float theta = dot(-L, D);
float spotLight = 0.0;
if (theta > light.cutoff) {
  spotLight = 1.0;
}
```

And apply the spotlight to the fragment colour calculation.

```glsl
// Output fragment colour
return spotlight * attenuation * (ambient + diffuse + specular);
```

In the `main()` function, add the light direction and cutoff attributes to both light sources. In the first light source add the following and comment out the code definining the second light source.

```javascript
type      : 2,
direction : [0, -1, -1],
cutoff    : Math.cos(40 * Math.PI / 180),
```

Finally, send the additional light source properties to the shader by adding the following code where the other light source properties are sent.

```javascript
gl.uniform3fv(gl.getUniformLocation(program, `uLights[${i}].direction`), lightSources[i].direction);      
gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].cutoff`), lightSources[i].cutoff);
```

:::

Here we have changed the first light source to be a spotlight that is pointing downwards and slightly towards the back of the scene. The cutoff angle is set to $30^\circ$ by calculating $\cos(30^\circ)$. The second light source has been switched off by commenting out the code that defines it. Refresh your web browser and you should see the following.

```{figure} ../_images/08_cubes_spotlight_harsh.png
:width: 80%
:name: directional-light-harsh-figure

Cubes lit using a spotlight.
```

Use the keyboard and mouse to move the camera around the cubes and see the effect of the spotlight. You may notice that there is an abrupt cutoff between the region illuminated by the spotlight and the region in darkness. In the real world this doesn't usually happen as light on this edge gets softened by various effects.

We can model this softening by gradually reducing the intensity of the light as we approach the cutoff angle. Introducing a new inner cutoff angle that is slightly less than the cutoff angle then we can have full intensity for angles less than the inner cutoff angle and zero intensity for angles greater than the cutoff angle. Between these two angles we can gradually reduce the intensity from 1 to 0.

```{figure} ../_images/08_soft_edge.svg
:width: 500
:name: soft-edge-figure

Intensity value over a range of $\theta$.
```

:::{admonition} Task
:class: tip

Add an attribute for the inner cutoff angle to the Light data structure in the fragment shader.

```glsl
float innerCutoff;
```

And in the `computeLight()` function, replace the spotlight code with the following code to soften the edges of the spotlight.

```glsl
// Spotlight
vec3 D = normalize(light.direction);
float theta = dot(-L, D);
float epsilon = light.cutoff - light.innerCutoff;
float spotLight = clamp((light.cutoff - theta) / epsilon, 0.0, 1.0);
```

Now add the attibute to the light source definitions in the ***more_lights.js*** file.

```javascript
innerCutoff : Math.cos(30 * Math.PI / 180),
```

And send the additional light source property to the shader by adding the following code where the other light source properties are sent.

```javascript
gl.uniform1f(gl.getUniformLocation(program, `uLights[${i}].innerCutoff`), lightSources[i].innerCutoff);
```

:::

Here we have defined an inner cutoff angle of $25^\circ$ which is slightly less than the cutoff angle of $30^\circ$. Refresh your web browser and you should see the following.

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

Update the `computeLight()` function in the fragment by replacing the code used to calculate the light source vector with the following.

```glsl
if (light.type == 3) {
  L = normalize(-light.direction);
} else {
  L = normalize(light.position - vPosition);
}
```

And replace the code used to calculate the attenuation with the following.

```glsl
// Attenuation
if (light.type != 3) {
  float dist = length(light.position - vPosition);
  attenuation = 1.0 / (light.constant + light.linear * dist + light.quadratic * dist * dist);
}
```

In the ***more_lights.js*** file, add an additional light source to the light sources array.

```javascript
{
  type        : 3,
  position    : [0, 0, 0],
  direction   : [2, -1, -1],
  colour      : [1, 0, 1],
  constant    : 1.0,
  linear      : 0.1,
  quadratic   : 0.02,
  cutoff      : 0,
  innerCutoff : 0,
},
```

:::

Here we have defined a directional light source with the direction vector $(2, -1, -1)$ which will produce light rays coming down from the top right as we look down the $z$-axis. The light source colour has been set to magenta using the RGB values $(1, 0, 1)$. Refresh your web browser and you should see the following.

```{figure} ../_images/08_cubes_directional_light.png
:width: 80%
:name: cubes-directional-light-figure

Cubes lit using a point light, spotlight and directional light.
```

---

## Exercises

1. Experiment with the positions, colours and material properties of the various light sources to see what effects they have.

2. Use a spotlight to model a flashlight controlled by the user such that the light is positioned at $\vec{eye}$, is pointing in the same direction as $\vec{front}$ and has a spread angle of $\phi = 15^\circ$. Turn off all other light sources for extra spookiness.
   
<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/08_flash_light.mp4" type="video/mp4">
</video>
</center>

3. Change the colour of the second point light source to magenta and rotate its position in a circle centred at (0,0,-5) with radius 5. Turn off the spotlight and directional light. Hint: the coordinates of points on a circle can be calculated using $(x, y, z) = (c_x, c_y, c_z) + r (\cos(t), 0, \sin(t))$ where $r$ is the radius $t$ is some parameter (e.g., time).

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/08_rotating_light.mp4" type="video/mp4">
</video>
</center>

4. Add the ability to turn the lights off and on using keyboard input.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/08_lights_on_off.mp4" type="video/mp4">
</video>
</center>

---

## Video walkthrough

The video below walks you through these lab materials.

<iframe width="560" height="315" src="https://www.youtube.com/embed/-hyZHa3jXzs?si=4-N9Nhlv5VBjnn2b" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>