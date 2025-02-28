(appendix-quaternions-section)=

# Complex Numbers and Quaternions

In [10. Quaternions](quaternions-section) we explored how we can make use of quaternions to perform rotation calculations. You don't need to know exactly how the various equations are derived in order to use them in your programs, however, if you are curious their derivations are provided here. 

## Complex numbers

The **imaginary number** $i$ is defined as $i^2 = -1$. A **complex number** is a real number plus a multiple of an imaginary number

$$ z = x + yi.$$

The following arithmetic operations can be applied to complex numbers.

| Operation | Result |
|:--|:--|
| Addition | $(a + bi) + (c + di) = a + c + (b + d)i$ |
| Subtraction | $(a + bi) - (c + di) = a - c + (b - d)i$ |
| Scalar multiplication| $k(a + bi) = ak + bki$ |
| Multiplication | $(a + bi)(c + di) = ac - bd + (ad - bc)i$ |

For example, given the complex numbers $z_1 = 1 + 2i$ and $z_2 = 3 + 4i$

$$ \begin{align*}
    z_1 + z_2 &= 1 + 3 + (2 + 4)i = 4 + 6i, \\
    z_1 - z_2 &= 1 - 3 + (2 - 4)i = -2 - 2i, \\
    3z_1 &= 3 \times 1 + 3 \times 2i = 3 + 6i, \\
    z_1z_2 &= (1 + 2i) (3 + 4i) = 1 \times 3 - 2 \times 4 + (1 \times 4 - 2 \times 3) = -5 - 2i.
\end{align*} $$

### The complex plane

Complex numbers can be represented using a 2D graph called a **complex plane** (also known as an Argand diagram) where the real part is mapped to the horizontal axis and the imaginary part mapped to the vertical axis. For example, consider the complex number $x + yi$

```{figure} ../_images/10_Complex_plane.svg
:width: 400
```

### Absolute value of a complex number

The absolute value of a complex number $z = x + yi$ is denoted by $|z|$ and is the distance of the complex number from the origin of the complex plane. It is calculated using Pythagoras' theorem

$$ |z| = \sqrt{x^2 + x^2}. $$

For example, given the complex number $z = 1 + 2i$ then the absolute value is

$$ |z| = \sqrt{1^2 + 2^2} = \sqrt{5} \approx 2.236. $$

### Complex conjugate

The complex conjugate of a complex number $z = x + yi$ is denoted by $z^*$ and is the complex number with the imaginary part negated

$$ z^* = a - bi. $$

When plotted on the complex plane the complex conjugate of $x + yi$ is reflected about the real axis.

```{figure} ../_images/10_Complex_conjugate.svg
:width: 250
```

Multiplying a complex number by its conjugate gives

$$ \begin{align*}
    zz^* &= (x + yi)(a - bi) \\
    &= x^2 + abi - abi + x^2 \\
    &= x^2 + x^2 \\
    &= |z|^2.
\end{align*} $$

which leads to the following definition of the multiplicative inverse of a complex number

$$ \begin{align*}
    zz^* &= |z|^2 \\
    z &= \frac{|z|^2}{z^*} \\
    \therefore z^{-1} &= \frac{z^*}{|z|^2}.
\end{align*} $$

(rotation-of-complex-numbers-section)=

## Rotation using complex numbers

We can rotate a complex number by multiplying by $i$. Consider the complex number $z = 2 + i$ when multiplied recursively by $i$

$$ \begin{align*}
    z &= 2 + i, \\
    z  i &= (2 + i)i = -1 + 2i, \\
    z  i^2 &= (-1 + 2i)i = -2 - i, \\
    z  i^3 &= (-2 - i)i = 1 - 2i, \\
    z  i^4 &= (1 - 2i)i = 2 + i, \\
    &\vdots
\end{align*} $$

Since $zi^4 = z$ then this sequence will repeat every four multiples of $i$. Plotting on the complex plane gives

```{figure} ../_images/10_Complex_rotation.svg
:width: 300
```

So multiplying a complex number by $i$ rotates it by 90$^\circ$ anti-clockwise about the origin.

Given a complex number $r = x + yi$ on the complex plane which has an absolute value of $|r|=1$, if $\theta$ is the angle between the real axis and the vector pointing from the origin to $r$, then the length of an adjacent side is $\cos(\theta)$ and the length of the opposite side is $\sin(\theta)$.

