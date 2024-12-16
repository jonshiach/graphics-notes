---
author: Dr Jon Shiach
institute: Department of Computing and Mathematics
title: Vectors and Matrices
subtitle: 6G5Z0025 Computer Graphics
date: Week 4
theme: simple
---

## Vectors

A vector in is an object with length and direction

Vectors are written using boldface characters, e.g., $\mathbf{a}$, or underlined when handwritten, e.g., $\underline{a}$

In 3D space a vector is defined as a 3-tuple

$$\begin{align*} \mathbf{a} = (a_x, a_y, a_z) \end{align*} $$

where $a_x,a_y,a_z$ are the signed distances along the $x,y,z$ axes

<center>
    <!-- <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Vector.svg" width="600"/> -->
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Vector.svg" width="600"/>
</center>

## The GLM Library

The <a href="https://github.com/g-truc/glm" target="_blank">glm</a> library is a popular C++ mathematics library that is designed for use with OpenGL

3-element vectors are declared using the `glm::vec3` declaration

For example, to declare the vectors $\mathbf{a} = (3, 0, 4)$ and $\mathbf{b} = (1, 2, 3)$

```cpp
// Defining vectors
glm::vec3 a = glm::vec3(3.0f, 0.0f, 4.0f);
glm::vec3 b;
b[0] = 1.0f, b[1] = 2.0f, b[2] = 3.0f;

printf("Defining vectors:\n");
std::cout << "a = " << a << std::endl;
std::cout << "b = " << b << std::endl;
```

Output

```text
Defining vectors:
a = [    3.000,    0.000,    4.000]
b = [    1.000,    2.000,    3.000]
```

## Arithmetic Operations on Vectors

Given two matrices $\mathbf{a}$ and $\mathbf{b}$ and the scalar $k$ (a single number) the following arithmetic operations are defined

| Operation | Notation |
|:--|:--:|
| addition | $\mathbf{a} + \mathbf{b}$ |
| subtraction | $\mathbf{a} - \mathbf{b}$ |
| scalar multiplication | $k \mathbf{a}$ |
| scalar division | $\dfrac{\mathbf{a}}{k}$ |
| dot product | $\mathbf{a} \cdot \mathbf{b}$ |
| cross product | $\mathbf{a} \times \mathbf{b}$ |

## Vector addition and subtraction

Vector addition and subtraction of two vectors $\mathbf{a} = (a_x, a_y, a_z)$ and $\mathbf{b} = (b_x, b_y, b_z)$ is defined by

$$ \begin{align*}
    \mathbf{a} + \mathbf{b} &= (a_x + b_x, a_y + b_y, a_z + b_z), \\
    \mathbf{a} - \mathbf{b} &= (a_x - b_x, a_y - b_y, a_z - b_z), \\
\end{align*} $$

:::::::::::::: {.columns}
::: {.column width="40%"}

Addition
<center>
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Vector_addition.svg" width="300"/>
</center>

:::
::: {.column width="60%"}
Subtraction
<center>
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Vector_subtraction.svg" width="400"/>
</center>

:::
::::::::::::::

## Example

Given the vectors $\mathbf{a} = (3,0,4)$ and $\mathbf{b} = (1, 2, 3)$ calculate:  

1. &emsp; $\mathbf{a} + \mathbf{b}$
   
2. &emsp; $\mathbf{a} - \mathbf{b}$

. . .

**Solution**

1.

$$\mathbf{a} + \mathbf{b} = (3 + 1, 0 + 2, 4 + 3) = (4, 2, 7)$$

. . .

2.

$$\mathbf{a} - \mathbf{b} = (3 - 1, 0 - 2, 4 - 3) = (2, -2, 1)$$

## C++: vector addition and subtraction

The addition and subtraction of glm vectors is done using the standard `+` and `-` operators
```cpp
// Arithmetic operations on vectors
printf("\nArithmetic operations on vectors:\n");
std::cout << "a + b = " << a + b << std::endl;
std::cout << "a - b = " << a - b << std::endl;
```

Output

```text
Arithmetic operations on vectors:
a + b = [    4.000,    2.000,    7.000]
a - b = [    2.000,   -2.000,    1.000]
```

## Scalar multiplication

The multiplication of a vector $\mathbf{a} = (a_x, a_y, a_z)$ by a scalar $k$ is defined by

$$ \begin{align*}
    k \mathbf{a} &= (ka_x, ka_y, ka_z)
\end{align*} $$

Multiplying or dividing a vector by a positive scalar has the effect of scaling the length of the vector

<center>
<img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/main/_images/04_Vector_multiplication.svg" width="500"/>
</center>

## Example

