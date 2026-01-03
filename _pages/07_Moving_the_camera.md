(moving-the-camera-section)=

# Lab 7: Moving the Camera

In the [Lab 6: 3D Worlds](3D-worlds-section) we saw how we use transformations to build a 3D world, align the world to the camera position and project the view space onto the screen space. We also created a Camera class to contains methods to perform these calculations. The next step is to modify the Camera class to be able to move and direct the camera around the 3D world.

:::{admonition} Task
:class: tip

Create a folder called ***Lab 7_Moving the Camera*** and copy across the contents of your ***Lab 6_3D_worlds*** folder (you will need to have completed [Lab 6: 3D Worlds](3D-worlds-section) before proceeding with this one). Change the filename of ***3D_worlds.js*** to ***moving_the_camera.js*** and edit ***index.html*** so that uses this file.
:::

Load ***index.html*** in a live server to check everything is working ok.

```{figure} ../_images/07_moving_the_camera.png
:width: 80%
:name: moving-the-camera-figure

The cubes from [Lab 6: 3D Worlds](3D-worlds-section).
```

---

## Using keyboard input to move the camera

We are going to use keyboard input to change the coordinates of the eye vector (i.e., the camera position). Recall the view matrix from [Lab 4: 3D Worlds](3D-worlds-section) where we introduced the camera vectors seen in {numref}`camera-vectors-figure-2`.

```{figure} ../_images/05_view_space_alignment.svg
:width: 400
:name: camera-vectors-figure-2

Camera vectors
```

Since these three vectors point to the right, up and to the front of the camera we can use these to move the camera in those directions. For example, to move the camera forwards and backwards we simply add and subtract the front vector to the $\vec{eye}$ vector ({numref}`camera-movement-figure`).

```{figure} ../_images/07_camera_movement.svg
:width: 500
:name: camera-movement-figure

Moving the camera forwards and backwards.
```

We need to get keyboard input from the user and use it to move the camera. To do this we are going to use the built-in JavaScript method `window.addEventListener()` that lets you listen to events happening in the browser window, e.g., key presses and mouse movement.

:::{admonition} Task
:class: tip

Change the constructor declaration in the ***camera.js*** file so that a canvas object is inputted.

```javascript
class Camera {

  constructor(canvas) {
```

Then add the following to the Camera class constructor.

```javascript
 // Movement and settings
this.keys      = {};

// Keyboard and mouse Input
this.canvas = canvas;
window.addEventListener("keydown", e => this.keys[e.key] = true);
window.addEventListener("keyup"  , e => this.keys[e.key] = false);
```

:::

Here we have created an empty JavaScript object called `keys` and two event listeners which will listen for when a key is pressed and when it is released. For example, if we press the <kbd>W</kbd> key down when the browser window is active then `"w"` will be added to the `keys` object and assigned true value. When we release the <kbd>W</kbd> key the value will be changed to false.

We now need to change the position of the camera, i.e., the $\vec{eye}$ vector, based on the state of the `keys` object.

:::{admonition} Task
:class: tip

Add the following method definition to the Camera class.

```javascript
// Update movement
update () {

  // Update camera vectors
  this.updateVectors();

  // Camera movement
  let vel = new Vec3(0, 0, 0);

  if (this.keys["w"]) vel = vel.add(this.front);
  if (this.keys["s"]) vel = vel.subtract(this.front);
  if (this.keys["a"]) vel = vel.subtract(this.right);
  if (this.keys["d"]) vel = vel.add(this.right);
  
  if (vel.length() > 0) this.eye = this.eye.add(vel.normalize());
}
```

:::

Here we created a method to update the camera vectors based on the keyboard input. After we call the `.updateVectors()` method to calculate the $\vec{right}$ and $\vec{up}$ vectors, we create a velocity vector and initialise it to zeros. We then check the state of the <kbd>W</kbd>, <kbd>S</kbd>, <kbd>A</kbd> and <kbd>D</kbd> keys and if any of these are true we add the $\vec{front}$ or $\vec{right}$ vectors to the velocity vector. This is normalized and then added to the $\vec{eye}$ vector.

:::{admonition} Task
:class: tip

Change the creation of the Camera object so that it now takes in the canvas input.

```javascript
// Camera object
const camera = new Camera(canvas);
```

Then replace the code used to update the camera vectors with the following.

