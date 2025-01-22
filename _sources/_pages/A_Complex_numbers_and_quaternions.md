(appendix-quaternions-section)=

# Complex Numbers and Quaternions

In [10. Quaternions](quaternions-section) we explored how we can make use of quaternions to perform rotation calculations. You don't need to know exactly how the various equations are derived in order to use them in your programs, however, if you are curious their derivations are provided here. 

## A.1 Complex numbers

The **imaginary number** $i$ is defined as $i^2 = -1$. A **complex number** is a real number plus a multiple of an imaginary number

$$ z = x + yi.$$

### A.1.1 Adding and subtracting complex numbers

Complex numbers are added and subtracted by adding and subtracting the real and imaginary parts separately. Let $z_1 = x_1 + y_1i$ and $z_2 = x_2 + y_2i$ then

$$ \begin{align*}
    z_1 + z_2 &= (x_1 + y_1i) + (x_2 + y_2i)
    = (x_1 + x_2) + (y_1 + y_2)i \\
    z_1 - z_2 &= (x_1 + y_1i) - (x_2 + y_2i) 
    = (x_1 - x_2) + (y_1 - y_2)i
\end{align*} $$

For example, if $z_1 = 1 + 2i$ and $z_2 = 3 + 4i$ then

$$ \begin{align*}
    z_1 + z_2 &= (1 + 2i) + (3 + 4i) = (1 + 3) + (2 + 4)i = 4 + 6i, \\
    z_1 - z_2 &= (1 + 2i) - (3 + 4i) = (1 - 3) + (2 - 4)i = -2 - 2i.
\end{align*} $$

### A.1.2 Multiply a complex number by a scalar.

To multiply a complex number by a scalar we multiply both the real and imaginary parts by the scalar. Let $z = x + yi$ then

$$kz = k(x + yi) = ka + kbi$$

For example, if $z = 1 + 2i$ and $k = 3$ then

$$ kz = 3(1 + 2i) = 3(1) + 3(2)i = 3 + 6i. $$

### A.1.3 Multiplying complex numbers

To multiply complex numbers use the FOIL (First Outside Inside Last) technique. Let $z_1 = x_1 + y_1i$ and $z_2 = x_2 + y_2i$ then

$$ \begin{align*}
    z_1z_2 &= (x_1 + y_1i) (x_2 + y_2i) \\
    &= x_1x_2 + x_1y_2i + x_2y_1i + y_1y_2i^2 \\
    &= (x_1x_2 - y_1y_2) + (x_1y_2 + x_2y_1)i
\end{align*} $$

For example, if $z_1 = 1 + 2i$ and $z_2 = 3 + 4i$ then

$$ \begin{align*}
    z_1z_2 &= (1 + 2i)(3 + 4i) \\
    &= 3 + 6i + 4i + 8i^2 \\
    &= 3 + 10i + 8(-1) \\
    &= -5 + 10i.
\end{align*} $$

### A.1.4 The complex plane

Complex numbers can be represented using a 2D graph called a **complex plane** (or Argand diagram) where the real part is mapped to the horizontal axis and the imaginary part mapped to the vertical axis. For example, consider the complex number $x + yi$

```{figure} ../_images/10_Complex_plane.svg
:width: 400
```

### A.1.5 Absolute value of a complex number

The absolute value of a complex number $z = x + yi$ is denoted by $|z|$ and is the distance of the complex number from the origin of the complex plane. It is calculated using

$$ |z| = \sqrt{x^2 + x^2} $$

For example, if $z = 1 + 2i$ then

$$ |z| = \sqrt{1^2 + 2^2} = \sqrt{5}. $$

### A.1.6 Complex conjugate

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

For example, if $z = 3 + 4i$ then

$$ \begin{align*}
    z^* &= 3 - 4i, \\
    |z| &= \sqrt{3^2 + 6^2} = \sqrt{25} = 5, \\
    z^{-1} &= \frac{1}{5}(3 - 4i).
\end{align*} $$

(rotation-of-complex-numbers-section)=

### A.1.7 Rotation of complex numbers

We can rotate a complex number by multiplying by $i$. Consider the complex number $z = 2 + i$ when multiplied recursively by $i$

