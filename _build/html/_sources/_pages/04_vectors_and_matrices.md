(vectors-and-matrices-section)=

# Vectors and Matrices

Computer graphics relies heavily on mathematics of vectors and matrices. In this lab we will be revising the important concepts needed for computer graphics and using a library to perform calculations. Will will be using this library in the upcoming labs so it is important that you know how it works.

---

## The glm library

The glm (<a href="https://github.com/g-truc/glm" target="_blank">OpenGL Mathematics</a>) library is a popular C++ mathematics library designed to provide classes and functions for mathematical operations, specifically tailored for graphics programming using OpenGL. We will be using functions from glm to perform calculations for us. Open the **Lab04_Vectors_and_matrices.cpp** file and in addition to the **iostream** library (for standard I/O operations) we have additional code that imports the glm library.

```cpp
// Include the glm library
#include <glm/glm.hpp>
#include <glm/gtx/io.hpp>
```

The **glm/glm.hpp** is a header file for the glm library and **glm/gtx/io.hpp** is a header file that handles I/O for glm objects.

---

## Vectors

A vector in is an object with magnitude (length) and direction. A vector is denoted by a lower case letter in boldface, e.g., $\mathbf{a}$ (or underlined when writing by hand), and represented mathematically by a tuple which is an ordered set of numbers. In geometry, each number in the vector represents the length along the co-ordinate axes. For example, consider the 3-element vector

$$ \mathbf{a} = (a_x, a_y, a_z). $$

Here $\mathbf{a}$ has 3 elements so is a vector in 3D space where $a_x$, $a_y$ and $a_z$ are the lengths of the vector in the $x$, $y$, and $z$ directions.

```{figure} ../_images/04_Vector.svg
:height: 200

The vector $\mathbf{a} = (a_x, a_y, a_z)$.
```

Lets create the following 3D vector objects in C++.

$$ \begin{align*}
    \mathbf{a} &= (3, 0, 4), &
    \mathbf{b} &= (1, 2, 3).
\end{align*} $$

Add the following code to the `main()` function.

```cpp
// Vectors
printf("Vectors and Matrices\n");
printf("--------------------------------------------------\n");

// Defining vectors
glm::vec3 a, b;
a = glm::vec3(3.0f, 0.0f, 4.0f);
b[0] = 1.0f, b[1] = 2.0f, b[2] = 3.0f;

printf("Defining vectors:\n");
std::cout << "a = " << a << std::endl;
std::cout << "b = " << b << std::endl;
```

Here we have declared two vectors `a` and `b` using the `glm::vec3` type (for vectors in 2D we would use `glm::vec2`). The elements of the vectors `a` and `b` have been defined using two different methods: `a` has been defined using the `glm::vec3(x, y, z)` constructor and `b` by accessing the individual elements using [array indexing](arrays-section). The vectors have been printed to the console using `std::cout` commands (glm vectors cannot be printed using the `printf()` function). Compile and run the **Lab04_Vectors_and_matrices** project and you should see the following outputted to the console.

```text
Vectors and Matrices
--------------------------------------------------
Defining vectors:
a = [    3.000,    0.000,    4.000]
b = [    1.000,    2.000,    3.000]
```

(vector-magnitude-section)=

### Vector magnitude

The **magnitude** of a vector $\mathbf{a} = (a_x, a_y, a_z)$ is denoted by $\|\mathbf{a}\|$ is the length from the tail of the vector to the head.

```{figure} ../_images/04_Vector_magnitude.svg
:height: 100

The magnitude of $\mathbf{a}$ is the length of the vector.
```

The magnitude is calculated using an extension of Pythagoras' theorem, for example for 3D vectors the magnitude is

$$ \|\mathbf{a}\| = \sqrt{a_x^2 + a_y^2 + a_z^2}. $$(eq:vector-magnitude)

For example, for the vectors $\mathbf{a}$ and $\mathbf{b}$ given above the magnitudes are

