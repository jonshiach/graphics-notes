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

Create a copy of either your folders from labs 7, 8 or 9 (doesn't matter which one, as long is it has a working camera that can be controlled using a keyboard and mouse), rename it ***Lab 10 Quaternions***, rename the main JavaScript file to ***quaternions.js*** and change ***index.html*** so that the page title is "Lab 10 - Quaternions".

Then create a new file called ***quaternion_calculations.js*** and enter the following

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

Finally, create a new file called ***index2.html*** and enter the following

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

:::

In this lab we will being by learning how to perform calculations using quaternions the ***quaternion_calculations.js*** file and adding a class to the ***maths.js*** file. Once we know our class performs the correct calculations, we will implement this into the ***quaternions.js*** and ***camera.js*** files. Load ***index2.html*** in a live server and you should see a webpage containing the following

```text
Lab 10 - Quaternions
--------------------
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

Quaternions are more commonly represented in scalar-vector form where we use a 3-element vector for the imaginary coefficients

$$q = [w, (x, y, z)],$$

where $w$ is known as the **scalar** part of a quaternion and $(x, y, z)$ is the **vector** part. We are going to create a Quaternion class so that we can work with quaternions.

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

    toString() {
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
console.log("q = " + q);
```

:::

Here we have defined a Quaternion class that contains a constructor to initialize the quaternion using input parameters for $w$, $x$, $y$ and $z$ components and a method to output a string for printing. We have also created a new quaternion object for the quaternion $[1, (2, 3, 4)]$. Refresh your browser, and you should see the following added to the webpage

```text
q = [ 1.000, ( 2.000, 3.000, 4.000 ) ]
```

### Quaternion magnitude

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
console.log("\nqHat = " + qHat);
console.log("length(qHat) = " + qHat.length());
```

:::

Here we have added the method `normalize()` to the Quaternion class that normalizes the quaternion object. Refresh your browser, and you should see the following added to the webpage

```text
qHat = [ 0.183, ( 0.365, 0.548, 0.730 ) ]
length(qHat) = 0.9999999999999999
```

### Multiplying quaternions

The multiplication of two quaternions $q_1 = [w_1, (x_1, y_1, z_1)]$ and $q_2 = [w_2, (x_2, y_2, z_2)]$ results in the quaternion $q_1 \, q_2 = [w, (x, y, z)]$ where

$$ \begin{align*}
  w &= w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2, \\
  x &= w_1x_2 + x_1w_2 + y_1z_2 - z_1y_2, \\
  y &= w_1y_2 - x_1z_2 + y_1w_2 + z_1x_2, \\
  z &= w_1z_2 + x_1y_2 - y_1x_2 + z_1w_2.
\end{align*}$$(quaternion-product-equation-1)

If $q_1 = [w_1, \vec{a}]$ and $q_2 = [w_2, \vec{b}]$ then we can write quaternion multiplication as

$$ \begin{align*}
  q_1 \, q_2 = [w_1w_2 - \vec{a} \cdot \vec{b}, w_1 \vec{a} + w_2 \vec{b} + \vec{a} \times \vec{b}].
\end{align*} $$(quaternion-product-equation-2)

You don't need to know where equations {eq}`quaternion-product-equation-1` and {eq}`quaternion-product-equation-2` come from but if you are curious, click on the dropdown below.

```{dropdown} Derivation of quaternion multiplication equation
Let $q_1 = x_1i + y_1j + z_1k + w_1$ and $q_2 = x_2i + y_2j + z_2k + w_2$ be two quaternions then multiplying them gives

$$ \begin{align*}
    q_1 \, q_2 &= (w_1 + x_1i + y_1j + z_1k)(w_2 + x_2i + y_2j + z_2k) \\
    &= w_1w_2 + w_1x_2i + w_1y_2j + w_1z_2k \\
    & \quad + x_1w_2i + x_1x_2i^2 + x_1y_2ij + x_1z_2ik \\
    & \quad + y_1w_2j + y_1x_2ji + y_1y_2j^2 + y_1z_2jk \\
    & \quad + z_1w_2k + z_1x_2ki + z_1y_2kj + z_1z_2k^2.
\end{align*} $$

Since $i^2 = j^2 = k^2 = -1$, $ij = k$, $ik = -j$, $ji = -k$, $jk = i$, $ki = j$, $kj = -i$ then

$$ \begin{align*}
  q_1 \, q_2 &= w_1w_2 + w_1x_2i + w_1y_2j + w_1z_2k \\
  & \quad + x_1w_2i - x_1x_2 + x_1y_2k - x_1z_2j \\
  & \quad + y_1w_2j - y_1x_2k - y_1y_2 + y_1z_2i \\
  & \quad + z_1w_2k + z_1x_2j - z_1y_2i - z_1z_2.
\end{align*} $$

Factorising the real and imaginary parts

$$ \begin{align*}
  q_1 \, q_2 &= w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2 \\
  & \quad + (w_1x_2 + x_1w_2 + y_1z_2 - z_1y_2)i \\
  & \quad + (w_1y_2 - x_1z_2 + y_1w_2 + z_1x_2)j \\
  & \quad + (w_1z_2 + x_1y_2 - y_1x_2 + z_1w_2)k.
\end{align*} $$(quaternion-multiplication-equation-3)

We can write this in scalar-vector form $q_1 \, q_2 = [w, (x, y, z)]$ where

$$ \begin{align*}
  w &= w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2, \\
  x &= w_1x_2 + x_1w_2 + y_1z_2 - z_1y_2, \\
  y &= w_1y_2 - x_1z_2 + y_1w_2 + z_1x_2, \\
  z &= w_1z_2 + x_1y_2 - y_1x_2 + z_1w_2.
\end{align*}$$

We can write equation {eq}`quaternion-multiplication-equation-3` by multiplying by the quaternions $[1, (0, 0, 0)]$ for the scalar part and $i = [0, (1, 0, 0)]$, $j = [0, (0, 1, 0)]$ and $k = [0, (0, 0, 1)]$ for the imaginary parts

$$ \begin{align*}
    q_1 \, q_2 &= (w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2)[1, (0, 0, 0)] \\
    & \quad + (w_1x_2 + x_1w_2 + y_1z_2 - z_1y_2)[0, (1, 0, 0)] \\
    & \quad + (w_1y_2 - x_1z_2 + y_1w_2 + z_1x_2)[0, (0, 1, 0)] \\
    & \quad + (w_1z_2 + x_1y_2 - y_1x_2 + z_1w_2)[0, (0, 0, 1)] \\
    &= [w_1w_2 - x_1x_2 - y_1y_2 - z_1z_2, \\
    & \quad w_1(x_2, y_2, z_2) + w_2(x_1, y_1, z_2)\\
    & \quad + (y_1z_2 - z_1y_2, z_1x_2 - x_1z_2, x_1y_2 - y_1x_2)]
\end{align*} $$

Since

$$ \begin{align*}
    (x_1, y_1, z_1) \cdot (x_2, y_2, z_2) &= x_1x_2 + y_1y_2 + z_1z_2, \\
    (x_1, y_1, z_1) \times (x_2, y_2, z_2) &= (y_1z_2 - z_1y_2, z_1x_2 - x_1z_2, x_1y_2 - y_1x_2)
\end{align*} $$

then

$$ \begin{align*}
    q_1 \, q_2 &= [w_1w_2 - (x_1, y_1, z_1) \cdot (x_2, y_2, z_2), \\
    & \qquad w_1(x_2, y_2, z_2) + w_2(x_1, y_1, z_2) + (x_1, y_1, z_1) \times (x_2, y_2, z_2)]
\end{align*} $$

Let $\vec{a} = (x_1, y_1, z_1)$ and $\vec{b} = (x_2, y_2, z_2)$ such that $q_1 = [w_1, \vec{a}]$ and $q_2 = [w_2, \vec{b}]$ then

$$ q_1 \, q_2 = [w_1w_2 - \vec{a} \cdot \vec{b}, w_1 \vec{b} + w_2 \vec{a} + \vec{a} \times \vec{b}].$$
```

For example, given the quaternions $q_1 = [1, (2, 3, 4)]$ and $q_2 = [5, (6, 7, 8)]$ then

$$ \begin{align*}
  w &= 1 \times 5 - 2 \times 6 - 3 \times 7 - 4 \times 8 = -60, \\
  x &= 1 \times 6 + 2 \times 5 + 3 \times 8 - 4 \times 7 = 12, \\
  y &= 1 \times 7 - 2 \times 8 + 3 \times 5 + 4 \times 6 = 30, \\
  z &= 1 \times 8 + 2 \times 7 - 3 \times 6 + 4 \times 5 = 24,
\end{align*} $$

so $q_1 \, q_2 = [-60, (12, 30, 24)]$.

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
console.log("\nq1 = " + q1);
console.log("q2 = " + q2);
console.log("q1 x q2 = " + q1.multiply(q2));
```

:::

Here we have added the method `multiply()` to the Quaternion class that multiplies the current quaternion object by another quaternion and used it to calculate $[1, (2, 3, 4)][5, (6, 7, 8)]$. Refresh your browser, and you should see the following added to the webpage

```text
q1 = [ 1.000, ( 2.000, 3.000, 4.000 ) ]
q2 = [ 5.000, ( 6.000, 7.000, 8.000 ) ]
q1 x q2 = [ -60.000, ( 12.000, 30.000, 24.000 ) ]
```

### Quaternion inverse

The **inverse** of a quaternion $q$ is denoted by $q^{-1}$ and is defined by

$$ q  q^{-1} = q^{-1} \, q = 1. $$(quaternion-inverse-definition)

To calculate the inverse or the quaternion $q = [w, (x, y, z)]$, we need to consider its **conjugate** of which is denoted by $q^*$ and is defined by

$$ \begin{align*}
    q^* = [w, (-x, -y, -z)],
\end{align*} $$

i.e., the sign of the vector part is negated. Note that multiplying $q$ by its conjugate results in $q q^*=q^* \, q = |q|^2$ so multiplying both sides of equation {eq}`quaternion-inverse-definition` by $q^*$

$$ \begin{align*}
  q^* \, q q^{-1} &= q^* \\
  |q|^2 q^{-1} &= q^* \\
  q^{-1} &= \frac{q^*}{|q|^2}.
\end{align*} $$

If $q$ is a unit quaternion then $|q|=1$ and $q^{-1} = q^*$. For example, given the quaternion $q = [1, (2, 3, 4)]$, then since $|q| = \sqrt{30}$ then

$$ \begin{align*}
  q^{-1} &= \frac{[1, (-2, -3, -4)]}{30} = [0.033, (-0.067, -0.1, -0.133)].
\end{align*} $$

Checking that this is the inverse of $q$

$$ \begin{align*}
  q q^{-1} &= [1, (-2, -3, -4)][0.183, (-0.365, -0.548, -0.730)] \\
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
console.log("\nqInv = " + qInv)
console.log("qInv x q = " + qInv.multiply(q))
```

:::

Here we have defined the Quaternion class method `inverse()` which calculates the inverse of the current quaternion, and we have used it to calculate the inverse of the quaternion $[1, (2, 3, 4)]$. Refresh your browser, and you should see the following added to the webpage

```text
qInv = [ 0.033, ( -0.067, -0.100, -0.133 ) ]
qInv x q = [ 1.000, ( 0.000, 0.000, 0.000 ) ]
```

---

## Rotations using quaternions

We saw above that we can rotate a number in the complex plane by multiplying by the complex number

$$ z = \cos(\theta) + i\sin(\theta). $$

To rotate a quaternion $p$ we simply multiply it by another quaternion $q$ that represents the rotation we wish to apply

$$ p' = q p, $$

where $q$ is defined by

$$ q = [\cos(\tfrac{1}{2}\theta), \sin(\tfrac{1}{2}\theta) \hat{\vec{v}} ]. $$(rotation-quaternion-equation)

To apply the rotation quaternion to rotate the vector $\vec{p}$ we need to define the quaternion $p = [0, \vec{p}]$ and then calculate

$$p' = q p q^{-1},$$(quaternion-rotation-multiplication-equation)

which returns a quaternion of the form $p' = [0, \vec{p}']$ where $\vec{p}'$ is the rotated vector. You don't need to know why we need to use 2 multiplications in equation {eq}`quaternion-rotation-multiplication-equation` but if you are curious, click on the dropdown below.

````{dropdown} Derivation of the equation for rotating a vector using quaternions
Consider the rotation of the vector $\vec{p} = (2, 0, 0)$ by 45$^\circ$ about the vector $\hat{\vec{v}} = (0, 0, 1)$ the points along the $z$-axis. The rotation quaternion for this is

$$ q = [\cos(45^\circ), \sin(45^\circ)(0, 0, 1)] =  [0.707, (0, 0, 0.707)]. $$

Expressing $\vec{p}$ as a quaternion we have $p = [0, (2, 0, 0)]$ and rotating this using $q$ we have

$$ \begin{align*}
    p' = q p &= [0.707, (0, 0, 0.707)] [0, (2, 0, 0)] = [0, (1.414, 1.414, 0)]
\end{align*} $$

The scalar part of $p'$ is zero so we can extract the rotated vector which is $\vec{p}' = (1.414, 1.414, 0)$. This rotation is shown below.

```{figure} ../_images/10_quaternion_rotation_1.svg
:width: 450
```

This example rotated about a vector that points along one of the axes, what happens when we rotate by a vector that doesn't? Consider the rotation of the same vector $\vec{p} = (2, 0, 0)$ by angle $45^\circ$ about the unit vector $\hat{\vec{v}} =  (0.707, 0, 0.707)$, the rotation quaternion is

$$ \begin{align*}
    q = [\cos(45^\circ), \sin(45^\circ)(0.707, 0, 0.707)] = [0.707,(0.5, 0, 0.5)]
\end{align*} $$

Calculating $q \, p$

$$ \begin{align*}
    p' = q p &= [0.707,(0.5, 0, 0.5)] [0, (2, 0, 0)] = [-1, (1.414, 1, 0)].
\end{align*} $$

Now the real part is non-zero, so we can't extract the rotated vector. However, if we multiply $q p$ by the inverse of the rotation quaternion $q^{-1}$ on the right we have

$$ \begin{align*}
    p' = q p q^{-1} &= [0.707,(0.5, 0, 0.5)] [0, (2, 0, 0)] [0.707, (-0.5, 0, -0.5)] \\
    &= [0, (1, 1.414, 1)]
\end{align*} $$

The real part of $p'$ is zero, so we can extract the rotated vector which is $\vec{p}' = (1, 1.414, 1)$.

```{figure} ../_images/10_quaternion_rotation_2.svg
:width: 450
```

The plot of this rotation above shows that we have rotated by $90^\circ$ instead of the desired $45^\circ$. This is because we have applied two rotations of $45^\circ$, so we need to halve the angle in the rotation quaternion is

$$ q = [\cos(\tfrac{1}{2}\theta), \sin(\tfrac{1}{2}\theta) \hat{\vec{v}}].$$

So our rotation quaternion is

$$q = [\cos(\tfrac{45^\circ}{2}), \sin(\tfrac{45^\circ}{2})(0.707, 0, 0.707)] = [0.924, (0.271, 0, 0.271)]. $$

Now calculating the rotation we have

$$ \begin{align*}
    p' = q p q^{-1} &= [0.924, (0.271, 0, 0.271)] [0,(2,0,0)] [0.924, (-0.271, 0, -0.271)] \\
    &= [0, (1.707, 1, 0.293)].
\end{align*}$$

The plot of this rotation below shows that this is the correct rotation.

```{figure} ../_images/10_quaternion_rotation_3.svg
:width: 450
```
````

For example, consider the rotation of the vector $\vec{p} = (1, 0, 0)$ that points along the $x$-axis by $90^\circ$ about the vector $\vec{v} = (0, 1, 0)$ which points along the $y$-axis. The resulting vector should be $\vec{v}' = (0, 0, -1)$, i.e., a vector pointing down the $z$-axis. Here $p = [0, (1, 0, 0)]$ and the rotation quaternion and its inverse is

$$ \begin{align*}
    q &= [\cos(45^\circ), \sin(45^\circ) (0, 1, 0)] = [0.707, (0, 0.707, 0)], \\
    q^{-1} &= [0.707, (0, -0.707, 0)]
\end{align*} $$

Computing $q p q^{-1}$ gives

$$ \begin{align*}
  q p q^{-1} &= [0.707, (0, 0.707, 0)][0, (1, 0, 0)][0.707, (0, -0.707, 0)] \\
  &= [0, (0.707, 0, -0.707)][0.707, (0, -0.707, 0)] \\
  &= [0, (0, 0, -1)]
\end{align*} $$

So $\vec{p}' = (0, 0, -1)$ as expected.

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
static fromAxisAngle(axis, angle) {
    axis = normalize(axis);
    const halfAngle = 0.5 * angle;
    const s = Math.sin(halfAngle);

    return new Quaternion(
        Math.cos(halfAngle),
        s * axis[0],
        s * axis[1],
        s * axis[2],
    );
}

rotateVector(v) {
    const p = new Quaternion(0, v[0], v[1], v[2]);
    const qInv = this.inverse();
    const result = this.multiply(p).multiply(qInv);
    return [result.x, result.y, result.z];
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
// Quaternion rotation
const p = [1, 0, 0];
const axis = [0, 1, 0];
const angle = 90 * Math.PI / 180;
const qRot = new Quaternion.fromAxisAngle(axis, angle);
console.log("\nQuaternion rotation\n-------------------");
console.log("p = " + printVector(p));
console.log("qRot = " + qRot);
console.log("pRotated = " + printVector(qRot.rotateVector(p)));
```

:::

Here we have defined two Quaternion class methods `fromAxisAngle()` using equation {eq}`rotation-quaternion-equation` and `rotateVector()` which calculates the rotation quaternion and rotates a vector using the current quaternion object. We have then used these to rotate the vector $(1, 0, 0)$ about the the vector $(0, 1, 0)$ by $90^\circ$. Refresh your browser, and you should see the following added to the webpage

```text
Quaternion rotation
-------------------
p = [ 1.00, 0.00, 0.00 ]
qRot = [ 0.707, ( 0.000, 0.707, 0.000 ) ]
pRotated = [ 0.00, 0.00, -1.00 ]
```

### Matrix representation of a quaternion

We have been using $4 \times 4$ matrices to compute the transformations to convert between model, view and screen spaces, so in order to use quaternions for rotations we need to calculate a $4 \times 4$ rotation matrix that is equivalent to $q p q^{-1}$. If the rotation quaternion is $q = [w, (x, y, z)]$, and $q$ is a unit quaternion, then the corresponding rotation matrix is

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

````{dropdown} Derivation of quaternion rotation matrix

To derive a $4 \times 4$ transformation matrix that achieves quaternion rotation, consider the multiplication of the quaternion $p = [p_w, (p_x, p_y, p_z)]$ on the left by the rotation quaternion $q = [w, (x, y, z)]$

$$ \begin{align*}
    q p &= [w, (x, y, z)] [p_w, (p_x, p_y, p_z)] \\
    &= [wp_w - (x, y, z) \cdot (p_x, p_y, p_z), w(p_x, p_y, p_z) + p_w(x, y, z) + (x, y, z) \times (p_x, p_y, p_z)] \\
    &= [wp_w - xp_x - yp_y - zp_z, \\
    &\qquad (wp_x - zp_y - yp_z + xp_w, zp_x + wp_y - xp_z + yp_w, -yp_x + xp_y + wp_z + zp_w)].
\end{align*} $$

If we write the quaternion $p$ as a 4-element vector of the form $\vec{p} = (p_x, p_y, p_z, p_w)^\mathsf{T}$ (note that $p_w$, is now at the end of the vector which is synonymous with [homogeneous co-ordinates](homogeneous-coordinates-section)) then we have

$$ \begin{align*}
    q p &=
    \begin{pmatrix}
         wp_x - zp_y + yp_z + xp_w \\
         zp_x + wp_y - xp_z + yp_w \\
        -yp_x + xp_y + wp_z + zp_w \\
        -xp_x - yp_y - zp_z + wp_w
    \end{pmatrix},
\end{align*} $$

and we can express the rotation $q p$ as the matrix equation

$$ q p = \begin{align*}
    \begin{pmatrix}
         w & -z &  y & x \\
         z &  w & -x & y \\
        -y &  x &  w & z \\
        -x & -y & -z & w
    \end{pmatrix}
    \begin{pmatrix} p_x \\ p_y \\ p_z \\ p_w \end{pmatrix}
\end{align*} $$(quaternion-rotation-q-equation)

Doing similar for multiplying $p$ on the right by the inverse rotation quaternion $q^{-1} = [w, (-x, -y, -z)]$

$$ \begin{align*}
    p q^{-1} &= [p_w, (p_x, p_y, p_z)][w, (-x, -y, -z)] \\
    &= [wp_w - (p_x, p_y, p_z) \cdot ( -x, -y, -z), \\
    & \qquad p_w(-x, -y, -z) + w(p_x, p_y, p_z) + (p_x, p_y, p_z) \times (-x, -y, -z)] \\
    &= [xp_x + yp_y + zp_z + wp_w, \\
    & \qquad (wp_x - zp_y + yp_z - xp_w, zp_x + wp_y - xp_z - yp_w, -yp_x + xp_y + wp_z - zp_w)].
\end{align*} $$

Writing $p$ the form $\vec{p} = (p_x, p_y, p_z, p_w)$ as before gives

$$ \begin{align*}
    p q^{-1} =
    \begin{pmatrix}
        wp_x - zp_y + yp_z - xp_w \\
        zp_x + wp_y - xp_z - yp_w \\
        -yp_x + xp_y + wp_z - zp_w \\
        xp_x + yp_y + zp_z + wp_w
    \end{pmatrix}
\end{align*} $$

which can be expressed by the matrix equation

$$ \begin{align*}
    p q^{-1} &=
    \begin{pmatrix}
        w & -z & y & -x \\
        z & w & -x & -y \\
        -y & x & w & -z \\
        x & y & z & w
    \end{pmatrix}
    \begin{pmatrix} p_x \\ p_y \\ p_z \\ p_w \end{pmatrix}
\end{align*} $$(quaternion-rotation-q2-equation)

The two matrices for $q p$ and $p q^{-1}$ from equations {eq}`quaternion-rotation-q-equation` and {eq}`quaternion-rotation-q2-equation` can be combined to give a single matrix $R$ that performs the quaternion rotation $q p q^{-1}$

$$ \begin{align*}
    R &= (q p) \cdot (p q^{-1})
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
const quaternionRotation = rotationQuaternion.matrix();
console.log("\nquaternion rotation matrix =\n" + quaternionRotation);

const rotationMatrix = new Mat4().rotate(axis, angle);
console.log("\nrotation matrix =\n" + rotationMatrix);
```

:::

Here we have defined the Quaternion class method `matrix()` that returns the $4 \times 4$ quaternion rotation matrix for a rotation quaternion. We then print this, as well as the standard axis-angle rotation matrix from equation {eq}`eq-axis-angle-rotation-matrix` that we derived in [Lab 5: Transformations](axis-angle-rotation-section). Refresh your browser, and you should see the following added to the webpage

```text
quaternion rotation matrix =
  [    0.00     0.00    -1.00     0.00 ]
  [    0.00     1.00     0.00     0.00 ]
  [    1.00     0.00     0.00     0.00 ]
  [    0.00     0.00     0.00     1.00 ]

rotation matrix =
  [    0.00     0.00    -1.00     0.00 ]
  [    0.00     1.00     0.00     0.00 ]
  [    1.00     0.00     0.00     0.00 ]
  [    0.00     0.00     0.00     1.00 ]
```

Note that both matrices are equivalent (you can change the axis and angles to confirm this works for other quaternions), so why are we bothering with quaternion rotation? Comparing the code for the `matrix()` Quaternion class method with the `rotate()` method from the Mat4 class we can see the quaternion rotation matrix requires 16 multiplications compared to 24 multiplications to calculate the rotation matrix. Efficiency is always a bonus, but the main advantage is the quaternion rotation matrix does not suffer from gimbal lock so it will work for any configuration.

So it makes sense to use the quaternion rotation matrix for our axis-angle rotations.

:::{admonition} Task
:class: tip

Edit the `rotate()` Mat4 class method, so that is looks like the following

```javascript
rotate(axis, angle) {
    const rotationQuaternion = new Quaternion.fromAxisAngle(axis, angle);
    return this.multiply(rotationQuaternion.matrix());
}
```
:::

<!-- ### Calculating a quaternion from Euler angles

Quaternions can be thought of as an orientation in 3D space. Imagine a camera in the world space that is pointing in a particular direction. The direction in which the camera is pointing can be described with reference to the $x$, $y$ and $z$ axes in terms of the $pitch$, $yaw$ and $roll$ Euler angles. Since multiplying rotation quaternions achieves rotation, then if $q_y$, $q_p$ and $q_r$ are rotation quaternions for rotating about the $yaw$, $pitch$ and $roll$ then the quaternion that gives the camera orientation is calculated using $q_y q_p q_r$ where

$$ \begin{align*}
  q_y &= [c_y, (s_y, 0, 0)], \\
  q_p &= [c_p, (0, s_p, 0)], \\
  q_r &= [c_r, (0, 0, s_r)].
\end{align*} $$

and

$$ \begin{align*}
    c_x &= \cos(\tfrac{pitch}{2}), &
    c_y &= \cos(\tfrac{yaw}{2}), &
    c_z &= \cos(\tfrac{roll}{2}) \\
    s_x &= \sin(\tfrac{pitch}{2}), &
    s_y &= \sin(\tfrac{yaw}{2}), &
    s_z &= \sin(\tfrac{roll}{2}).
\end{align*} $$

Therefore,

$$ \begin{align*}
  q_yq_pq_r &= [c_y, (0, s_y, 0)] \, [c_p, (s_p, 0, 0)] \, [c_r, (0, 0, s_r)] \\
  &= [c_yc_pc_r + s_ys_ps_r, (c_ys_pc_r + s_yc_ps_r, s_yc_pc_r - c_ys_ps_r, c_yc_ps_r - s_ys_pc_r)]
\end{align*} $$(euler-to-quaternion-equation)

:::{admonition} Task
:class: tip

Add the following method to the Quaternion class

```javascript
fromEuler(yaw, pitch, roll) {
    const cy = Math.cos(0.5 * yaw);
    const sy = Math.sin(0.5 * yaw);
    const cp = Math.cos(0.5 * pitch);
    const sp = Math.sin(0.5 * pitch);
    const cr = Math.cos(0.5 * roll);
    const sr = Math.sin(0.5 * roll);

    return new Quaternion(
        cy * cp * cr + sy * sp * sr,
        cy * sp * cr + sy * cp * sr,
        sy * cp * cr - cy * sp * sr,
        cy * cp * sr - sy * sp * cr
    );
}
```

And add the following code to the ***quaternion_calculations.js*** file

```javascript
const yaw = 45 * Math.PI / 180;
const pitch = 45 * Math.PI / 180;
const q3 = new Quaternion.fromEuler(yaw, pitch, 0.0);
console.log("\nq3 = " + q3);
```

:::

Refresh your browser, and you should see the following added to the webpage

```text
q3 = [ 0.854, ( 0.354, 0.354, -0.146 ) ]
```

--- -->

---

## A Quaternion camera

Now that we have built a Quaternion class we can now use quaternions to perform calculations in the Camera class to implement a quaternion camera. We are currently using Euler angles rotation to calculate the camera vectors in the `update()` method and our camera may suffer from gimbal lock. It also does not allow us to move the camera through $\pm 90^\circ$ to look straight up or down (recall that we needed to limit the $pitch$ angle between $\pm 89^\circ$).

To implement a quaternion camera we create a quaternion that describes the rotation of the camera in the world space. We rotate the camera quaternion using two rotation quaternions based on changes to the $yaw$ and $pitch$ angles from the mouse input. Once we have the rotated camera quaternion we can use it to rotate vectors pointing along the $x$ and negative $z$ axes to give the $\vec{right}$ and $\vec{front}$ vectors for moving the camera. We can also use the matrix form of the camera quaternion to calculate the view matrix.

For example, consider the camera quaternion $q_{camera} = [1, (0, 0, 0)]$ which represents a camera pointing down the $z$-axis. Let's say the user moves the mouse to the upwards resulting in a $pitch$ angle of $45^\circ$ (which is $\frac{\pi}{4}$ in radians) then we need to rotate $q_{camera}$ about the $x$-axis by multiplying by

$$ q_{pitch} = [\cos(\tfrac{\pi}{8}), \sin(\tfrac{\pi}{8})(1, 0, 0)] = [0.924, (0.383, 0, 0)].$$

Performing the quaternion multiplication we have

$$ \begin{align*}
    q_{pitch} \, q_{camera} &= [0.924, (0.383, 0, 0)] \, [1, (0, 0, 0)] \\
    &= [0.924, (0.383, 0, 0)].
\end{align*} $$

```{figure} ../_images/10_quaternion_camera_1.svg
:width: 350

Rotation of the camera quaternion $q_{camera}$ around the $x$-axis by the angle $pitch$.
```

Let's say the user also moves the mouse to the left resulting in a $yaw$ angle of $30^\circ$ (which is $\frac{\pi}{6}$ in radians) then we need to rotate about the $y$-axis by multiplying $q_{pitch} \, q_{camera}$ by

$$ q_{yaw} = [\cos(\tfrac{\pi}{12}), \sin(\tfrac{\pi}{12})(0, 1, 0)] = [0.966, (0, 0.259, 0)]. $$

Performing the quaternion multiplication we have

$$ \begin{align*}
    q_{yaw} \, q_{pitch} \, q_{camera} &= [0.966, (0, 0.259, 0)] \, [0.924, (0.383, 0, 0)] \\
    &= [0.892, (0.370, 0.239, -0.099)].
\end{align*} $$

Note that quaternion multiplication is applied right-to-left so $q_{yaw} \, q_{pitch} \, q_{camera}$ means that the $q_{camera}$ is multiplied by $q_{pitch}$ first and then multiplied by $q_{yaw}$.

```{figure} ../_images/10_quaternion_camera_2.svg
:width: 300

Rotation of the camera quaternion $q_{camera}'$ around the $x$-axis by the angle $pitch$.
```

Once the camera quaternion has been rotated using the $pitch$ and $yaw$ angles, we can use equation {eq}`quaternion-rotation-multiplication-equation` to rotate the vectors $(0, 0, -1)$, $(1, 0, 0)$ and $(0, 1, 0)$ to determine the local camera vectors $\vec{front}$, $\vec{right}$ and $\vec{up}$. In addition, we can use the inverse of the quaternion matrix form of the camera quaternion to calculate the view matrix using

$$ View = q_{camera}^{-1} \cdot Translate(-\vec{eye}). $$

The reason we use the inverse camera quaternion is that we want to rotate the world space in the opposite direction to the camera rotation, i.e., the world space rotates around the camera so when we move the mouse to the right, the world space rotates to the left.

:::{admonition} Task
:class: tip

In the ***camera.js*** file delete the camera vectors $\vec{worldUp}$, $\vec{front}$, $\vec{right}$ and $\vec{up}$ (but keep the $\vec{eye}$ vector) as well as the $yaw$ and $pitch$ properties from the Camera class constructor (we will no longer need these since the camera vectors are calculated using a quaternion) and add the following quaternion to the constructor

```javascript
// Rotation quaternion
this.rotation = new Quaternion();
```

Change the `update()` method so that is looks like the following

```javascript
update(dt) {  

    // Pitch rotation (rotate around local right vector)
    const localRight = this.rotation.rotateVector([1, 0, 0]);
    const pitchQuat = Quaternion.fromAxisAngle(localRight, this.pitch);

    // Yaw rotation (rotate around y-axis)
    const yawQuat = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);

    // Zero yaw and pitch angles
    this.yaw = 0;
    this.pitch = 0;

    // Rotate camera quaternion
    this.rotation = yawQuat
        .multiply(pitchQuat)
        .multiply(this.rotation)
        .normalize();

    // Calculate front and right camera vectors
    const front = this.rotation.rotateVector([0, 0, -1]);
    const right = this.rotation.rotateVector([1, 0, 0]);

    // Camera movement
    let vel = [0, 0, 0];
    if (this.keys["w"]) vel = addVector(vel, front);
    if (this.keys["s"]) vel = subtractVector(vel, front);
    if (this.keys["a"]) vel = subtractVector(vel, right);
    if (this.keys["d"]) vel = addVector(vel, right);
    console.log();

    if (length(vel) > 0) {
        vel = normalize(vel);
        this.eye = addVector(this.eye, scaleVector(vel, this.speed * dt));
    }
}
```

In the `mouseMove()` function change the `+=` to `-=` in the command to update the $yaw$ angle and delete the commands that limit the $pitch$ angle. 

Then replace the `getViewMatrix()` function with the following

```javascript
getViewMatrix() {
    const rotate = this.rotation.inverse().matrix();
    const translate = new Mat4().translate([
        -this.eye[0],
        -this.eye[1],
        -this.eye[2]
    ]);

    return rotate.multiply(translate);
}
```

:::

Here we have made the changes to implement a quaternion camera. In `update()` we use quaternions to rotate the camera quaternion based on the $yaw$ and $pitch$ angles from the mouse input. We then use the new camera quaternion to rotate the vectors $(0, 0, -1)$ and $(1, 0, 0)$ to give the $\vec{front}$ and $\vec{right}$ camera vectors. We have also changed the `getViewMatrix()` function so that it uses the camera quaternion to compute the view matrix.

Load ***index.html*** in a live server and you should see that nothing much has changed, you can still move the camera around using the keyboard and mouse. However, now we have a quaternion camera which does not suffer from gimbal lock and we can also move the camera through $\pm 90^\circ$.

<center>
<video autoplay controls muted="true" loop="true" width="500">
    <source src="../_static/videos/10_quaternion_camera.mp4" type="video/mp4">
</video>
</center>

---

## SLERP

Another advantage that quaternions have over Euler angles is that we can easily interpolate between two quaternions smoothly and without encountering the problem of gimble lock. Standard Linear intERPolation (LERP) is used to calculate an intermediate position on the straight line between two points.

```{figure} ../_images/10_LERP.svg
:width: 300