$$ \begin{align*}
    z &= 2 + i, \\
    zi &= (2 + i)i = -1 + 2i, \\
    zi^2 &= (-1 + 2i)i = -2 - i, \\
    zi^3 &= (-2 - i)i = 1 - 2i, \\
    zi^4 &= (1 - 2i)i = 2 + i, \\
    &\vdots
\end{align*} $$

Since $zi^4 = z$ then this sequence will repeat every four multiples of $i$. Plotting on the complex plane gives

```{figure} ../_images/10_Complex_rotation.svg
:width: 300
```

So multiplying a complex number by $i$ rotates it by 90$^\circ$ anti-clockwise about the origin.

Given a complex number $r = x + yi$ on the complex plane which has an absolute value of $|r|=1$, if $\theta$ is the angle between the real axis and the vector pointing from the origin to $r$ then $a$ is the length of an adjacent side and $b$ is the length of the opposite side.

```{figure} ../_images/A_Unit_complex_number.svg
:width: 250
```

Using the sin and cosine trigonometric ratios we can write $q$ as

$$ r = \cos(\theta) + \sin(\theta)i.$$

Multiplying the complex number $z = x + yi$ by $r$ gives

$$ \begin{align*}
    zr &= (x + yi) ( \cos(\theta) + \sin(\theta)i) \\
    &= x\cos(\theta) + y\cos(\theta)i + x\sin(\theta)i - y \sin(\theta) \\
    &= x\cos(\theta) - y \sin(\theta) + (x\sin(\theta) + y\cos(\theta))i 
\end{align*} $$

If $zr = x' + y'i$ then we can write this in matrix form as

$$ \begin{align*}
    \begin{pmatrix} x' & -y' \\ -y' & x' \end{pmatrix} 
    &=
    \begin{pmatrix}
        \cos(\theta) & -\sin(\theta) \\
        \sin(\theta) & \cos(\theta)
    \end{pmatrix}
    \begin{pmatrix} x & -y \\ y & x \end{pmatrix}.
\end{align*} $$

The matrix containing the sine and cosine trigonometric ratios is the [rotation matrix](rotation-section) which shows that multiplying a complex number by $r$ performs the rotation in the complex plane by angle $\theta$.

---

## A.2 Quaternions

The general form of a **quaternion** is

$$ q = w + xi + yj + zk, $$

where $w$, $x$, $y$ and $z$ are real numbers and $i$, $j$ and $k$ are imaginary numbers defined by

$$ i^2 = j^2 = k^2 = ijk = -1. $$

Lets examine the relationships between $i$, $j$ and $k$. Since $ijk = -1$ then

$$ \begin{align*}
    \frac{ijk}{k} &= -\frac{1}{k} \\
    ij &= -k^{-1} \\
    &= -\left( \frac{-k}{|k|^2} \right) \\
    &= k,
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

where $\mathbf{v} = x\mathbf{i} + y \mathbf{j} + z \mathbf{k}$.

### A.2.2 Absolute value of a quaternion

The absolute value of a quaternion $q = [w, (x, y, z)]$ is denoted by $|q|$ and calculated using

$$ |q| = \sqrt{w^2 + x^2 + y^2 + z^2}.$$

### A.2.3 Unit quaternion

A **unit quaternion**, denoted by $\hat{q}$, is a quaternion that has an absolute value of 1. We can **normalise** a quaternion by dividing by its absolute value to give a unit quaternion

$$ \hat{q} = \frac{q}{|q|}. $$

Checking that $|\hat{q}| = 1$ 

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

### A.2.6 Multiplying a quaternion by a scalar

Multiplying a quaternion by a scalar is achieved by multiplying the real part and the vector part by the scalar. Let $q = [w, \mathbf{v}]$ be a quaternion and $k$ be a scalar then

$$ kq = [kw, k\mathbf{v}].$$

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

then

$$ \begin{align*}
    q_1q_2 &= [w_1w_2 - \mathbf{v}_1\cdot \mathbf{v}_2, w_1 \mathbf{v}_2 + w_2 \mathbf{v}_1 + \mathbf{v}_1 \times \mathbf{v}_2].
\end{align*} $$(quaternion-product-equation)