```{figure} ../_images/A_Unit_complex_number.svg
:width: 250
```

Using the sin and cosine trigonometric ratios we can write $r$ as

$$ r = \cos(\theta) + \sin(\theta)i.$$

Multiplying a complex number by $r$ rotates it by $\theta$ anti-clockwise in the complex plane.

---

## A.2 Quaternions

The general form of a **quaternion** is

$$ q = w + xi + yj + zk, $$

where $w$, $x$, $y$ and $z$ are real numbers and $i$, $j$ and $k$ are imaginary numbers defined by

$$ i^2 = j^2 = k^2 = ijk = -1. $$

For example, $q = 1 + 2i + 3j + 4k$ is a quaternion. Lets examine the relationships between $i$, $j$ and $k$. Since $ijk = -1$ then

$$ \begin{align*}
    ij &= -\frac{1}{k} = -k^{-1} = -\left( \frac{k^*}{|k|^2} \right) = k,
\end{align*} $$

and doing similar for the other combinations of $i$, $j$ and $k$ gives

$$ \begin{align*}
    ij &= k, & jk &= i, & ki &= j, \\
    ji &= -k, & kj &= -i, & ik &= -j.
\end{align*} $$

Consider the [cross products](cross-product-section) between the three unit vectors pointing in the $x$, $y$ and $z$ directions $\mathbf{i}$, $\mathbf{j}$ and $\mathbf{k}$ 

$$ \begin{align*}
    \mathbf{i} \times \mathbf{j} &= \mathbf{k}, &
    \mathbf{j} \times \mathbf{k} &= \mathbf{i}, &
    \mathbf{k} \times \mathbf{i} &= \mathbf{j}, \\
    \mathbf{j} \times \mathbf{i} &= -\mathbf{k}, &
    \mathbf{k} \times \mathbf{j} &= -\mathbf{i}, &
    \mathbf{i} \times \mathbf{k} &= -\mathbf{j}.
\end{align*} $$

So the three imaginary numbers $i$, $j$ and $k$ can be used to represent the three unit vectors pointing in the $x$, $y$ and $z$ directions and multiplying the imaginary numbers is equivalent to the cross product.

### A.2.1 Scalar-vector form of a quaternion

Quaternions can be expressed more conveniently as an ordered-pair consisting of the real part $w$ and a vector of the imaginary parts

$$ q = [w, \mathbf{v}], $$

where $\mathbf{v} = x\mathbf{i} + y \mathbf{j} + z \mathbf{k}$. For example, the quaternion $q = 1 + 2i + 3j + 4k$ can be represented in scalar-vector form as

$$q = [1, (2, 3, 4)].$$

### A.2.2 Absolute value of a quaternion

The absolute value of a quaternion $q = [w, (x, y, z)]$ is denoted by $|q|$ and calculated using

$$ |q| = \sqrt{w^2 + x^2 + y^2 + z^2}.$$

### A.2.3 Unit quaternion

A **unit quaternion**, denoted by $\hat{q}$, is a quaternion that has an absolute value of 1. We can **normalise** a quaternion by dividing by its absolute value to give a unit quaternion

$$ \hat{q} = \frac{q}{|q|}. $$

Proving that $|\hat{q}| = 1$ 

$$ \begin{align*}
    \hat{q} &= \frac{q}{|q|} 
    = \frac{[w, \mathbf{v}]}{|q|} 
    = \left[ \frac{w}{|q|}, \frac{\mathbf{v}}{|q|} \right], \\
    \therefore |\hat{q}| &= \frac{w^2}{|q|^2} + \frac{x^2}{|q|^2} + \frac{y^2}{|q|^2} + \frac{z^2}{|q|^2}
    = \frac{|q|^2}{|q|^2} = 1.
\end{align*} $$

### A.2.4 Pure and real quaternions

A **pure quaternion** is a quaternion where the real part has a value of zero, i.e.,

$$ q = [0, \mathbf{v}]. $$

A pure quaternion is equivalent to a 3-element vector.

A **real quaternion** is a quaternion where the vector part is the zero vector $\mathbf{0} = 0\mathbf{i} + 0\mathbf{j} + 0\mathbf{k}$, i.e.,

$$ q = [w, \mathbf{0}]. $$

A real quaternion is equivalent to a real number.

