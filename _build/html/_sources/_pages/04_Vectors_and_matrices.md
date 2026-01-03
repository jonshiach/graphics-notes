(vectors-and-matrices-section)=

# Lab 4: Vectors and Matrices

Computer graphics relies heavily on mathematics of vectors and matrices. In this lab we will be revising the important concepts needed for computer graphics and using a library to perform calculations.

In this lab we will not be drawing any graphical objects, but we will be writing JavaScript code to perform calculations. So the first thing we are going to do is set up a simple HTML page and write a JavaScript function to print console output to the page.

:::{admonition} Task
:class: tip

Create a folder called ***Lab 4 Vectors and Matrices*** inside which create a file called ***index.html*** and enter the following into it.

```html
<!doctype html>

<html lang="en">
  <head>
    <title>Lab 4 - Vectors and Matrices</title>
  </head>
  <body>
    <div id="console-output" 
         style="font-family:monospace; white-space: pre; padding:10px;">
    </div>
    <script src="maths.js"></script>
    <script src="vectors_and_matrices.js"></script>
  </body>
</html>
```

Create another file called ***vectors_and_matrices.js*** and enter the following into it.

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
console.log('Lab 5 - Vectors and Matrices\n----------------------------');
```

:::

Here we have the function `setupConsoleOutput()` in the ***vectors_and_matrices.js*** file which means that any call to `console.log()` will output to the HTML page.

```text
Lab 5 - Vectors and Matrices
----------------------------
```

---

## Vectors

A vector in is an object with magnitude (length) and direction. A vector is denoted by a lower case letter in boldface, e.g., $\vec{a}$ (or underlined when writing by hand), and represented mathematically by a tuple which is an ordered set of numbers. In geometry, each number in the vector represents the length along the co-ordinate axes. For example, consider the 3-element vector

```{math}
:numbered: false
\vec{a} = (a_x, a_y, a_z).
```

Here $\vec{a}$ has 3 elements so is a vector in 3D space where $a_x$, $a_y$ and $a_z$ are the lengths of the vector in the $x$, $y$, and $z$ directions.

```{figure} ../_images/03_vector.svg
:height: 200
:name: 3d-vector

A 3D vector.
```

```{note}
The reason the diagram above has the $y$-axis pointing upwards and the $z$-axis pointing along the horizontal is because this is the way OpenGL represents 3D space (see [Lab 5: Transformations](transformations-section) for more details). The configuration of the axes does not matter for the calculations we will be performing in this lab, but I wanted to be consistent. 
```

Since we will be using vectors (and matrices) a lot over the rest of the labs we will create a vector class to define vectors and perform operations on them.

:::{admonition} Task
:class: tip

Create file called ***maths.js*** and enter the following class definition.

```javascript
// 3-element vector class
class Vec3 {

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Print vector
  print() {
    return `[ ${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.z.toFixed(4)} ]`;
  }
}
```

:::

Here we have declared a class called `Vec3` inside which we have defined the constructor method and a method to print the vector. To create a 3-element vector object we use the syntax

```javascript
const a = new Vec3(ax, ay, az);
```

To access the individual elements of the vector object we use `a.x`, `a.y` and `a.z`. The `.print()` method outputs a string where the elements of the vector are printed to 4 decimal places.

Now let's create the following vector objects in JavaScript and print them.

```{math}
:numbered: false
\begin{align*}
    \vec{a} &= (3, 0, 4), &
    \vec{b} &= (1, 2, 3).
\end{align*}
```

:::{admonition} Task
:class: tip

Add the following code to the ***vectors_and_matrices.js*** file.

```javascript
// Define vector objects
console.log('\nVectors\n-------');
const a = new Vec3(3, 0, 4)
const b = new Vec3(1, 2, 3);
console.log("x = " + a.x + ", y = " + a.y + ", z = " + a.z);
console.log("a = " + a.print());
console.log("b = " + b.print());
```

:::

Here we have created two vector objects `a` and `b` that contain the elements of $\vec{a}$ and $\vec{b}$ and printed these to our webpage which should now look like

```text
Vectors
-------
x = 3, y = 0, z = 4
a = [ 3.0000, 0.0000, 4.0000 ]
b = [ 1.0000, 2.0000, 3.0000 ]
```

---

## Arithmetic operations on vectors

Like numbers, we can define the arithmetic operations of addition, subtraction for vectors as well as multiplication and division by a scalar.

### Vector addition and subtraction

The addition and subtraction of two vectors $\vec{a} = (a_x, a_y, a_z)$ and $\vec{b} = (b_x, b_y, b_z)$ is defined by

$$ \begin{align*}
    \vec{a} + \vec{b} &= (a_x + b_x, a_y + b_y, a_z + b_z), \\
    \vec{a} - \vec{b} &= (a_x - b_x, a_y - b_y, a_z - b_z).
\end{align*} $$(eq:vector-addition)

For example, given the vectors $\vec{a} = (3,0,4)$ and $\vec{b} = (1, 2, 3)$

```{math}
:numbered: false
\begin{align*}
    \vec{a} + \vec{b} &= (3, 0, 4) + (1, 2, 3) = (3 + 1, 0 + 2, 4 + 3) = (4, 2, 7), \\
    \vec{a} - \vec{b} &= (3, 0, 4) - (1, 2, 3) = (3 - 1, 0 - 2, 4 - 3) = (2, -2, 1).