Equation {eq}`quaternion-product-equation` is the general equation for calculating the quaternion product $[w_1, \mathbf{v}_1][w_2, \mathbf{v}_2]$.

### A.2.9 Quaternion conjugate

The **conjugate** of a quaternion $q$, denoted by $q^*$, is found by negating the vector part. Let $q = [\mathbf{v}, w]$ then

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

In [4. Transformations](axis-angle-rotation-section) we saw that we can rotate about a vector $\mathbf{v}$ by an angle $\theta$ using a combination of a translation and rotations about the $x$, $y$ and $z$ axes. The resulting matrix shown in equation {eq}`eq:axis-angle-rotation-matrix` is quite complicated and requires lots of floating point computations. Quaternions gives us a away of performing similar calculation in a way that uses fewer computations and also does not suffer from gimbal lock.

```{figure} ../_images/10_Axis_angle_rotation.svg
:width: 350
:name: axis-angle-rotation-figure-3

Axis-angle rotation about the vector $\hat{\mathbf{v}}$.
```

We have seen that we can rotate a complex number by multiplying by

$$ q = \cos(\theta) + \sin(\theta)i. $$

Since quaternions are an extension of complex numbers the quaternion equivalent to this is

$$ q = \cos(\theta) + \sin(\theta) i + \sin(\theta) j + \sin(\theta) k, $$

or in vector-scalar form

$$ q = [\cos(\theta), \sin(\theta) \hat{\mathbf{v}}]. $$

To demonstrate rotation using quaternion rotation consider the rotation of the vector $\mathbf{p} = (2, 0, 0)$ by 45$^\circ$ about the $z$-axis. The rotation quaternion for this is

$$ q = [\cos(45^\circ), \sin(45^\circ)(0, 0, 1)] =  [\tfrac{\sqrt2}{2}, (0, 0, \tfrac{\sqrt{2}}{2})], $$

and expressing $\mathbf{p}$ as a quaternion we have $p = [0, (2, 0, 0)]$ and multiplying by $q$ gives

$$ \begin{align*}
    qp &= [\tfrac{\sqrt2}{2}, (0, 0, \tfrac{\sqrt{2}}{2})] [0, (2, 0, 0)] \\
    &= [-(0, 0, \tfrac{\sqrt{2}}{2}) \cdot (2, 0, 0), \tfrac{\sqrt{2}}{2}(2, 0, 0) + (0, 0, \tfrac{\sqrt{2}}{2}) \times (2, 0, 0)] \\
    &= [0, (\sqrt{2}, 0, 0) + (0, \sqrt{2}, 0)] \\
    &= [0, (\sqrt{2}, \sqrt{2}, 0)]
\end{align*} $$

Since the scalar part is zero then this is a pure quaternion and the absolute value of the rotated quaternion is

$$ \begin{align*}
    |qp| &= \sqrt{(\sqrt{2})^2 + (\sqrt{2})^2} = \sqrt{4} = 2,
\end{align*} $$

which is the same as the absolute value of $[0, (2, 0, 0)]$. This rotation is shown in shown in {numref}`quaternion-rotation-1-figure`.

```{figure} ../_images/A_Quaternion_rotation_1.svg
:width: 400
:name: quaternion-rotation-1-figure

The rotation of the quaternion or $p=(2, 0, 0, 0)$ by multiplying by the rotation quaternion $q = (\frac{\sqrt{2}}{2}, (0, 0, \frac{\sqrt{2}}{2}))$.
```

In the rotation example shown above used a quaternion that was perpendicular to the vector being rotated. What happens when we rotate by a quaternion that isn't perpendicular to the vector? Consider the rotation of the same vector $\mathbf{p} = (2, 0, 0)$ by angle 45$^\circ$ about the vector $\hat{\mathbf{v}} =  (\frac{\sqrt{2}}{2}, 0, \frac{\sqrt{2}}{2})$ which is not perpendicular to $\mathbf{p}$. The rotation quaternion is

$$ q = [\tfrac{\sqrt{2}}{2}, \tfrac{\sqrt{2}}{2} (\tfrac{\sqrt{2}}{2}, 0, \tfrac{\sqrt{2}}{2})] =[\tfrac{\sqrt{2}}{2}, (\tfrac{1}{2}, 0, \tfrac{1}{2})], $$