Given the vectors $\mathbf{a} = (3,0,4)$ and $\mathbf{b} = (1, 2, 3)$ calculate:  

1. &emsp; $2\mathbf{a}$
   
2. &emsp; $\dfrac{\mathbf{b}}{3}$

. . .

**Solution**

1.

$$2\mathbf{a} = 2(3, 0, 4) = (6, 0, 8) $$

. . .

2.

$$\dfrac{\mathbf{b}}{3} = \frac{1}{3}(1, 2, 3) = \left( \frac{1}{3}, \frac{2}{3}, \frac{3}{3} \right) \approx (0.333, 0.667, 1)$$

## C++: scalar multiplication

Scalar multiplication and division is done using the standard `*` and `/` operators

```cpp
std::cout << "2a    = " << 2.0f * a << std::endl;
std::cout << "b / 3 = " << b / 3.0f << std::endl;
```

Output

```text
2a    = [    6.000,    0.000,    8.000]
b / 3 = [    0.333,    0.667,    1.000]
```

## Vector Magnitude

The **magnitude** of a vector $\mathbf{a} = (a_x, a_y, a_z)$ is denoted by $\|\mathbf{a}\|$ is the length from the tail of the vector to the head

<center>
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Vector_magnitude.svg" width="300" text-align="center"/>
</center>

The magnitude of a vector in 3D is calculated using an extension of Pythagoras' theorem

$$ \|\mathbf{a}\| = \sqrt{a_x^2 + a_y^2 + a_z^2}. $$

## Example

Calculate the magnitude of the vectors

1. &emsp; $\mathbf{a} = (3,0,4)$
   
2. $\mathbf{b} = (1, 2, 3)$

. . .

**Solution**

1.

$$\| \mathbf{a} \| = \sqrt{3^2 + 0^2 + 4^2} = \sqrt{9 + 0 + 16} = \sqrt{25} = 5$$

. . .

2.

$$\| \mathbf{b} \| = \sqrt{1^2 + 2^2 + 3^2} = \sqrt{1 + 4 + 9} = \sqrt{14} \approx 3.742$$

## C++: vector magnitude

The glm function `glm::length()` returns the magnitude (or length) of a glm vector

```cpp
// Vector length
printf("\nVector length:\n");
printf("length(a) = %0.3f\n", glm::length(a));
printf("length(b) = %0.3f\n", glm::length(b));
```

Output

```
Vector length:
length(a) = 5.000
length(b) = 3.742
```

## Unit Vectors

A **unit vector** is a vector that has a length of 1

We can **normalise** a vector by dividing by its magnitude to give a unit vector

$$ \hat{\mathbf{a}} = \frac{\mathbf{a}}{\|\mathbf{a}\|} $$

Note that a unit vector is denoted by $\hat{\mathbf{a}}$ and is said as *"a-hat"*

## Example

Calculate a unit vector that points in the same direction as $\mathbf{a} = (3, 0, 4)$
 
. . .

**Solution**

We know that $\| \mathbf{a} \| = 5$ so

$$ \hat{\mathbf{a}} = \dfrac{(3, 0, 4)}{5} = \left( \frac{3}{5}, 0, \frac{4}{5} \right) = (0.6, 0, 0.8)$$

. . .

Checking that $\hat{\mathbf{a}}$ is a unit vector

$$\| \hat{\mathbf{a}} \| = \sqrt{\frac{9}{25} + \frac{16}{25}} = \sqrt{\frac{25}{25}} = 1$$

## C++: normalising a vector

The glm function `glm::normalize()` normalises a vector

```cpp
// Normalising vectors
glm::vec3 aHat = glm::normalize(a);
std::cout << "aHat = " << aHat << std::endl;
printf("length(aHat) = %0.3f\n", glm::length(aHat));
```

Output

```
aHat = [    0.600,    0.000,    0.800]
length(aHat) = 1.000
```

## Multiplying vectors

Mathematically speaking the multiplication of two vectors is not defined

In computing it is useful to be able to multiply the individual elements of vectors which is done using the `*` operator

```cpp
std::cout << "a * b = " << a * b << std::endl;
```

Output

```text
a * b = [    3.000,    0.000,   12.000]
```

Which is equivalent to

$$(3, 0, 4) * (1, 2, 3) = (3 \times 1, 0 \times 2, 4 \times 3) = (3, 0, 12)$$

## The dot product

The dot product between two vectors $\mathbf{a} = (a_x, a_y, a_z)$ and $\mathbf{b} = (b_x, b_y, b_z)$ is denoted by $\mathbf{a} \cdot \mathbf{b}$ and returns a **scalar**