### A.2.7 Quaternion dot product

The dot product between two quaternions $q_1 = [w_1, (x_1, y_1, z_1)]$ and $q_2 = [w_2, (x_2, y_2, z_2)]$ is denoted by $q_1 \cdot q_2$ and is calculated using

$$ q_1 \cdot q_2 = w_1w_2 + x_1x_2 + y_1y_2 + z_1z_2,$$(quaternion-dot-product-equation)

and the angle $\theta$ between $q_1$ and $q_2$ is 

$$ \theta = \cos^{-1} \left( \frac{q_1 \cdot q_2}{|q_1||q_2|} \right).$$(quaternion-angle-difference-equation)

### A.2.8 Multiplying quaternions

Let $q_1 = x_1i + y_1j + z_1k + w_1$ and $q_2 = x_2i + y_2j + z_2k + w_2$ be two quaternions then

$$ \begin{align*}
    q_1q_2 &= (w_1 + x_1i + y_1j + z_1k)(w_2 + x_2i + y_2j + z_2k) \\
    &= (w_1x_2 + w_2x_1 + y_1z_2 - y_2z_1)i \\
    & \qquad + (w_1y_2 + w_2y_1 + z_1x_2 - z_2x_1)j \\
    & \qquad + (w_1z_2 + w_2z_1 + x_1y_2 - x_2y_1)k \\
    & \qquad + (w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2).
\end{align*} $$

Substituting in the pure quaternions $[0,\mathbf{i}]$, $[0,\mathbf{j}]$ and $[0,\mathbf{k}]$ as well as the real quaternion $[1,\mathbf{0}]$ then

$$ \begin{align*}
    q_1q_2 &= (w_1x_2 + w_2x_1 + y_1z_2 - y_2z_1)[0,\mathbf{i}] \\
    & \qquad + (w_1y_2 + w_2y_1 + z_1x_2 - z_2x_1)[0,\mathbf{j}] \\
    & \qquad + (w_1z_2 + w_2z_1 + x_1y_2 - x_2y_1)[0,\mathbf{k}] \\
    & \qquad + (-x_1x_2 - y_1y_2 - z_1z_2 + w_1w_2) [1,\mathbf{0}] \\
    &=  [0, (w_1x_2 + w_2x_1 + y_1z_2 - y_2z_1) \mathbf{i}] \\
    & \qquad + [0,(w_1y_2 + w_2y_1 + z_1x_2 - z_2x_1) \mathbf{j}] \\
    & \qquad + [0,(w_1z_2 + w_2z_1 + x_1y_2 - x_2y_1) \mathbf{k}] \\
    & \qquad + [-x_1x_2 - y_1y_2 - z_1z_2 + w_1w_2, \mathbf{0}] \\
    &= [(w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2 + w_1w_2), \\
    & \qquad w_1(x_2\mathbf{i} + y_2\mathbf{j} + z_2\mathbf{k}) + w_2(x_1 \mathbf{i} + y_1 \mathbf{j} + z_1\mathbf{k}) \\
    & \qquad + (y_1z_2 - y_2z_1)\mathbf{i} + (z_1x_2 - z_2x_1)\mathbf{j} + (x_1y_2 - x_2y_1)\mathbf{k} ]
\end{align*} $$

Substituting the dot and cross products

$$ \begin{align*}
    \mathbf{v}_1 \cdot \mathbf{v}_2 &= x_1x_2 + y_1y_2 + z_1z_2, \\
    \mathbf{v}_1 \times \mathbf{v}_2 &= (y_1z_2 - y_2z_1)\mathbf{i} + (z_1x_2 - z_2x_1)\mathbf{j} + (x_1y_2 - x_2y_1)\mathbf{k}
\end{align*} $$

results in

$$ \begin{align*}
    q_1q_2 &= [w_1w_2 - \mathbf{v}_1\cdot \mathbf{v}_2, w_1 \mathbf{v}_2 + w_2 \mathbf{v}_1 + \mathbf{v}_1 \times \mathbf{v}_2].
\end{align*} $$(quaternion-product-equation)

