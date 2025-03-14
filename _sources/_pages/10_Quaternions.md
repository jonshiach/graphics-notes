(quaternions-section)=

# Quaternions

We saw in [5. Transformations](axis-angle-rotation-section) that we can use calculate a transformation matrix to rotate about a vector. This matrix was derived by compositing three individual rotations about the three co-ordinate $x$, $y$ and $z$ axes.

```{figure} ../_images/10_Euler_angles.svg
:width: 300
:name: euler-angles-figure

The pitch, yaw and roll Euler angles.
```

The angles that we use to define the rotation around each of the axes are known as **Euler angles** and we use the names **pitch**, **yaw** and **roll** for the rotation around the $x$, $y$ and $z$ axes respectively. The problem with using a composite of Euler angles rotations is that for certain alignments we can experience <a href="https://en.wikipedia.org/wiki/Gimbal_lock" target="_blank">**gimbal lock**</a> where two of the rotation axes are aligned leading to a loss of a degree of freedom causing the composite rotation to be *locked* into a 2D rotation.

Quaternions are a mathematical object that can be used to perform rotation operations that do not suffer from gimbal lock and require fewer floating point calculations. There is quite a lot of maths used here but in this page I've focussed only on the bits you need to know to apply quaternions. If you are interested in the derivations of the various equations see [Appendices - Complex Numbers and Quaternions](appendix-quaternions-section).

Compile and run the project and you will see that we have the scene consisting of the cubes last seen in [7. Moving the Camera](moving-the-camera-section).

```{figure} ../_images/10_Quaternions.png
:width: 500
```

---

## Complex Numbers

Before we delve into quaternions we must first look at complex numbers. Consider the following equation

$$ x^2 + 1 = 0. $$

Solving using simple algebra gives

$$ \begin{align*}
    x^2 + 1 &= 0 \\
    x^2 &= -1 \\
    x &= \sqrt{-1}.
\end{align*} $$

Here we have a problem since the square of a negative number always returns a positive value, e.g., $(-1) \times (-1) = 1$, so there does not exist a real number to satisfy the solution to this equation. Not being satisfied with this, mathematicians invented another type of number called the **imaginary number** that is defined by $i^2 = -1$ so the solution to the equation above is $x = i$.

```{note}
Some students find the concept of an imaginary number difficult to grasp. However, you have been using negative numbers for a while now and these are similar to the imaginary number since they do not represent a physical quantity, e.g., you can show me 5 coins but you cannot show me negative 5 coins. We developed negative numbers to help us solve problems, as we have also done with the imaginary number.
```

Imaginary numbers can be combined with real numbers to give us a **complex number** where a real number is added to a multiple of the imaginary number

$$ z = x + yi, $$

where $x$ and $y$ are real numbers, $x$ is known as the **real part** and $y$ is known as the **imaginary part** of a complex number.

Since a complex number consists of two parts we can plot them on a 2D space called the **complex plane** where the horizontal axis is used to represent the real part and the vertical axis is used to represent the imaginary part ({numref}`complex-plane-figure`).

```{figure} ../_images/10_Complex_plane.svg
:width: 400
:name: complex-plane-figure

The complex number $z = x + yi$ plotted on the complex plane.
```

We can see from {numref}`complex-plane-figure` that a complex number $z = x + yi$ can be thought of as a 2D vector pointing from $(0,0)$ to $(x, y)$. The length of this vector is known as the **magnitude** of $z$ denoted by $|z|$ and calculated using

$$|z| = \sqrt{x^2 + y^2}.$$

### Rotation using complex numbers

A very useful property of complex numbers, and the reason why we are interested in them, is that multiplying a number by $i$ rotates the number by $90^\circ$ in the complex plane. For example consider the complex number $2 + i$, multiplying repeatedly by $i$