Linear interpolation between two points.
```

If $\vec{v}_1$ and $\vec{v}_2$ are two points then another point, $\vec{v}_t$, that lies on the line between $\vec{v}_1$ and $\vec{v}_2$ is calculated using

$$ \operatorname{LERP}(\vec{v}_1, \vec{v}_2, t) = \vec{v}_1 + t(\vec{v}_2 - \vec{v}_1), $$

where $t$ is a value between 0 and 1.

**SLERP** stands for Spherical Linear intERPolation and is a method used to interpolate between two quaternions across a surface of a sphere.

```{figure} ../_images/10_SLERP.svg
:width: 400
:name: A-SLERP-figure

SLERP interpolation between two points on a sphere.
```

Consider {numref}`A-SLERP-figure` where $q_1$ and $q_2$ are two quaternions emanating from the centre of a sphere (note that this diagram is a bit misleading as quaternions exist in 4 dimensions but since it's very difficult to visualize 4D on a 2D screen this will have to do). The interpolated quaternion $q_t$ represents another quaternion that is partway between $q_1$ and $q_2$ calculated using

$$ \begin{align*}
    \operatorname{SLERP}(q_1, q_2, t) = \frac{\sin((1-t) \theta)}{\sin(\theta)} \, q_1 + \frac{\sin(t\theta)}{\sin(\theta)} \, q_2
\end{align*}, $$(slerp-equation)

where $t$ is a value between 0 and 1 and $\theta$ is the angle between the two quaternions and is calculated using

$$ \theta = \cos^{-1} \left( \frac{q_1 \cdot q_2}{|q_1||q_2|} \right),$$

where $q_1 \cdot q_2$ is the dot product between the two quaternions and calculated in the same way as the [dot product between two 4-element vectors](dot-product-section). Sometimes $q_1 \cdot q_2$ returns a negative result meaning that $\theta$ we will be interpolating the long way round the sphere. To overcome this we negate the values of one of the quaternions, this is fine since the quaternion $-q$ is the same orientation as $q$. Another consideration is when $\theta$ is very small then $\sin(\theta)$ in equation {eq}`slerp-equation` can be rounded to zero causing a divide by zero error. To get around this we can use LERP between $q_1$ and $q_2$.

To calculate SLERP between two quaternions $q_1 = [w_1, (x_1, y_1, z_1)]$ and $q_2 = [w_2, (x_2, y_2, z_2)]$ we do the following:

- Calculate $\cos(\theta) = w_1w_2 + x_1x_2 + y_1y_2 + z_1z_2$
- If $\cos(\theta) < 0$ then $q_2 = -q_2$ and $\cos(\theta) = -\cos(\theta)$
- If $\cos(\theta) > 0.9995$ (i.e., $q_1$ and $q_2$ are very close) use LERP

$$q_t = q_1 + t  (q_2 - q_1).$$

- Else use SLERP
  
$$ q_t = \frac{\sin((1 - t) \theta)}{\sin(\theta)} \, q_1 + \frac{\sin(t\theta)}{\sin(\theta)} \, q_2, $$

where $t =  1 - \exp(-rotation \, speed \times \Delta t)$ for exponential damping.

To implement smoothing in a first-person camera we calculate a target quaternion using the mouse input and then use SLERP to calculate the interpolated quaternion between the current camera quaternion and the target quaternion ({numref}`slerped-camera-figure`). This interpolated quaternion becomes the camera quaternion and is used to perform the rotations on the camera vectors.

```{figure} ../_images/10_slerped_camera.svg
:width: 350
:name: slerped-camera-figure

Camera smoothing using SLERP.
```

The effects of applying SLERP to smooth the camera rotation can be seen in the video below (the effects are best experienced by moving the camera yourself).

<center>
<video autoplay controls muted="true" loop="true" width="60%">
    <source src="../_static/videos/10_slerped_camera.mp4" type="video/mp4">
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