\end{align*}
```

What is happening in a geometrical sense when we add and subtract vectors? Take a look at {numref}`vector-addition-figure`, here the vector $\vec{b}$ has been added to the vector $\vec{a}$ where the tail of $\vec{b}$ is placed at the head of $\vec{a}$. The resulting vector $\vec{a} + \vec{b}$ points from the tail of $\vec{a}$ to the head of $\vec{b}$.

```{figure} ../_images/03_vector_addition.svg
:height: 150
:name: vector-addition-figure

Vector addition.
```

The subtraction of the vector $\vec{b}$ does similar, but since $\vec{a} - \vec{b} = \vec{a} + (-1)\vec{b}$ then the direction of $\vec{b}$ is reversed so $\vec{a} - \vec{b}$ is the same as placing the tail of $-\vec{b}$ at the head of $\vec{a}$.

```{figure} ../_images/03_vector_subtraction.svg
:height: 180
:name: vector-subtraction-figure

Vector subtraction.
```

To calculate the addition and subtraction of vectors we are going to write methods to do this.

:::{admonition} Task
:class: tip

Add the following methods to your `Vec3` class.

```javascript
// Arithmetic operations
add(v) {
  return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
}

subtract(v) {
  return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
}
```

:::

Here we have defined two similar methods `add()` and `subtract()` that add and subtract two vectors. Both methods return a new vector object so that we don't change the values of the current vector.

:::{admonition} Task
:class: tip

Add the following to the ***Vectors_and_matrices.js*** file.

```javascript
// Arithmetic operations on vectors
console.log('\nArithmetic operations on vectors\n--------------------------------');
console.log("a + b = " + a.add(b).print());
console.log("a - b = " + a.subtract(b).print());
```

:::

Refresh your web page, and you should see the following has been added.

```text
Arithmetic operations on vectors
--------------------------------
a + b = [ 4.0000, 2.0000, 7.0000 ]
a - b = [ 2.0000, -2.0000, 1.0000 ]
```

---

### Multiplication by a scalar

Multiplication of a vector $\vec{a} = (a_x, a_y, a_z)$ by a scalar (a number) $k$ are defined by

```{math}
:numbered: false
\begin{align*}
    k \vec{a} &= (ka_x, ka_y, ka_z), \\
    \frac{\vec{a}}{k} &= \left(\frac{a_x}{k}, \frac{a_y}{k}, \frac{a_z}{k} \right).
\end{align*}
```

For example, multiplying the vector $\vec{a} = (3, 0, 4)$ by the scalar 2 gives

```{math}
:numbered: false
2\vec{a} = 2(3,0,4) = (6, 0, 8).
```

If we wanted to divide by a scale $k$ then we simply multiply by $\dfrac{1}{k}$. For example, dividing the vector $\vec{b} = (1, 2, 3)$ by 3 gives

```{math}
:numbered: false
\frac{\vec{b}}{3} = \frac{1}{3} \vec{b} = \left( \frac{1}{3}, \frac{2}{3}, \frac{3}{3} \right) = (0.3333, 0.6667, 1).
```

Multiplying a vector by a positive scalar has the effect of scaling the length of the vector. Multiplying by a negative scalar reverses the direction of the vector.

```{figure} ../_images/03_vector_scalar_multiplication.svg
:height: 180
```

:::{admonition} Task
:class: tip
Add the following method definition to the vector class.

```javascript
scale(s) {
  return new Vec3(this.x * s, this.y * s, this.z * s);
}
```

Now add the following to the ***vectors_and_matrices.js*** file.

```javascript
console.log("2a    = " + a.scale(2).print());
console.log("b/3   = " + b.scale(1/3).print());
```

:::

Refresh your web page, and you should see the following has been added.

```text
2a    = [ 6.0000, 0.0000, 8.0000 ]
b/3   = [ 0.3333, 0.6667, 1.0000 ]
```

---

(vector-magnitude-section)=

### Vector magnitude

The length or **magnitude** of a vector $\vec{a} = (a_x, a_y, a_z)$ is denoted by $\|\vec{a}\|$ is the length from the tail of the vector to the head.

```{figure} ../_images/03_vector_magnitude.svg
:height: 100
:name: magnitude-figure

Vector magnitude (length).
```

The magnitude is calculated using an extension of Pythagoras' theorem, for example for 3D vectors the magnitude is

$$\|\vec{a}\| = \sqrt{a_x^2 + a_y^2 + a_z^2}. $$(eq:vector-magnitude)

For example, if $\vec{a} = (3, 0, 4)$ and $\vec{b} = (1, 2, 3)$ then their magnitudes are

```{math}
:numbered: false
\begin{align*}
    \| \vec{a} \| &= \sqrt{3^2 + 0^2 + 4^2} = \sqrt{9 + 0 + 16} = \sqrt{25} = 5, \\
    \| \vec{b} \| &= \sqrt{1^2 + 2^2 + 3^2} = \sqrt{1 + 4 + 9} = \sqrt{14} = 3.7416\ldots