and multiplying by $p = [0, (2, 0, 0)]$

$$ \begin{align*}
    qp &= [\tfrac{\sqrt{2}}{2}, (\tfrac{1}{2}, 0, \tfrac{1}{2})] [0, (2, 0, 0)] \\
    &= [-(\tfrac{1}{2}, 0, \tfrac{1}{2}) \cdot (2, 0, 0), \tfrac{\sqrt{2}}{2}(2, 0, 0) + (\tfrac{1}{2}, 0, \tfrac{1}{2}) \times (2, 0, 0)] \\
    &= [-1, (\sqrt{2}, 0, 0) + (0, 1, 0)] \\
    &= [-1, (\sqrt{2}, 1, 0)].
\end{align*} $$

Now we no longer have a pure quaternion since the scalar part is $-1$ which is non-zero and the absolute value of $qp$ is

$$ |qp| = \sqrt{(\sqrt{2})^2 + 1^2 + (-1)^2 } = \sqrt{6} \approx 2.45.$$

Since $|qp| > |p|$ in rotating the quaternion $p$ we scaled it up as shown in {numref}`quaternion-rotation-2-figure`.

```{figure} ../_images/A_Quaternion_rotation_2.svg
:width: 400
:name: quaternion-rotation-2-figure

The rotation of the quaternion or $p=[0, (2, 0, 0)]$ by multiplying by the rotation quaternion $q = [\tfrac{\sqrt{2}}{2}, (\tfrac{1}{2}, 0, \tfrac{1}{2})]$.
```

However, if we multiply $qp$ by the inverse quaternion $q^{-1}$ then $qpq^{-1}$ is a pure quaternion that has the same absolute value as $|p|$. If we make $q$ into a unit quaternion then $q^{-1} = q^*$ and

$$ \begin{align*}
    qpq^* &= [-1, (\sqrt{2}, 1, 0)] [(-\tfrac{1}{2}, 0, -\tfrac{1}{2})] \\
    &= [-\tfrac{\sqrt{2}}{2} - (\sqrt{2}, 1, 0) \cdot (-\tfrac{1}{2}, 0, -\tfrac{1}{2}), (\tfrac{1}{2}, 0, \tfrac{1}{2}) + (1, \tfrac{\sqrt{2}}{2}, 0) + (\sqrt{2}, 1, 0) \times (-\tfrac{1}{2}, 0, -\tfrac{1}{2})] \\
    &= [-\tfrac{\sqrt{2}}{2}+ \tfrac{\sqrt{2}}{2}, (\tfrac{1}{2}, 0, \tfrac{1}{2}) + (\tfrac{1}{2}, \tfrac{\sqrt{2}}{2}, 0) + (-\tfrac{1}{2}, \tfrac{\sqrt{2}}{2}, \tfrac{1}{2})] \\
    &= [0, (1, \sqrt{2}, 1)].
\end{align*} $$

So this is a pure quaternion and its absolute value is

$$ |qpq^*| = \sqrt{1^2 + (\sqrt{2})^2 + 1^2} = \sqrt{4} = 2. $$

However, plotting the result of the quaternion rotation ({numref}`quaternion-rotation-3-figure`) we see that $\mathbf{u}$ has been rotated by 90$^\circ$ as opposed to 45$^\circ$ which we desired.

```{figure} ../_images/A_Quaternion_rotation_3.svg
:width: 400
:name: quaternion-rotation-3-figure

The rotation of the quaternion or $p=(2, 0, 0, 0)$ by multiplying by the rotation quaternion $r = (\frac{\sqrt{2}}{2}, (0, 0, \frac{\sqrt{2}}{2}))$ and the quaternion conjugate $r^*$ using the sequence $rpr^*$.
```

This is because when we calcualte $qpq^*$ we are rotating $p$ by $\theta$ twice, therefore we need to halve $\theta$ when calculating the rotation quaternion

$$ q = [\cos(\tfrac{1}{2}\theta), \sin(\tfrac{1}{2}\theta) \hat{\mathbf{v}}].$$(appendix-rotation-quaternion-equation)

(quaternion-rotation-matrix-derivation-section)=