$$ \begin{align*}
    (2 + i)i &= 2i + i^2 = -1 + 2i, \\
    (-1 +2i)i &= -i + 2i^2 = -2 - i, \\
    (-2 - i)i &= -2i - i^2 = 1 - 2i, \\
    (1 - 2i)i &= i - 2i^2 = 2 + i.
\end{align*} $$

So after mulitplying $2 + i$ by $i$ four times we are back to where we started. {numref}`complex-rotation-figure` shows these complex numbers plotted on the complex plane. Note how they have been rotated by $90^\circ$ each time.

```{figure} ../_images/10_Complex_rotation.svg
:width: 300
:name: complex-rotation-figure

Rotation of the complex number $2 + i$ by repeated multiplying by $i$.
```

So we have seen that multiplying a number by $i$ rotates it by 90$^\circ$, so how do we rotate a number by a different angle? {numref}`complex-rotation-2-figure` shows the rotation of the number 1 by $\theta$ anti-clockwise in the complex plane.

```{figure} ../_images/10_Complex_rotation_2.svg
:width: 300
:name: complex-rotation-2-figure

The complex number $z$ is the real number 1 rotated $\theta$ anti-clockwise in the complex plane.
```

Recall that $\cos(\theta) = \dfrac{adjacent}{hypotenuse}$ and $\sin(\theta) = \dfrac{opposite}{hypotenuse}$ and since the hypotenuse is 1 then

$$ z = \cos(\theta) + i \sin(\theta).$$

This means we can rotate by an arbitrary angle $\theta$ in the complex plane by multiplying by $z$. 

---

## Quaternions

A **quaternion** is an extension of a complex number where two additional imaginary numbers are used to extend from a 2D space to a 4D space. The general form of a quaternion is

$$ q = w + xi + yj + zk, $$

where $w$, $x$, $y$ and $z$ are real numbers and $i$, $j$ and $k$ are imaginary numbers which are related to $-1$ and each other by

$$i^2 = j^2 = k^2 = ijk = -1. $$

Quaternions are more commonly represented in scalar-vector form

$$q = [w, (x, y, z)].$$

## Quaternion magnitude

The **magnitude** of a quaternion $q = w + xi + yj + zk$ is denoted by $|q|$ and calculated in the same way as the magnitude of a 4-element vector

$$|q| = \sqrt{w^2 + x^2 + y^2 + z^2}.$$

## Quaternion dot product

The dot product between two quaternions $q_0 = w_0 + x_0i + y_0j + z_0k$ and $q_1 = w_1 + x_1i + y_1j + z_1k$ is denoted by $q_0 \cdot q_1$ and calculated in the same way as the dot product between two 4-element vectors

$$ q_0 \cdot q_1 = w_0w_1 + x_0x_1 + y_0y_1 + z_0z_1. $$

Quaternion dot product shares the same geometric interpretation as vector dot product, i.e.,

$$ q_0 \cdot q_1 = |q_0| |q_1| \cos(\theta),$$

where $\theta$ is the angle between $q_0$ and $q_1$. Rearranging this gives the expression for the angle between two quaternions

$$ \theta = \cos^{-1} \left( \frac{q_0 \cdot q_1}{|q_0| |q_1|} \right). $$

---
## Rotations using quaternions

We saw above that we can rotate a number in the complex plane by multiplying by the complex number

$$ z = \cos(\theta) + i\sin(\theta). $$

We can do similar in 3D space where the rotation around a unit vector $\hat{\mathbf{v}}$ by the angle $\theta$ can be achieved by multiplying a quaternion by the rotation quaternion

$$ q = [\cos(\tfrac{1}{2}\theta), \sin(\tfrac{1}{2}\theta) \hat{\mathbf{v}}], $$(rotation-quaternion-equation)

See [Appendix: Quaternion rotation](appendix-quaternion-rotation-section) for the derivation of this formula.

```{figure} ../_images/05_axis_angle_rotation.svg
:height: 300
:name: axis-angle-rotation-figure-2

Axis-angle rotation.
```

