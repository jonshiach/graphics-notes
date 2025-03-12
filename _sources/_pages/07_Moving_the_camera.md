(moving-the-camera-section)=

# Moving the camera

In the [previous lab](3D-worlds-section) we saw how we use transformations to build a 3D world, align the world to the camera position and project the view space onto the screen space. We also created a Camera class to contains functions to perform these calculations. The next step is to modify the Camera class to by able to move and direct the camera around the 3D world.

Compile and run the **Lab07_Moving_the_camera** project and you will see the multiple cube example we created at the end of the last lab.

```{figure} ../_images/07_Moving_the_camera.png
:width: 500
:name: moving-the-camera-figure

Multiple cubes from [6. 3D Worlds](3D-worlds-section).
```

## Using keyboard input to move the camera

The first thing we need to do is add a method to our Camera class to move the camera in the world space. We want to be able to move the camera forward and backwards, left and right, up and down. Recall the view matrix from the previous lab on [3D Worlds](3D-worlds-section) where we introduced the camera vectors seen in {numref}`camera-vectors-figure-2`.

```{figure} ../_images/06_view_space_alignment.svg
:width: 400
:name: camera-vectors-figure-2

Camera vectors
```

Since these three vectors point to the right, up and to the front of the camera we can use these to move the camera in those directions. For example, to move the camera forwards and backwards we simply add and subtract the $\mathbf{front}$ vector to the $\mathbf{eye}$ vector ({numref}`camera-movement-figure`).

```{figure} ../_images/07_camera_movement.svg
:width: 500
:name: camera-movement-figure

Moving the camera forwards and backwards.
```

Add the following camera vectors to the class definition in the **camera.hpp** file so they can be accessed outside of the `lookAt()` function

```cpp
glm::vec3 right   = glm::vec3(1.0f, 0.0f,  0.0f);
glm::vec3 up      = glm::vec3(0.0f, 1.0f,  0.0f);
glm::vec3 front   = glm::vec3(0.0f, 0.0f, -1.0f);
```

Here we have specified that the camera is pointing straight down the $z$-axis.

### Getting the keyboard input

We now need to get keyboard input from the user and use it to move the camera. If you take a look at the **Lab07_Moving_the_camera.cpp** file at the bottom we have the function `keyboardInput()` which currently contains a single if statement that uses the function `glfwGetKey()` to detect whether the escape key has been pressed. This is called in the render loop so that at each frame the program is checking for keyboard inputs. Add the following code to the `keyboardInput()` function.

```cpp
// Move the camera using WSAD keys
if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
    camera.eye += camera.front;

if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
    camera.eye -= camera.front;

if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
    camera.eye -= camera.right;

if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
    camera.eye += camera.right;
```

Here we've used the classic WSAD key combination to control the movement of the camera by adding and subtracting the $\mathbf{front}$ and $\mathbf{right}$ vectors to the $\mathbf{eye}$ vector.

We also need to change the $\mathbf{target}$ vector which is used by the `glm::lookAt()` function in the Camera class so that the camera is pointing down the $z$-axis. In the **Camera.cpp** file, change the `calculateMatrices()` method so that the call to the `lookAt()` function looks like the following

```cpp
// Calculate the view matrix
view = glm::lookAt(eye, eye + front, worldUp);
```

Here we have replaced `target` with `eye + front` so that the target is always in front of the camera. Run your program and experiment with moving the camera. Run your program and you should see that the camera always points down the $z$-axis.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/07_keyboard_2.mp4" type="video/mp4">
</video>
</center>

## Controlling the speed of the camera

Playing around with the camera movement you will also notice that the controls are quite sensitive and not very satisfying to use. To fix this we can control the speed at which the camera moves in the world space. Speed is distance divided by time so to ensure that the camera moves at a chosen speed we need to calculate the time that has elapsed since the previous frame was rendered. We saw when we applied animations to the rectangle in the lab [05 Transformations](animating-objects-section) that we could use the `glfwGetTime()` function to get the current time since the application was started. So to calculate the time since the previous frame was rendered we simply use a variable to store the time and subtract its value from the current time. 

Before the `main()` function, declare a variable for storing the time of the previous frame

