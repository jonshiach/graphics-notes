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
console.log("Lab 4 - Vectors and Matrices\n----------------------------");
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

$$\vec{a} = (a_x, a_y, a_z).$$

Here $\vec{a}$ has 3 elements so is a vector in 3D space where $a_x$, $a_y$ and $a_z$ are the lengths of the vector in the $x$, $y$, and $z$ directions.

```{figure} ../_images/04_vector.svg
:height: 200
:name: 3d-vector

A 3D vector.
```

```{note}
The reason the diagram above has the $y$-axis pointing upwards and the $z$-axis pointing along the horizontal is because this is the way WebGL represents 3D space (see [Lab 5: Transformations](transformations-section) for more details). The configuration of the axes does not matter for the calculations we will be performing in this lab, but I wanted to be consistent. 
```

Since we will be using vectors (and matrices) a lot over the rest of the labs we will create a file containing helper functions to perform operations.

:::{admonition} Task
:class: tip

Create file called ***maths.js*** and enter the following function definition.

```javascript
// Vector operations
function printVector(v) {
    return `[ ${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)} ]`;
}
```

:::

Here we have defined a function that prints a 3-element vector. Now let's create the following vectors in JavaScript and print them.

$$
\begin{align*}
    \vec{a} &= (3, 0, 4), &
    \vec{b} &= (1, 2, 3).
\end{align*}
$$

:::{admonition} Task
:class: tip

Add the following code to the ***vectors_and_matrices.js*** file.

```javascript
// Vectors
console.log('\nVectors\n-------');

const a = [3, 0, 4];
const b = [1, 2, 3];
console.log("a = " + printVector(a));
console.log("b = " + printVector(b));
```

:::

Here we have created the two vectors `a` and `b` and printed these to our webpage which should now look like

```text
Vectors
-------
a = [ 3.00, 0.00, 4.00 ]
b = [ 1.00, 2.00, 3.00 ]
```

### Vector addition and subtraction

Like numbers, we can define the arithmetic operations of addition, subtraction for vectors as well as multiplication and division by a scalar. The addition and subtraction of two vectors $\vec{a} = (a_x, a_y, a_z)$ and $\vec{b} = (b_x, b_y, b_z)$ is defined by

$$ \begin{align*}
    \vec{a} + \vec{b} &= (a_x + b_x, a_y + b_y, a_z + b_z), \\
    \vec{a} - \vec{b} &= (a_x - b_x, a_y - b_y, a_z - b_z).
\end{align*} $$(eq-vector-addition)

For example, given the vectors $\vec{a} = (3,0,4)$ and $\vec{b} = (1, 2, 3)$

$$
\begin{align*}
    \vec{a} + \vec{b} &= (3, 0, 4) + (1, 2, 3) = (3 + 1, 0 + 2, 4 + 3) = (4, 2, 7), \\
    \vec{a} - \vec{b} &= (3, 0, 4) - (1, 2, 3) = (3 - 1, 0 - 2, 4 - 3) = (2, -2, 1).
\end{align*}
$$

What is happening in a geometrical sense when we add and subtract vectors? Take a look at {numref}`vector-addition-figure`, here the vector $\vec{b}$ has been added to the vector $\vec{a}$ where the tail of $\vec{b}$ is placed at the head of $\vec{a}$. The resulting vector $\vec{a} + \vec{b}$ points from the tail of $\vec{a}$ to the head of $\vec{b}$.

```{figure} ../_images/04_vector_addition.svg
:height: 150
:name: vector-addition-figure

Vector addition.
```

The subtraction of the vector $\vec{b}$ does similar, but since $\vec{a} - \vec{b} = \vec{a} + (-1)\vec{b}$ then the direction of $\vec{b}$ is reversed so $\vec{a} - \vec{b}$ is the same as placing the tail of $-\vec{b}$ at the head of $\vec{a}$.

```{figure} ../_images/04_vector_subtraction.svg
:height: 180
:name: vector-subtraction-figure

Vector subtraction.
```

To calculate the addition and subtraction of vectors we are going to write functions to do this.

:::{admonition} Task
:class: tip

Add the following functions to the ***maths.js*** file