We have been using $4 \times 4$ matrices to compute the transformations to convert between model, view and screen spaces so in order to use quaternions for rotations we need to calculate a $4 \times 4$ rotation matrix that is equivalent to multiplying by the rotation quaternion from equation {eq}`rotation-quaternion-equation`. If $q = [w, (x, y, z)]$ is the rotation quaternion, then the corresponding rotation matrix is

$$ \begin{align*}
    Rotate &= 
    \begin{pmatrix}
        1 - s(y^2 + z^2) & s(xy + zw) & s(xz - yw) & 0 \\
        s(xy - zw) & 1 - s(x^2 + z^2) & s(yz + xw) & 0 \\
        s(xz + yw) & s(yz - xw) & 1 - s(x^2 + y^2) & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}
\end{align*} $$(quaternion-rotation-matrix-equation)

where $s = \dfrac{2}{w^2 + x^2 + y^2 + z^2}$ (see [Appendix: Rotation matrix](quaternion-rotation-matrix-derivation-section) for the derivation of this matrix).

In the **maths.hpp** file add the following method declaration to the Quaternion class

```cpp
glm::mat4 matrix();
```

Then in the **maths.cpp** file add the following method definition

```cpp
glm::mat4 Quaternion::matrix()
{
    float s = 2.0f / (w * w + x * x + y * y + z * z);
    float xs = x * s,  ys = y * s,  zs = z * s;
    float xx = x * xs, xy = x * ys, xz = x * zs;
    float yy = y * ys, yz = y * zs, zz = z * zs;
    float xw = w * xs, yw = w * ys, zw = w * zs;
    
    glm::mat4 rotate;
    rotate[0][0] = 1.0f - (yy + zz);
    rotate[0][1] = xy + zw;
    rotate[0][2] = xz - yw;
    rotate[1][0] = xy - zw;
    rotate[1][1] = 1.0f - (xx + zz);
    rotate[1][2] = yz + xw;
    rotate[2][0] = xz + yw;
    rotate[2][1] = yz - xw;
    rotate[2][2] = 1.0f - (xx + yy);
    
    return rotate;
}
```

We can now calculate the rotation matrix for a rotation quaternion `q` using `q.matrix()`. Comparing this code to the definition of `rotate()` in the **maths.cpp** file we can see the the the quaternion rotation matrix requires 16 multiplications compared to 24 multiplications to calculate the rotation matrix based on the composite of three separate rotations about the $x$, $y$ and $z$ axes and a translation. Efficiency is always a bonus but the main advantage is the quaternion rotation matrix does not suffer from gimbal lock.

So it makes sense to use the quaternion rotation matrix for our axis-angle rotations. Edit the `rotate()` function definition so that is looks like the following.

```cpp
glm::mat4 Maths::rotate(const float &angle, glm::vec3 v)
{
    v = glm::normalize(v);
    float c = cos(0.5f * angle);
    float s = sin(0.5f * angle);
    Quaternion q(c, s * v.x, s * v.y, s * v.z);

    return q.matrix();
}
```

Here we normalise the vector which we are rotating around before calculating the rotation quaternion `q` and returning its rotation matrix using equation {eq}`quaternion-rotation-matrix-equation`

Compile and run your program and you should see that nothing has changed. This is good news as we are now using efficient quaternion rotation to rotate the cubes and don't have to worry about gimbal lock.

### Calculating a quaternion from Euler angles

Quaternions can be thought of as a orientation in 3D space. Imagine a camera in the world space that is pointing in a particular direction. The direction in which the camera is pointing can be described with reference to the $x$, $y$ and $z$ axes in terms of the $pitch$ and $yaw$ Euler angles. Using the following abbreviations

$$ \begin{align*}
    c_p &= \cos\left(\frac{pitch}{2}\right), &
    s_p &= \sin\left(\frac{pitch}{2}\right), \\
    c_y &= \cos\left(\frac{yaw}{2}\right), &
    s_y &= \sin\left(\frac{yaw}{2}\right),