$$ \begin{align*}
    \| \mathbf{a} \| &= \sqrt{3^2 + 0^2 + 4^2} = \sqrt{9 + 0 + 16} = \sqrt{25} = 5, \\
    \| \mathbf{b} \| &= \sqrt{1^2 + 2^2 + 3^2} = \sqrt{1 + 4 + 9} = \sqrt{14} = 3.742\ldots
\end{align*}  $$

The `glm::length()` function calculates the magnitude of a glm vector object. To demonstrate this,  add the following code to your program.

```cpp
// Vector length
printf("\nVector length:\n");
printf("length(a) = %0.3f\n", glm::length(a));
printf("length(b) = %0.3f\n", glm::length(b));
```

Running the program you should see the following printed to the console.

```text
Vector length:
length(a) = 5.000
length(b) = 3.742
```

(unit-vectors-section)=

### Unit vectors

A **unit vector** is a vector that has a length of 1. We can find a unit vector that points in the same direction as a non-zero vector $\mathbf{a}$, which is denoted by $\hat{\mathbf{a}}$ (pronounced *a-hat*), by dividing by its magnitude, i.e.,

$$ \hat{\mathbf{a}} = \frac{\mathbf{a}}{\|\mathbf{a}\|}. $$(eq:unit-vector)

This process is called **normalising a vector**. For example, to determine a unit vector pointing in the same direction as $\mathbf{a} = (3, 0, 4)$ we normalise it by dividing by its magnitude which we have already calculated is 5.

$$ \begin{align*}
    \hat{\mathbf{a}} &= \frac{(3, 0, 4)}{5} = \left( \frac{3}{5}, 0, \frac{4}{5} \right) = (0.6, 0, 0.8).
\end{align*} $$

Checking that $\hat{\mathbf{a}}$ has a magnitude of 1

$$ \|\hat{\mathbf{a}}\| = \sqrt{0.6^2 + 0^2 + 0.8^2} = \sqrt{0.36 + 0.64} = \sqrt{1} = 1.$$

Normalising a vector is an operation that is used a lot in graphics programming so the glm library has the function `glm::normalize()` to do this. Add the following code to your program.

```cpp
// Normalising vectors
glm::vec3 aHat, bHat;
aHat = glm::normalize(a);
bHat = b / glm::length(b);

printf("\nNormalising vectors:\n");
std::cout << "aHat = " << aHat << std::endl;
std::cout << "bHat = " << bHat << std::endl;
printf("length(aHat) = %0.3f\n", glm::length(aHat));
printf("length(bHat) = %0.3f\n", glm::length(bHat));
```

Here we are calculating unit vectors from `a` and `b` using the `glm::normalize()` function and dividing by the vector magnitude. Running your program you should see the following printed to the console.

```text
Normalising vectors:
aHat = [    0.600,    0.000,    0.800]
bHat = [    0.267,    0.535,    0.802]
length(aHat) = 1.000
length(bHat) = 1.000
```

Both `aHat` and `bHat` have magnitudes of 1 which shows they are both unit vectors.

## Arithmetic operations on vectors

Like numbers, we can define the arithmetic operations of addition, subtraction for vectors as well as multiplication and division by a scalar.

### Vector addition and subtraction

The addition and subtraction of two vectors $\mathbf{a} = (a_x, a_y, a_z)$ and $\mathbf{b} = (b_x, b_y, b_z)$ is defined by

$$ \begin{align*}
    \mathbf{a} + \mathbf{b} &= (a_x + b_x, a_y + b_y, a_z + b_z), \\
    \mathbf{a} - \mathbf{b} &= (a_x - b_x, a_y - b_y, a_z - b_z).
\end{align*} $$(eq:vector-addition)

For example, given the vectors $\mathbf{a} = (3,0,4)$ and $\mathbf{b} = (1, 2, 3)$