```javascript
function addVector(a, b) {
    return [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ];
}

function subtractVector(a, b) {
    return [ a[0] - b[0], a[1] - b[1], a[2] - b[2] ];
}
```

:::

Here we have defined two similar functions `addVector()` and `subtractVector()` that add and subtract two vectors.

:::{admonition} Task
:class: tip

Add the following to the ***vectors_and_matrices.js*** file

```javascript
// Arithmetic operations on vectors
console.log('\nArithmetic operations on vectors\n--------------------------------');
console.log("a + b =", printVector(addVector(a, b)));
console.log("a - b =", printVector(subtractVector(a, b)));
```

:::

Refresh your web page, and you should see the following has been added

```text
Arithmetic operations on vectors
--------------------------------
a + b = [ 4.00, 2.00, 7.00 ]
a - b = [ 2.00, -2.00, 1.00 ]
```

---

### Multiplication by a scalar

Multiplication of a vector $\vec{a} = (a_x, a_y, a_z)$ by a scalar (a number) $k$ are defined by

$$
\begin{align*}
    k \vec{a} &= (ka_x, ka_y, ka_z), \\
    \frac{\vec{a}}{k} &= \left(\frac{a_x}{k}, \frac{a_y}{k}, \frac{a_z}{k} \right).
\end{align*}
$$

For example, multiplying the vector $\vec{a} = (3, 0, 4)$ by the scalar 2 gives

$$
2\vec{a} = 2(3,0,4) = (6, 0, 8).
$$

If we wanted to divide by a scale $k$ then we simply multiply by $\dfrac{1}{k}$. For example, dividing the vector $\vec{b} = (1, 2, 3)$ by 3 gives

$$
\frac{\vec{b}}{3} = \frac{1}{3} \vec{b} = \left( \frac{1}{3}, \frac{2}{3}, \frac{3}{3} \right) = (0.3333, 0.6667, 1).
$$

Multiplying a vector by a positive scalar has the effect of scaling the length of the vector. Multiplying by a negative scalar reverses the direction of the vector.

```{figure} ../_images/04_vector_scalar_multiplication.svg
:height: 180
```

:::{admonition} Task
:class: tip
Add the following function to the ***maths.js*** file

```javascript
function scaleVector(v, k) {
    return [ k * v[0], k * v[1], k * v[2] ];
}
```

Now add the following to the ***vectors_and_matrices.js*** file

```javascript
console.log("2a =", printVector(scaleVector(a, 2)));
console.log("b/3 =", printVector(scaleVector(b, 1/3)));
```

:::

Refresh your web page, and you should see the following has been added

```text
2a = [ 6.00, 0.00, 8.00 ]
b/3 = [ 0.33, 0.67, 1.00 ]
```

---

(vector-magnitude-section)=

### Vector magnitude

The length or **magnitude** of a vector $\vec{a} = (a_x, a_y, a_z)$ is denoted by $\|\vec{a}\|$ is the length from the tail of the vector to the head.

```{figure} ../_images/04_vector_magnitude.svg
:height: 100
:name: magnitude-figure

Vector magnitude (length).
```

The magnitude is calculated using an extension of Pythagoras' theorem, for example for 3D vectors the magnitude is

$$\|\vec{a}\| = \sqrt{a_x^2 + a_y^2 + a_z^2}. $$(eq-vector-magnitude)

For example, if $\vec{a} = (3, 0, 4)$ and $\vec{b} = (1, 2, 3)$ then their magnitudes are

$$
\begin{align*}
    \| \vec{a} \| &= \sqrt{3^2 + 0^2 + 4^2} = \sqrt{9 + 0 + 16} = \sqrt{25} = 5, \\
    \| \vec{b} \| &= \sqrt{1^2 + 2^2 + 3^2} = \sqrt{1 + 4 + 9} = \sqrt{14} = 3.74\ldots
\end{align*}
$$

:::{admonition} Task
:class: tip

Add the following function to the ***maths.js*** file