\end{align*} $$

then the quaternion that represents the camera orientation is

$$ q = [c_pc_y, (s_pc_y, c_ps_y, s_ps_y)]. $$(euler-to-quaternion-equation)

See [Appendix: Euler angles to quaternion](euler-to-quaternion-derivation-section) for the derivation of this equation. We are going to add constructor to our quaternion class to create a quaternion from Euler angles. Add the following to the Quaternion class declaration in **maths.hpp**

```cpp
Quaternion(const float pitch, const float yaw);
```

and in the **maths.cpp** define the constructor

```cpp
Quaternion::Quaternion(const float pitch, const float yaw)
{
    float cosPitch = cos(0.5f * pitch);
    float sinPitch = sin(0.5f * pitch);
    float cosYaw   = cos(0.5f * yaw);
    float sinYaw   = sin(0.5f * yaw);

    this->w = cosPitch * cosYaw;
    this->x = sinPitch * cosYaw;
    this->y = cosPitch * sinYaw;
    this->z = sinPitch * sinYaw;
}
```

We are currently using Euler angles rotation to calculate the view matrix in the `calculateMatrices()` Camera class function (see [6. 3D worlds](camera-class-section)). As such our camera may suffer from gimbal lock, and it also does not allow us to move the camera through 90$^\circ$ or 270$^\circ$ (try looking at the cubes from directly above or below, you will notice the orientation suddenly flipping around -- see the video below). So it would be advantageous to use quaternion rotations to calculate the view matrix.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_Camera_without_quaternion.mp4" type="video/mp4">
</video>
</center>

To implement a quaternion camera we calculate a quaternion from the camera Euler angles that represents the current orientation of the camera. We can then use the rotation matrix for this quaternion, along with a translation transformation to move the camera to $(0, 0, 0)$, to calculate the view matrix.

In the **camera.hpp** header file declare the camera orientation quaternion attribute.

```cpp
// Quaternion camera
Quaternion orientation = Quaternion(pitch, yaw);
```

We are going to write a Camera class method for a quaternion camera, add the method declaration to the Camera class

```cpp
void quaternionCamera();
```

and define the method in the **camera.cpp** file

```cpp
void Camera::quaternionCamera()
{
    // Calculate camera orientation quaternion from the Euler angles
    Quaternion orientation(-pitch, yaw);
    
    // Calculate the view matrix
    view = orientation.matrix() * Maths::translate(-eye);
    
    // Calculate the projection matrix
    projection = glm::perspective(fov, aspect, near, far);
    
    // Calculate camera vectors from view matrix
    right =  glm::vec3(view[0][0], view[1][0], view[2][0]);
    up    =  glm::vec3(view[0][1], view[1][1], view[2][1]);
    front = -glm::vec3(view[0][2], view[1][2], view[2][2]);
}
```

Here the camera orientation quaternion is calculated from the $pitch$ and $yaw$ Euler angles. We then combine a translation by $-\mathbf{eye}$ so that the camera is at the origin and then rotate using the rotation matrix for the orientation quaternion (remember this is how the view matrix was derived in [6. 3D Worlds](view-matrix-section)). We also need to calculate the $\mathbf{right}$, $\mathbf{up}$ and $\mathbf{front}$ camera vectors using the orientation quaternion. Recall that the view matrix given in equation {eq}`lookat-matrix-equation` is

$$ \view = \begin{pmatrix}
        \mathbf{right}_x & \mathbf{up}_x & -\mathbf{front}_x & 0 \\
        \mathbf{right}_y & \mathbf{up}_y & -\mathbf{front}_y & 0 \\
        \mathbf{right}_z & \mathbf{up}_z & -\mathbf{front}_z & 0 \\
        -\mathbf{eye} \cdot \mathbf{right} & -\mathbf{eye} \cdot \mathbf{up} & \mathbf{eye} \cdot \mathbf{front} & 1 \\
    \end{pmatrix} $$