$$ \begin{align*}
    \mathbf{a} + \mathbf{b} &= (3, 0, 4) + (1, 2, 3) = (3 + 1, 0 + 2, 4 + 3) = (4, 2, 7), \\
    \mathbf{a} - \mathbf{b} &= (3, 0, 4) - (1, 2, 3) = (3 - 1, 0 - 2, 4 - 3) = (2, -2, 1).
\end{align*} $$

What is happening in a geometrical sense when we add and subtract vectors? Take a look at {numref}`vector-addition-figure`, here the vector $\mathbf{b}$ has been added to the vector $\mathbf{a}$ where the tail of $\mathbf{b}$ is placed at the head of $\mathbf{a}$. The resulting vector $\mathbf{a} + \mathbf{b}$ points from the tail of $\mathbf{a}$ to the head of $\mathbf{b}$. 

```{figure} ../_images/04_Vector_addition.svg
:height: 150
:name: vector-addition-figure

Vector addition.
```

The subtraction of the vector $\mathbf{b}$ does similar, but since $\mathbf{a} - \mathbf{b} = \mathbf{a} + (-1)\mathbf{b}$ then the direction of $\mathbf{b}$ is reversed so $\mathbf{a} - \mathbf{b}$ is the same as placing the tail of $-\mathbf{b}$ at the head of $\mathbf{a}$.

```{figure} ../_images/04_Vector_subtraction.svg
:height: 180
:name: vector-subraction-figure

Vector subtraction.
```

To calculate the addition and subraction of our vectors add the following code to your program.

```cpp
// Arithmetic operations on vectors
printf("\nArithmetic operations on vectors:\n");
std::cout << "a + b = " << a + b << std::endl;
std::cout << "a - b = " << a - b << std::endl;
```

Running the program adds the following output to the console.

```text
Arithmetic operations on vectors:
a + b = [    4.000,    2.000,    7.000]
a - b = [    2.000,   -2.000,    1.000]
```

### Multiplication and division by a scalar

Multiplication and division of a vector $\mathbf{a} = (a_x, a_y, a_z)$ by a scalar (a number) $k$ are defined by

$$ \begin{align*}
    k \mathbf{a} &= (ka_x, ka_y, ka_z), \\
    \frac{\mathbf{a}}{k} &= \left(\frac{a_x}{k}, \frac{a_y}{k}, \frac{a_z}{k} \right).
\end{align*} $$

Multiplying or dividing a vector by a positive scalar has the effect of scaling the length of the vector. Multiplying or dividing by a negative scalar reverses the direction of the vector.

```{figure} ../_images/04_vector_multiplication.svg
:height: 180
```

For example, multiplying the vector $\mathbf{a} = (3, 0, 4)$ by the scalar 2 gives

$$ 2\mathbf{a} = 2(3,0,4) = (6, 0, 8), $$

which has the magnitude