The dot product is calculated using

$$ \mathbf{a} \cdot \mathbf{b} = a_xb_x + a_yb_y + a_zb_z. $$

## Dot product: geometric interpretation

The dot product is related to the angle $\theta$ between the two vectors by

$$ \mathbf{a} \cdot \mathbf{b} = \|\mathbf{a}\| \|\mathbf{b}\| \cos(\theta). $$

<center>
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Dot_product.svg" width="200">
</center>

A useful result for graphics is that if $\theta=90^\circ$ then $\cos(\theta) = 0$ and 

$$ \mathbf{a} \cdot \mathbf{b} = 0$$

## Example

Given the two matrices $\mathbf{a} = (3,0,4)$ and $\mathbf{b} = (1, 2, 3)$, calculate $\mathbf{a} \cdot \mathbf{b}$

. . .

**Solution**

$$\begin{align*}
    \mathbf{a} \cdot \mathbf{b} &= (3, 0, 4) \cdot (1, 2, 3) \\
    &= 3 \times 1 + 2 \times 0 + 3 \times 4 \\
    &= 3 + 0 + 12\\
    & = 15
\end{align*} $$

## C++: the dot product

The glm function `glm::dot()` returns the dot product of two vectors

```cpp
// Dot and Cross products
printf("\nDot and cross products:\n");
printf("a . b = %0.3f\n", glm::dot(a, b));
```

Output
```text
Dot and cross products:
a . b = 15.000
```

## The Cross Product

The cross product between two vectors $\mathbf{a} = (a_x, a_y, a_z)$ and $\mathbf{b} = (b_x, b_y, b_z)$ is denoted by $\mathbf{a} \times \mathbf{b}$ and returns a **vector**

The cross product is calculated using

$$ \mathbf{a} \times \mathbf{b} = (a_yb_z - a_zb_y, a_zb_x - a_xb_z, a_xb_y - a_yb_x). $$

The $\mathbf{a} \times \mathbf{b}$ is perpendicular to both $\mathbf{a}$ and $\mathbf{b}$

<center>    
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_cross_product.svg" width=300>
</center>

## Example

Given the vectors $\mathbf{a} = (3,0,4)$ and $\mathbf{b} = (1, 2, 3)$, calculate $\mathbf{a} \times \mathbf{b}$ 

. . .

**Solution**

Using $\mathbf{a} \times \mathbf{b} = (a_yb_z - a_zb_y, a_zb_x - a_xb_z, a_xb_y - a_yb_x).$

$$ \begin{align*}
    \mathbf{a} \times \mathbf{b} &= (3, 0, 4) \times (1, 2, 3) \\
    &= (0 \times 3 - 4 \times 2, 4 \times 1 - 3 \times 3, 3 \times 2 - 0 \times 3) \\
    &= (-8, -5, 6).
\end{align*} $$

. . .

We can show that $\mathbf{a} \times \mathbf{b}$ is perpendicular to both $\mathbf{a}$ and $\mathbf{b}$

$$ \begin{align*}
    \mathbf{a} \cdot (\mathbf{a} \times \mathbf{b}) &= (3, 0, 4) \cdot (-8, -5, 6) = -24 + 0 + 24 = 0, \\
    \mathbf{b} \cdot (\mathbf{a} \times \mathbf{b}) &= (1, 2, 3) \cdot (-8, -5, 6) = - 8 - 10 + 18 = 0.
\end{align*} $$

## C++: the cross product

The glm function `glm::cross()` calculates the cross product of two vectors

```cpp
std::cout << "a x b = " << glm::cross(a, b) << std::endl;
printf("a . (a x b) = %0.3f\n", glm::dot(a, glm::cross(a, b)));
printf("b . (a x b) = %0.3f\n", glm::dot(b, glm::cross(a, b)));
```

Output

```text
a x b = [   -8.000,   -5.000,    6.000]
a . (a x b) = 0.000
b . (a x b) = 0.000
```

## Matrices

A matrix is a rectangular array of numbers.

$$ \begin{align*}
    A =
    \begin{pmatrix}
        a_{11} & a_{12} & \cdots & a_{1n} \\
        a_{21} & a_{22} & \cdots & a_{2n} \\
        \vdots & \vdots & \ddots & \vdots \\
        a_{m1} & a_{m2} & \cdots & a_{mn}
    \end{pmatrix}
\end{align*} $$

The elements of a matrix are indexed such that $a_{ij}$ is the element in row $i$ and column $j$ of the matrix $A$

We refer to the size of a matrix by $number\, of\, rows \times number\, of\, columns$, here $A$ is an $m \times n$ matrix

## C++: matrices

