(moving-the-camera-section)=

# Lab 7: Moving the Camera

In the [Lab 6: 3D Worlds](3D-worlds-section) we saw how we use transformations to build a 3D world, align the world to the camera position and project the view space onto the screen space. We also created a Camera class to contains methods to perform these calculations. The next step is to obtain keyboard and mouse input and modify the Camera class to be able to move and direct the camera around the 3D world.

:::{admonition} Task
:class: tip

Create a copy of your ***Lab 6 - 3D Worlds*** folder, rename it ***Lab 7 - Moving the Camera***, rename the file ***3d_worlds.js*** to ***moving_the_camera.js*** and change ***index.html*** so that the page title is "Lab 7 - Moving the Camera" and it embeds the ***moving_the_camera.js*** file.
:::

Load ***index.html*** in a live server to check everything is working ok.

```{figure} ../_images/07_moving_the_camera.png
:width: 80%
:name: moving-the-camera-figure

The cubes from [Lab 6: 3D Worlds](3D-worlds-section).
```

---

## Getting keyboard and mouse input

We need a way to get keyboard and mouse input from the user and use it to move the camera. To do this we are going create a class to handle all inputs from the keyboard and mouse.

:::{admonition} Task
:class: tip

Add the following class to the ***webGLUtils.js*** file

```javascript
class Input {

    constructor() {
        this.keys = {};
        this.mouseDelta = { x: 0, y: 0 };

        window.addEventListener("keydown", e => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        canvas.addEventListener("click", () => 
            canvas.requestPointerLock()
        );

        document.addEventListener("mousemove", e => {
            if (document.pointerLockElement === canvas) {
                this.mouseDelta.x += e.movementX;
                this.mouseDelta.y += e.movementY;
            }
        });
    }

    isDown(key) {
        return this.keys[key.toLowerCase()];
    }

    consumeMouseDelta() {

        const dx = this.mouseDelta.x;
        const dy = this.mouseDelta.y;

        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;

        return { dx, dy };
    }
}
```

In the ***moving_the_camera.js*** file, add the following after we have created the camera object

```javascript
// Keyboard and mouse inputs
const input = new Input(canvas);
```

:::

Here we create an Input class that contains the following properties and methods:

- `keys` -- a JavaScript object that stores a boolean value for each key that is pressed
- `mouseDelta` -- a JavaScript object that stores the distance that the mouse pointer has moved since the last frame
- `addEventListener()` -- a method listens to events happening in the browser window
- `isDown()` -- a method that provides an easy way to check whether are particular key is being pressed
- `consumeMouseDelta()` -- a method that returns the values stored in `mouseDelta` and then resets it to zero


The event listeners are used to update the `keys` and `mouseDelta` properties. For example, if we press the <kbd>W</kbd> key down when the browser window is active then `"w"` will be added to the `keys` object and assigned true value. When we release the <kbd>W</kbd> key the value will be changed to false. 

---

## Using keyboard input to move the camera

Now that we have a way of capturing keyboard and mouse inputs, we are going to use keyboard input to change the coordinates of the $\vec{eye}$ vector, i.e., the camera position. Recall the view matrix from [Lab 6: 3D Worlds](3D-worlds-section) where we introduced the camera vectors seen in {numref}`camera-vectors-figure-2`.

```{figure} ../_images/06_view_space_alignment.svg
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

:::{admonition} Task
:class: tip

In the ***camera.js*** file, change the Camera class method `update()` so that is looks like the following

```javascript
update(input) {  

    this.right = normalize(cross(this.front, this.worldUp));
    this.up    = normalize(cross(this.right, this.front));

    // Camera movement
    let vel = [0, 0, 0];
    if (input.isDown("w")) vel = addVector(vel, this.front);
    if (input.isDown("s")) vel = subtractVector(vel, this.front);
    if (input.isDown("a")) vel = subtractVector(vel, this.right);
    if (input.isDown("d")) vel = addVector(vel, this.right);

    if (length(vel) > 0) {
        vel = normalize(vel);
        this.eye = addVector(this.eye, vel);
    }
}
```

In the ***moving_the_camera.js**, delete the code that sets the $\vec{eye}$ and $\vec{front}$ camera vectors and change the method call to `camera.upate()` so that it takes the `input` object.

```javascript
camera.update(input);
```

:::

Here we have made changes the `update()` camera class method to create a velocity vector and initialise it to all zeros. We then check whether any of the <kbd>W</kbd>, <kbd>S</kbd>, <kbd>A</kbd> and <kbd>D</kbd> keys are depressed, and if so we add the $\vec{front}$ or $\vec{right}$ vectors to the velocity vector. If the velocity vector is non-zero, so that a key is being pressed, we normalize it and add it to the $\vec{eye}$ vector.

Now our WebGL application will listen to any keyboard input and move the camera using the WSAD keys. Refresh your browser and have a play with moving the camera around.

<center>
<video autoplay controls muted="true" loop="true" width="500">
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
// Update camera
const dt = (time - lastTime) * 0.001;
lastTime = time;
camera.update(input, dt);
```

:::

Here we have created the variable `lastFrame` which is used to store the time (in milliseconds) that has elapsed when the previous frame was rendered. We use this and the current time to calculate the change in time between the two frames `dt` in second which we have added as an input parameter to the `update()` Camera class method, so we now need to update that.

:::{admonition} Task
:class: tip

First add the following to the Camera class constructor.

```javascript
// Movement settings
this.speed = 5;
```

Then change the `update()` method declaration so that it takes in the `dt` input.

```javascript
update(input, dt) {
```

Finally, change the calculation of the new $\vec{eye}$ vector to the following.

```javascript
this.eye = addVector(this.eye, scaleVector(vel, this.speed * dt));
```