```javascript
// Update camera vectors
camera.update();
```

:::

Now our WebGL application will listen to any keyboard input and move the camera using the WSAD keys. Refresh your browser and have a play with moving the camera around. 

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/videos/07_keyboard_1.mp4" type="video/mp4">
</video>
</center>

---

## Controlling the speed of the camera

Playing around with the camera movement you will also notice that the controls are quite sensitive and not very satisfying to use. To fix this we can control the speed at which the camera moves in the world space. Speed is distance divided by time so to ensure that the camera moves at a chosen speed we need to calculate the time that has elapsed since the previous frame was rendered.

We saw when we applied animations to the rectangle in the lab [Lab 6: Transformations](animating-objects-section) that the `requestAnimationFrame()` function provides the time that has elapsed since the WebGL application was started, so we can use this to measure the time that has elapsed since the previous frame was rendered and use this in our movement calculations.

:::{admonition} Task
:class: tip

Before the `render()` function add the following line of code

```javascript
// Timer
let lastTime = 0;
```

Then edit the commands to update the camera vectors, so it looks like the following.

```javascript
// Update camera vectors
const dt = (time - lastTime) * 0.001;
lastTime = time;
camera.update(dt);
```

:::

Here we have created the variable `lastFrame` which is used to store the time (in milliseconds) that has elapsed when the previous frame was rendered. We use this and the current time to calculate the change in time between the two frames `dt` in second which we have entered this as an input in the `.update()` Camera class method, so we now need to update that.

:::{admonition} Task
:class: tip

First add the following to the Camera class constructor.

```javascript
this.speed     = 5;
```

Then change the `.update()` method declaration so that it takes in the `dt` input.

```javascript
// Update movement
update(dt) {
```

Finally, change the calculation of the new $\vec{eye}$ vector to the following.

```javascript
const move = this.speed * dt;
if (vel.length() > 0) this.eye = this.eye.add(vel.normalize().scale(move));
```
:::

So here we have set the speed of our camera to 5 units per second and have scaled the velocity vector by this speed before it is added to the $\vec{eye}$ vector. The speed you choose is arbitrary, and we can change this to suit our needs, e.g., simulating a character sprinting. Refresh your browser and have a play with the controls, and you should have a much more satisfying result.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/videos/07_keyboard_2.mp4" type="video/mp4">
</video>
</center>

---

## Using the mouse to point the camera

We can now move the camera position using keyboard inputs but we cannot yet point the camera in a different direction. This is usually done using mouse inputs but can also done using keyboard or game controllers.

### Yaw, pitch and roll

The direction which the camera is pointing is governed by three angles called $yaw$, $pitch$ and $roll$ which are collectively known as <a href="https://en.wikipedia.org/wiki/Euler_angles" target="_blank">**Euler angles**</a>. The name of these come from the aviation industry where they are related to the direction that an aircraft is facing. A plane on the ground first needs to taxi to the end of a runway which is does by steering left and right in the horizontal direction by changing its $yaw$ angle. Then on take off it can point its nose upwards in the vertical direction by changing its $pitch$ angle. Once airborne the plane can move its wingtips up and down thus changing its $roll$ angle. Our camera is analogous to the plane ({numref}`yaw-pitch-roll-figure`).

```{figure} /_images/07_yaw_pitch_roll.svg
:width: 300
:name: yaw-pitch-roll-figure

Yaw, pitch and roll
```

To point our camera we only need the $yaw$ and $pitch$ angles which we are going to change using mouse inputs such that when the mouse is moved left and right the $yaw$ angle changes and when the mouse is moved up and down the $pitch$ angle changes. Our `.lookAt()` method uses the front vector to calculate the view matrix so we need some way of calculating the front vector from the $yaw$ and $pitch$ angles.

```{figure} /_images/07_yaw.svg
:name: yaw-figure
:width: 350

Looking down the $y$-axis.
```

Consider ({numref}`yaw-figure`) that shows the front vector which is at an angle $yaw$ from the positive $z$-axis. The $x$ and $y$ components of the rotated vector are the adjacent and opposite sides of the right-angled triangle. Remembering that $\cos(\theta) = adjacent/hypotenuse$ and $\sin(\theta) = opposite/hypotenuse$, if front is a unit vector then $hypotenuse=1$ and $x$ and $y$ components of the vector are