```javascript
function length(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file

```javascript
// Vector magnitude and normalization
console.log("\nVector magnitude and normalization\n----------------------------------");
console.log("length(a) = " + length(a));
console.log("length(b) = " + length(b));
```

:::

Refresh your web page, and you should see the following has been added

```text
Vector magnitude and normalization
----------------------------------
length(a) = 5
length(b) = 3.7416573867739413
```
---

(unit-vectors-section)=

### Unit vectors

A **unit vector** is a vector that has a length of 1. We can find a unit vector that points in the same direction as a non-zero vector $\vec{a}$, which is denoted by $\hat{\vec{a}}$ (pronounced *a-hat*), by dividing by its magnitude, i.e.,

$$ \hat{\vec{a}} = \frac{\vec{a}}{\|\vec{a}\|}. $$(eq-unit-vector)

This process is called **normalising a vector**. For example, to determine a unit vector pointing in the same direction as the vector $\vec{a} = (3, 0, 4)$, we normalise it by dividing by its magnitude which is 5.

$$
\begin{align*}
    \hat{\vec{a}} &= \frac{(3, 0, 4)}{5} = \left( \frac{3}{5}, 0, \frac{4}{5} \right) = (0.6, 0, 0.8).
\end{align*}
$$

Checking that $\hat{\vec{a}}$ has a magnitude of 1

$$
\|\hat{\vec{a}}\| = \sqrt{0.6^2 + 0^2 + 0.8^2} = \sqrt{0.36 + 0.64} = \sqrt{1} = 1.
$$

Normalizing a vector is an operation that is used a lot in graphics programming, so it would be useful to have a function that does this.

:::{admonition} Task
:class: tip

Add the following function to the ***maths.js*** file

```javascript
function normalize(v) {
    const len = length(v);
    if (len === 0) return [0, 0, 0];
    return scaleVector(v, 1 / len);
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file

```javascript
const aHat = normalize(a);
const bHat = normalize(b);
console.log("aHat = " + printVector(aHat));
console.log("bHat = " + printVector(bHat));
console.log("length(aHat) = " + length(aHat));
console.log("length(bHat) = " + length(bHat));
```

:::

Refresh your web page, and you should see the following has been added

```text
aHat = [ 0.60, 0.00, 0.80 ]
bHat = [ 0.27, 0.53, 0.80 ]
length(aHat) = 1
length(bHat) = 1
```

Both `aHat` and `bHat` have magnitudes of 1 which shows they are both unit vectors.

---

(dot-product-section)=

### The dot product

The <a href="https://en.wikipedia.org/wiki/Dot_product" target="_blank">**dot product**</a> between two vectors $\vec{a} = (a_x, a_y, a_z)$ and $\vec{b} = (b_x, b_y, b_z)$ is denoted by $\vec{a} \cdot \vec{b}$ and returns a scalar. The dot product is calculated using

$$ \vec{a} \cdot \vec{b} = a_xb_x + a_yb_y + a_zb_z. $$(eq-dot-product)

The dot product is related to the angle $\theta$ between the two vectors ({numref}`angle-between-vectors-figure`) by

$$ \vec{a} \cdot \vec{b} = \|\vec{a}\| \|\vec{b}\| \cos(\theta). $$(eq-dot-product-geometric)

```{figure} ../_images/04_dot_product.svg
:height: 125
:name: angle-between-vectors-figure

The angle $\theta$ between the vectors $\vec{a}$ and $\vec{b}$.
```

A useful result for computer graphics is that if $\theta=90^\circ$ then $\cos(\theta) = 0$ and equation {eq}`eq-dot-product-geometric` becomes

$$
\vec{a} \cdot \vec{b} = 0.
$$

In order words, if the dot product of two vectors is zero then the two vectors are perpendicular. For example, given the vectors $\vec{a} = (3, 0, 4)$ and $\vec{b} = (1, 2, 3)$ the dot product between these are

$$
\begin{align*}
    \vec{a} \cdot \vec{b} &= (3, 0, 4) \cdot (1, 2, 3)
    = 3 + 0 + 12
    = 15.
\end{align*}
$$

:::{admonition} Task
:class: tip

Add the following function to the ***maths.js*** file

```javascript
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file

```javascript
// Dot and cross products
console.log("\nDot and cross products\n----------------------");
console.log("a . b = " + dot(a, b));
```

:::

Refresh your web page, and you should see the following has been added

```text
Dot and cross products
----------------------
a . b = 15
```

---

(cross-product-section)=

### The cross product

The <a href="https://en.wikipedia.org/wiki/Cross_product" target="_blank">**cross product**</a> between two 3-element vectors $\vec{a} = (a_x, a_y, a_z)$ and $\vec{b} = (b_x, b_y, b_z)$ is denoted by $\vec{a} \times \vec{b}$ and returns a vector. The cross product is calculated using

$$ \vec{a} \times \vec{b} = (a_yb_z - a_zb_y, a_zb_x - a_xb_z, a_xb_y - a_yb_x). $$(eq-cross-product)

The cross product between two vectors produces another vector that is perpendicular to both of the vectors ({numref}`cross-product-figure`). This is another incredibly useful result as it allows us to calculate a [**normal vector**](normal-vector-section) to a polygon which are used in calculating how light is reflected off surfaces (see [Lab 8: Lighting](lighting-section)).

```{figure} ../_images/04_cross_product.svg
:height: 220
:name: cross-product-figure

The cross product between two vectors gives a vector that is perpendicular to both vectors.
```

For example, given the vectors $\vec{a} = (3,0,4)$ and $\vec{b} = (1, 2, 3)$ the cross product $\vec{a} \times \vec{b}$ is

$$
\begin{align*}
    \vec{a} \times \vec{b} &= (3, 0, 4) \times (1, 2, 3) \\
    &= (0 \times 3 - 4 \times 2, 4 \times 1 - 3 \times 3, 3 \times 2 - 0 \times 3) \\
    &= (-8, -5, 6).
\end{align*}
$$

We can show that $\vec{a} \times \vec{b}$ is perpendicular to both $\vec{a}$ and $\vec{b}$ using the dot product

$$
\begin{align*}
    \vec{a} \cdot (\vec{a} \times \vec{b}) &= (3, 0, 4) \cdot (-8, -5, 6) = -24 + 0 + 24 = 0, \\
    \vec{b} \cdot (\vec{a} \times \vec{b}) &= (1, 2, 3) \cdot (-8, -5, 6) = - 8 - 10 + 18 = 0.
\end{align*}
$$

:::{admonition} Task
:class: tip

Add the following function to the ***maths.js*** file

```javascript
function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file

```javascript
const aCrossB = cross(a, b);
console.log("a x b = " + printVector(aCrossB));
console.log("a . (a x b) = " + dot(a, aCrossB));
console.log("b . (a x b) = " + dot(b, aCrossB));
```

:::

Refresh your web page, and you should see the following has been added

```text
a x b = [ -8.00, -5.00, 6.00 ]
a . (a x b) = 0
b . (a x b) = 0
```

Here we have also shown that the cross product of `a` and `b` is perpendicular to both vectors.

---

## Matrices

Another type of mathematical object that is fundamental to computer graphics is the matrix. A matrix is a rectangular array of numbers.

$$
\begin{align*}
    A =
    \begin{pmatrix}
        a_{11} & a_{12} & \cdots & a_{1n} \\
        a_{21} & a_{22} & \cdots & a_{2n} \\
        \vdots & \vdots & \ddots & \vdots \\
        a_{m1} & a_{m2} & \cdots & a_{mn}
    \end{pmatrix}
\end{align*}
$$

It is common to use uppercase characters for the name of a matrix and lowercase characters for the individual elements. The elements of a matrix are referenced by an **index** which is a pair of numbers, the first of which is the horizontal row number and the second is the vertical column number so $a_{ij}$ is the element in row $i$ and column $j$ of the matrix $A$.

We refer to the size of a matrix by the number of rows by the number of columns. Here the matrix $A$ has $m$ rows and $n$ columns, so we call this matrix a $m \times n$ matrix. Computer graphics mostly works with $4 \times 4$ matrices (see [Lab 5: Transformations](transformations-section) for why this is) so we will create a matrix class to define $4 \times 4$ matrices and perform operations on them.

:::{admonition} Task
:class: tip

Add the following class declaration to the ***maths.js*** file.

```javascript
// 4x4 Matrix class
class Mat4 {
    constructor() {
        this.m = new Float32Array(16);
        this.identity();
    }

    identity() {
        const m = this.m;
        m[0] = 1; m[4] = 0; m[8]  = 0; m[12] = 0;
        m[1] = 0; m[5] = 1; m[9]  = 0; m[13] = 0;
        m[2] = 0; m[6] = 0; m[10] = 1; m[14] = 0;
        m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
        return this;
    }

    set(values) {
        this.m.set(values);
        return this;
    }

    toString() {
        const m = this.m;
        let string = "";
        for (let i = 0; i < 4; i++) {
            const row = [
                m[i * 4 + 0].toFixed(2).padStart(8),
                m[i * 4 + 1].toFixed(2).padStart(8),
                m[i * 4 + 2].toFixed(2).padStart(8),
                m[i * 4 + 3].toFixed(2).padStart(8),
            ];
            string += "    [" + row.join(" ") + " ]\n";
        }
        return string;
    }

    copy (mat) {
        this.m.set(mat.m);
        return this;
    }
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
// Matrices
console.log("\nMatrices\n--------");
const A = new Mat4().set([
     1,  2,  3,  4,
     5,  6,  7,  8,
     9, 10, 11, 12,
    13, 14, 15, 16
]);
console.log("A =\n" + A);
```

:::

Here we have declared a class called `Mat4` inside which we have defined the following methods

- `constructor()` -- the constructor method that defines a $4\times 4$ identity matrix (we discuss identity matrices [below](identity-matrix-section))
- `identity()` -- returns an identity matrix
- `set()` -- sets the values of the matrix equal to 16 inputted values
- `toString()` -- outputs a string that can be used with `console.log()` to print the matrix
- `copy()` -- makes a copy of the matrix (useful to avoid overwriting the matrix)

We have then created a matrix object and set the values equal to the matrix below and printed the matrix.

$$
A =
\begin{pmatrix}
    1 & 2 & 3 & 4 \\
    5 & 6 & 7 & 8 \\
    9 & 10 & 11 & 12 \\
    13 & 14 & 15 & 16
\end{pmatrix}.
$$

Refresh your web page, and you should see the following has been added

```text
Matrices
--------
A =
  [    1.00     2.00     3.00     4.00 ]
  [    5.00     6.00     7.00     8.00 ]
  [    9.00    10.00    11.00    12.00 ]
  [   13.00    14.00    15.00    16.00 ]
```

(transpose-section)=

### Matrix transpose

The **transpose** of a matrix $A$ is denoted by $A^\mathsf{T}$ and is defined

$$A_{ij}^\mathsf{T} = A_{ji}$$

i.e., the rows and columns of $A$ are swapped so row $i$ of $A$ is column $i$ of $A^\mathsf{T}$. For example, the matrix $A$ we defined above

$$
A =
\begin{pmatrix}
    1 & 2 & 3 & 4 \\
    5 & 6 & 7 & 8 \\
    9 & 10 & 11 & 12 \\
    13 & 14 & 15 & 16
\end{pmatrix},
$$

then $A^\mathsf{T}$ is

$$
A^\mathsf{T} =
\begin{pmatrix}
    1 & 5 & 9 & 13 \\
    2 & 6 & 10 & 14 \\
    3 & 7 & 11 & 15 \\
    4 & 8 & 12 & 16
\end{pmatrix}.
$$

:::{admonition} Task
:class: tip

Add the following method definition to the matrix class.

```javascript
transpose() {
    const m = this.m;
    let tmp;
    tmp = m[1];  m[1]  = m[4];  m[4]  = tmp;
    tmp = m[2];  m[2]  = m[8];  m[8]  = tmp;
    tmp = m[3];  m[3]  = m[12]; m[12] = tmp;
    tmp = m[6];  m[6]  = m[9];  m[9]  = tmp;
    tmp = m[7];  m[7]  = m[13]; m[13] = tmp;
    tmp = m[11]; m[11] = m[14]; m[14] = tmp;
    return this
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
console.log("\nA^T =\n" + A.transpose());
```

:::

Refresh your web page, and you should see the following has been added

```text
A^T =
  [    1.00     5.00     9.00    13.00 ]
  [    2.00     6.00    10.00    14.00 ]
  [    3.00     7.00    11.00    15.00 ]
  [    4.00     8.00    12.00    16.00 ]
```

So here we have transposed the matrix $A$ and printed it. Note that the call `A.transpose()` has changed the elements in the matrix `A` so if we want to work with the original matrix we must first make a copy.

:::{admonition} Task
:class: tip

Edit the code used to print the transpose of the matrix `A` to the following

```javascript
const AT = new Mat4().copy(A);
console.log("\nA^T =\n" + AT.transpose());
console.log("\nA =\n" + A);
```

:::

Here we have created a new matrix `AT` and copied the elements of `A` into it and printed the transpose of the new matrix. We have also printed the original `A` matrix to check that its elements are still the original values. Refresh your web browser and you should set the following.

```text
A^T =
  [    1.00     5.00     9.00    13.00 ]
  [    2.00     6.00    10.00    14.00 ]
  [    3.00     7.00    11.00    15.00 ]
  [    4.00     8.00    12.00    16.00 ]

A =
  [    1.00     2.00     3.00     4.00 ]
  [    5.00     6.00     7.00     8.00 ]
  [    9.00    10.00    11.00    12.00 ]
  [   13.00    14.00    15.00    16.00 ]
```

(matrix-multiplication-section)=

### Matrix multiplication

Scalar multiplication of a matrix by a scalar is the same for matrices as it is for vectors. However, the multiplication of two matrices $A$ and $B$ is defined in a very specific way. If $A$ and $B$ are two matrices then the element in row $i$ and column $j$ of the matrix $AB$ is calculated using

$$ [AB]_{ij} = \vec{a}_i \cdot \vec{b}_j, $$(eq-matrix-multiplication)

Where $\vec{a}_i$ is the vector formed from row $i$ of $A$ and $\vec{b}_j$ is the vector formed from column $j$ of $B$. In computer graphics we mainly work with $4 \times 4$ matrices, so consider the following matrix multiplication

$$
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
$$

For the element in row 2 and column 3, $[AB]_{23}$, we have the dot product between row 2 of the left-hand matrix and column 3 of the right-hand matrix

$$
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
$$

so

$$
(5, 6, 7, 8) \cdot (19, 23, 27, 31) = 5 \times 19 + 6 \times 23 + 7 \times 27 + 8 \times 31 = 670.
$$

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
    const result = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += this.m[row + k * 4] * mat.m[k + col * 4];
            }
            result[row + col * 4] = sum;
        }
    }
    this.set(result);
    return this;
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
const B = new Mat4().set([
    17, 18, 19, 20,
    21, 22, 23, 24,
    25, 26, 27, 28,
    29, 30, 31, 32
]);