:::

So here we have set the speed of our camera to 5 units per second and have scaled the velocity vector by this speed. The speed you choose is arbitrary, and we can change this to suit our needs, e.g., simulating a character sprinting. Refresh your browser and have a play with the controls, and you should have a much more satisfying result.

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/videos/07_keyboard_2.mp4" type="video/mp4">
</video>
</center>

---

## Using the mouse to point the camera

We can now move the camera position using keyboard inputs, but we cannot yet point the camera in a different direction. This is usually done using mouse inputs but can also be done using keyboard or game controllers.

### Yaw, pitch and roll

The direction which the camera is pointing is governed by three angles called $yaw$, $pitch$ and $roll$ which are collectively known as <a href="https://en.wikipedia.org/wiki/Euler_angles" target="_blank">Euler angles</a>. The name of these come from the aviation industry where they are related to the direction that an aircraft is facing. A plane on the ground first needs to taxi to the end of a runway which is does by steering left and right in the horizontal direction by changing its $yaw$ angle. Then on take off it can point its nose upwards in the vertical direction by changing its $pitch$ angle. Once airborne the plane can move its wingtips up and down thus changing its $roll$ angle. Our camera is analogous to the plane ({numref}`yaw-pitch-roll-figure`).

```{figure} /_images/07_yaw_pitch_roll.svg
:width: 300
:name: yaw-pitch-roll-figure

Yaw, pitch and roll
```

To point our camera we only need the $yaw$ and $pitch$ angles which we are going to change using mouse inputs such that when the mouse is moved left and right the $yaw$ angle changes and when the mouse is moved up and down the $pitch$ angle changes. Our `getViewMatrix()` method uses the front vector to calculate the view matrix, so we need some way of calculating the front vector from the $yaw$ and $pitch$ angles.

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

We now do the same for the $pitch$ angle. The $z$ (and $x$) component of the vector is the adjacent side and the $y$ component is the opposite side ({numref}`pitch-figure`), i.e.,

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

Add the following to the movement settings in the Camera class constructor

```javascript
this.turnSpeed = 0.005;  
this.yaw = 0;
this.pitch = 0;
```

And add the following before the $\vec{right}$ and $\vec{front}$ camera vectors are calculated in the `update()` method

```javascript
const { dx, dy } = input.consumeMouseDelta();
this.yaw += dx * this.turnSpeed;
this.pitch -= dy * this.turnSpeed;

const cy = Math.cos(this.yaw);
const cp = Math.cos(this.pitch);
const sy = Math.sin(this.yaw);
const sp = Math.sin(this.pitch);

this.front = normalize([cp * sy, sp, -cp * cy]);
```

:::

Here we have added Camera class properties for controlling the turn speed of the camera and storing the $yaw$ and $pitch$ angles. Then we have modified the `update()` Camera class method to get the mouse movement values from the input, use these to update the $yaw$ and $pitch$ angles and calculate the $\vec{front}$ vector using equation {eq}`eq-euler-to-vector`. Note that we have subtract `dy * turnSpeed` from the $pitch$ angle because the mouse movement is measured from the top of the canvas.

Running the program and we can now move around our world space and point the camera using the mouse.

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/videos/07_mouse_1.mp4" type="video/mp4">
</video>
</center>

### Limiting the pitch angle

A problem that we have with our camera is that when we try to look straight up or straight down the orientation of the world flips. Position the camera above (or below) the crates and move the camera past $90^\circ$ and $-90^\circ$.

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/videos/07_mouse_2.mp4" type="video/mp4">
</video>
</center>

This is due to the calculation of $\cos(pitch)$ and $\sin(pitch)$ in equation {eq}`eq-euler-to-vector`. To prevent this we can limit the $pitch$ angle in the `mouseMove()` Camera class method.

:::{admonition} Task
:class: tip

Add the following code to the `update()` Camera class method after the $pitch$ angle has been updated.

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

A surface is said to be back facing it its normal vector is pointing away from the camera position. If we only render the front facing surfaces then, assuming the surfaces are opaque, we should not notice any difference, and we have halved the number of surfaces the shader has to deal with ({numref}`backface-culling-figure`).

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
<video autoplay controls muted="true" loop="true" width="60%">
    <source src="../_static/videos/07_mouse_3.mp4" type="video/mp4">
</video>
</center>

---

## Exercises

1. Make it so that the camera position always has a $y$ coordinate of 0, i.e., like a first-person shooter game where the player cannot fly around the world.

2. Add the ability for the user to perform a jump by pressing the space bar. Hints:
   - To record when the space bar is pressed you can use `input.isDown(" ")`.
   - You will need a way of recording when the space bar was first pressed and when the jump has been completed. 
   - For a jump based on physics the height of the camera can be calculated for each frame using
  
    $$\vec{eye}_y = \vec{eye}_y + jump\, velocity \times \Delta t$$ 
   - The $jump \, velocity$ is initialised to some value (the larger the value the higher the jump), and is updated at each frame using

    $$jump \, velocity = jump \, velocity - 9.81 \times \Delta t$$

   - $9.81ms^{-2}$ is the acceleration due to gravity on Earth.

3. Add collision detection so that the camera cannot pass through the cube objects. A simple (but crude) way of doing this is

    - Loop through all the cubes
    - Calculate the distance between the $\vec{eye}$ vector and the centre of the current cube
    - If this distance is less than 1, move the $\vec{eye}$ away from the centre of the current cube so that the distance is now 1

---

## Video walkthrough

The video below walks you through these lab materials.

<iframe 
    width="560"
    height="315"
    src="https://www.youtube.com/embed/uIRpZXMt7eA?si=m7JHMkgnuKHf5lXY"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
></iframe>