\end{align*}
```

:::{admonition} Task
:class: tip

Add the following method definition to the vector class.

```javascript
// Length and normalization
length() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
// Vector magnitude and normalization
console.log("\nVector magnitude and normalization\n----------------------------------");
console.log("length(a)    = " + a.length());
console.log("length(b)    = " + b.length());
```

:::

Refresh your web page, and you should see the following has been added.

```text
Vector magnitude and normalization
----------------------------------
length(a)    = 5
length(b)    = 3.7416573867739413
```
---

(unit-vectors-section)=

### Unit vectors

A **unit vector** is a vector that has a length of 1. We can find a unit vector that points in the same direction as a non-zero vector $\vec{a}$, which is denoted by $\hat{\vec{a}}$ (pronounced *a-hat*), by dividing by its magnitude, i.e.,

$$ \hat{\vec{a}} = \frac{\vec{a}}{\|\vec{a}\|}. $$(eq:unit-vector)

This process is called **normalising a vector**. For example, to determine a unit vector pointing in the same direction as the vector $\vec{a} = (3, 0, 4)$, we normalize it by dividing by its magnitude which is 5.

```{math}
:numbered: false
\begin{align*}
    \hat{\vec{a}} &= \frac{(3, 0, 4)}{5} = \left( \frac{3}{5}, 0, \frac{4}{5} \right) = (0.6, 0, 0.8).