const AB = new Mat4().copy(A).multiply(B);
console.log("\nB =\n" + B);
console.log("\nAB =\n" + AB);
```

:::

Refresh your web page, and you should see the following has been added

```text
B =
  [   17.00    18.00    19.00    20.00 ]
  [   21.00    22.00    23.00    24.00 ]
  [   25.00    26.00    27.00    28.00 ]
  [   29.00    30.00    31.00    32.00 ]

AB =
  [  538.00   612.00   686.00   760.00 ]
  [  650.00   740.00   830.00   920.00 ]
  [  762.00   868.00   974.00  1080.00 ]
  [  874.00   996.00  1118.00  1240.00 ]
```

Hang on a minute, this matrix isn't the same as the one from equation {eq}`eq-matrix-multiplication-example`. Our `multiply()` method hasn't given us the result shown above. The reason for this is how the elements of a matrix are stored in memory.

(column-major-order-section)=

### Column-major order

Linear memory is a contiguous block of addresses that can be sequentially accessed. So a 1D array is stored in adjacent memory locations. Since matrices are 2D we have a choice whether to store the elements in the rows or columns in adjacent locations. These are known as **column-major order** and **row-major order**. Consider the $4 \times 4$ matrix

$$
\begin{pmatrix}
    a & b & c & d \\
    e & f & g & h \\
    i & j & k & l \\
    m & n & o & p
\end{pmatrix}.
$$

Using column-major order this will be stored in the memory as

```{figure} ../_images/04_column_major_order.svg
:width: 650
```

i.e., we move down and across the matrix. Alternatively, using row-major order the matrix will be stored as

```{figure} ../_images/04_row_major_order.svg
:width: 650
```

i.e., we move across and down the matrix. **WebGL uses column-major order** because it is based upon OpenGL which was written for early GPUs that treated vertex data as column vectors. So a matrix containing vertices is stored column-by-column which means, when working with WebGL, we need to switch the rows and columns around when multiplying matrices. This is why our `multiply()` method produced the wrong result.

To output the matrix multiplication $AB$ as we would expect it to appear, we can swap `A` and `B`.

:::{admonition} Task
:class: tip

Edit the line that computes the matrix `AB` so that `A` and `B` are swapped.

```javascript
const AB = new Mat4().copy(B).multiply(A);
```

:::

Refresh your browser and you should now see that we have the matrix seen in equation {eq}`eq-matrix-multiplication-example`.

```text
AB =
  [  250.00   260.00   270.00   280.00 ]
  [  618.00   644.00   670.00   696.00 ]
  [  986.00  1028.00  1070.00  1112.00 ]
  [ 1354.00  1412.00  1470.00  1528.00 ]