$2\times 2$ glm matrices are declared using `glm::mat2()`, so to declare the matrices

$$ \begin{align*}
    A &= \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, &
    B &= \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}.
\end{align*} $$

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

Output 

```text
Defining matrices:
A = 
[[    1.000,    3.000]
 [    2.000,    4.000]]

B = 
[[    5.000,    7.000]
 [    6.000,    8.000]]
```

. . .

But these aren't right

## Column-major

Linear memory is a contiguous block of addresses that can be sequentially accessed

Since matrices are 2D we have a choice whether to store the elements in the rows or columns in adjacent locations

Consider the $4 \times 4$ matrix

$$ \begin{align*}
    \begin{pmatrix}
        a & b & c & d \\
        e & f & g & h \\
        i & j & k & l \\
        m & n & o & p
    \end{pmatrix}
\end{align*} $$

**Column-major** order is where we store the elements column-by-column, i.e.,

<center>
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Column_major.svg" width="800">
</center>

## Row-major order

Alternatively, using **row-major** order we store the elements row-by-row, so the matrix

$$ \begin{align*}
    \begin{pmatrix}
        a & b & c & d \\
        e & f & g & h \\
        i & j & k & l \\
        m & n & o & p
    \end{pmatrix}
\end{align*} $$

will be stored as

<center>
    <img src="https://raw.githubusercontent.com/jonshiach/graphics-book/refs/heads/gh-pages/_images/04_Row_major.svg" width="800">
</center>

OpenGL uses column-major order so does glm. When we output a glm matrix it is outputed column-by-column, hence why our matrices didn't look right

## Matrix Transpose

The transpose of a matrix $A$ is denoted by $A^\mathsf{T}$ and is defined by swapping the rows and columns of $A$. 

For example, given the matrix $A$ 

$$ \begin{align*}
    A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix},
\end{align*} $$

then $A^\mathsf{T}$ is

$$ \begin{align*}
    A^\mathsf{T} = \begin{pmatrix} 1 & 3 \\ 2 & 4 \end{pmatrix}
\end{align*} $$

## C++: matrix transpose

The glm function `glm::transpose()` returns that transpose of a matrix

```cpp
std::cout << "A = " << glm::transpose(A) << "\n" << std::endl;
std::cout << "B = " << glm::transpose(B) << std::endl;
```

Output

```text
Defining matrices:
A = 
[[    1.000,    2.000]
 [    3.000,    4.000]]

B = 
[[    5.000,    6.000]
 [    7.000,    8.000]]
```

## Arithmetic operations on matrices

The arithmetic operations on matrices for addition and subtraction of two matrices and multiplying by a scalar are the same as for vectors

E.g., given the matrices

$$ \begin{align*}
    A &= \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, &
    B &= \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}.
\end{align*} $$

then

$$ \begin{align*}
    A + B &= 
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} +  
    \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix} = 
    \begin{pmatrix} 1 + 5 & 2 + 6 \\ 3 + 7 & 4 + 8 \end{pmatrix} 
    = 
    \begin{pmatrix} 6 & 8 \\ 10 & 12 \end{pmatrix}\\
    A - B &= 
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} -  
    \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix} 
    = 
    \begin{pmatrix} 1 - 5 & 2 - 6 \\ 3 - 7 & 4 - 8 \end{pmatrix} = 
    \begin{pmatrix} -4 & -4 \\ -4 & -4 \end{pmatrix} \\
    2A &= 2 \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}
    =
    \begin{pmatrix} 2 & 4 \\ 6 & 8 \end{pmatrix} \\
    \frac{A}{3} &= \frac{1}{3} 
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} 
    =
    \begin{pmatrix} \frac{1}{3} & \frac{2}{3} \\ 1 & \frac{4}{3} \end{pmatrix}
    \approx
    \begin{pmatrix} 0.333 & 0.667 \\ 1 & 1.333 \end{pmatrix}
\end{align*} $$

## C++: arithmetic operations on matrices

The addition, subtraction and multiplication and division of a matrix by a scalar is done using the standard `+`, `-`, `*` and `/` operators

```cpp
// Aritmetic operations on matrices
printf("\nArithmetic operations on matrices:\n");
std::cout << "A + B = " << glm::transpose(A + B) << "\n" << std::endl;
std::cout << "A - B = " << glm::transpose(A - B) << "\n" << std::endl;
std::cout << "2A    = " << glm::transpose(2.0f * A) << "\n" << std::endl;
std::cout << "A / 3 = " << glm::transpose(A / 3.0f) << "\n" << std::endl;
```

Output

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

## Matrix multiplication