\end{align*}
```

Checking that $\hat{a}$ has a magnitude of 1

```{math}
:numbered: false
\|\hat{a}\| = \sqrt{0.6^2 + 0^2 + 0.8^2} = \sqrt{0.36 + 0.64} = \sqrt{1} = 1.
```

Normalizing a vector is an operation that is used a lot in graphics programming, so it would be useful to have a method that does this.

:::{admonition} Task
:class: tip

Add the following method definition to the vector class.

```javascript
normalize() {
  const len = this.length();
  if (len === 0) return new Vec3(0, 0, 0);
  const inv = 1 / len;
  return new Vec3(this.x * inv, this.y * inv, this.z * inv);
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
const aHat = a.normalize();
const bHat = b.normalize();
console.log("aHat         = " +  aHat.print());
console.log("bHat         = " +  bHat.print());
console.log("length(aHat) = " +  aHat.length());
console.log("length(bHat) = " +  bHat.length());
```

:::

Refresh your web page, and you should see the following has been added.

```text
aHat         = [ 0.6000, 0.0000, 0.8000 ]
bHat         = [ 0.2673, 0.5345, 0.8018 ]
length(aHat) = 1
length(bHat) = 1
```

Both `aHat` and `bHat` have magnitudes of 1 which shows they are both unit vectors.

---

(dot-product-section)=

### The dot product

The <a href="https://en.wikipedia.org/wiki/Dot_product" target="_blank">**dot product**</a> between two vectors $\vec{a} = (a_x, a_y, a_z)$ and $\vec{b} = (b_x, b_y, b_z)$ is denoted by $\vec{a} \cdot \vec{b}$ and returns a scalar. The dot product is calculated using

$$ \vec{a} \cdot \vec{b} = a_xb_x + a_yb_y + a_zb_z. $$(eq:dot-product)

The dot product is related to the angle $\theta$ between the two vectors ({numref}`angle-between-vectors-figure`) by

$$ \vec{a} \cdot \vec{b} = \|\vec{a}\| \|\vec{b}\| \cos(\theta). $$(eq:dot-product-geometric)

```{figure} ../_images/03_dot_product.svg
:height: 125
:name: angle-between-vectors-figure

The angle $\theta$ between the vectors $\vec{a}$ and $\vec{b}$.
```

A useful result for computer graphics is that if $\theta=90^\circ$ then $\cos(\theta) = 0$ and equation {eq}`eq:dot-product-geometric` becomes

```{math}
:numbered: false

\vec{a} \cdot \vec{b} = 0.
```

In order words, if the dot product of two vectors is zero then the two vectors are perpendicular. For example, given the vectors $\vec{a} = (3, 0, 4)$ and $\vec{b} = (1, 2, 3)$ the dot product between these are

```{math}
:numbered: false

\begin{align*}
    \vec{a} \cdot \vec{b} &= (3, 0, 4) \cdot (1, 2, 3)
    = 3 + 0 + 12
    = 15.
\end{align*}
```

:::{admonition} Task
:class: tip

Add the following method definition to the vector class.

```javascript
// Dot and cross products
dot(v) {
  return this.x * v.x + this.y * v.y + this.z * v.z;
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
// Dot and cross products
console.log("\nDot and cross products\n----------------------");
console.log("a . b       = " + a.dot(b));
```

:::

Refresh your web page, and you should see the following has been added.

```text
Dot and cross products
----------------------
a . b = 15
```

---

(cross-product-section)=

### The cross product

The <a href="https://en.wikipedia.org/wiki/Cross_product" target="_blank">**cross product**</a> between two 3-element vectors $\vec{a} = (a_x, a_y, a_z)$ and $\vec{b} = (b_x, b_y, b_z)$ is denoted by $\vec{a} \times \vec{b}$ and returns a vector. The cross product is calculated using

$$ \vec{a} \times \vec{b} = (a_yb_z - a_zb_y, a_zb_x - a_xb_z, a_xb_y - a_yb_x). $$(eq:cross-product)

The cross product between two vectors produces another vector that is perpendicular to both of the vectors ({numref}`cross-product-figure`). This is another incredibly useful result as it allows us to calculate a [**normal vector**](normal-vector-section) to a polygon which are used in calculating how light is reflected off surfaces (see [Lab 8: Lighting](lighting-section)).

```{figure} ../_images/03_cross_product.svg
:height: 220
:name: cross-product-figure

The cross product between two vectors gives a vector that is perpendicular to both vectors.
```

For example, given the vectors $\vec{a} = (3,0,4)$ and $\vec{b} = (1, 2, 3)$ the cross product $\vec{a} \times \vec{b}$ is

```{math}
:numbered: false
\begin{align*}
    \vec{a} \times \vec{b} &= (3, 0, 4) \times (1, 2, 3) \\
    &= (0 \times 3 - 4 \times 2, 4 \times 1 - 3 \times 3, 3 \times 2 - 0 \times 3) \\
    &= (-8, -5, 6).
\end{align*}
```

We can show that $\vec{a} \times \vec{b}$ is perpendicular to both $\vec{a}$ and $\vec{b}$ using the dot product

```{math}
:numbered: false
\begin{align*}
    \vec{a} \cdot (\vec{a} \times \vec{b}) &= (3, 0, 4) \cdot (-8, -5, 6) = -24 + 0 + 24 = 0, \\
    \vec{b} \cdot (\vec{a} \times \vec{b}) &= (1, 2, 3) \cdot (-8, -5, 6) = - 8 - 10 + 18 = 0.
\end{align*}
```

:::{admonition} Task
:class: tip

Add the following method definition to the vector class.

```javascript
cross(v) {
  return new Vec3(
    this.y * v.z - this.z * v.y,
    this.z * v.x - this.x * v.z,
    this.x * v.y - this.y * v.x
  )
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
const aCrossB = a.cross(b);
console.log("a x b       = " + aCrossB.print());
console.log("a . (a x b) = " + a.dot(aCrossB));
console.log("b . (a x b) = " + b.dot(aCrossB));
```

:::

Refresh your web page, and you should see the following has been added.

```text
a x b       = [ -8.0000, -5.0000, 6.0000 ]
a . (a x b) = 0
b . (a x b) = 0
```

Here we have also shown that the cross product of `a` and `b` is perpendicular to both vectors.

---

## Matrices

Another type of mathematical object that is fundamental to computer graphics is the matrix. A matrix is a rectangular array of numbers.

```{math}
:numbered: false
\begin{align*}
    A =
    \begin{pmatrix}
        a_{11} & a_{12} & \cdots & a_{1n} \\
        a_{21} & a_{22} & \cdots & a_{2n} \\
        \vdots & \vdots & \ddots & \vdots \\
        a_{m1} & a_{m2} & \cdots & a_{mn}
    \end{pmatrix}
\end{align*}
```

It is common to use uppercase characters for the name of a matrix and lowercase characters for the individual elements. The elements of a matrix are referenced by an **index** which is a pair of numbers, the first of which is the horizontal row number and the second is the vertical column number so $a_{ij}$ is the element in row $i$ and column $j$ of the matrix $A$.  

We refer to the size of a matrix by the number of rows by the number of columns. Here the matrix $A$ has $m$ rows and $n$ columns, so we call this matrix a $m \times n$ matrix. Computer graphics mostly works with $4 \times 4$ matrices (see [Lab 6: Transformations](transformations-section) for why this is) so we will create a matrix class to define $4 \times 4$ matrices and perform operations on them.

:::{admonition} Task
:class: tip

Add the following class declaration to the ***maths.js*** file.

```javascript
// 4x4 Matrix class
class Mat4 {
  constructor() {
    this.m = new Float32Array(16);
  }

  // Print matrix
  print() {
    let string = "";
    for (let i = 0; i < 4; i++) {
      const row = [
        this.m[i * 4 + 0].toFixed(4),
        this.m[i * 4 + 1].toFixed(4),
        this.m[i * 4 + 2].toFixed(4),
        this.m[i * 4 + 3].toFixed(4),
      ];
      string += "  [ " + row.join("  ") + " ]\n";
    }
    return string;
  }
  
  // Set
  set(...values) {
    if (values.length !== 16) {
      throw new Error("Mat4.set() requires 16 values");
    }
    for (let i = 0; i < 16; i++) {
      this.m[i] = values[i];
    }
    return this;
  }
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
// Matrices
console.log("\nMatrices\n--------");
const A = new Mat4().set(
   1,  2,  3,  4,
   5,  6,  7,  8,
   9, 10, 11, 12,
  13, 14, 15, 16
);
console.log("A =\n" + A.print());
```

:::

Here we have declared a class called `Mat4` inside which we have defined the constructor method that defines a $4\times 4$ matrix of zeros, a print method and a set method that sets the elements of a matrix to values from a 16-element array. We have then created a matrix object and set the values equal to

```{math}
:numbered: false
A =
\begin{pmatrix}
  1 & 2 & 3 & 4 \\
  5 & 6 & 7 & 8 \\
  9 & 10 & 11 & 12 \\
  13 & 14 & 15 & 16
\end{pmatrix}.
```

And printed the matrix. Refresh your web page, and you should see the following has been added.

```text
Matrices
--------
A =
  [ 1.0000  2.0000  3.0000  4.0000 ]
  [ 5.0000  6.0000  7.0000  8.0000 ]
  [ 9.0000  10.0000  11.0000  12.0000 ]
  [ 13.0000  14.0000  15.0000  16.0000 ]
```

---

(transpose-section)=

### Matrix transpose

The **transpose** of a matrix $A$ is denoted by $A^\mathsf{T}$ and is defined

$$A_{ij}^\mathsf{T} = A_{ji}$$

i.e., the rows and columns of $A$ are swapped so row $i$ of $A$ is column $i$ of $A^\mathsf{T}$. For example, the matrix $A$ we defined above

```{math}

A =
\begin{pmatrix}
  1 & 2 & 3 & 4 \\
  5 & 6 & 7 & 8 \\
  9 & 10 & 11 & 12 \\
  13 & 14 & 15 & 16
\end{pmatrix},
```

then $A^\mathsf{T}$ is

```{math}

A^\mathsf{T} =
\begin{pmatrix}
  1 & 5 & 9 & 13 \\
  2 & 6 & 10 & 14 \\
  3 & 7 & 11 & 15 \\
  4 & 8 & 12 & 16
\end{pmatrix}.
```

:::{admonition} Task
:class: tip

Add the following method definition to the matrix class.

```javascript
// Arithmetic operations
transpose() {
  let m = this.m;
  return new Mat4().set(
    m[0], m[4], m[8],  m[12],
    m[1], m[5], m[6],  m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  );
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
console.log("\nA^T =\n" + A.transpose().print());
```

:::

Refresh your web page, and you should see the following has been added.

```text
A^T =
  [ 1.0000  5.0000  9.0000  13.0000 ]
  [ 2.0000  6.0000  10.0000  14.0000 ]
  [ 3.0000  7.0000  11.0000  15.0000 ]
  [ 4.0000  8.0000  12.0000  16.0000 ]
```

---

(matrix-multiplication-section)=

### Matrix multiplication

Scalar multiplication of a matrix by a scalar is the same for matrices as it is for vectors. However, the multiplication of two matrices $A$ and $B$ is defined in a very specific way. If $A$ and $B$ are two matrices then the element in row $i$ and column $j$ of the matrix $AB$ is calculated using

$$ [AB]_{ij} = \vec{a}_i \cdot \vec{b}_j, $$(eq:matrix-multiplication)

Where $\vec{a}_i$ is the vector formed from row $i$ of $A$ and $\vec{b}_j$ is the vector formed from column $j$ of $B$. In computer graphics we mainly work with $4 \times 4$ matrices, so consider the following matrix multiplication

```{math}
:numbered: false
\begin{pmatrix}
  1 & 2 & 3 & 4 \\
  5 & 6 & 7 & 8 \\
  9 & 10 & 11 & 12 \\
  13 & 14 & 15 & 16
\end{pmatrix}
\begin{pmatrix}
  17 & 18 & 19 & 20 \\
  21 & 22 & 23 & 24 \\
  25 & 26 & 27 & 28 \\
  29 & 30 & 31 & 32
\end{pmatrix}
```

For the element in row 2 and column 3, $[AB]_{23}$, we have the dot product between row 2 of the left-hand matrix and column 3 of the right-hand matrix

```{math}
:numbered: false
\begin{pmatrix}
  \color{lightgray}1 & \color{lightgray}2 & \color{lightgray}3 & \color{lightgray}4 \\
  5 & 6 & 7 & 8 \\
  \color{lightgray}9 & \color{lightgray}10 & \color{lightgray}11 & \color{lightgray}12 \\
  \color{lightgray}13 & \color{lightgray}14 & \color{lightgray}15 & \color{lightgray}16
\end{pmatrix}
\begin{pmatrix}
  \color{lightgray}17 & \color{lightgray}18 & 19 & \color{lightgray}20 \\
  \color{lightgray}21 & \color{lightgray}22 & 23 & \color{lightgray}24 \\
  \color{lightgray}25 & \color{lightgray}26 & 27 & \color{lightgray}28 \\
  \color{lightgray}29 & \color{lightgray}30 & 31 & \color{lightgray}32
\end{pmatrix}
```

so

```{math}
:numbered: false
(5, 6, 7, 8) \cdot (19, 23, 27, 31) = 5 \times 19 + 6 \times 23 + 7 \times 27 + 8 \times 31 = 670.
```

Doing similar for the other elements gives

$$ \begin{pmatrix}
  1 & 2 & 3 & 4 \\
  5 & 6 & 7 & 8 \\
  9 & 10 & 11 & 12 \\
  13 & 14 & 15 & 16
\end{pmatrix}
\begin{pmatrix}
  17 & 18 & 19 & 20 \\
  21 & 22 & 23 & 24 \\
  25 & 26 & 27 & 28 \\
  29 & 30 & 31 & 32
\end{pmatrix}
=
\begin{pmatrix}
   250 &  260 &  270 &  280 \\
   618 &  644 &  670 &  696 \\
   986 & 1028 & 1070 & 1112 \\
  1354 & 1412 & 1470 & 1528 \\
\end{pmatrix}$$(eq-matrix-multiplication-example)

:::{admonition} Task
:class: tip

Add the following method definition to the matrix class.

```javascript
multiply(mat) {
  const c = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      for (let i  = 0; i < 4; i++) {
        c[col * 4 + row] += this.m[i * 4 + row] * mat.m[col * 4 + i];
      }
    }
  }
  return new Mat4().set(...c);
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
const B = new Mat4().set(
  17, 18, 19, 20,
  21, 22, 23, 24,
  25, 26, 27, 28,
  29, 30, 31, 32
);
console.log("\nB =\n" + B.print());
console.log("\nAB =\n" + A.multiply(B).print());
```

:::

Refresh your web page, and you should see the following has been added.

```text
B =
  [ 17.0000  18.0000  19.0000  20.0000 ]
  [ 21.0000  22.0000  23.0000  24.0000 ]
  [ 25.0000  26.0000  27.0000  28.0000 ]
  [ 29.0000  30.0000  31.0000  32.0000 ]

AB =
  [ 538.0000  612.0000  686.0000  760.0000 ]
  [ 650.0000  740.0000  830.0000  920.0000 ]
  [ 762.0000  868.0000  974.0000  1080.0000 ]
  [ 874.0000  996.0000  1118.0000  1240.0000 ]
```

What... wait... hang on a minute, this matrix isn't the same as the one from equation {eq}`eq-matrix-multiplication-example`. Our `.multiply()` method hasn't given us the result shown above. The reason for this is something called column-major order.

---

(column-major-order-section)=

### Column-major order

Linear memory is a contiguous block of addresses that can be sequentially accessed. So a 1D array is stored in adjacent memory locations. Since matrices are 2D we have a choice whether to store the elements in the rows or columns in adjacent locations. These are known as **column-major order** and **row-major order**. Consider the $4 \times 4$ matrix

```{math}
:numbered: false

\begin{pmatrix}
    a & b & c & d \\
    e & f & g & h \\
    i & j & k & l \\
    m & n & o & p
\end{pmatrix}.
```

Using column-major order this will be stored in the memory as

```{figure} ../_images/03_column_major_order.svg
:width: 650
```

i.e., we move down and across the matrix. Alternatively, using row-major order the matrix will be stored as

```{figure} ../_images/03_row_major_order.svg
:width: 650
```

i.e., we move across and down the matrix. **WebGL uses column-major order** because it is based upon OpenGL which was written for early GPUs that treated vertex data as column vectors. So a matrix containing vertices is stored column-by-column which means, when working with WebGL, we need to switch the rows and columns around when multiplying matrices. This is why our `.multiply()` method produced the wrong result.

To output the matrix multiplication $AB$ as we would expect it to appear, we can swap `A` and `B`.

:::{admonition} Task
:class: tip

Edit the last line you entered so the `A` and `B` are swapped.

```javascript
console.log("\nAB =\n" + B.multiply(A).print());
```

:::

Refresh your browser and you should now see that we have the matrix seen in equation {eq}`eq-matrix-multiplication-example`.

```text
AB =
   [ 250.0000  260.0000  270.0000  280.0000 ]
  [ 618.0000  644.0000  670.0000  696.0000 ]
  [ 986.0000  1028.0000  1070.0000  1112.0000 ]
  [ 1354.0000  1412.0000  1470.0000  1528.0000 ]
```

:::{note}
:class: note
Microsoft's graphics library directX and Unreal Engine uses row-major order whilst WebGL, OpenGL, Vulkan (successor to OpenGL), Metal (Apple's graphics library) and Unity all use column-major order. This means when porting code between the graphics libraries developers have to change all of their matrix calculations.
:::

---

## The Identity Matrix

The identity matrix is a special square matrix where all the elements are zero apart from the elements on the diagonal line from the top-left element down to the bottom-right element (known as the main diagonal). For example the $4 \times 4$ identity matrix is

```{math}
I =
\begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & 1 & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}.
```

The identity matrix is similar to the number 1 in that if we multiply any matrix by an identity matrix the result is unchanged. For example,

```{math}
IA =
\begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & 1 & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
   1 &  2 &  3 &  4 \\
   5 &  6 &  7 &  8 \\
   9 & 10 & 11 & 12 \\
  13 & 14 & 15 & 16
\end{pmatrix}
=
\begin{pmatrix}
   1 &  2 &  3 &  4 \\
   5 &  6 &  7 &  8 \\
   9 & 10 & 11 & 12 \\
  13 & 14 & 15 & 16
\end{pmatrix}
= A.
```

---

## Matrix Inverse

Whilst matrix multiplication is defined for certain matrices there is no way of dividing one matrix by another. However, for certain square matrices we can calculate an **inverse matrix** that performs a similar function to divide. Consider the division of two numbers, 4 and 2 say. If we wanted to divide 4 by two we could write

$$ \frac{4}{2} = 2. $$

We could also write this division as the multiplication of $\dfrac{1}{2}$ and 4

$$ \frac{1}{2} \times 4 = 2.$$

Here we have shown that $\frac{1}{2}$ is the **multiplicative inverse** of 2. A multiplicative inverse of a number $x$ is denoted as $x^{-1}$ and satisfies $x \times x^{-1} = 1$. The inverse of a matrix $A$ is denoted by $A^{-1}$ and satisfies $A^{-1} A = AA^{-1} = I$ where $I$ is the identity matrix. For example, consider the matrix $C$

$$ C = \begin{pmatrix}
  1  &   3  &   2  &   1 \\
  1  &   1  &   2  &   2 \\
  1  &   3  &   3  &   2 \\
  3  &   1  &   3  &   2 \\
\end{pmatrix}, $$

which has the inverse

$$ C^{-1} = \begin{pmatrix}
  1 & 1/2 & -5/4 & 1/4 \\
  1 & 1/2 & -3/4 & -1/4 \\
  -2 & -2 & 5/2 & 1/2 \\
  1 & 2 & -3/2 & -1/2
\end{pmatrix}. $$

We can check whether this is the inverse of $A$ by calculating $A^{-1}A$ (or $A A^{-1}$)

$$ \begin{align*}
    C^{-1} C &=
  \begin{pmatrix}
    1  &   3  &   2  &   1 \\
    1  &   1  &   2  &   2 \\
    1  &   3  &   3  &   2 \\
    3  &   1  &   3  &   2 \\
  \end{pmatrix}
  \begin{pmatrix}
    1 & 1/2 & -5/4 & 1/4 \\
    1 & 1/2 & -3/4 & -1/4 \\
    -2 & -2 & 5/2 & 1/2 \\
    1 & 2 & -3/2 & -1/2
  \end{pmatrix}
  =
  \begin{pmatrix}
   1 & 0 & 0 & 0  \\
   0 & 1 & 0 & 0 \\
   0 & 0 & 1 & 0 \\
   0 & 0 & 0 & 1
  \end{pmatrix}.
\end{align*} $$

So this shows that $C^{-1}$ is the correct inverse matrix of $C$. Calculating the inverse of a matrix is quite involved process and not all square matrices have an inverse.

:::{admonition} Task

Add the following method to the Matrix class (you may wish to use copy and paste here).

```javascript
inverse() {
  let m = this.m;
  const inv = new Float32Array([
    m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10],
    -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10],      
    m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7]  - m[13] * m[3] * m[6],      
    -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7]  + m[9] * m[3] * m[6],

    -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10],
    m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10],
    -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7]  + m[12] * m[3] * m[6],
    m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7]  - m[8] * m[3] * m[6],

    m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9],
    -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9],
    m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7]  - m[12] * m[3] * m[5],
    -m[0] * m[5] * m[11] + m[0] * m[7] * m[9]  + m[4] * m[1] * m[11] - m[4] * m[3] * m[9]  - m[8] * m[1] * m[7]  + m[8] * m[3] * m[5],

    -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9],
    m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9],
    -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6]  + m[12] * m[2] * m[5],
    m[0] * m[5] * m[10] - m[0] * m[6] * m[9]  - m[4] * m[1] * m[10] + m[4] * m[2] * m[9]  + m[8] * m[1] * m[6]  - m[8] * m[2] * m[5]
  ]);

  let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  if (det === 0) {
    console.error("Matrix is singular, no inverse exists");
    return null;
  }

  det = 1 / det;
  for (let i = 0; i < 16; i++) {
    inv[i] *= det;
  }
  return new Mat4().set(...inv);
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
const C = new Mat4().set(
  1, 3, 2, 1, 
  1, 1, 2, 2, 
  1, 3, 3, 2,
  3, 1, 3, 2
);
console.log("\nC =\n" + C.print());
console.log("\ninv(C) =\n" + C.inverse().print());
console.log("\ninv(C)C =\n" + C.inverse().multiply(C).print());
```

:::

Refresh your browser and you should now see that we have calculated the inverse matrix $C^{-1}$ and shown that $C^{-1}C = I$.

```text
C =
  [ 1.0000  3.0000  2.0000  1.0000 ]
  [ 1.0000  1.0000  2.0000  2.0000 ]
  [ 1.0000  3.0000  3.0000  2.0000 ]
  [ 3.0000  1.0000  3.0000  2.0000 ]