So we just extract $\mathbf{right}$, $\mathbf{up}$ and $\mathbf{front}$ from the first three columns of the view matrix.

We also need to change the initial $yaw$ angle from $-90^\circ$ to $0^\circ$. In the **camera.hpp** change the $yaw$ angle declaration to the following

```cpp
float yaw   = 0.0f;
```

Finally, replace the call to the `calculateMatrices()` method in the **Lab10_Quaternions.cpp** file with the following so that we are now using our quaternion camera.

```cpp
camera.quaternionCamera();
```

Compile and run the code and you will see that you can move the camera in any orientation and we can move the camera through 90$^\circ$ or 270$^\circ$ without the orientation flipping around.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_Camera_with_quaternion.mp4" type="video/mp4">
</video>
</center>

---
## SLERP

The another advantage that quaternions have over Euler angles is that we can interpolate between two orientations smoothly and without encountering the problem of gimble lock. Standard Linear intERPolation (LERP) is used to calculate an intermediate position on the straight line between two points.

```{figure} ../_images/10_LERP.svg
:width: 300

Linear interpolation between two points.
```

If $\mathbf{v}_0$ and $\mathbf{v}_1$ are two points then another point, $\mathbf{v}_t$, that lies on the line between $\mathbf{v}_0$ and $\mathbf{v}_1$ is calculated using

$$ \operatorname{LERP}(\mathbf{v}_0, \mathbf{v}_1, t) = \mathbf{v}_0 + t(\mathbf{v}_1 - \mathbf{v}_0), $$

where $t$ is a value between 0 and 1. 

**SLERP** stands for Spherical Linear intERPpolation and is a method used to interpolate between two orientations emanating from the centre of a sphere.

```{figure} ../_images/10_SLERP.svg
:width: 400
:name: A-SLERP-figure

SLERP interpolation between two points on a sphere.
```