If $A$ and $B$ are two matrices then the element in row $i$ and column $j$ of the matrix $AB$ is calculated using

$$ [AB]_{ij} = \mathbf{a}_i \cdot \mathbf{b}_j, $$

where $\mathbf{a}_i$ is the vector formed from row $i$ of $A$ and $\mathbf{b}_j$ is the vector formed from column $j$ of $B$

For example, given the matrices $A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$ and $B = \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}$

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
    \begin{pmatrix} 19 & 22 \\ 43 & 50 \end{pmatrix}
\end{align*} $$

## Non-commutativity of matrix multiplication

Unlike numbers where is doesn't matter which way round they are when we multiplied (i.e., $1 \times 2 = 2 \times 1 = 2$) this is **not** the case with matrices

For example, lets calculate $BA$

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
    \begin{pmatrix} 23 & 34 \\ 31 & 46 \end{pmatrix}
\end{align*} $$

So $AB \neq BA$

## C++: matrix multiplication

The glm operator `*` is used to multiply two or more matrices together.

Since glm uses column-major order to store matrices the order of the matrices is reversed so to calculate $AB$ we would use `B * A`

```cpp
std::cout << "A * B = " << glm::transpose(B * A) << "\n" << std::endl;
std::cout << "B * A = " << glm::transpose(A * B) << "\n" << std::endl;
```

Output

```text
A * B = 
[[   19.000,   22.000]
 [   43.000,   50.000]]

B * A = 
[[   23.000,   34.000]
 [   31.000,   46.000]]
```

## The Identity Matrix

The identity matrix is a special square matrix where all the elements are zero apart from the elements on the diagonal line from the top-left element down to the bottom-right element

For example the $4\times 4$ identity matrix is

$$ I = \begin{pmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1
\end{pmatrix}$$

The identity element is similar to the number 1 in that if we multiply any matrix by an identity matrix the result is unchanged

$$ \begin{align*}
    I_2A = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} =
    \begin{pmatrix}
        (1,0) \cdot (1, 3) & (1,0) \cdot (2, 4) \\
        (0,1) \cdot (1,3) & (0,1) \cdot (2,4)
    \end{pmatrix} =
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}
\end{align*} $$

## C++: the identity matrix

The default constructor for a glm matrix object declares the matrix as an identity matrix

```cpp
// The identity matrix
printf("\nThe identity matrix:\n");
glm::mat2 I;
std::cout << "I = " << glm::transpose(I) << "\n" << std::endl;
```

Output

```text
The identity matrix:
I = 
[[    1.000,    0.000,    0.000,    0.000]
 [    0.000,    1.000,    0.000,    0.000]
 [    0.000,    0.000,    1.000,    0.000]
 [    0.000,    0.000,    0.000,    1.000]]
```

## Inverse matrix

The inverse of a matrix $A$ is denoted by $A^{-1}$ and satisfies $A^{-1} A = AA^{-1} = I$ where $I$ is the identity matrix

The inverse of the matrix $A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$ is

$$ A^{-1} = \begin{pmatrix} -2 & 1 \\ \frac{3}{2} & -\frac{1}{2} \end{pmatrix}. $$

We can check whether this is the inverse of $A$ by calculating $A^{-1}A$ (or $A A^{-1}$)

$$ \begin{align*}
    A^{-1} A &= 
    \begin{pmatrix} -2 & 1 \\ \frac{3}{2} & -\frac{1}{2} \end{pmatrix}
    \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} 
    =
    \begin{pmatrix} (-2, 1) \cdot (1, 3) & (-2, 1) \cdot (2, 4) \\ (\frac{3}{2}, -\frac{1}{2}) \cdot (1, 3) & (\frac{3}{2}, -\frac{1}{2}) \cdot (2, 4) \end{pmatrix}
    \\
    &= 
    \begin{pmatrix}
        -2 + 3 & -4 + 4 \\
        \frac{3}{2} - \frac{3}{2} & 3 - 2
    \end{pmatrix} 
    = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} = I
\end{align*} $$
 
## C++: inverse matrix

The glm function `glm::inverse()` returns the inverse of a matrix

```{.cpp}
// Inverse matrices
printf("\nInverse matrices:\n");
glm::mat2 invA = glm::inverse(A);
glm::mat2 invB = glm::inverse(B);
std::cout << "invA = " << glm::transpose(invA) << "\n" << std::endl;
std::cout << "invB = " << glm::transpose(invB) << "\n" << std::endl;
std::cout << "invA * A = " << glm::transpose(A * invA) << "\n" << std::endl;
std::cout << "invB * B = " << glm::transpose(B * invB) << "\n" << std::endl;
```

Output

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