$$ \|2 \mathbf{a} \| = \sqrt{6^2 + 0^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10 = 2 \|\mathbf{a}\|. $$

To perform scalar multiplication or division on a glm vector we simply use the `*` and `/` operators. To demonstrate this add the following code to your program.

```cpp
std::cout << "2a    = " << 2.0f * a << std::endl;
std::cout << "b / 3 = " << b / 3.0f << std::endl;
```

Note that we need to use float values for scalar multiplication and division, i.e., `2.0f` and `3.0f` instead of `2` and `3`. Running the program will add the following to the console.

```text
2a    = [    6.000,    0.000,    8.000]
b / 3 = [    0.333,    0.667,    1.000]
```

(element-wise-multiplication-section)=

### Element-wise multiplication

Mathematically speaking the multiplication of two vectors is not defined (instead we have the dot and cross products - see [below](dot-product-section)). However, in computing it is useful to be able to multiply the individual elements of vectors, known as **element-wise multiplication**, which is done using the `*` operator.

Add the following code to your program.

```cpp
std::cout << "a * b = " << a * b << std::endl;
```

Running the program gives the following output.

```text
a * b = [    3.000,    0.000,   12.000]
```

So each element of `a * b` is the product of the corresponding elements in the vectors `a` and `b`.

(dot-product-section)=

### The dot product

The **dot product** between two vectors $\mathbf{a} = (a_x, a_y, a_z)$ and $\mathbf{b} = (b_x, b_y, b_z)$ is denoted by $\mathbf{a} \cdot \mathbf{b}$ and returns a scalar. The dot product is calculated using

$$ \mathbf{a} \cdot \mathbf{b} = a_xb_x + a_yb_y + a_zb_z. $$(eq:dot-product)

The dot product is related to the angle $\theta$ between the two vectors ({numref}`angle-between-vectors-figure`) by

$$ \mathbf{a} \cdot \mathbf{b} = \|\mathbf{a}\| \|\mathbf{b}\| \cos(\theta). $$(eq:dot-product-geometric)

```{figure} ../_images/04_Dot_product.svg
:height: 125
:name: angle-between-vectors-figure

The angle $\theta$ between the vectors $\mathbf{a}$ and $\mathbf{b}$.
```

A useful result for computer graphics is that if $\theta=90^\circ$ then $\cos(\theta) = 0$ and equation {eq}`eq:dot-product-geometric` becomes

$$ \mathbf{a} \cdot \mathbf{b} = 0. $$

In order words, if the dot product of two vectors is zero then the two vectors are perpendicular. For example, given the vectors $\mathbf{a} = (3, 0, 4)$ and $\mathbf{b} = (1, 2, 3)$ the dot product between these is

$$ \begin{align*}
    \mathbf{a} \cdot \mathbf{b} &= (3, 0, 4) \cdot (1, 2, 3)
    = 3 + 0 + 12
    = 15.
\end{align*} $$

The glm function `glm::dot()` calculates the dot product of two vectors. To demonstrate its use, add the following code to your program.

```cpp
// Dot and Cross products
printf("\nDot and cross products:\n");
printf("a . b = %0.3f\n", glm::dot(a, b));
```

Running the program results in the following output.

```text
Dot and cross products:
a . b = 15.000
```

(cross-product-section)=

### The cross product

The **cross product** between two vectors $\mathbf{a} = (a_x, a_y, a_z)$ and $\mathbf{b} = (b_x, b_y, b_z)$ is denoted by $\mathbf{a} \times \mathbf{b}$ and returns a vector. The cross product is calculated using

$$ \mathbf{a} \times \mathbf{b} = (a_yb_z - a_zb_y, a_zb_x - a_xb_z, a_xb_y - a_yb_x). $$(eq:cross-product)

The cross product between two vectors produces another vector that is perpendicular to both of the vectors ({numref}`cross-product-figure`). This is another incredibly useful result as it allows us to calculate a [**normal vector**](normal-vector-section) to a polygon which are used in calculating how light is reflected off surfaces (see [8. Lighting](lighting-section)).

```{figure} ../_images/04_cross_product.svg
:height: 200
:name: cross-product-figure

The cross product between two vectors gives a vector that is perpendicular to both vectors.
```

For example, given the vectors $\mathbf{a} = (3,0,4)$ and $\mathbf{b} = (1, 2, 3)$ the cross product $\mathbf{a} \times \mathbf{b}$ is

$$ \begin{align*}
    \mathbf{a} \times \mathbf{b} &= (3, 0, 4) \times (1, 2, 3) \\
    &= (0 \times 3 - 4 \times 2, 4 \times 1 - 3 \times 3, 3 \times 2 - 0 \times 3) \\
    &= (-8, -5, 6).
\end{align*} $$

We can show that $\mathbf{a} \times \mathbf{b}$ is perpendicular to both $\mathbf{a}$ and $\mathbf{b}$ using the dot product

$$ \begin{align*}
    \mathbf{a} \cdot (\mathbf{a} \times \mathbf{b}) &= (3, 0, 4) \cdot (-8, -5, 6) = -24 + 0 + 24 = 0, \\
    \mathbf{b} \cdot (\mathbf{a} \times \mathbf{b}) &= (1, 2, 3) \cdot (-8, -5, 6) = - 8 - 10 + 18 = 0.
\end{align*} $$

The glm function `glm::cross()` calculates the cross product of two vectors. To demonstrate its use, add the following code to your program.

```cpp
std::cout << "a x b = " << glm::cross(a, b) << std::endl;
printf("a . (a x b) = %0.3f\n", glm::dot(a, glm::cross(a, b)));
printf("b . (a x b) = %0.3f\n", glm::dot(b, glm::cross(a, b)));
```

Running the program results in the following output.

```text
a x b = [   -8.000,   -5.000,    6.000]
a . (a x b) = 0.000
b . (a x b) = 0.000
```

Here we have also shown that the cross product of `a` and `b` is perpendicular to both vectors.

---

## Matrices

Another type of mathematic object that is fundamental to computer graphics is the matrix. A matrix is a rectangular array of numbers.

$$ \begin{align*}
    A =
    \begin{pmatrix}
        a_{11} & a_{12} & \cdots & a_{1n} \\
        a_{21} & a_{22} & \cdots & a_{2n} \\
        \vdots & \vdots & \ddots & \vdots \\
        a_{m1} & a_{m2} & \cdots & a_{mn}
    \end{pmatrix}
\end{align*} $$

It is common to use uppercase characters for the name of a matrix and lowercase characters for the individual elements. The elements of a matrix are referenced by an **index** which is a pair of numbers, the first of which is the horizontal row number and the second is the vertical column number so $a_{ij}$ is the element in row $i$ and column $j$ of the matrix $A$.  

We refer to the size of a matrix by the number of rows by the number of columns. Here the matrix $A$ has $m$ rows and $n$ columns so we call this matrix a $m \times n$ matrix.

To declare a $2 \times 2$ glm matrix object we use the `glm::mat2()` function (a $4 \times 4$ matrix object is declared using `glm::mat4()`)
Lets create some glm matrix objects for the following matrices

$$ \begin{align*}
    A &= \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, &
    B &= \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}.