```

:::{important}
When working with column-major ordering, matrix multiplication is read from right-to-left, so to calculate the multiplication $AB$ we would reverse the order, i.e., $BA$.
:::

:::{note}
:class: note
Microsoft's graphics library directX and Unreal Engine uses row-major order whilst WebGL, OpenGL, Vulkan (successor to OpenGL), Metal (Apple's graphics library) and Unity all use column-major order. This means when porting code between the graphics libraries developers have to change all of their matrix calculations.
:::

(identity-matrix-section)=

### The Identity Matrix

The identity matrix is a special square matrix where all the elements are zero apart from the elements on the diagonal line from the top-left element down to the bottom-right element (known as the main diagonal). For example the $4 \times 4$ identity matrix is

$$
I =
\begin{pmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1
\end{pmatrix}.
$$

The identity matrix is similar to the number 1 in that if we multiply any matrix by an identity matrix the result is unchanged. For example,

$$
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
$$

(inverse-matrix-section)=

### Matrix Inverse

Whilst matrix multiplication is defined for certain matrices there is no way of dividing one matrix by another. However, for certain square matrices we can calculate an **inverse matrix** that performs a similar function to divide. Consider the division of two numbers, 4 and 2 say. If we wanted to divide 4 by two we could write

$$ \frac{4}{2} = 2. $$

We could also write this division as the multiplication of $\dfrac{1}{2}$ and 4

$$ \frac{1}{2} \times 4 = 2.$$

Here we have shown that $\frac{1}{2}$ is the **multiplicative inverse** of 2. A multiplicative inverse of a number $x$ is denoted as $x^{-1}$ and satisfies $x \times x^{-1} = 1$. The inverse of a matrix $A$ is denoted by $A^{-1}$ and satisfies $A^{-1} A = AA^{-1} = I$ where $I$ is the identity matrix. For example, consider the matrix $C$

$$ C = \begin{pmatrix}
    1 & 3 & 2 & 1 \\
    1 & 1 & 2 & 2 \\
    1 & 3 & 3 & 2 \\
    3 & 1 & 3 & 2 \\
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
      1 & 3 & 2 & 1 \\
      1 & 1 & 2 & 2 \\
      1 & 3 & 3 & 2 \\
      3 & 1 & 3 & 2 \\
    \end{pmatrix}
    \begin{pmatrix}
        1 & 1/2 & -5/4 & 1/4 \\
        1 & 1/2 & -3/4 & -1/4 \\
        -2 & -2 & 5/2 & 1/2 \\
        1 & 2 & -3/2 & -1/2
    \end{pmatrix}
    =
    \begin{pmatrix}
     1 & 0 & 0 & 0 \\
     0 & 1 & 0 & 0 \\
     0 & 0 & 1 & 0 \\
     0 & 0 & 0 & 1
    \end{pmatrix}.
\end{align*} $$

So this shows that $C^{-1}$ is the correct inverse matrix of $C$. Calculating the inverse of a matrix is quite involved process and outside the scope of this course.

:::{admonition} Task
:class: tip

Add the following method to the Matrix class (you may wish to use copy and paste here).

```javascript
inverse() {
    let m = this.m;
    const inv = new Float32Array([
        m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10],
        -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10],
        m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7]    - m[13] * m[3] * m[6],
        -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7]    + m[9] * m[3] * m[6],

        -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10],
        m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10],
        -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7]    + m[12] * m[3] * m[6],
        m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7]    - m[8] * m[3] * m[6],

        m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9],
        -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9],
        m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7]    - m[12] * m[3] * m[5],
        -m[0] * m[5] * m[11] + m[0] * m[7] * m[9]    + m[4] * m[1] * m[11] - m[4] * m[3] * m[9]    - m[8] * m[1] * m[7]    + m[8] * m[3] * m[5],

        -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9],
        m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9],
        -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6]    + m[12] * m[2] * m[5],
        m[0] * m[5] * m[10] - m[0] * m[6] * m[9]    - m[4] * m[1] * m[10] + m[4] * m[2] * m[9]    + m[8] * m[1] * m[6]    - m[8] * m[2] * m[5]
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
    this.set(inv);
    return this;
}
```

Now add enter the following code to the ***vectors_and_matrices.js*** file.

```javascript
const C = new Mat4().set([
    1, 3, 2, 1,
    1, 1, 2, 2,
    1, 3, 3, 2,
    3, 1, 3, 2
]);
const invC = new Mat4().copy(C).inverse();