Equation {eq}`quaternion-product-equation) is the equation for the multiplication of two quaternions $q_1 = [w_1, \mathbf{v}_1]$ and $q_2 = [w_2, \mathbf{v}_2]$.

### A.2.9 Quaternion conjugate

The **conjugate** of a quaternion $q$, denoted by $q^*$, is found by negating the vector part. For example, given the quaternion $q = [\mathbf{v}, w]$ then

$$ q^* = [w, -\mathbf{v}].$$

### A.2.10 Quaternion inverse

The inverse of a quaternion $q$, denoted by $q^{-1}$, is defined by

$$ qq^{-1} = 1.$$

If we multiply both sides of this equation by $q^*$ then

$$ \begin{align*}
    q^*qq^{-1} &= q^* \\
    |q|^2q^{-1} &= q^* \\
    q^{-1} &= \frac{q^*}{|q|^2}.
\end{align*} $$

If $q$ is a unit quaternion then $|q|=1$ and

$$ q^{-1} = q^*. $$

(appendix-quaternion-rotation-section)=

## A.3 Quaternion rotation

In [5. Transformations](axis-angle-rotation-section) we saw that we can rotate about a vector $\mathbf{v}$ by an angle $\theta$ using a combination of a translation and rotations about the $x$, $y$ and $z$ axes. The resulting matrix shown in equation {eq}`eq:axis-angle-rotation-matrix` is quite complicated and requires lots of floating point computations. Quaternions gives us a away of performing similar calculation in a way that uses fewer computations and also does not suffer from gimbal lock.

```{figure} ../_images/05_axis_angle_rotation.svg
:height: 300
:name: axis-angle-rotation2-figure-3

Axis-angle rotation
```

We have seen [above](rotation-of-complex-numbers-section) that we can rotate a complex number by multiplying by the complex number $ r = \cos(\theta) + \sin(\theta)i$. Since quaternions are an extension of complex numbers the quaternion equivalent to this is

$$ q = \cos(\theta) + \sin(\theta) i + \sin(\theta) j + \sin(\theta) k, $$

or in vector-scalar form

$$ q = [\cos(\theta), \sin(\theta) \hat{\mathbf{v}}]. $$

To demonstrate rotation using quaternion rotation consider the rotation of the vector $\mathbf{p} = (2, 0, 0)$ by 45$^\circ$ about the $z$-axis. The rotation quaternion for this is

$$ q = [\cos(45^\circ), \sin(45^\circ)(0, 0, 1)] =  [0.707, (0, 0, 0.707)], $$

and expressing $\mathbf{p}$ as a pure quaternion we have $p = [0, (2, 0, 0)]$. Multiplying $p$ and $q$ using equation {eq}`quaternion-product-equation` gives

$$ \begin{align*}
    qp &=  [0.707, (0, 0, 0.707)] [0, (2, 0, 0)] = [0, (1.414, 1.414, 0)]
\end{align*} $$

Since the scalar part is zero then this is a pure quaternion and the absolute value of the rotated quaternion is

$$ \begin{align*}
    |qp| &= \sqrt{0 ^ 2 + 1.414^2 + 1.414^2 + 0^2} = 2,
\end{align*} $$

which is the same as the absolute value of $[0, (2, 0, 0)]$. This rotation is shown in shown in {numref}`quaternion-rotation-1-figure`.

```{figure} ../_images/A_Quaternion_rotation_1.svg
:width: 450
:name: quaternion-rotation-1-figure

The quaternion $p = [0, (2, 0, 0)]$ is rotated $45^\circ$ by multiplying by the rotation quaternion $q = [\cos(45^\circ), \sin(45^\circ)(1, 0, 0)]$.
```

In the rotation example shown above used a quaternion that was perpendicular to the vector being rotated. What happens when we rotate by a quaternion that isn't perpendicular to the vector? Consider the rotation of the same vector $\mathbf{p} = (2, 0, 0)$ by angle 45$^\circ$ about the unit vector $\hat{\mathbf{v}} =  (0.707, 0, 0.707)$ which is not perpendicular to $\mathbf{p}$. The rotation quaternion is

$$ \begin{align*}
    q = [\cos(45^\circ), \sin(45^\circ)(0.707, 0, 0.707)] = [0.707,(0.5, 0, 0.5)]
\end{align*} $$

and multiplying by $p = [0, (2, 0, 0)]$

$$ \begin{align*}
    qp &= [0.707,(0.5, 0, 0.5)] [0, (2, 0, 0)] = [-1, (1.414, 1, 0)].
\end{align*} $$

Now we no longer have a pure quaternion since the scalar part is $-1.414$ which is non-zero and the absolute value of $qp$ is

$$ |qp| = \sqrt{(-1.414)^2 + 1.414^2 + 1.414^2 + 0^2} = 2.45.$$

So in rotating using the quaternion $q$ we have scaled up the vector. However, if we multiply $qp$ by the quaternion conjugate $q^*$ on the right we have

$$ \begin{align*}
    qpq^* &= [0.707,(0.5, 0, 0.5)] [0, (2, 0, 0)] [0.707, (-0.5, 0, -0.5)] \\
    &= [0, 1, 1.414, 1)]
\end{align*} $$

So $qpq^*$ is a pure quaternion and its absolute value is

$$ |qpq^*| = \sqrt{1^2 + (1.414)^2 + 1^2} = \sqrt{4} = 2,$$

which is the same as $|p|$. However, by calculating $qpq^*$ we have rotated the vector $\mathbf{p}$ by $90^\circ$ since we have applied two rotations of $45^\circ$ ({numref}`quaternion-rotation-2-figure`).


```{figure} ../_images/A_Quaternion_rotation_2.svg
:width: 450
:name: quaternion-rotation-2-figure