\end{align*} $$

Enter the following code into your program.

```cpp
// Defining matrices
glm::mat2 A, B;

A[0][0] = 1.0f, A[0][1] = 2.0f;
A[1][0] = 3.0f, A[1][1] = 4.0f;

B = glm::mat2(5.0f, 6.0f, 7.0f, 8.0f);

printf("\nDefining matrices:\n");
std::cout << "A = " << A << "\n" << std::endl;
std::cout << "B = " << B << std::endl;
```

Here we have declared two $2 \times 2$ matrices `A` and `B`. The elements of `A` are defined using matrix indexing and the elements of `B` are defined using the `glm::mat2()` function. Note how the elements of the 2D matrix are indexed using `[row][col]` 

Run your program and the following should be printed to the console.

```text
Defining matrices:
A = 
[[    1.000,    3.000]
 [    2.000,    4.000]]

B = 
[[    5.000,    7.000]
 [    6.000,    8.000]]
```

Hang on something isn’t right here. Looking at the matrix `A` that was outputted we have 1 and 3 on the top row when we were expecting 1 and 2 (and similar for `B`), so what has gone wrong? To explain we need to look at how arrays are stored in the memory.

(column-major-order-section)=

### Column-major order

Linear memory is a contiguous block of addresses that can be sequentially accessed. So a 1D array is stored in adjacent memory locations. Since matrices are 2D we have a choice whether to store the elements in the rows or columns in adjacent locations. These are known as **column-major order** and **row-major order**. Consider the $4 \times 4$ matrix

$$ \begin{align*}
    \begin{pmatrix}
        a & b & c & d \\
        e & f & g & h \\
        i & j & k & l \\
        m & n & o & p
    \end{pmatrix}.
\end{align*} $$