inv(C) =
  [ 1.0000  0.5000  -1.2500  0.2500 ]
  [ 1.0000  0.5000  -0.7500  -0.2500 ]
  [ -2.0000  -2.0000  2.5000  0.5000 ]
  [ 1.0000  2.0000  -1.5000  -0.5000 ]

inv(C)C =
  [ 1.0000  0.0000  0.0000  0.0000 ]
  [ 0.0000  1.0000  0.0000  0.0000 ]
  [ 0.0000  0.0000  1.0000  0.0000 ]
  [ 0.0000  0.0000  0.0000  1.0000 ]
```

---

(vectors-exercises)=

## Exercises

1. Three points have the co-ordinates $A = (5, 1, 3)$, $B = (10, 7, 4)$ and $C = (0, 5, -3)$. Use pen and paper to calculate the following:

    (a) The vector $\vec{p}$ that points from $A$ to $B$;<br>
    (b) The vector $\vec{q}$ that points from $B$ to $C$;<br>
    (c) The vector $\vec{r}$ that points from $C$ to $A$;<br>
    (d) The length of the vector $\vec{p}$;<br>
    (e) A unit vector that points in the direction of the vector $\vec{q}$;<br>
    (f) The dot product $\vec{p} \cdot \vec{q}$;<br>
    (g) The cross product $\vec{q} \times \vec{r}$.

2. Repeat exercise 1 using your methods from the ***maths.js*** file.

3. The three matrices $A$, $B$ and $C$ are defined by

$$ \begin{align*}
    A &= \begin{pmatrix} -1 & 3 \\ 2 & -5 \end{pmatrix}, &
    B &= \begin{pmatrix} 0 & 2 \\ 7 & 1 \end{pmatrix}, &
    C &= \begin{pmatrix} 3 & 2 \\ -3 & -4 \end{pmatrix}.
\end{align*} $$

&emsp;&emsp; Use pen and paper to calculate the following:

&emsp;&emsp; (a) $AB$;<br>
&emsp;&emsp; (b) $ABC$;<br>
&emsp;&emsp; (c) $B^\mathsf{T}A^\mathsf{T}$.<br>

4. A transformation can be applied to a vector by matrix multiplication. If $T$ is a transformation matrix and $\vec{v}$ is a vector then the transformed vector is $T \vec{v}$. Given the following transformation matrices and vector

```{math}
:numbered: false
\begin{align*}
  S &= \begin{pmatrix}
    2 & 0 & 0 & 0 \\
    0 & 2 & 0 & 0 \\
    0 & 0 & 2 & 0 \\
    0 & 0 & 0 & 1
  \end{pmatrix}, &
  T &= \begin{pmatrix}
    1 & 0 & 0 & 3 \\
    0 & 1 & 0 & 2 \\
    0 & 0 & 1 & -1 \\
    0 & 0 & 0 & 1
  \end{pmatrix}, &
  \vec{v} = \begin{pmatrix} 5 \\ 8 \\ 10 \\ 1 \end{pmatrix},