Rotating the quaternion $p=[0, (2, 0, 0)]$ using $qpq^*$ where $q = [\cos(45^\circ), \sin(45^\circ) \hat{\mathbf{v}}]$
```

So to rotate a quaternion $p$ about a vector $\hat{\mathbf{v}}$ by angle $\theta$ whilst ensuring that we get a pure quaternion we perform $qpq^*$ where

$$ q = [\cos(\tfrac{1}{2}\theta), \sin(\tfrac{1}{2}\theta) \hat{\mathbf{v}}].$$(appendix-rotation-quaternion-equation)

This is effectively two rotations of half the desired rotation angle $\theta$. Returning to our example of rotating $\mathbf{p} = (2, 0, 0)$ by $45^\circ$ about the vector $\hat{\mathbf{v}} = (0.707, 0, 0.707)$ using equation {eq}`appendix-rotation-quaternion-equation` we have a rotation quaternion of

$$q = [\cos(\tfrac{45^\circ}{2}), \sin(\tfrac{45^\circ}{2})(0.707, 0, 0.707)] = [0.924, (0.271, 0, 0.271)]$$

so calculating $qpq^*$ we have

$$ \begin{align*}
    qpq^* &= [0.924, (0.271, 0, 0.271)] [0,(2,0,0)] [0.924, (-0.271, 0, -0.271)] \\
    &= [0, (1.707, 1, 0.293)].
\end{align*}$$

The effect of this rotation is shown in {numref}`quaternion-rotation-3-figure`.

```{figure} ../_images/A_Quaternion_rotation_3.svg
:width: 450
:name: quaternion-rotation-3-figure