Using column-major order this will be stored in the memory as

```{figure} ../_images/04_Column_major.svg
:width: 600
```

i.e., we move down and across the matrix. Alternatively, using row-major order the matrix will be stored as

```{figure} ../_images/04_Row_major.svg
:width: 600
```

i.e., we move across and down the matrix. The choice of whether to use column-major or row-major order is arbitrary but OpenGL uses column-major order so glm does as well (incidentally Microsoft's graphics library directX uses row-major order which means when porting code between the graphics libraries developers have to change all of their matrix calculations).

So since OpenGL uses column-major order them so does glm. This is way our matrices `A` and `B` were outputted column-by-column. If we want to view the matrix how it should be we need to calculate its transpose.

(transpose-section)=

### Matrix transpose

The **transpose** of a matrix $A$ is denoted by $A^\mathsf{T}$ and is defined by swapping the rows and columns of $A$. For example, the matrix $A$ defined above

$$ \begin{align*}
    A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix},
\end{align*} $$

then $A^\mathsf{T}$ is

$$ \begin{align*}
    A^\mathsf{T} = \begin{pmatrix} 1 & 3 \\ 2 & 4 \end{pmatrix}.
\end{align*} $$

Edit the code in your programme so that the transpose of `A` and `B` are outputted to the console instead.

```cpp
std::cout << "A = " << glm::transpose(A) << "\n" << std::endl;
std::cout << "B = " << glm::transpose(B) << std::endl;
```

Running the program should change the output to

```text
Defining matrices:
A = 
[[    1.000,    2.000]
 [    3.000,    4.000]]

B = 
[[    5.000,    6.000]
 [    7.000,    8.000]]
```

That's better.

## Arithmetic operations on matrices

The arithmetic operations on matrices for addition and subtraction of two matrices and multiplying and dividing by a scalar are the same as for vectors using the `+`, `-`, `*` and `/` operators. To show these add the following code to your program.

```cpp
// Aritmetic operations on matrices
printf("\nArithmetic operations on matrices:\n");
std::cout << "A + B = " << glm::transpose(A + B) << "\n" << std::endl;
std::cout << "A - B = " << glm::transpose(A - B) << "\n" << std::endl;
std::cout << "2A    = " << glm::transpose(2.0f * A) << "\n" << std::endl;
std::cout << "A / 3 = " << glm::transpose(A / 3.0f) << "\n" << std::endl;
```

Running the program should output the following to the console.

```text
Arithmetic operations on matrices:
A + B = 
[[    6.000,    8.000]
 [   10.000,   12.000]]

A - B = 
[[   -4.000,   -4.000]
 [   -4.000,   -4.000]]

2A    = 
[[    2.000,    4.000]
 [    6.000,    8.000]]

A / 3 = 
[[    0.333,    0.667]
 [    1.000,    1.333]]
```

(matrix-multiplication-section)=
### Matrix multiplication

So multiplication of a matrix by a scalar is the same for matrices as it is for vectors. However, the multiplication of two matrices $A$ and $B$ is defined in a very specific way. If $A$ and $B$ are two matrices then the element in row $i$ and column $j$ of the matrix $AB$ is calculated using

$$ [AB]_{ij} = \mathbf{a}_i \cdot \mathbf{b}_j, $$(eq:matrix-multiplication)

where $\mathbf{a}_i$ is the vector formed from row $i$ of $A$ and $\mathbf{b}_j$ is the vector formed from column $j$ of $B$. For example, given the $2\times 2$ matrices $A$ and $B$ defined earlier

$$ \begin{align*}
    A &= \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, &
    B &= \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix},
\end{align*} $$

then the multiplication $AB$ is