### A.3.2 Rotation matrix

To be able to combine quaternion rotation with other transformations we need to express the quaternion $qpq^*$ as a $4 \times 4$ matrix. Consider the multiplication of the axis vector quaternion $p = [p_w, (p_x, p_y, p_z)]$ on the left by the rotation unit quaternion $q = [w, (x, y, z)]$

$$ \begin{align*}
    qp &= [w, (x, y, z)] [p_w, (p_x, p_y, p_z)] \\
    &= [p_ww - (x, y, z) \cdot (p_x, p_y, p_z), \\
    &\qquad w(p_x, p_y, p_z) + p_w(x, y, z) + (x, y, z) \times (p_x, p_y, p_z)] \\
    &= [-p_xx - p_yy - p_zz + p_ww, \\
    & \qquad (w(p_x, p_y, p_z) + p_w(x, y, z) + (p_yz - p_zy, p_xz - p_zx, -p_xy + p_yx))] \\
    &= [p_ww - p_xx - p_yy - p_zz, \\
    & \qquad (p_xw + p_yz - p_zy + p_wx, p_xz + p_yw - p_zx + p_wy, -p_xy + p_yx + p_zw + p_wz)].
\end{align*} $$

If we write the quaternion $p$ as a 4-element vector of the form $\mathbf{p} = (p_x, p_y, p_z, p_w)$ (note that the scalar part of $p$, $p_w$, is now at the end of the vector which is synonymous with [homogeneous co-ordinates](homogeneous-coordinates-section)) then we can express the rotation $qp$ as the matrix equation $R_q\mathbf{p}$ where

$$ \begin{align*}
    R_q &=
    \begin{pmatrix}
        w & -z & y & x \\
        z & w & -x & y \\
        -y & x & w & z \\
        -x & -y & -z & w
    \end{pmatrix}.
\end{align*} $$

Doing similar for multiplying $p$ on the right by $q^* = [w, (-x, -y, -z)]$

$$ \begin{align*}
    pq^* &= [p_w, (p_x, p_y, p_z)][w, (-x, -y, -z)] \\
    &= [p_ww - (p_x, p_y, p_z) \cdot ( -x, -y, -z), \\
    & \qquad p_w(-x, -y, -z) + w(p_x, p_y, p_z) + (p_x, p_y, p_z) \times (-x, -y, -z)] \\
    &= [p_ww + p_xx + p_yy + p_zz, \\
    & \qquad (-p_wx, -p_wy, -p_wz) + (p_xw, p_yw, p_zw) + (-p_yz + p_zy, p_xz - p_zx, -p_xy + p_yx)] \\
    &= [p_xx + p_yy + p_zz + p_ww, \\
    & \qquad (p_xw - p_yz + p_zy - p_wx, p_xz + p_yw - p_zx - p_wy, -p_xy + p_yx + p_zw - p_wz)].
\end{align*} $$

This can be expressed by the matrix equation $R_{q^*}\mathbf{p}$ where

$$ \begin{align*}
    R_{q^*} &=
    \begin{pmatrix}
        w & -z & y & -x \\
        z & w & -x & -y \\
        -y & x & w & -z \\
        x & y & z & w
    \end{pmatrix}
\end{align*} $$

The composite quaternion multiplication $qpq^*$ can be written as the matrix equation $R_{q^*}R_q\mathbf{p}$ (this is the same as calculating $qp$ then multiplying the result on the right by $q^*$). So the rotation matrix is

$$ \begin{align*}
    R &= R_{q^*}R_q =
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
    x^2 - y^2 - z^2 + w^2 
    &= x^2 + y^2 + z^2 + w^2 - 2 y^2 - 2 z^2 \\
    &= 1 - 2(y^2 + z^2).
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

The matrix $R$ is the quaternion rotation matrix for rotating a vector $\mathbf{p}$ by angle $\theta$ about the unit vector $\hat{\mathbf{v}}$ where $x$, $y$, $z$ and $w$ are the values of the unit rotation quaternion.

To demonstrate this lets return to our example of rotating the vector $\mathbf{p} = (2, 0, 0)$ by 45$^\circ$ about the vector $(\frac{\sqrt{2}}{2}, 0, \frac{\sqrt{2}}{2})$. We first calculate the rotation quaternion $q$