\end{align*}
```

&emsp;&emsp; use pen and paper to calculate the following transformations:

&emsp;&emsp; (a) &emsp; $S \, \vec{v}$;<br>
&emsp;&emsp; (b) &emsp; $T \, \vec{v}$;<br>
&emsp;&emsp; (c) &emsp; $T\,S\,\vec{v}$.<br>

&emsp;&emsp; For each one, describe what effect the transformation has on $\vec{v}$.

````{dropdown} Solutions
1. (a) &emsp; $\vec{p} = (5, 6, 1)$ <br>
   (b) &emsp; $\vec{q} = (-10, -2, -7)$ <br>
   (c) &emsp; $\vec{r} = (5, -4, 6)$ <br>
   (d) &emsp; $\| \vec{p} \| = 7.8740$ <br>
   (e) &emsp; $\hat{q} = (-0.8085,   -0.1617,   -0.5659)$ <br>
   (f) &emsp; $\vec{p} \cdot \vec{q} = -69$ <br>
   (g) &emsp; $\vec{q} \times \vec{r} = (-40, 25, 50)$ <br>

2.
```javascript
// Exercise 2
console.log("\nExercise 2\n----------");

const A1 = new Float32Array([5, 1, 3]);
const B1 = new Float32Array([10, 7, 4]);
const C1 = new Float32Array([0, 5, -3]);