$$ \begin{align*}
    AB &=
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}
    \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix} =
    \begin{pmatrix}
        (1, 2) \cdot (5, 7) & (1,2) \cdot (6, 8) \\
        (3, 4) \cdot (5, 7) & (3, 4) \cdot (6, 8)
    \end{pmatrix} \\
    &=
    \begin{pmatrix} 5 + 14 & 6 + 16 \\ 15 + 28 & 18 + 32 \end{pmatrix} =
    \begin{pmatrix} 19 & 22 \\ 43 & 50 \end{pmatrix}.
\end{align*} $$

Note that unlike numbers where is doesn't matter which way round they are when we multiplied (i.e., $1 \times 2 = 2 \times 1 = 2$) this is **not** the case with matrices. For example, lets calculate $BA$

$$ \begin{align*}
    BA &=
    \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} =
    \begin{pmatrix}
        (5, 6) \cdot (1, 3) & (5, 6) \cdot (2, 4) \\
        (7, 8) \cdot (1, 3) & (7, 8) \cdot (2, 4)
    \end{pmatrix} \\
    &=
    \begin{pmatrix} 5 + 18 & 10 + 24 \\ 7 + 24 & 14 + 32 \end{pmatrix} =
    \begin{pmatrix} 23 & 34 \\ 31 & 46 \end{pmatrix}.
\end{align*} $$

So based on these two examples we can see that $AB \neq BA$ which is very important when it comes to calculating [transformations](transformations-section).

```{important}
The glm operator `*` is used to multiply two or more matrices together. However, since glm uses column-major order to store matrices the order of the matrices is reversed so to calculate $AB$ we would use `B * A`.
```

Add the following code to your program

```cpp
std::cout << "A * B = " << glm::transpose(B * A) << "\n" << std::endl;
std::cout << "B * A = " << glm::transpose(A * B) << "\n" << std::endl;
```

Run the program and the following should be outputted to the console.

```text
A * B = 
[[   19.000,   22.000]
 [   43.000,   50.000]]

B * A = 
[[   23.000,   34.000]
 [   31.000,   46.000]]
```

(identity-matrix-section)=

### The identity matrix

The **identity matrix** is a special square matrix (a matrix with the same number of rows and columns) where all the elements are zero apart from the elements on the diagonal line from the top-left element down to the bottom-right element (known as the **main diagonal**). For example the $4\times 4$ identity matrix is

$$ I = \begin{pmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1
\end{pmatrix}.$$

The identity element is similar to the number 1 in that if we multiply any matrix by an identity matrix the result is unchanged. For example

$$ \begin{align*}
    I_2A = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} =
    \begin{pmatrix}
        (1,0) \cdot (1, 3) & (1,0) \cdot (2, 4) \\
        (0,1) \cdot (1,3) & (0,1) \cdot (2,4)
    \end{pmatrix} =
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}.
\end{align*} $$

The default constructor for a glm matrix object declares the matrix as an identity matrix. Add the following code to your program.

```cpp
// The identity matrix
printf("\nThe identity matrix:\n");
glm::mat2 I;
std::cout << "I = " << glm::transpose(I) << "\n" << std::endl;
```

Run your program and you should see the following outputted to the console.

```text
The identity matrix:
I = 
[[    1.000,    0.000,    0.000,    0.000]
 [    0.000,    1.000,    0.000,    0.000]
 [    0.000,    0.000,    1.000,    0.000]
 [    0.000,    0.000,    0.000,    1.000]]
```

(inverse-matrix-section)=

### Inverse matrices

Whilst matrix multiplication is defined for certain matrices there is no way of dividing one matrix by another. However, for certain square matrices we can calculate an **inverse matrix** that performs a similar function to divide. Consider the division of two numbers, 4 and 2 say. If we wanted to divide 4 by two we could write

$$ \frac{8}{2} = 4. $$

We could also write this division as the multiplication of $\dfrac{1}{2}$ and 8

$$ \frac{1}{2} \times 8 = 4.$$