```cpp
// Frame timer
float previousTime = 0.0f;    // time of previous iteration of the loop
float deltaTime    = 0.0f;    // time elapsed since last iteration of the loop
```

Then at the beginning of the render loop add the following code

```cpp
// Update timer
float time   = glfwGetTime();
deltaTime    = time - previousTime;
previousTime = time;
```

So `deltaTime` is the time elapsed since the previous frame was rendered and we can now use it to control the speed of our camera movement. In the `keyboardInputs()` function, edit the code so that is looks like the following

```cpp
if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
        camera.eye += 5.0f * deltaTime * camera.front;
```

and do similar for the other three directions. Here we have chosen to move the camera at a speed of 5 units per second. This is of course arbitrary and we can change this to suit our needs, e.g., simulating a character sprinting in a first person shooter game. Compile and run your program and you should have a much more satisfying result.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/07_keyboard_3.mp4" type="video/mp4">
</video>
</center>

---

## Using the mouse to point the camera

We can now move the camera position using keyboard inputs but we cannot yet point the camera in a different direction. This is usually done using mouse inputs but can also done using keyboard or game controllers.

First we need to capture the mouse inputs. Take a look at the `main()` function, just after the window is created we call the `glfwSetInputMode()` which enables use to capture the keyboard inputs. So to capture the mouse input we need to do similar. Enter the following code just after we capture the keyboard inputs.

```cpp
// Capture mouse inputs
glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
glfwPollEvents();
glfwSetCursorPos(window, 1024 / 2, 768 / 2);
```

These functions are:

- `glfwSetInputMode()` captures the mouse input (in addition to the earlier call to the same function to capture the keyboard inputs) and hides the mouse cursor
- `glfwPollEvents()` processes any events in the event queue, in other words it checks for a mouse input right away
- `glfwSetCursorPos()` specifies the position of the mouse cursor in the window, here we have set this to the centre of the window

### Yaw, pitch and roll

The direction which the camera is pointing is governed by three angles called $yaw$, $pitch$ and $roll$ which are collectively known as <a href="https://en.wikipedia.org/wiki/Euler_angles" target="_blank">**Euler angles**</a>. The name of these come from the aviation industry where they are related to the direction that an aircraft is facing. A plane on the ground first needs to taxi to the end of a runway which is does by steering left and right in the horizontal direction by changing its $yaw$ angle. Then on take off it can point its nose upwards in the vertical direction by changing its $pitch$ angle. Once airborne the plane can move its wingtips up and down thus changing its $roll$ angle. Our camera is analogous to the plane ({numref}`yaw-pitch-roll-figure`).

```{figure} /_images/07_yaw_pitch_roll.svg
:width: 300
:name: yaw-pitch-roll-figure

Yaw, pitch and roll
```

To point our camera we only need the $yaw$ and $pitch$ angles which we are going to change using mouse inputs such that when the mouse is moved left and right the $yaw$ angle changes and when the mouse is moved up and down the $pitch$ angle changes. The problem we have is that our `lookAt()` function uses the $\mathbf{front}$ vector to calculate the view matrix so we need some way of calculating the $\mathbf{front}$ vector from the $yaw$ and $pitch$ angles.

```{figure} /_images/07_yaw.svg
:name: yaw-figure
:width: 250

Rotating the vector $(1,0,0)$ about the $y$-axis by the $yaw$ angle.
```

Consider ({numref}`yaw-figure`) that shows the $\mathbf{front}$ vector initially pointing along the $x$-axis rotated about the $y$-axis by the $yaw$ angle. The $x$ and $y$ components of the rotated vector are the adjacent and opposite sides of the right-angled triangle. Remembering that $\cos(\theta) = \dfrac{adjacent}{hypotenuse}$ and $\sin(\theta) = \dfrac{opposite}{hypotenuse}$, if $\mathbf{front}$ is a unit vector then $hypotenuse=1$ and  $x$ and $y$ components of the rotated vector are

$$ \begin{align*}
    \mathbf{front}_x &= \cos(yaw), \\
    \mathbf{front}_z &= \sin(yaw).
\end{align*} $$

