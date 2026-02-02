(quaternions-section)=

# Lab 10: Quaternions

We saw in [Lab 5: Transformations](axis-angle-rotation-section) that we can calculate a transformation matrix to rotate about a vector. This matrix was derived by compositing three individual rotations about the three co-ordinate $x$, $y$ and $z$ axes.

```{figure} ../_images/10_Euler_angles.svg
:width: 300
:name: euler-angles-figure

The pitch, yaw and roll Euler angles.
```

The angles that we use to define the rotation around each of the axes are known as **Euler angles** and we use the names **pitch**, **yaw** and **roll** for the rotation around the $x$, $y$ and $z$ axes respectively. The problem with using a composite of Euler angles rotations is that for certain alignments we can experience <a href="https://en.wikipedia.org/wiki/Gimbal_lock" target="_blank">**gimbal lock**</a> where two of the rotation axes are aligned leading to a loss of a degree of freedom causing the composite rotation to be *locked* into a 2D rotation.

Quaternions are a mathematical object that can be used to perform rotation operations that do not suffer from gimbal lock and require fewer floating point calculations. There is quite a lot of maths used here but in this page I've focussed only on the bits you need to know to apply quaternions.

:::{admonition} Task
:class: tip

Create a folder called ***Lab 10 Quaternions*** inside which create a file called ***index.html*** and enter the following into it.

```html
<!doctype html>

<html lang="en">
  <head>
    <title>Lab 10 - Quaternions</title>
  </head>
  <body>
    <div id="console-output" 
         style="font-family:monospace; white-space: pre; padding:10px;">
    </div>
    <script src="maths.js"></script>
    <script src="quaternion_calculations.js"></script>
  </body>
</html>
```

Create another file called ***quaternion_calculations.js*** and enter the following into it.

```javascript
function setupConsoleOutput(elementId) {
  const output = document.getElementById(elementId);

  function write(args) {
    const line = document.createElement("div");
    line.textContent = [...args].join(" ");
    output.appendChild(line);
  }
  console.log = (...args) => write(args);
}

setupConsoleOutput("console-output");
console.log('Lab 10 - Quaternions\n--------------------');
```

:::

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

Here we have a problem since the square of a negative number always returns a positive value, e.g., $(-1) \times (-1) = 1$, so there does not exist a real number to satisfy the solution to this equation. Not being satisfied with this, mathematicians invented another type of number called the **imaginary number** that is defined by $i = \sqrt{-1}$ so the solution to the equation above is $x = i$.

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

$$ z = \cos(\theta) + \sin(\theta)i.$$

This means we can rotate by an arbitrary angle $\theta$ in the complex plane by multiplying by $z$.

---

## Quaternions

A **quaternion** is an extension of a complex number where we add two additional imaginary numbers. The general form of a quaternion is

$$ q = w + xi + yj + zk, $$

where $w$, $x$, $y$ and $z$ are real numbers and $i$, $j$ and $k$ are imaginary numbers which are related to $-1$ and each other by

$$i^2 = j^2 = k^2 = ijk = -1. $$

Quaternions are more commonly represented in scalar-vector form

$$q = [w, \vec{q}_{\vec{v}}],$$

where $\vec{q}_{\vec{v}} = (x, y, z)$. We are going to create a Quaternion class so that we can work with quaternions.

:::{admonition} Task
:class: tip

Add the following class definition to the ***maths.js** file

```javascript
class Quaternion {
  constructor(w = 1, x = 0, y = 0, z = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  print() {
    const w = this.w.toFixed(3);
    const x = this.x.toFixed(3);
    const y = this.y.toFixed(3);
    const z = this.z.toFixed(3);
    return `[ ${w}, ( ${x}, ${y}, ${z} ) ]`;
  }
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
const q = new Quaternion(1, 2, 3, 4);
console.log("q = " + q.print());
```

:::

Here we have defined a Quaternion class that contains a constructor to initialize the quarternion using input paramters for $w$, $x$, $y$ and $z$ components and a method to print the quaternion. We have also created a new quaternion object for the quaternion $[1, (2, 3, 4)]$. Refresh your browser, and you should see the following added to the webpage

```text
q = [ 1.000, ( 2.000, 3.000, 4.000 ) ]
```

### Quarternion magnitude

The **magnitude**, or length, of a quaternion $q$ is denoted by $| q |$ and calculated in a similar way to how we calculate [vector magnitude](vector-magnitude-section)

$$ |q| = \sqrt{w^2 + x^2 + y^2 + z^2}. $$

For example, given the quaternion $q = [1, (2, 3, 4)]$ then