$$ \begin{align*}
    \vec{front}_x &= \sin(yaw), \\
    \vec{front}_z &= \cos(yaw).
\end{align*} $$

```{figure} /_images/07_pitch.svg
:name: pitch-figure
:width: 350

Looking down the $x$-axis.
```

We now do the same for the $pitch$ angle. The $z$ (and $x$) component of the vector is the adjacent side and the $y$ component is the opposite side, i.e.,

$$ \begin{align*}
    \vec{front}_x &= \cos(pitch), \\
    \vec{front}_y &= \sin(pitch), \\
    \vec{front}_z &= \cos(pitch).
\end{align*} $$

Combining this with the $yaw$ rotation gives

$$ \begin{align*}
    \vec{front}_x &= \cos(pitch) \sin(yaw), \\
    \vec{front}_y &= \sin(pitch), \\
    \vec{front}_z &= \cos(pitch) \cos(yaw) .
\end{align*} $$

This is the conversion between the $yaw$ and $pitch$ Euler angles and unit vector. However, this assumes alignment with the positive $z$-axis and in WebGL we look down the $z$-axis so we need to negate $\vec{front}_z$. Therefore

$$ \vec{front} = (\cos(pitch) \sin(yaw), \sin(pitch), -\cos(pitch) \cos(yaw)).$$(eq-euler-to-vector)

So now we can calculate the front vector from the $yaw$ and $pitch$ Euler angles. To apply this to our Camera class we need to add attributes for the $yaw$ and $pitch$ Euler angles and calculate the $\vec{front}$ vector.

:::{admonition} Task
:class: tip

Add the following to the Camera class constructor.

```javascript
// Rotation
this.yaw   = 0;
this.pitch = 0;
this.turnSpeed = 0.005;
```

And edit the `.updateVectors()` method so that it looks like the following.

```javascript
// Update camera vectors
updateVectors() {
  const cy = Math.cos(this.yaw);
  const cp = Math.cos(this.pitch);
  const sy = Math.sin(this.yaw);
  const sp = Math.sin(this.pitch);

  this.front = new Vec3(cp * sy, sp, -cp * cy).normalize();
  this.right = this.front.cross(this.worldUp).normalize();
  this.up    = this.right.cross(this.front).normalize();
}
```

:::

Here, along with declaring variables for the $yaw$ and $pitch$ angles, we have decalared a variable that governs the speed at which the camera turns when we move the mouse. We have also calculated the $\vec{front}$ vector using equation {eq}`eq-euler-to-vector`.

### Getting the mouse input

We need a way of recording the input from the mouse and adjusting the $yaw$ and $pitch$ angles.

:::{admonition} Task
:class: tip

Add the following to the Camera class constructor.

```javascript
canvas.addEventListener("click", () => canvas.requestPointerLock());
document.addEventListener("mousemove", e => this.mouseMove(e));
```

:::

Here we have added two event listeners. The first detects whether the mouse has been clicked in the browser window and if so, hides the mouse pointed and locks it to the canvas using `.requestPointerLock()`. The second uses the `.mouseMove()` method which we will now write to return the $x$ and $y$ coordinates (in pixels) of the mouse pointer.

:::{admonition} Task
:class: tip

Add the following method to the Camera class.

```javascript
// Move look
mouseMove(e) {
  if (document.pointerLockElement !== this.canvas) return;
  this.yaw   += e.movementX * this.turnSpeed;
  this.pitch -= e.movementY * this.turnSpeed;
}
```
:::

Here we have defined a simple method to update the $pitch$ and $yaw$ angles based on the mouse cursor movement. Note that we subtract the $y$ coordinate from the $pitch$ angle becase the mouse coordinates are relative to the top left-hand corner of the canvas.

Running the program and we can now move around our world space and point the camera using the mouse.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/videos/07_mouse_1.mp4" type="video/mp4">
</video>
</center>

### Limiting the pitch angle

A problem that we have with our camera is that when we try to look straight up or straight down the orientation of the world flips. Position the camera above (or below) the crates and move the camera past $90^\circ$ and $-90^\circ$.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/videos/06_mouse_3.mp4" type="video/mp4">
</video>
</center>

This is due to the calculation of $\cos(pitch)$ and $\sin(pitch)$ in equation {eq}`eq-euler-to-vector`. To prevent this we can limit the $pitch$ angle in the `.mouseMove()` Camera class method.