$$ \begin{align*}
    q &= [\cos(\tfrac{45^\circ}{2}), \sin(\tfrac{45^\circ}{2}) (\tfrac{\sqrt{2}}{2}, 0, \tfrac{\sqrt{2}}{2})] \\
    &\approx [0.9239, (0.2706, 0, 0.2706)].
\end{align*} $$

From $q$ we have $w = 0.9239$, $x = 0.2706$, $y = 0$ and $z = 0.2706$. Substituting these into equation {eq}`quaternion-rotation-matrix-2-equation` gives

$$ \begin{align*}
    R = 
    \begin{pmatrix}
        0.8536 & -0.5000 & 0.1464 & 0 \\
        0.5000 & 0.7071 & -0.5000 & 0 \\
        0.1464 & 0.5000 & 0.8536 & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}.
\end{align*} $$

Applying the rotation to $\mathbf{p} = (2, 0, 0, 0)$

$$ \begin{align*}
    R\mathbf{p} =
    \begin{pmatrix}
        0.8536 & -0.5000 & 0.1464 & 0 \\
        0.5000 & 0.7071 & -0.5000 & 0 \\
        0.1464 & 0.5000 & 0.8536 & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}
    \begin{pmatrix} 2 \\ 0 \\ 0 \\ 0 \end{pmatrix}
    = \begin{pmatrix} 1.7071 \\ 1.0000 \\ 0.2929 \\ 0 \end{pmatrix}.
\end{align*} $$

So the rotated vector is $(1.7071, 1, 0.2929)$ which is plotted in {numref}`quaternion-rotation-4-figure`. We can see that the vector $\mathbf{p}$ has now been rotated 45$^\circ$ about the vector $\mathbf{v}$.

```{figure} ../_images/A_Quaternion_rotation_4.svg
:width: 400
:name: quaternion-rotation-4-figure

The rotation of the vector $\mathbf{p} = (2, 0, 0)$ by angle 45$^\circ$ about the vector $\mathbf{v} = (\frac{\sqrt{2}}{2}, 0, \frac{\sqrt{2}}{2})$ using the quaternion rotation matrix $R$.
```

(euler-to-quaternion-derivation-section)=

### A.3.1 Euler angles to quaternion

Euler angles are the rotations around the three co-ordinates axes $x$, $y$ and $z$ so equation {eq}`appendix-rotation-quaternion-equation` can be used to give three quaternions for pitch, yaw and roll rotations. Let $c_y = \cos(\frac{1}{2}\theta)$, $s_y = \sin(\frac{1}{2}\theta)$, $c_p = \cos(\frac{1}{2}\theta)$, $s_p =\sin(\frac{1}{2}\theta)$, $c_r = \cos(\frac{1}{2}\theta)$ and $s_r = \sin(\frac{1}{2}\theta)$ then the quaternions that rotate using the pitch, roll and yaw angles then

$$ \begin{align*}
    q_y &= [c_y, s_y \mathbf{i}], \\
    q_p &= [c_p, s_p \mathbf{j}], \\
    q_r &= [c_r, s_r \mathbf{k}].
\end{align*} $$

The combined rotation $q_pq_yq_r$ is

$$ \begin{align*}
    q_pq_yq_r &= [c_p, s_p\mathbf{i}] [c_y, s_y\mathbf{j}] [c_r, s_r\mathbf{k}] \\
    &= [c_pc_y, c_ps_y\mathbf{j} + s_pc_y\mathbf{i} + s_ps_y\mathbf{k}] [c_r, s_r\mathbf{k}] \\
    &= [c_pc_yc_r - s_ps_ys_r, c_pc_ys_r\mathbf{k} + c_ps_yc_r\mathbf{j} + s_pc_yc_r\mathbf{i} + s_ps_yc_r\mathbf{k} + c_ps_ys_r\mathbf{i} - s_pc_ys_r\mathbf{j}] \\
    &= [c_pc_yc_r - s_ps_ys_r, (s_pc_yc_r + c_ps_ys_r, c_ps_yc_r - s_pc_ys_r, c_pc_ys_r - s_ps_yc_r)].
\end{align*} $$