console.log("\nC =\n" + C);
console.log("\ninv(C) =\n" + invC);
console.log("\ninv(C)C =\n" + invC.multiply(C));
```

:::

Here we have computed and printed the inverse of the matrix `C` (remembering to take a copy) as well printing the matrix multiplication of `C`, and it's inverse to check that we get an identity matrix. Refresh your browser, and you should see the following.

```text
C =
  [    1.00     3.00     2.00     1.00 ]
  [    1.00     1.00     2.00     2.00 ]
  [    1.00     3.00     3.00     2.00 ]
  [    3.00     1.00     3.00     2.00 ]

inv(C) =
  [    1.00     0.50    -1.25     0.25 ]
  [    1.00     0.50    -0.75    -0.25 ]
  [   -2.00    -2.00     2.50     0.50 ]
  [    1.00     2.00    -1.50    -0.50 ]

inv(C)C =
  [    1.00     0.00     0.00     0.00 ]
  [    0.00     1.00     0.00     0.00 ]
  [    0.00     0.00     1.00     0.00 ]
  [    0.00     0.00     0.00     1.00 ]
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

$$
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
\end{align*}$$

&emsp;&emsp; use pen and paper to calculate the following transformations:

&emsp;&emsp; (a) &emsp; $S \, \vec{v}$;<br>
&emsp;&emsp; (b) &emsp; $T \, \vec{v}$;<br>
&emsp;&emsp; (c) &emsp; $T\,S\,\vec{v}$.<br>