p = subtractVectors(B1, A1);
printVector(p, "(a) p");
q = subtractVectors(C1, B1);
printVector(q, "(b) q");
r = subtractVectors(A1, C1);
printVector(r, "(c) r");
console.log("(d) length(p) = " + length(p));
printVector(normalize(q), "(e) qHat")
console.log("(f) p . q = " + dot(p, q));
printVector(cross(q, r), "(g) q x r")
```

```text
Exercise 2
----------
(a) p = [ 5.0000, 6.0000, 1.0000 ]
(b) q = [ -10.0000, -2.0000, -7.0000 ]
(c) r = [ 5.0000, -4.0000, 6.0000 ]
(d) length(p) = 7.874007874011811
(e) qHat = [ -0.8085, -0.1617, -0.5659 ]
(f) p . q = -69
(g) q x r = [ -40.0000, 25.0000, 50.0000 ]
```

3. (a) &emsp; $AB = \begin{pmatrix} 21 & 1 \\ -35 & -1 \end{pmatrix}$<br>
   (b) &emsp; $ABC = \begin{pmatrix} 60 & 38 \\ -102 & -66 \end{pmatrix}$<br>
   (c) &emsp; $B^\textsf{T} A^\textsf{T} = \begin{pmatrix} 21 & -35 \\ 1 & -1 \end{pmatrix}$

4. (a) &emsp; $S \vec{v} = \begin{pmatrix} 10 \\ 16 \\ 20 \\ 1 \end{pmatrix}$<br>
    &emsp; The first three elements of $\vec{v}$ have been scaled up by a factor of 2, i.e., $\begin{pmatrix} 2 \times 10 \\ 2 \times 16 \\ 2 \times 20 \\ 1 \end{pmatrix}$.<br>
   (b) &emsp; $T \vec{v} = \begin{pmatrix} 8 \\ 10 \\ 9 \\ 1 \end{pmatrix}$<br>
   &emsp; The first three elements of $\vec{v}$ have been increased by 3, 2 and $-$1 respectively, i.e., $\begin{pmatrix} 5 + 3 \\ 8 + 2 \\ 10 - 1 \\ 1 \end{pmatrix}$.<br>
   (c) &emsp; $T \, S \, \vec{v} = \begin{pmatrix} 13 \\ 18 \\ 19 \\ 1 \end{pmatrix}$
   &emsp; The first three elements of $\vec{v}$ have been scaled up by a factor or 2 and then increased by 3, 2 and $-$1 respectively, i.e., $\begin{pmatrix} 2 \times 5 + 3 \\ 2 \times 8 + 2 \\ 2 \times 10 - 1 \\ 1\end{pmatrix}$.

````