Consider {numref}`A-SLERP-figure` where $q_1$ and $q_2$ are two quaternions emanating from the centre of a sphere (note that this diagram is a bit misleading as quaternions exist in 4 dimensions but since it's very difficult to visualize 4D on a 2D screen this will have to do). The interpolated quaternion $q_t$ represents another quaternion that is partway between $q_0$ and $q_1$ calculated using

$$ \begin{align*}
    \operatorname{SLERP}(q_0, q_1, t) = \frac{\sin((1-t) \theta)}{\sin(\theta)}q_0 + \frac{\sin(t\theta)}{\sin(\theta)}q_1
\end{align*}, $$(slerp-equation)

where $t$ is a value between 0 and 1 and $\theta$ is the angle between the two pure quaternions $q_0$ and $q_1$ and is calculated using

$$ \theta = \cos^{-1} \left( \frac{q_0 \cdot q_1}{|q_0||q_1|} \right).$$

Sometimes the dot product $q_0 \cdot q_1$ returns a negative result meaning that $\theta$ we will be interpolating the long way round the sphere. To overcome this we negate the values of one of the quaternions, this is fine since the quaternion $-q$ is the same orientation as $q$.

Another consideration is when $\theta$ is very small then $\sin(\theta)$ in equation {eq}`slerp-equation` can be rounded to zero causing a divide by zero error. To get around this we can use LERP between $q_0$ and $q_1$.

Add a method declaration to the Maths class in the `maths.hpp` file

```cpp
static Quaternion SLERP(const Quaternion q0, const Quaternion q1, const float t);
```

and define the method in the `maths.cpp` file

```cpp
// SLERP
Quaternion Maths::SLERP(Quaternion q0, Quaternion q1, const float t)
{
    // Calculate cos(theta)
    float cosTheta = q0.w * q1.w + q0.x * q1.x + q0.y * q1.y + q0.z * q1.z;
    
    // If q1 and q2 are close together use LERP to avoid divide by zero errors
    if (cosTheta > 0.9999f)
    {
        Quaternion q;
        q.w = q0.w + t * (q1.w - q0.w);
        q.x = q0.x + t * (q1.x - q0.x);
        q.y = q0.y + t * (q1.y - q0.y);
        q.z = q0.z + t * (q1.z - q0.z);
        return q;
    }
    
    // Avoid taking the long path around the sphere by reversing sign of q1
    if (cosTheta < 0)
    {
        q1 = Quaternion(-q1.w, -q1.x, -q1.y, -q1.z);
        cosTheta = -cosTheta;
    }
    
    // Calculate SLERP
    Quaternion q;
    float theta = acos(cosTheta);
    float a = sin((1.0f - t) * theta) / sin(theta);
    float b = sin(t * theta) / sin(theta);
    q.w = a * q0.w + b * q2.w;
    q.x = a * q0.x + b * q2.x;
    q.y = a * q0.y + b * q2.y;
    q.z = a * q0.z + b * q2.z;
    
    return q;
}
```

Then to apply SLERP replace the code used to calculate the `orientation` quaternion in the `quaternionCamera()` method with the following.

```cpp
// Calculate camera orientation quaternion from the Euler angles
Quaternion newOrientation(-pitch, yaw, roll);

// Apply SLERP
orientation = Maths::SLERP(orientation, newOrientation, 0.2f);
```

Here we use a temporary quaternion `newOrientation` which is calculated using the $pitch$, $yaw$ and $roll$ Euler angles of the camera and then used SLERP to interpolate between `orientation` and `newOrientation`. Compile and run your program and you should see that the camera rotation is much smoother and more satisfying to use.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/09_Third_person_camera_with_SLERP.mp4" type="video/mp4">
</video>
</center>

---

## Third person camera

The use of quaternions allows game developers to implement third person camera view in 3D games where the camera follows the character that the player is controlling. This was first done for the Playstation game *Tomb Raider* released by Core Design in 1996 and has become popular with game developers with game franchises such as *God of War*, *Horizon Zero Dawn*, *Assassins Creed* and *Red Dead Redemption* to name a few all using third person camera view.

```{figure} ../_images/10_Third_person_camera.svg
:width: 400
:name: third-person-camera-figure

A third person camera that follows a character.
```
To implement a simple third person camera, we calculate the view matrix as usual and then move the camera back by translating by an $\mathbf{offset}$ vector {numref}`third-person-camera-figure`.

$$ View = Translate(\mathbf{offset}) \cdot View $$

The result of a third-person camera view can be seen below. Here we are using Suzanne the Blender mascot to act as our character model, and we can switch from first-person to third-person view using keyboard input.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_Third_person_camera_1.mp4" type="video/mp4">
</video>
</center>

Moving the camera around we see that our character model is always facing in the same direction. To make it face in the same direction as the camera we combine pitch and yaw rotations, and use them in the model matrix calculation.

$$ Rotate = R_y(yaw) \cdot R_x(pitch).$$

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_Third_person_camera_2.mp4" type="video/mp4">
</video>
</center>

Implementations of a third-person camera can vary. For example, you may want the character movement to be independent of the camera movement so that the camera is not always behind the character. To do this we would calculate the view matrix for a third-person camera as seen above, but calculate a different $\mathbf{front}$ vector for the character based on another $yaw$ angle that can be altered using keyboard inputs.

---
## Exercises

1. Add the ability for the user to switch between view modes where pressing the 1 key selects first-person camera and pressing the 2 key selects a third person camera. In third-person camera mode the camera should follow the character.

2. Add the ability for the user to select a different third-person camera mode by pressing the 3 key. In this mode, the camera should be independent of the character movement where it can rotate around the character based on the camera $yaw$ and $pitch$ angles. The character movement direction should be governed by a yaw angle that can be altered by the A and D keys.

<center>
<video controls muted="true" loop="true" width="500">
    <source src="../_static/10_Third_person_camera_3.mp4" type="video/mp4">
</video>
</center>