&emsp;&emsp; For each one, describe what effect the transformation has on $\vec{v}$.


```{dropdown} Solutions

1 (a) $\vec{p} = (5, 6, 1)$

1 (b) $\vec{q} = (-10, -2, -7)$

1 (c) $\vec{r} = (5, -4, 6)$

1 (d) $\| \vec{p} \| = 7.874$

1 (e) $\hat{\vec{q}} = (-0.81, -0.16, -0.57)$

1 (f) $\vec{p} \cdot \vec{q} = -69$

1 (g) $\vec{q} \times \vec{r} = (-30, 25, 50)$

3 (a) $AB = \begin{pmatrix} 21 & 1 \\ -35 & -1 \end{pmatrix}$

3 (b) $ABC = $

3 (c) $B^\mathsf{T}A^\mathsf{T} = $

4 (a) $S\vec{v} = \begin{pmatrix} 10 \\ 16 \\ 20 \\ 1 \end{pmatrix}$. The first three elements of $\vec{v}$ have been doubled.

4 (b) $T\vec{v} = \begin{pmatrix} 8 \\ 10 \\ 9 \\ 1 \end{pmatrix}$. The first three elements of $\vec{v}$ have been increased by the elements in the fourth column of $T$.

4 (c) $TS\vec{v} = \begin{pmatrix} 13 \\ 18 \\ 19 \\ 1 \end{pmatrix}$ This first three elements of $\vec{v}$ have been double and then increased by the elements in the fourth column of $T$.
```

---

## Video Walkthrough

<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/9Ju2yfozZ6o?si=mZ5lOq2D3NzL9-2X" title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
></iframe>