$$ |q| = \sqrt{1^2 + 2^2 + 3^2 + 4^2} = \sqrt{1 + 4 + 9 + 16} = \sqrt{30} = 5.477. $$

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
length() {
  return Math.sqrt(
    this.w * this.w +
    this.x * this.x +
    this.y * this.y +
    this.z * this.z
  );
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
console.log("length(q) = " + q.length());
```

:::

Here we have added the method `length()` that computes the magnitude of the quaternion object and used it to calculate the magnitude of the quaternion $[1, (2, 3, 4)]$. Refresh your browser, and you should see the following added to the webpage

```text
length(q) = 5.477225575051661
```

### Unit quaternion

A **unit quaternion** is a quaternion denoted by $\hat{q}$ that has a magnitude of 1. We can **normalize** a quaternion in a similar way we did for vectors to convert to a unit quaternion.

$$ \begin{align*}
  \hat{q} &= \frac{q}{| q |}.
\end{align*} $$

For example, given the quaternion $q = [1, (2, 3, 4)]$ then normalizing this gives

$$ \begin{align*}
  \hat{q} &= \frac{[1, (2, 3, 4)]}{5.477} = [0.183, (0.365, 0.548, 0.730)].
\end{align*} $$

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
normalize() {
  const len = this.length();
  if (len === 0) return new Quaternion(0, 0, 0, 0);
  const inv = 1 / len;
  this.w *= inv;
  this.x *= inv;
  this.y *= inv;
  this.z *= inv;
  
  return this;
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
const qHat = new Quaternion(1, 2, 3, 4).normalize();
console.log("\nqHat = " + qHat.print());
console.log("length(qHat) = " + qHat.length());
```

:::

Here we have added the method `normalize()` to the Quaternion class that normalizes the quaternion object. Refresh your browser, and you should see the following added to the webpage

```text
qHat = [ 0.183, ( 0.365, 0.548, 0.730 ) ]
length(qHat) = 0.9999999999999999
```

### Quaternion conjugate

The **conjugate** of the quaternion $q = [w, \vec{q}_{\vec{v}}]$ is denoted by $q^*$ and is another quaternion with the vector parts negated

$$ \begin{align*}
  q^* = [w, -\vec{q}_{\vec{v}}].
\end{align*} $$

For example, given the quaternion $q = [1, (2, 3, 4)]$ then its conjugate is

$$ \begin{align*}
  q^* = [1, (-2, -3, -4)].
\end{align*} $$

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
conjugate() {
  this.x *= -1;
  this.y *= -1;
  this.z *= -1;

  return this;
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
const qConjugate = new Quaternion(1, 2, 3, 4).conjugate();
console.log("\nconjugate(q) = " + qConjugate.print());
```

:::

Here we have added the method `conjugate()` to the Quaternion class that computes the conjugate of the current quaternion. Refresh your browser, and you should see the following added to the webpage

```text
conjugate(q) = [ 1.000, ( -2.000, -3.000, -4.000 ) ]
```

### Multiplying quaternions

The multiplication of two quaternions $q_1 = [w_1, (x_1, y_1, z_1)]$ and $q_2 = [w_2, (x_2, y_2, z_2)]$ results in the quaternion $q_1q_2 = [w, (x, y, z)]$ where

$$ \begin{align*}
  w &= w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2, \\
  x &= w_1x_2 + x_1w_2 + y_1z_2 - z_1y_2, \\
  y &= w_1y_2 - x_1z_2 + y_1w_2 + z_1x_2, \\
  z &= w_1z_2 + x_1y_2 - y_1x_2 + z_1w_2.
\end{align*}$$(quaternion-product-equation-1)

If $q_1 = [w_1, \vec{q}_{\vec{v}1}]$ and $q_2 = [w_2, \vec{q}_{\vec{v}2}]$ then we can write

$$ \begin{align*}
  q_1q_2 = [w_1w_2 - \vec{q}_{\vec{v}1} \cdot \vec{q}_{\vec{v}2}, w_1 \vec{q}_{\vec{v}1} + w_2 \vec{q}_{\vec{v}2} + \vec{q}_{\vec{v}1} \times \vec{q}_{\vec{v}2}].
\end{align*} $$(quaternion-product-equation-2)

You don't need to know where these come from but if you are curious, click on the dropdown below.

```{dropdown} Derivation of quaternion rotation equation
Let $q_1 = x_1i + y_1j + z_1k + w_1$ and $q_2 = x_2i + y_2j + z_2k + w_2$ be two quaternions then multiplying them gives

$$ \begin{align*}
    q_1q_2 &= (w_1 + x_1i + y_1j + z_1k)(w_2 + x_2i + y_2j + z_2k) \\
    &= w_1w_2 + w_1x_2i + w_1y_2j + w_1z_2k \\
    & \quad + x_1w_2i + x_1x_2i^2 + x_1y_2ij + x_1z_2ik \\
    & \quad + y_1w_2j + y_1x_2ji + y_1y_2j^2 + y_1z_2jk \\
    & \quad + z_1w_2k + z_1x_2ki + z_1y_2kj + z_1z_2k^2.
\end{align*} $$

Since $i^2 = j^2 = k^2 = -1$, $ij = k$, $ik = -j$, $ji = -k$, $jk = i$, $ki = j$, $kj = -i$ then

$$ \begin{align*}
  q_1q_2 &= w_1w_2 + w_1x_2i + w_1y_2j + w_1z_2k \\
  & \quad + x_1w_2i - x_1x_2 + x_1y_2k - x_1z_2j \\
  & \quad + y_1w_2j - y_1x_2k - y_1y_2 + y_1z_2i \\
  & \quad + z_1w_2k + z_1x_2j - z_1y_2i - z_1z_2.
\end{align*} $$

Factorising the real and imaginary parts

$$ \begin{align*}
  q_1q_2 &= w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2 \\
  & \quad + (w_1x_2 + x_1w_2 + y_1z_2 - z_1y_2)i \\
  & \quad + (w_1y_2 - x_1z_2 + y_1w_2 + z_1x_2)j \\
  & \quad + (w_1z_2 + x_1y_2 - y_1x_2 + z_1w_2)k.
\end{align*} $$

We can write this in scalar-vector form $q_1q_2 = [w, (x, y, z)]$ where

$$ \begin{align*}
  w &= w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2, \\
  x &= w_1x_2 + x_1w_2 + y_1z_2 - z_1y_2, \\
  y &= w_1y_2 - x_1z_2 + y_1w_2 + z_1x_2, \\
  z &= w_1z_2 + x_1y_2 - y_1x_2 + z_1w_2.
\end{align*}$$
```

For example, given the quaternions $q_1 = [1, (2, 3, 4)]$ and $q_2 = [5, (6, 7, 8)]$ then

$$ \begin{align*}
  w &= 1 \times 5 - 2 \times 6 - 3 \times 7 - 4 \times 8 = -60, \\
  x &= 1 \times 6 + 2 \times 5 + 3 \times 8 - 4 \times 7 = 12, \\
  y &= 1 \times 7 - 2 \times 8 + 3 \times 5 + 4 \times 6 = 30, \\
  z &= 1 \times 8 + 2 \times 7 - 3 \times 6 + 4 \times 5 = 24,
\end{align*} $$

so $q_1q_2 = [-60, (12, 30, 24)]$.

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
multiply(q) {
  const w = this.w, x = this.x, y = this.y, z = this.z;

  this.w = w * q.w - x * q.x - y * q.y - z * q.z;
  this.x = w * q.x + x * q.w + y * q.z - z * q.y;
  this.y = w * q.y - x * q.z + y * q.w + z * q.x;
  this.z = w * q.z + x * q.y - y * q.x + z * q.w;

  return this;
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
const q1 = new Quaternion(1, 2, 3, 4);
const q2 = new Quaternion(5, 6, 7, 8);
console.log("\nq1 = " + q1.print());
console.log("q2 = " + q2.print());
console.log("q1q2 = " + q1.multiply(q2).print());
```

:::

Here we have added the method `multiply()` to the Quaternion class that multiplies the current quaternion object by another quaternion and used it to calculate $[1, (2, 3, 4)][5, (6, 7, 8)]$. Refresh your browser, and you should see the following added to the webpage

```text
q1 = [ 1.000, ( 2.000, 3.000, 4.000 ) ]
q2 = [ 5.000, ( 6.000, 7.000, 8.000 ) ]
q1q2 = [ -60.000, ( 12.000, 30.000, 24.000 ) ]
```

### Quaternion inverse

The **inverse** of a quaternion $q$ is denoted by $q^{-1}$ and is defined by

$$ qq^{-1} = 1. $$

Multiplying both sides by the quaternion conjugate $q^*$

$$ \begin{align*}
  q^*qq^{-1} &= q^* \\
  |q|^2q^{-1} &= q^* \\
  q^{-1} &= \frac{q^*}{|q|^2}.
\end{align*} $$

If $q$ is a unit quaternion then $|q|=1$ and $q^{-1} = q^*$.

For example, given the quaternion $q = [1, (2, 3, 4)]$, then since $|q| = \sqrt{30}$ then

$$ \begin{align*}
  q^{-1} &= \frac{[1, (-2, -3, -4)]}{30} = [0.033, (-0.067, -0.1, -0.133)].
\end{align*} $$

Checking that this is the inverse of $q$

$$ \begin{align*}
  qq^{-1} &= [1, (-2, -3, -4)][0.183, (-0.365, -0.548, -0.730)] \\
  &= [1, (0, 0, 0)].
\end{align*} $$

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
inverse() {
  const len2 = this.length() * this.length();
  if (len2 === 0) throw new Error("Cannot invert a zero quaternion");
  return new Quaternion(
    this.w / len2,
    -this.x / len2,
    -this.y / len2,
    -this.z / len2
  );
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
// Quaternion inverse
const qInv = q.inverse();
console.log("\nqInv = " + qInv.print())
console.log("qInv * q = " + qInv.multiply(q).print())
```

:::

Here we have defined the Quaternion class method `inverse()` which calculates the inverse of the current quaternion and we have used it to calculate the inverse of the quaternion $[1, (2, 3, 4)]$. Refresh your browser, and you should see the following added to the webpage

```text
qInv = [ 0.033, ( -0.067, -0.100, -0.133 ) ]
qInv * q = [ 1.000, ( 0.000, 0.000, 0.000 ) ]
```

---

## Rotations using quaternions

We saw above that we can rotate a number in the complex plane by multiplying by the complex number

$$ z = \cos(\theta) + i\sin(\theta). $$

We can do similar in 3D space where the rotation of the vector $\vec{v}$ around a unit vector $\vec{q}_{\vec{v}}$ by the angle $\theta$. We represent $\vec{v}$ as the pure quaternion $p = [0, \vec{v}]$ and calculate

$$ p' = qpq^{-1}, $$

where $q$ is the **rotation quaternion** defined by

$$ q = [\cos(\tfrac{1}{2}\theta), \sin(\tfrac{1}{2}\theta) \vec{q}_{\vec{v}}]. $$(rotation-quaternion-equation)

For example, consider the rotation of the vector $\vec{v} = (1, 0, 0)$ that points along the $x$-axis by $90^\circ$ about the $y$-axis. The resulting vector should be $\vec{v}' = (0, 0, -1)$ (pointing down the $z$-axis). Here $p = [0, (1, 0, 0)]$ and the rotation quaternion is

$$ q = [\cos(45^\circ), \sin(45^\circ) (0, 1, 0)] = [0.707, (0, 0.707, 0)], $$

and $q^{-1} = [0.707, (0, -0.707, 0)]$. Computing $qp$ using equation {eqref}`quaternion-product-equation-2` gives

$$ \begin{align*}
  qpq^{-1} &= [0.707, (0, 0.707, 0)][0, (1, 0, 0)][0.707, (0, -0.707, 0)] \\
  &= [0, (0.707, 0, -0.707)][0.707, (0, -0.707, 0)] \\
  &= [0, (0, 0, -1)]
\end{align*} $$

So $\vec{v}' = (0, 0, -1)$ as expected.

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
fromAxisAngle(axis, angle) {
  axis = normalize(axis);
  const halfAngle = 0.5 * angle;
  const s = Math.sin(halfAngle);

  this.w = Math.cos(halfAngle);
  this.x = axis[0] * s;
  this.y = axis[1] * s;
  this.z = axis[2] * s;

  return this.normalize();
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
// Quaternion rotation
const qRot = new Quaternion().fromAxisAngle([0, 1, 0], 90 * Math.PI / 180);
const p = new Quaternion(0, 1, 0, 0);
const qRotInv = qRot.inverse();

console.log("\nqRot = " + qRot.print());
console.log("p = " + p.print());
console.log("qRotInv = " + qRotInv.print());

const pRotated = qRot.multiply(p).multiply(qRotInv);
console.log("\npRotated = " + pRotated.print());
```

:::

Here we have defined the Quaternion class method `fromAxisAngle()` which calculates the rotation quaternion using equation {eqref}`quaternion-rotation-equation`. We have then calculated the quaternions $q$, $p$ and $q^{-1}$ from the example above and used these to apply quaternion rotaiton. Refresh your browser, and you should see the following added to the webpage

```text
qRot = [ 0.707, ( 0.000, 0.707, 0.000 ) ]
p = [ 0.000, ( 1.000, 0.000, 0.000 ) ]
qRotInv = [ 0.707, ( 0.000, -0.707, 0.000 ) ]

pRotated = [ 0.000, ( 0.000, 0.000, -1.000 ) ]
```



We have been using $4 \times 4$ matrices to compute the transformations to convert between model, view and screen spaces, so in order to use quaternions for rotations we need to calculate a $4 \times 4$ rotation matrix that is equivalent to $qpq^*$. If the rotation quaternion is $q = [w, (x, y, z)]$, and $q$ is a unit quaternion, then the corresponding rotation matrix is

$$ \begin{align*}
    Rotate &=
    \begin{pmatrix}
        1 - 2(y^2 + z^2) & 2(xy + wz) & 2(xz - wy) & 0 \\
        2(xy - wz) & 1 - 2(x^2 + z^2) & 2(yz + wx) & 0 \\
        2(xz + wy) & 2(yz - wx) & 1 - 2(x^2 + y^2) & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}
\end{align*} $$(quaternion-rotation-matrix-equation)

You don't need to know the derivation of the quaternion rotation matrix but if you are curious, click on the dropdown below.

````{dropdown} Derivation of quaternion rotation equation
Consider the rotation of the vector $\vec{p} = (2, 0, 0)$ by 45$^\circ$ about the $z$-axis. The rotation quaternion for this is

$$ q = [\cos(45^\circ), \sin(45^\circ)(0, 0, 1)] =  [0.707, (0, 0, 0.707)], $$

and expressing $\vec{p}$ as a pure quaternion we have $p = [0, (2, 0, 0)]$. Multiplying $p$ and $q$ using equation {eq}`quaternion-product-equation` gives

$$ \begin{align*}
    qp &=  [0.707, (0, 0, 0.707)] [0, (2, 0, 0)] = [0, (1.414, 1.414, 0)]
\end{align*} $$

Since the scalar part is zero then this is a pure quaternion and the absolute value of the rotated quaternion is

$$ \begin{align*}
    |qp| &= \sqrt{0 ^ 2 + 1.414^2 + 1.414^2 + 0^2} = 2,
\end{align*} $$

which is the same as the absolute value of $[0, (2, 0, 0)]$. This rotation is shown in shown in {numref}`quaternion-rotation-1-figure`.

```{figure} ../_images/B_Quaternion_rotation_1.svg
:width: 450
:name: quaternion-rotation-1-figure

The quaternion $p = [0, (2, 0, 0)]$ is rotated $45^\circ$ by multiplying by the rotation quaternion $q = [\cos(45^\circ), \sin(45^\circ)(1, 0, 0)]$.
```

In the rotation example shown above used a quaternion that was perpendicular to the vector being rotated. What happens when we rotate by a quaternion that isn't perpendicular to the vector? Consider the rotation of the same vector $\vec{p} = (2, 0, 0)$ by angle 45$^\circ$ about the unit vector $\hat{\vec{v}} =  (0.707, 0, 0.707)$ which is not perpendicular to $\vec{p}$. The rotation quaternion is

$$ \begin{align*}
    q = [\cos(45^\circ), \sin(45^\circ)(0.707, 0, 0.707)] = [0.707,(0.5, 0, 0.5)]
\end{align*} $$

and multiplying by $p = [0, (2, 0, 0)]$

$$ \begin{align*}
    qp &= [0.707,(0.5, 0, 0.5)] [0, (2, 0, 0)] = [-1, (1.414, 1, 0)].
\end{align*} $$

Now we no longer have a pure quaternion since the scalar part is $-1.414$ which is non-zero. However, if we multiply $qp$ by the quaternion conjugate $q^*$ on the right we have

$$ \begin{align*}
    qpq^* &= [0.707,(0.5, 0, 0.5)] [0, (2, 0, 0)] [0.707, (-0.5, 0, -0.5)] \\
    &= [0, (1, 1.414, 1)]
\end{align*} $$

So $qpq^*$ is a pure quaternion and its absolute value is

$$ |qpq^*| = \sqrt{1^2 + (1.414)^2 + 1^2} = \sqrt{4} = 2,$$

which is the same as $|p|$.

```{figure} ../_images/B_Quaternion_rotation_2.svg
:width: 450
:name: quaternion-rotation-2-figure

Rotating the quaternion $p=[0, (2, 0, 0)]$ using $qpq^*$ where $q = [\cos(45^\circ), \sin(45^\circ) \hat{\vec{v}}]$
```

Plotting $p$ and $qpq^*$ we see that we have rotated by $90^\circ$ instead of the desired $45^\circ$ ({numref}`quaternion-rotation-2-figure`). This is because we have multiplied the quaternion $p$ by two rotation quaternions each using the angle $45^\circ$. So to rotate a quaternion $p$ about a vector $\hat{\vec{v}}$ by angle $\theta$ whilst ensuring that we get a pure quaternion we perform $qpq^*$ where the rotation quaternion is

$$ q = [\cos(\tfrac{1}{2}\theta), \sin(\tfrac{1}{2}\theta) \hat{\vec{v}}].$$(appendix-rotation-quaternion-equation)

Returning to our example of rotating $\vec{p} = (2, 0, 0)$ by $45^\circ$ about the vector $\hat{\vec{v}} = (0.707, 0, 0.707)$ using equation {eq}`appendix-rotation-quaternion-equation` we have a rotation quaternion of

$$q = [\cos(\tfrac{45^\circ}{2}), \sin(\tfrac{45^\circ}{2})(0.707, 0, 0.707)] = [0.924, (0.271, 0, 0.271)]$$

so calculating $qpq^*$ we have

$$ \begin{align*}
    qpq^* &= [0.924, (0.271, 0, 0.271)] [0,(2,0,0)] [0.924, (-0.271, 0, -0.271)] \\
    &= [0, (1.707, 1, 0.293)].
\end{align*}$$

The effect of this rotation is shown in {numref}`quaternion-rotation-3-figure`.

```{figure} ../_images/B_Quaternion_rotation_3.svg
:width: 450
:name: quaternion-rotation-3-figure

Rotating the quaternion $p=[0, (2, 0, 0)]$ using $qpq^*$ where $q = [\cos(\frac{45^\circ}{2}), \sin(\frac{45^\circ}{2}) \hat{\vec{v}}]$.
```

To derive a $4 \times 4$ transformation matrix that achieves quaternion rotation, consider the multiplication of the quaternion $p = [p_w, (p_x, p_y, p_z)]$ on the left by the rotation unit quaternion $q = [w, (x, y, z)]$

$$ \begin{align*}
    qp &= [w, (x, y, z)] [p_w, (p_x, p_y, p_z)] \\
    &= [wp_w - (x, y, z) \cdot (p_x, p_y, p_z), w(p_x, p_y, p_z) + p_w(x, y, z) + (x, y, z) \times (p_x, p_y, p_z)] \\
    &= [wp_w - xp_x - yp_y - zp_z, \\
    &\qquad (wp_x - zp_y - yp_z + xp_w, zp_x + wp_y - xp_z + yp_w, -yp_x + xp_y + wp_z + zp_w)].
\end{align*} $$

If we write the quaternion $p$ as a 4-element vector of the form $\vec{p} = (p_x, p_y, p_z, p_w)^\mathsf{T}$ (note that $p_w$, is now at the end of the vector which is synonymous with [homogeneous coordinates](homogeneous-coordinates-section)) then we have

$$ \begin{align*}
    qp &=
    \begin{pmatrix}
         wp_x - zp_y + yp_z + xp_w \\
         zp_x + wp_y - xp_z + yp_w \\
        -yp_x + xp_y + wp_z + zp_w \\
        -xp_x - yp_y - zp_z + wp_w
    \end{pmatrix},
\end{align*} $$

and we can express the rotation $qp$ as the matrix equation

$$ qp = \begin{align*}
    \begin{pmatrix}
         w & -z &  y & x \\
         z &  w & -x & y \\
        -y &  x &  w & z \\
        -x & -y & -z & w
    \end{pmatrix}
    \begin{pmatrix} p_x \\ p_y \\ p_z \\ p_w \end{pmatrix}
\end{align*} $$(quaternion-rotation-q-equation)

Doing similar for multiplying $p$ on the right by $q^* = [w, (-x, -y, -z)]$

$$ \begin{align*}
    pq^* &= [p_w, (p_x, p_y, p_z)][w, (-x, -y, -z)] \\
    &= [wp_w - (p_x, p_y, p_z) \cdot ( -x, -y, -z), \\
    & \qquad p_w(-x, -y, -z) + w(p_x, p_y, p_z) + (p_x, p_y, p_z) \times (-x, -y, -z)] \\
    &= [xp_x + yp_y + zp_z + wp_w, \\
    & \qquad (wp_x - zp_y + yp_z - xp_w, zp_x + wp_y - xp_z - yp_w, -yp_x + xp_y + wp_z - zp_w)].
\end{align*} $$

Writing $p$ the form $\vec{p} = (p_x, p_y, p_z, p_w)$ as before gives

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

The two matrices for $qp$ and $pq^*$ from equations {eq}`quaternion-rotation-q-equation` and {eq}`quaternion-rotation-q2-equation` can be combined to give a single matrix $R$ that performs the quaternion rotation $qpq^*$

$$ \begin{align*}
    R &= qp \cdot pq^*
    =
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
        x^2 - y^2 - z^2 + w^2 & 2(xy - wz) & 2(xz + wy) & 0 \\
        2(xy + wz) & -x^2 + y^2 - z^2 + w^2 & 2(yz - wx) & 0 \\
        2(xz - wy) & 2(wx + yz) & -x^2 - y^2 + z^2 + w^2 & 0 \\
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
        1 - 2(y^2 + z^2) & 2(xy - wz) & 2(xz + wy) & 0 \\
        2(xy + wz) & 1 - 2(x^2 + z^2) & 2(yz - wx) & 0 \\
        2(xz - wy) & 2(wx + yz) & 1 - 2(x^2 + y^2) & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}.
\end{align*} $$

Transposing $R$ for use with column-major ordering gives

$$ \begin{align*}
    R &=
    \begin{pmatrix}
        1 - 2(y^2 + z^2) & 2(xy + wz) & 2(xz - wy) & 0 \\
        2(xy - wz) & 1 - 2(x^2 + z^2) & 2(yz + wx) & 0 \\
        2(xz + wy) & 2(yz - wx) & 1 - 2(x^2 + y^2) & 0 \\
        0 & 0 & 0 & 1
    \end{pmatrix}.
\end{align*} $$
````

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
matrix() {
  const w = this.w, x = this.x, y = this.y, z = this.z;
  const xx = x * x, yy = y * y, zz = z * z;
  const wx = w * x, wy = w * y, wz = w * z;
  const xy = x * y, xz = x * z, yz = y * z;

  return new Mat4().set([
    1 - 2 * (yy + zz),  2 * (xy + wz),      2 * (xz - wy),      0,
    2 * (xy - wz),      1 - 2 * (xx + zz),  2 * (yz + wx),      0,
    2 * (xz + wy),      2 * (yz - wx),      1 - 2 * (xx + yy),  0,
    0,                  0,                  0,                  1
  ]);
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
const quaterionRotation = rotationQuaternion.matrix();
console.log("\nquaternion rotation matrix =\n" + quaterionRotation.print());

const rotationMatrix = new Mat4().rotate(axis, angle);
console.log("\nrotation matrix =\n" + rotationMatrix.print());
```

:::

Here we have defined the Quaternion class method `matrix()` that returns the $4 \times 4$ quaternion rotation matrix for a rotation quaternion. We then print this, as well as the standard [axis-angle rotation matrix](axis-angle-rotation-section) from {eqref}`axis-angle-rotation-matrix`. Refresh your browser, and you should see the following added to the webpage

```text
quaternion rotation matrix =
  [    0.80     0.51    -0.31     0.00 ]
  [   -0.31     0.80     0.51     0.00 ]
  [    0.51    -0.31     0.80     0.00 ]
  [    0.00     0.00     0.00     1.00 ]

rotation matrix =
  [    0.80     0.51    -0.31     0.00 ]
  [   -0.31     0.80     0.51     0.00 ]
  [    0.51    -0.31     0.80     0.00 ]
  [    0.00     0.00     0.00     1.00 ]
```

Note that both matrices are equivalent, so why are we bothering with quaternion rotation? Comparing the code for the `matrix()` Quaternion class method with the `rotate()` method from the Mat4 class we can see the quaternion rotation matrix requires 16 multiplications compared to 24 multiplications to calculate the rotation matrix. Efficiency is always a bonus, but the main advantage is the quaternion rotation matrix does not suffer from gimbal lock so it will work for any axis vector.

So it makes sense to use the quaternion rotation matrix for our axis-angle rotations. Edit the `rotate()` Mat4 class method, so that is looks like the following.

```cpp
rotate(axis, angle) {
  const rotationQuaternion = new Quaternion().fromAxisAngle(axis, angle);
  return this.multiply(rotationQuaternion.matrix());
}
```

### Calculating a quaternion from Euler angles

Quaternions can be thought of as an orientation in 3D space. Imagine a camera in the world space that is pointing in a particular direction. The direction in which the camera is pointing can be described with reference to the $x$, $y$ and $z$ axes in terms of the $pitch$, $yaw$ and $roll$ Euler angles. Since multiplying rotation quaternions achieves rotation, then if $q_x$, $q_y$ and $q_z$ are rotation quaterions for rotatiing about the $x$, $y$ and $z$ axes then

$$ \begin{align*}
  q_x &= [c_x, (s_x, 0, 0)], \\
  q_y &= [c_y, (0, s_y, 0)], \\
  q_z &= [c_z, (0, 0, s_z)].
\end{align*} $$

Since $pitch$, $yaw$ and $roll$ are the angles for rotating about the $x$, $y$ and $z$ axes respectively then

$$ \begin{align*}
    c_x &= \cos(\tfrac{pitch}{2}), &
    c_y &= \cos(\tfrac{yaw}{2}), &
    c_z &= \cos(\tfrac{roll}{2}) \\
    s_x &= \sin(\tfrac{pitch}{2}), &
    s_y &= \sin(\tfrac{yaw}{2}), &
    s_z &= \sin(\tfrac{roll}{2}).
\end{align*} $$

Rotating about the $x$, $y$ and $z$ axes in that order we need to calcualte $q_zq_yq_x$ (quaternion multiplication applies rotations from right-to-left)

$$ \begin{align*}
  q_zq_yq_x &= [c_r, (0, 0, s_r)][c_y, (0, s_y, 0)][c_p, (s_p, 0, 0)] \\
  &= [c_pc_yc_r + s_ps_ys_r, (s_pc_yc_r - c_ps_ys_r, c_ps_yc_r + s_pc_ys_r, c_pc_yc_r - s_ps_yc_r)].
\end{align*} $$(euler-to-quaternion-equation)

---

## A Quaternion camera

We are currently using Euler angles rotation to calculate the camera vectors in the `update()` Camera class method. As such our camera may suffer from gimbal lock, and it also does not allow us to move the camera through 90$^\circ$ or 270$^\circ$ (recall that we needed to limit the $pitch$ angle between $-89^\circ$ and $+89^\circ$). So it would be advantageous to use quaternion rotations to calculate the view matrix.

To implement a quaternion camera we calculate a quaternion from the camera Euler angles that represents the current orientation of the camera. We can then use the rotation matrix for this quaternion, along with a translation transformation to move the camera to $(0, 0, 0)$, to calculate the view matrix, i.e.,

$$ View = Quaternion(pitch, yaw) \cdot Translate(-\vec{eye}) $$

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

Here the camera orientation quaternion is calculated from the $pitch$ and $yaw$ Euler angles. We then combine a translation by $-\vec{eye}$ so that the camera is at the origin and then rotate using the rotation matrix for the orientation quaternion (remember this is how the view matrix was derived in [6. 3D Worlds](view-matrix-section)). We also need to calculate the $\vec{right}$, $\vec{up}$ and $\vec{front}$ camera vectors using the orientation quaternion. Recall that the view matrix given in equation {eq}`lookat-matrix-equation` is

$$ View = \begin{pmatrix}
        \vec{right}_x & \vec{up}_x & -\vec{front}_x & 0 \\
        \vec{right}_y & \vec{up}_y & -\vec{front}_y & 0 \\
        \vec{right}_z & \vec{up}_z & -\vec{front}_z & 0 \\
        -\vec{eye} \cdot \vec{right} & -\vec{eye} \cdot \vec{up} & \vec{eye} \cdot \vec{front} & 1 \\
    \end{pmatrix} $$

So we just extract $\vec{right}$, $\vec{up}$ and $\vec{front}$ from the first three columns of the view matrix.

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
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/10_Camera_with_quaternion.mp4" type="video/mp4">
</video>
</center>

---
## SLERP

The another advantage that quaternions have over Euler angles is that we can interpolate between two quaternions smoothly and without encountering the problem of gimble lock. Standard Linear intERPolation (LERP) is used to calculate an intermediate position on the straight line between two points.

```{figure} ../_images/10_LERP.svg
:width: 300

Linear interpolation between two points.
```

If $\vec{v}_1$ and $\vec{v}_2$ are two points then another point, $\vec{v}_t$, that lies on the line between $\vec{v}_1$ and $\vec{v}_2$ is calculated using

$$ \operatorname{LERP}(\vec{v}_1, \vec{v}_2, t) = \vec{v}_1 + t(\vec{v}_2 - \vec{v}_1), $$

where $t$ is a value between 0 and 1.

**SLERP** stands for Spherical Linear intERPpolation and is a method used to interpolate between two quaternions across a surface of a sphere.

```{figure} ../_images/10_SLERP.svg
:width: 400
:name: A-SLERP-figure

SLERP interpolation between two points on a sphere.
```

Consider {numref}`A-SLERP-figure` where $q_1$ and $q_2$ are two quaternions emanating from the centre of a sphere (note that this diagram is a bit misleading as quaternions exist in 4 dimensions but since it's very difficult to visualize 4D on a 2D screen this will have to do). The interpolated quaternion $q_t$ represents another quaternion that is partway between $q_1$ and $q_2$ calculated using

$$ \begin{align*}
    \operatorname{SLERP}(q_1, q_2, t) = \frac{\sin((1-t) \theta)}{\sin(\theta)}q_1 + \frac{\sin(t\theta)}{\sin(\theta)}q_2
\end{align*}, $$(slerp-equation)

where $t$ is a value between 0 and 1 and $\theta$ is the angle between the two quaternions and is calculated using

$$ \theta = \cos^{-1} \left( \frac{q_1 \cdot q_2}{|q_1||q_2|} \right),$$

where $q_1 \cdot q_2$ is the dot product between the two quaternions and calculated in the same way as the [dot product between two 4-element vectors](dot-product-section). Sometimes $q_1 \cdot q_2$ returns a negative result meaning that $\theta$ we will be interpolating the long way round the sphere. To overcome this we negate the values of one of the quaternions, this is fine since the quaternion $-q$ is the same orientation as $q$.

Another consideration is when $\theta$ is very small then $\sin(\theta)$ in equation {eq}`slerp-equation` can be rounded to zero causing a divide by zero error. To get around this we can use LERP between $q_1$ and $q_2$.

Add a method declaration to the Maths class in the `maths.hpp` file

```cpp
static Quaternion SLERP(const Quaternion q1, const Quaternion q2, const float t);
```

and define the method in the `maths.cpp` file

```cpp
// SLERP
Quaternion Maths::SLERP(Quaternion q1, Quaternion q2, const float t)
{
    // Calculate cos(theta)
    float cosTheta = q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
    
    // If q1 and q2 are close together return q2 to avoid divide by zero errors
    if (cosTheta > 0.9999f)
        return q2;

    // Avoid taking the long path around the sphere by reversing sign of q2
    if (cosTheta < 0)
    {
        q2 = Quaternion(-q2.w, -q2.x, -q2.y, -q2.z);
        cosTheta = -cosTheta;
    }
    
    // Calculate SLERP
    Quaternion q;
    float theta = acos(cosTheta);
    float a = sin((1.0f - t) * theta) / sin(theta);
    float b = sin(t * theta) / sin(theta);
    q.w = a * q1.w + b * q2.w;
    q.x = a * q1.x + b * q2.x;
    q.y = a * q1.y + b * q2.y;
    q.z = a * q1.z + b * q2.z;
    
    return q;
}
```

Then to apply SLERP replace the code used to calculate the `orientation` quaternion in the `quaternionCamera()` method with the following.

```cpp
// Calculate camera orientation quaternion from the Euler angles
Quaternion newOrientation(-pitch, yaw);

// Apply SLERP
orientation = Maths::SLERP(orientation, newOrientation, 0.2f);
```

Here we use a temporary quaternion `newOrientation` which is calculated using the $pitch$, $yaw$ and $roll$ Euler angles of the camera and then used SLERP to interpolate between `orientation` and `newOrientation`. Note that here we are using $t = 0.2$. This parameter determines how far towards the new orientation we are interpolating. Compile and run your program and you should see that the camera rotation is much smoother and more satisfying to use.

---

## Third person camera

The use of quaternions allows game developers to implement third person camera view in 3D games where the camera follows the character that the player is controlling. This was first done for the Playstation game *Tomb Raider* released by Core Design in 1996 and has become popular with game developers with game franchises such as *God of War*, *Horizon Zero Dawn*, *Assassins Creed* and *Red Dead Redemption* to name a few all using third person camera view.

```{figure} ../_images/10_Third_person_camera.svg
:width: 400
:name: third-person-camera-figure

A third person camera that follows a character.
```

To implement a simple third person camera, we calculate the view matrix as usual and then move the camera back by translating by an $\vec{offset}$ vector {numref}`third-person-camera-figure`.

$$ View = Translate(\vec{offset}) \cdot View $$

The result of a third-person camera view can be seen below. Here we are using <a href="https://en.wikipedia.org/wiki/Blender_(software)#Suzanne" target="_blank">Suzanne the Blender mascot</a> to act as our character model, and we can switch from first-person to third-person view using keyboard input.

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/10_Third_person_camera_1.mp4" type="video/mp4">
</video>
</center>

Moving the camera around we see that our character model is always facing in the same direction. To make it face in the same direction as the camera we combine pitch and yaw rotations, and use them in the model matrix calculation for the character model.

$$ Rotate = R_y(yaw) \cdot R_x(pitch).$$

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/10_Third_person_camera_2.mp4" type="video/mp4">
</video>
</center>

Implementations of a third-person camera can vary. For example, you may want the character movement to be independent of the camera movement so that the camera is not always behind the character. To do this we would calculate the view matrix for a third-person camera as seen above, but calculate a different orientation for the character based on a different $yaw$ angle that can be altered using keyboard inputs ({numref}`third-person-camera-figure-2`).

```{figure} ../_images/10_Third_person_camera_2.svg
:width: 450
:name: third-person-camera-figure-2

A third person camera that is independent of the character orientation.
```

---
## Exercises

1. Add the ability for the user to switch between view modes where pressing the 1 key selects first-person camera and pressing the 2 key selects a third person camera. In third-person camera mode the camera should follow the character and point in the same direction as the character is facing.

The Suzanne model and textures can be downloaded from the <a href="https://github.com/jonshiach/Computer-Graphics-Labs/tree/main/assets" target="_blank">GitHub repository</a> (this was only added recently so you might not have it).

2. Add the ability for the user to select a different third-person camera mode by pressing the 3 key. In this mode, the camera should be independent of the character movement where it can rotate around the character based on the camera $yaw$ and $pitch$ angles. The character movement direction should be governed by a character $yaw$ angle that can be altered by the A and D keys.

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/10_Third_person_camera_3.mp4" type="video/mp4">
</video>
</center>

---

## Video walkthrough

The video below walks you through these lab materials.

<iframe width="560" height="315" src="https://www.youtube.com/embed/-hodWDPpV9w?si=SouaIdCqYoy6wEmb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>