Rotating the quaternion $p=[0, (2, 0, 0)]$ using $qpq^*$ where $q = [\cos(\frac{45^\circ}{2}), \sin(\frac{45^\circ}{2}) \hat{\mathbf{v}}]$.
```

(quaternion-rotation-matrix-derivation-section)=

### A.3.2 Rotation matrix

To be able to combine quaternion rotation with other transformations we need to express the quaternion $qpq^*$ as a $4 \times 4$ matrix. Consider the multiplication of the axis vector quaternion $p = [p_w, (p_x, p_y, p_z)]$ on the left by the rotation unit quaternion $q = [w, (x, y, z)]$

$$ \begin{align*}
    qp &= [w, (x, y, z)] [p_w, (p_x, p_y, p_z)] \\
    &= [wp_w - (x, y, z) \cdot (p_x, p_y, p_z), w(p_x, p_y, p_z) + p_w(x, y, z) + (x, y, z) \times (p_x, p_y, p_z)] \\
    &= [wp_w - xp_x - yp_y - zp_z, (wp_x - zp_y - yp_z + xp_w, zp_x + wp_y - xp_z + yp_w, -yp_x + xp_y + wp_z + zp_w)].
\end{align*} $$

If we write the quaternion $p$ as a 4-element vector of the form $\mathbf{p} = (p_x, p_y, p_z, p_w)^\mathsf{T}$ (note that $p_w$, is now at the end of the vector which is synonymous with [homogeneous coordinates](homogeneous-coordinates-section)) then we have

$$ \begin{align*}
    qp &= 
    \begin{pmatrix}
        wp_x + zp_y - yp_z + xp_w \\ 
        zp_x + wp_y - xp_z + yp_w \\ 
        -yp_x + xp_y + wp_z + zp_w \\
        wp_w - xp_x - yp_y - zp_z
    \end{pmatrix},
\end{align*} $$

and we can express the rotation $qp$ as the matrix equation

$$ qp = \begin{align*}
    \begin{pmatrix}
        w & -z & y & x \\
        z & w & -x & y \\
        -y & x & w & z \\
        -x & -y & -z & w
    \end{pmatrix}
    \begin{pmatrix} p_x \\ p_y \\ p_z \\ p_w \end{pmatrix}
\end{align*} $$(quaternion-rotation-q-equation)

Doing similar for multiplying $p$ on the right by $q^* = [w, (-x, -y, -z)]$

$$ \begin{align*}
    pq^* &= [p_w, (p_x, p_y, p_z)][w, (-x, -y, -z)] \\
    &= [wp_w - (p_x, p_y, p_z) \cdot ( -x, -y, -z), \\
    & \qquad p_w(-x, -y, -z) + w(p_x, p_y, p_z) + (p_x, p_y, p_z) \times (-x, -y, -z)] \\
    &= [xp_x + yp_y + zp_z + wp_w, (wp_x - zp_y + yp_z - xp_w, zp_x + wp_y - xp_z - yp_w, -yp_x + xp_y + wp_z - zp_w)].
\end{align*} $$

Writing $p$ the form $\mathbf{p} = (p_x, p_y, p_z, p_w)$ as before gives

$$ \begin{align*}
    pq^* = 
    \begin{pmatrix}
        wp_x - zp_y + yp_z - xp_w \\ 
        zp_x + wp_y - xp_z - yp_w \\ 
        -yp_x + xp_y + wp_z - zp_w \\
        xp_x + yp_y + zp_z + wp_w
    \end{pmatrix}
\end{align*} $$

which can be expressed by the matrix equation

$$ \begin{align*}
    pq^* &=
    \begin{pmatrix}
        w & -z & y & -x \\
        z & w & -x & -y \\
        -y & x & w & -z \\
        x & y & z & w
    \end{pmatrix}
    \begin{pmatrix} p_x \\ p_y \\ p_z \\ p_w \end{pmatrix}
\end{align*} $$(quaternion-rotation-q2-equation)

The two matrices from equations {eq}`quaternion-rotation-q-equation` and {eq}`quaternion-rotation-q2-equation` can be combined to give a single matrix $R$ that performs the quaternion rotation $qpq^*$

$$ \begin{align*}
    R &= 
    \begin{pmatrix}
        w & -z & y & -x \\
        z & w & -x & -y \\
        -y & x & w & -z \\
        x & y & z & w
    \end{pmatrix}
    \begin{pmatrix}
        w & -z & y & x \\
        z & w & -x & y \\
        -y & x & w & z \\
        -x & -y & -z & w
    \end{pmatrix} \\
    &=
    \begin{pmatrix}
        x^2 - y^2 - z^2 + w^2 & 2(xy - zw) & 2(xz + yw) & 0 \\
        2(xy + zw) & -x^2 + y^2 - z^2 + w^2 & 2(yz - xw) & 0 \\
        2(xz - yw) & 2(xw + yz) & -x^2 - y^2 + z^2 + w^2 & 0 \\
        0 & 0 & 0 & x^2 + y^2 + z^2 + w^2
    \end{pmatrix}.
\end{align*} $$

Recall that $q$ is a unit quaternion so $x^2 + y^2 + z^2 + w^2 = 1$. We can use this to simplify the main diagonal elements of $R$, for example, consider the element in row 1 column 1 of $R$

$$ \begin{align*}
    x^2 - y^2 - z^2 + w^2 = 1 - 2(y^2 + z^2).
\end{align*} $$

Doing this for the other main diagonal elements $R$ simplifies to

$$ \begin{align*}
    R &= 
    \begin{pmatrix}
        1 - 2(y^2 + z^2) & 2(xy - zw) & 2(xz + yw) & 0 \\
        2(xy + zw) & 1 - 2(x^2 + z^2) & 2(yz - xw) & 0 \\
        2(xz - yw) & 2(xw + yz) & 1 - 2(x^2 + y^2) & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}.
\end{align*} $$(quaternion-rotation-matrix-2-equation)

To demonstrate this lets return to our example of rotating the vector $\mathbf{p} = (2, 0, 0)$ about the unit vector $\hat{\mathbf{v}} = (0.707, 0, 0.707)$ by $45^\circ$. Recall that the rotation quaternion was

$$ \begin{align*}
    q &= [\cos(\tfrac{45^\circ}{2}), \sin(\tfrac{45^\circ}{2}) (0.707, 0, 0.707)] = [0.924, (0.271, 0, 0.271)].
\end{align*} $$

From $q$ we have $w = 0.924$, $x = 0.271$, $y = 0$ and $z = 0.271$. Substituting these into $R$ from equation {eq}`quaternion-rotation-matrix-2-equation` gives

$$ \begin{align*}
    R = 
    \begin{pmatrix}
        0.854 & -0.5 & 0.146 & 0 \\
        0.5 & 0.707 & -0.5 & 0 \\
        0.146 & 0.5 & 0.854 & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}.
\end{align*} $$

Applying the rotation to $p = (2, 0, 0, 0)$

$$ \begin{align*}
    R \cdot p =
    \begin{pmatrix}
        0.854 & -0.5 & 0.146 & 0 \\
        0.5 & 0.707 & -0.5 & 0 \\
        0.146 & 0.5 & 0.854 & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}
    \begin{pmatrix} 2 \\ 0 \\ 0 \\ 0 \end{pmatrix}
    = \begin{pmatrix} 1.707 \\ 1 \\ 0.293 \\ 0 \end{pmatrix}.
\end{align*} $$

So the rotated vector is $(1.707, 1, 0.293)$ which was shown in {numref}`quaternion-rotation-3-figure`. We can see that the vector $\mathbf{p}$ has now been rotated $45^\circ$ about the vector $\mathbf{v}$.

(euler-to-quaternion-derivation-section)=

### A.3.1 Euler angles to quaternion

Euler angles are the rotations around the three coordinates axes $x$, $y$ and $z$ so equation {eq}`appendix-rotation-quaternion-equation` can be used to give three quaternions for yaw, pitch and roll rotations. Since we are using OpenGL's coordinate system then yaw is the rotation around the vector $\mathbf{j} = (0, 1, 0)$ (a vector pointing in the same direction as the $y$-axis), pitch is the rotation around the vector $\mathbf{i} = (1, 0, 0)$ (a vector pointing along the $x$-axis) and roll with the rotation about the vector $\mathbf{k} = (0, 0, 1)$ (a vector pointing along the $z$-axis) so the corresponding rotation quaternions are

$$\begin{align*}
    q_{yaw} &= [\cos(\tfrac{1}{2}yaw), \sin(\tfrac{1}{2}yaw) \mathbf{j}], \\
    q_{pitch} &= [\cos(\tfrac{1}{2}pitch), \sin(\tfrac{1}{2}pitch) \mathbf{i}], \\
    q_{roll} &= [\cos(\tfrac{1}{2}roll), \sin(\tfrac{1}{2}roll) \mathbf{k}].
\end{align*} $$

Let $c_y = \cos(\frac{1}{2}yaw)$ and $s_y = \sin(\frac{1}{2}yaw)$ for brevity, and do similar for $pitch$ and $roll$, then the single rotation quaternion that combines rotation about the three coordinates axes is

$$ \begin{align*}
    q_{pitch}q_{yaw}q_{roll} &= [c_p, s_p\mathbf{i}] [c_y, s_y\mathbf{j}] [c_r, s_r\mathbf{k}] \\
    &= [c_pc_yc_r - s_ps_ys_r, c_pc_ys_r\mathbf{k} + c_ps_yc_r\mathbf{j} + s_pc_yc_r\mathbf{i} + s_ps_yc_r\mathbf{k} + c_ps_ys_r\mathbf{i} - s_pc_ys_r\mathbf{j}] \\
    &= [c_pc_yc_r - s_ps_ys_r, (c_ys_pc_r + s_yc_ps_r, s_yc_pc_r - c_ys_ps_r, c_yc_ps_r + s_ys_pc_r)].
\end{align*} $$

This means we can define a quaternion based on the three Euler angles and then use equation {eq}`quaternion-rotation-matrix-2-equation` to generate the rotation matrix.