:::{admonition} Task
:class: tip

Add the following code to the `.mouseMove()` method in the ***camera.js*** file. 

```javascript
// Limit the pitch angle to -89 degrees < pitch < 89 degrees
const pitchLimit = 89 * Math.PI / 180;
this.pitch = Math.max(-pitchLimit, Math.min(pitchLimit, this.pitch));
```
:::

Refresh your web browser and try to look straight up or down towards the crates and you should find that the camera is prevented from moving past $\pm 90^\circ$.

---

## Back face culling

Whilst moving your camera around your 3D world you may notice that we can move through objects and view them from the inside. All surfaces of the cubes are rendered, including those not visible from the camera because they are on the far side of the cubes. This is a waste of resources as WebGL is calculating the vertex and fragment shaders for objects that won't be shown in the frame. To overcome this we can cull (omit) any surface of an object that is **back facing** the camera in a method called **back face culling**.

(normal-vector-section)=

A **normal vector** (often just referred to as a **normal**) is a vector denoted by $\vec{n}$ that is perpendicular to a surface at a given point ({numref}`normal-vector-figure`).

```{figure} /_images/07_normal_vector.svg
:width: 350
:name: normal-vector-figure

The surface normal vector.
```

Since in computer graphics are surfaces are triangles, we can easily calculate a normal vector using a [cross product](cross-product-section). If a triangle has vertices $\vec{v}_0$, $\vec{v}_1$ and $\vec{v}_2$ then the normal vector can be calculated using

$$ \vec{n} = (\vec{v}_1 - \vec{v}_0) \times (\vec{v}_2 - \vec{v}_1). $$

A surface is said to be back facing it its normal vector is pointing away from the camera position. If we only render the front facing surfaces then, assuming the surfaces are opaque, we should not notice any difference and we have halved the number of surfaces the shader has to deal with ({numref}`backface-culling-figure`).

```{figure} /_images/07_backface_culling.svg
:width: 300
:name: backface-culling-figure

Back face culling removes surfaces with vectors pointing away from the camera.
```

But how do we know if a surface is back facing? Consider {numref}`back-facing-figure` which shows a back facing surface.

```{figure} /_images/07_back_facing_polygon.svg
:width: 400
:name: back-facing-figure

A back facing surface.
```

Here $\vec{v}$ is a vector pointing from the camera to a point on the surface. Recall that the [dot product](dot-product-section) is related to the angle between two vectors, i.e.,

$$ \vec{n} \cdot \vec{v} = \| \vec{n} \| \| \vec{v} \| \cos(\theta). $$

If we have a back facing surface then $\theta$ is less than 90$^\circ$ and $\cos(\theta)$ is a positive number so

$$\begin{align*}
  \vec{n} \cdot \vec{v} > 0.
\end{align*}$$

So to apply back face culling the vertex shader just has to calculate the dot product between the $\vec{n}$ and $\vec{v}$ vectors and if it is a positive number it ignores the surface from then on.

:::{admonition} Task
:class: tip

Add the following line of code to the `initWebGL()` function in the ***webGLUtils.js*** file.

```javascript
gl.enable(gl.CULL_FACE);
```
:::

Refresh your web browser and use the keyboard and mouse to put the camera inside a cube. You will now see that the back faces haven't been rendered.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/videos/07_mouse_2.mp4" type="video/mp4">
</video>
</center>

---

## Exercises

1. Make it so that the camera position always has a $y$ co-ordinate of 0, i.e., like a first-person shooter game where the player cannot fly around the world.
2. Add the ability for the user to perform a jump by pressing the space bar. The jump should last for 1 second and the camera should follow a smooth arc. Hint: the function $y = h \sin(\pi t)$ produces values of $y=0$ when $t = 0$ or $t = 1$ and $y = h$ when $t = 0.5$.
3. Add collision detection so that the camera cannot pass through the cube objects. A simple (but crude) way of doing this is

    - Loop through all the cubes
      - Calculate the distance between the $\vec{eye}$ vector and the centre of the current cube
      - If this distance is less than 1, move the $\vec{eye}$ away from the centre of the current cube so that the distance is now 1

---

## Video walkthrough

The video below walks you through these lab materials.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Au7U-dJobM8?si=1Ajdd3NEsGcbf1cJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>