```{figure} /_images/07_pitch.svg
:name: pitch-figure
:width: 250

Rotating the vector $(\cos(yaw), 0, \sin(yaw))$ upwards by the $pitch$ angle.
```

We now do the same for rotating the $\mathbf{front}$ vector, which lies on the horizontal plane, upwards by the $pitch$ angle. The $x$ and $y$ components of the rotated vector are the adjacent side and the $y$ component is the opposite side. Once again if $\mathbf{front}$ is a unit vector then the components of the rotated vector are

$$ \begin{align*}
    \mathbf{front}_x &= \cos(pitch), \\
    \mathbf{front}_y &= \sin(pitch), \\
    \mathbf{front}_z &= \cos(pitch).
\end{align*} $$

Combining this with the $yaw$ rotation gives

$$ \begin{align*}
    \mathbf{front}_x &= \cos(yaw) \cos(pitch), \\
    \mathbf{front}_y &= \sin(pitch), \\
    \mathbf{front}_z &= \sin(yaw) \cos(pitch).
\end{align*} $$

So now we can calculate the $\mathbf{front}$ vector from the $yaw$ and $pitch$ Euler angles. To apply this to our Camera class we need to add attributes for the $yaw$, $pitch$ and $roll$ Euler angles (we don't really need the $roll$ angle for now but we may wish to add the facility to roll the camera in the future). Add the following code to the Camera class declaration.

```cpp
// Camera Euler angles
float yaw   = Maths::radians(-90.0f);
float pitch = 0.0f;
float roll  = 0.0f;
```

Since our rotation of the $\mathbf{front}$ vector assumes it is initially pointing along the $x$-axis we use an initial $yaw$ angle of $-90^\circ$ to rotate it so it is pointing down the $z$-axis. We now need to add a method to the Camera class to calculate the $\mathbf{front}$, $\mathbf{right}$ and $\mathbf{up}$ camera vectors from the Euler angles. In the **camera.hpp** file add the following method declaration.

```cpp
void calculateCameraVectors();
```

Then in the **camera.cpp** define the method using the following code.

```cpp
void Camera::calculateCameraVectors()
{
    front = glm::vec3(cos(yaw) * cos(pitch), sin(pitch), sin(yaw) * cos(pitch));
    right = glm::normalize(glm::cross(front, worldUp));
    up    = glm::cross(right, front);
}
```

Here we have calculated the $\mathbf{front}$ vector from the Euler angles and the $\mathbf{right}$ and $\mathbf{up}$ vectors in the same way used for the [view matrix](view-matrix-section). We need to use this method before we calculate the view matrix in the `calculateMatrices()` method so add the following code before we call the `glm::lookAt()` function

```cpp
// Calculate camera vectors
calculateCameraVectors();
```

### Getting the mouse input

We need a way of recording the input from the mouse and adjusting the $yaw$ and $pitch$ angles. To do this we are going to write a function called `mouseInput()` that is similar to the one already used for the keyboard inputs. In the **Lab07_Moving_the_camera.cpp** file add the following function prototype near the top of the file where we have one for the `keyboardInputs()` function.

```cpp
void mouseInput(GLFWwindow *window);
```

Then at the very bottom of the file define the function by entering the following code.

```cpp
void mouseInput(GLFWwindow *window)
{
    // Get mouse cursor position and reset to centre
    double xPos, yPos;
    glfwGetCursorPos(window, &xPos, &yPos);
    glfwSetCursorPos(window, 1024 / 2, 768 / 2);

    // Update yaw and pitch angles
    camera.yaw   += 0.0005f * float(xPos - 1024 / 2);
    camera.pitch += 0.0005f * float(768 / 2 - yPos);
}
```

Here we use the function `glfwGetCursorPos()` to get the pixel coordinates of the mouse pointer and then we reset this to the window centre using the `glfwSetCursorPos()` function. This is so that the mouse cursor does not eventually move out of the window. The $yaw$ and $pitch$ angles are then adjusted based on the number of pixels that the mouse cursor moves the centre of the window (note that we subtract `yPos` from the centre coordinates since pixel coordinates assume $(0,0)$ is the top-left hand corder of the display). The distances that the mouse cursor moves is multiplied by a factor of 0.0005 to limit the mouse sensitivity, you may need to make adjustments this value depending on your setup. Finally, the camera vectors are then calculated using the new $yaw$ and $pitch$ angles.

We now need to invoke our mouse input function for each iteration of the render loop. Add the following code beneath where the `keyboardInput()` function is called.

```cpp
mouseInput(window);
```

Running the program and we can now move around our world space and point the camera in any direction we want.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/07_mouse.mp4" type="video/mp4">
</video>
</center>

---

## Back face culling

Whilst moving your camera around your 3D world you may notice that we can move through objects and view them from the inside. All surfaces of the cubes are rendered, including those not visible from the camera because they are on the far side of the cubes. This is a waste of resources as OpenGL is calculating the vertex and fragment shaders for objects that won't be shown in the frame. To overcome this we can cull (omit) any surface of an object that is **back facing** the camera in a method called **back face culling**.

(normal-vector-section)=

A **normal vector** (often just referred to as a **normal**) is a vector denoted by $\mathbf{n}$ that is perpendicular to a surface at a given point ({numref}`normal-vector-figure`).

```{figure} /_images/07_normal_vector.svg
:width: 250
:name: normal-vector-figure

The surface normal vector.
```

Since in computer graphics are surfaces are triangles, we can easily calculate a normal vector using a [cross product](cross-product-section). If a triangle has vertices $\mathbf{v}_0$, $\mathbf{v}_1$ and $\mathbf{v}_2$ then the normal vector can be calculated using

$$ \mathbf{n} = (\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{v}_2 - \mathbf{v}_1). $$

A surface is said to be back facing it its normal vector is pointing away from the camera position. If we only render the front facing surfaces then, assuming the surfaces are opaque, we should not notice any difference and we have halved the number of surfaces the shader has to deal with ({numref}`backface-culling-figure`). 

```{figure} /_images/07_backface_culling.svg
:width: 300
:name: backface-culling-figure

Back face culling removes surfaces with vectors pointing away from the camera.
```

But how do we know if a surface is back facing? Consider {numref}`back-facing-figure` which shows a back facing surface.

```{figure} /_images/07_Back_facing.svg
:width: 400
:name: back-facing-figure

A back facing surface.
```

Here $\mathbf{v}$ is a vector pointing from the camera to a point on the surface. Recall that the [dot product](dot-product-section) is related to the angle between two vectors, i.e.,

$$ \mathbf{n} \cdot \mathbf{v} = \| \mathbf{n} \| \| \mathbf{v} \| \cos(\theta). $$

If we have a back facing surface then $\theta$ is less than 90$^\circ$ and $\cos(\theta)$ is a positive number so

$$\begin{align*}
  \mathbf{n} \cdot \mathbf{v} > 0.
\end{align*}$$

So to apply back face culling the vertex shader just has to calculate the dot product between the $\mathbf{n}$ and $\mathbf{v}$ vectors and if it is a positive number it ignores the surface from then on. To apply back face culling in OpenGL all we need to do is add the following code to the `main()` function near where we invoke the depth testing.

```cpp
// Enable back face culling
glEnable(GL_CULL_FACE);
```

Compile and run your program and use the keyboard and mouse to put the camera inside a cube. You will now see that the back faces haven't been rendered.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/07_Back_face_culling.mp4" type="video/mp4">
</video>
</center>

---

## Exercises

1. Make it so that the camera position always has a $y$ co-ordinate of 0, i.e., like a first-person shooter game where the player cannot fly around the world.
2. Add the ability for the user to perform a jump by pressing the space bar. The jump should last for 1 second and the camera should follow a smooth arc. Hint: the function $y = h \sin(\pi t)$ produces values of $y=0$ when $t = 0$ or $t = 1$ and $y = h$ when $t = 0.5$.
3. Add collision detection so that the camera cannot pass through the cube objects. A simple (but crude) way of doing this is

    - Loop through all the cubes
      - Calculate the distance between the $\mathbf{eye}$ vector and the centre of the current cube
      - If this distance is less than 1, move the $\mathbf{eye}$ away from the centre of the current cube so that the distance is now 1

---

## Video walkthrough

The video below walks you through these lab materials.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Au7U-dJobM8?si=1Ajdd3NEsGcbf1cJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>