Here we have shown that $\frac{1}{2}$ is the **multiplicative inverse** of 2. A multiplicative inverse of a number $x$ is denoted as $x^{-1}$ and satisfies $x \times x^{-1} = 1$. The inverse of a matrix $A$ is denoted by $A^{-1}$ and satisfies $A^{-1} A = AA^{-1} = I$ where $I$ is the identity matrix. For example, the inverse of the matrix $A$ defined above

$$ A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, $$

is

$$ A^{-1} = \begin{pmatrix} -2 & 1 \\ 3/2 & -1/2 \end{pmatrix}. $$

We can check whether this is the inverse of $A$ by calculating $A^{-1}A$ (or $A A^{-1}$)

$$ \begin{align*}
    A^{-1} A &= 
    \begin{pmatrix} -2 & 1 \\ \frac{3}{2} & -\frac{1}{2} \end{pmatrix}
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \\
    &=
    \begin{pmatrix} 
        -2 \times 1 + 1 \times 3 & -2 \times 2 + 1 \times 4 \\ 
        \frac{3}{2} \times 1 + (-\frac{1}{2}) \times 3 & \frac{3}{2} \times 2 + (-\frac{1}{2}) \times 4
    \end{pmatrix} \\
    &= 
    \begin{pmatrix}
        -2 + 3 & -4 + 4 \\
        \frac{3}{2} - \frac{3}{2} & 3 - 2
    \end{pmatrix} \\
    &= \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}.
\end{align*} $$

The glm function `glm::inverse()` calculates the inverse of a matrix. To demonstrate this, add the following code to your program.

```cpp
// Inverse matrices
printf("\nInverse matrices:\n");
glm::mat2 invA = glm::inverse(A);
glm::mat2 invB = glm::inverse(B);
std::cout << "invA = " << glm::transpose(invA) << "\n" << std::endl;
std::cout << "invB = " << glm::transpose(invB) << "\n" << std::endl;
std::cout << "invA * A = " << glm::transpose(A * invA) << "\n" << std::endl;
std::cout << "invB * B = " << glm::transpose(B * invB) << "\n" << std::endl;
```

Run your program and the following should be outputted to the console.

```text
Inverse matrices:
invA = 
[[   -2.000,    1.000]
 [    1.500,   -0.500]]

invB = 
[[   -4.000,    3.000]
 [    3.500,   -2.500]]

invA * A = 
[[    1.000,    0.000]
 [    0.000,    1.000]]

invB * B = 
[[    1.000,    0.000]
 [    0.000,    1.000]]
```

---

(vectors-exercises)=

## Exercises

1. Three points have the co-ordinates $P = (5, 1, 3)$, $Q = (10, 7, 4)$ and $R = (0, 5, -3)$. Use pen and paper to calculate the following:

    (a) The vector $\mathbf{p}$ that points from P to Q;<br>
    (b) The vector $\mathbf{q}$ that points from Q to R;<br>
    (c) The vector $\mathbf{r}$ that points from R to P;<br>
    (d) The length of the vector $\mathbf{p}$;<br>
    (e) A unit vector that points in the direction of the vector $\mathbf{q}$;<br>
    (f) The dot product $\mathbf{p} \cdot \mathbf{q}$;<br>
    (g) The cross product $\mathbf{q} \times \mathbf{r}$.

2. The three matrices $A$, $B$ and $C$ are defined as

$$ \begin{align*}
    A &= \begin{pmatrix} -1 & 3 \\ 2 & -5 \end{pmatrix}, &
    B &= \begin{pmatrix} 0 & 2 \\ 7 & 1 \end{pmatrix}, &
    C &= \begin{pmatrix} 3 & 2 \\ -3 & -4 \end{pmatrix}.
\end{align*} $$

&emsp;&emsp; Use C++ code to output the following:

&emsp;&emsp; (a) $AB$;<br>
&emsp;&emsp; (b) $ABC$;<br>
&emsp;&emsp; (c) $CBA$;<br>
&emsp;&emsp; (d) $A^\mathsf{T}B$;<br>
&emsp;&emsp; (f) $A^{-1}$.