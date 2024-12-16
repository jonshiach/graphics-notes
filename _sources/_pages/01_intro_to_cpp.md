(intro-to-cpp-section)=

# Introduction to C++

In this first lab we will be introducing/revisiting the fundamentals of the C++ language. C++ (pronounced "C-plus-plus") is a general purpose high performance programming language developed by Bjarne Stroustrup in 1979. It's an extension of the C programming language with added classes (the original name for C++ was "C with classes") so it shares the same syntax as C. It is also similar to Java so it won't be too difficult to make the switch from Java to C++.

In this semester we will be using OpenGL to create graphics applications. OpenGL uses C++ so its important you are comfortable with the syntax and the use of classes.

## IDEs

A C++ program is simply a set of plain text files that we instruct a compiler to convert to machine code and produce an executable. As long as you have installed the compiler and you have a text editor program you get program away to your hearts content. However, as your programs start to become increasingly sophisticated and you experience syntax errors and bugs, you will start to yearn for a better way. Fortunately there is and we can use an Integrated Development Environment (IDE).

An IDE provides a way of writing and organising your code files as well as a number of useful tools for debugging and organising your code projects. There are a number of IDEs available for working with C++ but we will look at the most common ones for Windows and macOS which are Visual Studio and Xcode respectively (I haven't covered Linux here but I figure if you prefer to work with Linux you are able to find a suitable IDE yourself).

---

### Visual Studio (Windows)

The latest version of Visual Studio can be installed via the App Store and this has been installed on PCs in the Dalton Building.

1. Open **Visual Studio** and click on 'Create a new project' (or File > New > New Project if you are already in Visual Studio). Select **Empty Project** and click on **Next**.

2. Give your project a suitable name like `Lab01_Intro_to_cpp`, select a directory in your OneDrive area and click on **Create**.
   This will create a folder with the name of your project within which there will be a file with the extension `.sln` (along with some other files). This is your project file and double clicking on this will open your project in Visual Studio.

3. We need to add a file which will contain code to our project. Right-click on **Source Files** in the Solution Explorer and **Add > New Item...** Make sure **C++ File (.cpp)** is highlighted, give the file a suitable name like `main.cpp` and click **Add**.

### Xcode (macOS)

The latest version of Xcode can be installed via the Mac App Store.

1. Open Xcode and click on **Create a new Xcode project** (or if you are already in Xcode click File > New > Project or press ⇧⌘N), choose **Command Line Tool** and click **Next**.

2. Give your project a suitable name like `Lab01_Intro_to_cpp` and click **Next**, select a directory in your OneDrive area and click on **Create**.

    This will create a folder with the name of your project within which there will be a file with the extension `.xcodeproj`. This is your project file and double clicking on this will open your project in Xcode.

3. Xcode has already given you a `main.cpp` file with a basic hello world example program.

---

## C++ basics

### hello world

We will start with the classic hello world example. In your **.cpp** source file, enter the following code.

```cpp
// Lab01 - Introduction to C++

#include <iostream>

int main() 
{
    std::cout << "hello world\n" << std::endl;
    return 0;
}
```

Compile and run the code by pressing the F5 (Visual Studio) key or ⌘R in Xcode. If you do not have any syntax errors a command window should appear with the following output.

```text
hello world
```

Lets run through the code and see what each line does

| <div style="width:250px">Code</div> | Explanation |
|:--|:--|
|`// Lab01 - Introduction to C++` | Any text between `//` and the end of the current line is a comment and is ignored by the compiler. For multiline comments, any text between ``/*`` and `*/` is considered a comment. |
| `#include <iostream>` | Imports the `iostream` library allowing us to input and output data to the terminal. |
| `int main() {}` | Defines a [function](functions-section) called `main` which has no inputs and will output an integer value. All C++ programs must contain a function called `main` which is the designated entry point to a program. |
| `std::cout` | Calls the `cout` (pronounced "see-out") object from the `iostream` library. This is used to output text. |
| `<< "hello world\n"` | Sends the text string `hello world` to the `cout` object for printing. `\n`is the newline character which inserts a newline. |
| `<< std::endl;` | Sends the end line character to the `cout` object so the line is printed. Note that every C++ statement must end in a semi-colon `;` (get used to doing this). |
| `return 0;` | Returns the integer `0`. This is because in the function definition we specified that the function `main` would return a `0`. The convention is that a `0` is returned if the program has executed successfully and a `1` is returned if not. |

### Variables

A variable is a portion of memory used to store a value. C++ uses the following types of variables.

| Type | Explanation |
|:---- |:------------|
| `int` | integers (whole numbers), e.g., 1, -2, 3 |
| `unsigned int` | positive integers, e.g., 1, 2, 3 |
| `float` | floating point numbers, e.g., 1.23. |
| `char` | single character, e.g., 'a' (character values are surrounded by single quotes). |
| `string` | text consisting of multiple characters, e.g., "hello world" (strings are surrounded by double quotes). |
| `bool` | Boolean values, e.g., true or false. |

A variable must be identified by a unique names which are called **identifiers**. An identifier can be a sequence of one or more letters, digits and underscores but must begin with a character and cannot contain spaces, punctuation marks and symbols. As long as you don't use an identifier that conflicts with a C++ keyword (e.g., `char`) you are free to choose whatever identifier you wish. It is good practice to use descriptive identifiers, e.g., `position`, and where an identifier contains multiple words is it standard practice for the first letter of each additional word to be an uppercase character, e.g., `framesPerSecond`.

Let's write a simple program which converts an angle from degrees to radians (a <a href="https://en.wikipedia.org/wiki/Radian" target="_blank">radian</a> is an angle measure where 1 radian is the angle subtended at the centre of a circle by an arc equal to the radius (it is the preferred unit of measurement when working with angles). Add the following code to your program.

```cpp
// Degrees to radians conversion
float angleInDegrees = 45.0f;
float angleInRadians;
float pi = 3.1415927f;

angleInRadians = angleInDegrees * pi / 180.0f;

// Output result
std::cout << angleInDegrees << " degrees is equal to "
          << angleInRadians << " radians." << std::endl;
```

Output:

```text
45 degrees is equal to 0.785398 radians.
```

When working with variables we first need to define the variable types. For example `float angleInDegrees;` defined a variable with the identifier `angleInDegrees` as a float. We could then store the value inputted by the user into this variable using the `std::cin >>` command.

````{note}
When declaring float variables we should use the syntax `1.0f` instead of `1`. For example

```cpp
float myVariable = 1.0f;
```

This is because is we were to use `float myVariable = 1;` the compiler would need to generate extra code to convert from an integer value to a floating point value.
````

### If statements

The if-elseif-else statement in C++ uses the syntax

```cpp
if (condition1) 
{
    // code to be executed if condition1 is true
} 
else if (condition2) 
{
    // code to be executed if condition1 is false and condition2 is true
} 
else
{
    // code to be executed if both condition1 and condition2 are false
}
```

Let add the following code to our program to determine whether an angle is acute ($<90^\circ$) or obtuse ($\geq 90^\circ$).

```cpp
// Determine whether it is acute or obtuse
std::cout << "\nIf statements\n-------------" << std::endl;
std::cout << angleInDegrees << " degrees is an ";

if (angleInDegrees < 90)
{
  std::cout << "acute angle." << std::endl;
}
else
{
  std::cout << "obtuse angle." << std::endl;
}
```

Output:

```text
If statements
-------------
45 degrees is an acute angle.
```

### For loop

A for loop is used to repeat a set of commands when we know beforehand how many times we want it repeating. The C++ syntax for a for loop is as follows.

```cpp
for (before statement ; condition ; after statement) 
{
    // block of code to be executed
}
```

The `before statement` contains code to be executed before the for loop, the `condition` is a logical check to see whether code within the for loop is executed and the `after statement` is executed after the code within the for loop.

Lets add a for loop to our program to output the first 10 powers of 2.

```cpp
// Output the first 10 powers of 2
std::cout << "\nFor loop\n--------" << std::endl;
int powerOfTwo = 1;

for (int i = 0; i < 10; i++)
{
  powerOfTwo *= 2;
  std::cout << "2^" << i + 1 << " = " << powerOfTwo << std::endl;
}
```

Output:

```text
For loop
--------
2^1 = 2
2^2 = 4
2^3 = 8
2^4 = 16
2^5 = 32
2^6 = 64
2^7 = 128
2^8 = 256
2^9 = 512
2^10 = 1024
```

### While loop

A while loop is used to repeat a block of code as long as a specified condition(s) is reached and used when we do not know how many times a block of code is repeated (if we did a for loop would be used). The C++ syntax for a while loop is as follows.

```cpp
while (condition) 
{
    // block of code to be executed
}
```

Lets add a while loop to our program calculate how many times the following expression is calculated until we get $n = 1$ (known as the <a href="https://en.wikipedia.org/wiki/Collatz_conjecture" target="_blank">Collatz conjecture</a>).

$$ n = \begin{cases} n / 2, & \text{if $n$ is even}, \\ 3n + 1, & \text{if $n$ is odd}.\end{cases} $$

```cpp
 // Count the number of steps the Collatz sequence takes for n = 10 to reach 1
int n, step;
n = 10;
step = 0;
std::cout << "\nWhile loop\n----------\n" << n;

while (n > 1)
{
  if (n % 2 == 0)
  {
      n /= 2;
  }
  else
  {
      n = 3 * n + 1;
  }

  step++;
  std::cout << " -> " << n;
}

std::cout << "\n\nThe Collatz sequence took " << step << " steps to reach 1." << std::endl;
```

Note the `x % y` operator returns the remainder when `x` is divided by `y` so `n % 2` is 0 when `n` is an even number or 1 when `n` is an odd number.

Output:

```text
While loop
----------
10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1

The Collatz sequence took 6 steps to reach 1.
```

---

(arrays-section)= 

### Arrays

An **array** is a collection of multiple values of the same type that can be stored in a single variable. For example, we could store the co-ordinates of multiple points in an array and access all of the co-ordinates at once instead of creating separate variables for each one. The values of an array are stored in consecutive memory locations. The C++ syntax for declaring an array is to use square brackets after the array name, the values of each element in the array is then written in curly brackets. For example, define an array called `indices` with the following.

```cpp
// Arrays
float vertices[] = 
{
    -0.5f, -0.5f, 0.0f,
     0.5f, -0.5f, 0.0f, 
     0.0f,  0.5f, 0.0f
};
```

To access individual **elements** in an array we specify the **index** which is a positive integer value where the first element has the index 0, the second has the index 1 and so on. For example, add the following code to your program to print the elements of the `vertices` array.

```cpp
std::cout << "\nArrays\n------" << std::endl;

for (int i = 0; i < 9; i++)
{
  std::cout << "vertices[" << i << "] = " << vertices[i] << std::endl;
}
```

Output:

```text
Arrays
------
vertices[0] = -0.5
vertices[1] = -0.5
vertices[2] = 0
vertices[3] = 0.5
vertices[4] = -0.5
vertices[5] = 0
vertices[6] = 0
vertices[7] = 0.5
vertices[8] = 0
```

The size of the memory used to store an array can be determined using the `sizeof` command. Add the following to your program to output the number of bytes used to story the `vertices` array.

```cpp
std::cout << "\nsize of vertices = " << sizeof(vertices) << std::endl;
```

Output:

```text
size of vertices = 36
```

So 36 bytes are used to store the `vertices` array. We can use the `sizeof` command to return the number of bytes used to store different variable types, so a useful way to determine the number of elements in an array is to divide the memory used to store the array by the memory used for each element. For example, add the following to your program.

```cpp
std::cout << "\nnumber of elements = " << sizeof(vertices) / sizeof(float) << std::endl;
```

Output:

```text
number of elements = 9
```

---

(functions-section)=

## Functions

A **function** is a block of code that is used to perform a (usually) single action. They are useful for when we need to use similar code multiple times, instead of writing the code each time, we can define a function just once and call it to perform the action. You've already declared the `main()` function which all C++ programs must have so lets add another function that raises a floating point number to a power. Add the following code to the top of your program (before the `main()` function is declared).

```cpp
float power(const float x, const int y)
{
    float xPowerY = 1.0f;
    for (int i = 0; i < y; i++)
    {
        xPowerY *= x;
    }
    return xPowerY;
}
```

```{important}
The C++ compiler reads source code from top to bottom so functions that are defined in the `main.cpp` file need to appear above the `main()` function.
```

Here we have declared the function called `power()` that takes in inputs of a floating point variable `x` and an integer variable `y` and outputs a floating point variable. The values of our inputs will not change during the execution of the function so we specify them as constants using the `const` keyword which makes the compiled code more efficient. We can call the function to calculate $\text{2}^\text{10}$ by adding the following inside the `main()` function.

```cpp
// Call the power function
float twoPowerTen = power(2.0f, 10);

std::cout << "\nFunctions\n---------" << std::endl;
std::cout << "2^10 = " << twoPowerTen << std::endl;
```

Output:

```text
Functions
---------
2^10 = 1024
```

### Function parameters

A function **parameter** is information that is passed into a function, for example, in our function above we passed in the parameters `x` and `y`. The code within a function only knows about the information passed into it via its input parameters and any **global variables** that are declared outside of all functions. Lets write a function that converts an angle in degrees to radians

```cpp
float radians(const float angle)
{
    return angle * pi / 180.0f;
}
```

Here our function called `radians()` converts the float parameter `angle` to radians by multiplying it by $\pi / 180$ and returns it. If you attempt to compile your program you will get a compiler error that `pi` is undefined. This is because `pi` is a **local variable** for the `main()` function. We can correct this using the following:

- declare `pi` to be a local variable within the `radians` function (preferred if we are unlikely to be using `pi` elsewhere in the program);
- declare `pi` to be a global variable outside of all functions (preferred if `pi` is likely to be used elsewhere in the program);
- delcare `pi` to be a parameter of the `radians` function.

Fix your program by defining `pi` to be a global variable so that it compiles. Call your function using the following code.

```cpp
// Call the radians function
float angle = angleInDegrees;
angle = radians(angle);

std::cout << "\n" << angleInDegrees << " degrees is equal to "<< angle << " radians." << std::endl;
```

### Pass by reference

When we want a function to change the value of the parameters that are passed to the function we can pass a **reference** to the function. This is done using an ampersand `&` before the name of the parameter. Change your `radians` function above to the following.

```cpp
void radians(float &angle)
{
    angle *= pi / 180;
}
```

Here we have passed the reference to the `angle` variable (the memory address of the variable) so the code within the function changes its value. We do not need to return anything from the function so we remove the `return` command and change the output type of the function to `void`. We now need to change how we call the `radians()` function.

```cpp
// Call the radians function
float angle = angleInDegrees;
radians(angle);

std::cout << "\n" << angleInDegrees << " degrees is equal to "<< angle << " radians." << std::endl;
```

---

(oop-section)=
## Object orientated programming

The main difference between C++ and its predecessor C is that C++ has **classes** which allow us to use <a href="https://en.wikipedia.org/wiki/Object-oriented_programming" target="_blank">**Object Orientated Programming (OOP)**</a>. Procedural programming requires use to write code that performs operations on data whereas object orientated programming allows us to create objects that include both data and code. Object orientated programming makes code easier to write and modify and is often faster than procedural programming.

### Classes/objects

A **class** defines the **attributes** (like variables) and **methods** (like functions) that the objects within the class will possess. For example, lets create `Car` class which has the attributes for the `make`, `model`, `year` and `speed` of a car. The methods that apply to objects in our class may include `accelerate()`, `brake()` etc.

Add the following code to your program outside of any functions.

```cpp
class Car {
public:
    std::string make;
    std::string model;
    int year;
    float speed = 0.0f;
};
```

|  <div style="width:150px">Code</div> | Explanation |
|:--|:--|
| `class Car` | Keyword used to create the class `Car`. |
| `public:` | An **access specifier** that specifies which attributes and methods can be accessed outside of the class. |
| `std::string make;` | Defines the attribute `make` which is a string. The other attributes are the string `model`, the integer `year` and the floating point number `speed` which is initially set to zero for any new object which is created. |

We can then create an object from our `Car` class and set its attributes. Lets create an object called `delorean` for a 1981 DeLorean DMC-12. In your `main()` function add the following code.

```cpp
// Define car object
Car delorean;
delorean.make = "Delorean";
delorean.model = "DMC-12";
delorean.year = 1981;
```

Here to create the object we specified the class name and the name of our object, e.g., `Car delorean;`. Then we define the car attributes using the name of the object followed by the name of the attribute, e.g., `delorean.make`.

### Class methods

The methods for a class a functions that the objects in the class share. At the moment we have created a Car object but don't have a way of seeing what the make, model or year of the object are. Lets create a method to print out the attributes. Inside the Car class definition add the following code.

```cpp
// Methods
void outputDetails();
```

This declares a method called `outputDetails()` which does not have any inputs. To define the method itself we use the syntax

```text
<return type> <class name> :: <method name>()
{
    // commands
}
```

So to define the `outputDetails()` method add the following code outside of the Car class.

```cpp
void Car::outputDetails()
{
    std::cout << "\nMake: " << make
              << "\nModel: " << model
              << "\nYear: " << year << std::endl;
}
```

The `Car::` bit tells the compiler that this method belongs to the `Car` class. We could define the method inside of the class where we would not need `Car::` but this is not recommended practice.

To call a method we use the syntax `<object name> . <method name>(<inputs>)`. We can now print the details of the car object using the following code.

```cpp
std::cout << "\nClasses\n-------" << std::endl;
delorean.outputDetails();
```

Output:

```text
Make: DeLorean
Model: DMC-12
Year: 1981
```

Our `outputDetails()` method does not require any inputs because the attributes are known to all objects of the class. Lets define a method for accelerating the car which has an input argument for the amount of acceleration. Add the following to your Car class.

```cpp
void accelerate(const float);
```

Now define the method.

```cpp
void Car::accelerate(const float increment)
{
    speed = +increment;
    std::cout << "\nThe car has accelerated to " << speed << " mph." << std::endl;
}
```

Note that we do not have to give the name of the input in the method declaration (some people choose to do so to help with the readability of the code). Now we have created the `acceleration()` method lets accelerate our car to 88 mph.

```cpp
// Call accelerate method
delorean.accelerate(88.0f);
```

Output

```text
The car has accelerated to 88 mph.
```

### Constructors

A **constructor** is a special method that is automatically called when an object of a class is created. A constructor has the same name as that of the class, so for our `Car` class we declare the constructor using `Car();`. Now lets define the constructor so that a message is printed to the terminal.

```cpp
Car::Car() 
{
    std::cout << "\nCar object created" << std::endl;
}
```

When we create our `delorean` object the following is outputted

```text
Car object created
```

Constructors are more useful when we use parameters to set the values of the class attributes. Modify the constructor declaration to include the parameters

```cpp
Car(const std::string, const std::string, const int);
```

and modify the constructor definition so that the attributes are specified.

```cpp
Car::Car(const std::string makeInput, const std::string modelInput, const int yearInput)
{
    make = makeInput;
    model = modelInput;
    year = yearInput;
    std::cout << "\nCar object created" << std::endl;
}
```

Now we can define the object attributes by creating the object using the following code.

```cpp
Car delorean("DeLorean", "DMC-12", 1981);
```

### Static member functions

A **static member function** is a function that belongs to a class rather than an instance of the class. Static member functions are useful because we can call them without needing an object of that class. Static member functions can be declared simply by prepending the keyword `static` to the function declaration.

Let's say we want to define a function in the `Car` class that converts speed from miles per hour to kilometers per hour. We declare a static member function in the class

```cpp
static float mph2kph(const float);
```

and then define the function outside of the `Car` class

```cpp
float Car::mph2kph(const float speed)
{
    return speed * 1.60934f;
}
```

We can now convert from miles per hour to kilometers per hour without needing to have a `Car` object declared. If Back to the Future had been set in Europe what would the speed be required for time travel? Let's call our static member function `mph2kph()` to find out.

```cpp
// Convert speed from mph to kph
std::cout << "\n" << 88 << " mph is equivalent to " << Car::mph2kph(88.0f) << " kph." << std::endl;
```

Which gives the output

```text
88 mph is equivalent to 141.622 kph.
```

"141.622 kilometers per hour!" doesn't quite have the same ring to it as "88 miles per hour!" does it.

### Header files

When dealing with larger programs and larger classes it becomes necessary to split the code over multiple files. Classes are declared in a **header file** which usually have the extension `.hpp` (this isn't a requirement but has become standard practice in C++ programming). The methods of a class are then defined in a separate source files which have the extension `.cpp`.

Lets create a header file for our `Car` class.

---
#### Visual Studio

1. Right-click on the project name in the **Solution Explorer** and the select **Add > New Item...** (or press Ctrl+Shift+A).
2. Select **C++ Class** and click on **Add**.
3. Enter **Car** in the **Class name** field and change the **.h file** field to `Car.hpp` (we could have left this as `Car.h` but I've always used `.hpp` as the file extension for header files).
4. This creates the header file `Car.hpp` in the **Header files** filter and the source file `Car.cpp` in the **Source Files** filter.

The header file we have created contains the following code.

```cpp
#pragma once
class Car
{
};
```

The command `#pragma once` is used to prevent multiple header files of the same name from being included in the compilation of the program.

#### Xcode

1. Click on **File > New > File...** (or just press ⌘N) and select **C++ File**, make sure the checkbox next to **Also create header file** is selected and click on **Next**.
2. Enter `Car` in the **Save As** field and click on **Next**, make sure the folder where your `main.cpp` is selected and click on **Create**.
3. This creates the header file `Car.hpp` and the code file `Car.cpp` in your Xcode project.

The header file we have created contains the following code. Xcode uses <a href="https://en.wikipedia.org/wiki/Include_guard" target="_blank">include guards</a> which perform the same function as `#pragma once`.

```cpp
#ifndef Car_hpp
#define Car_hpp

#include <stdio.h>

#endif /* Car_hpp */
```
---

Cut and paste the `Car` class from `main.cpp` into our `Car.hpp` header file so that it looks like the following.

```cpp
#pragma once

#include <iostream>

class Car {

public:
    std::string make;
    std::string model;
    int year;
    float speed = 0.0f;

    // Constructor
    Car(const std::string, const std::string, const int);

    // Methods
    void outputDetails();
    void accelerate(const float);
    static float mph2kph(const float);
};
```

Note that we also need the `#include <iostream>` library so we can use strings and input/output commands. The methods are defined in the `Car.cpp` source file. Cut and paste your `Car` class methods from `main.cpp` and so it looks like the following.

```cpp
#include <iostream>
#include "Car.hpp"

Car::Car(const std::string makeInput, const std::string modelInput, const int yearInput)
{
    make = makeInput;
    model = modelInput;
    year = yearInput;
    std::cout << "\nCar object created" << std::endl;
}

void Car::outputDetails()
{
    std::cout << "\nMake: " << make
              << "\nModel: " << model
              << "\nYear: " << year << std::endl;
}

void Car::accelerate(const float increment)
{
    speed = +increment;
    std::cout << "\nThe car has accelerated to " << speed << " mph." << std::endl;
}

float Car::mph2kph(const float speed)
{
    return speed * 1.60934f;
}

```

Here we have also included the `iostream` library as well as our `Car.hpp` header file. We also need to make sure we include the `Car.hpp` header file in `main.cpp`. Compile and run the program to check everything works ok.

---

## Exercises

1. You are tasked with writing a C++ program to help the university store students' details (name, ID number, course, marks etc.). Create a class called `Student` in a header file which has the following attributes:

   - first name - string;
   - last name - string;
   - ID number - integer;
   - course - string;
   - level - integer;
   - marks - 12-element integer array (marks for four units over the three years);

2. Create a constructor for your class with parameters for creating an object. Use your constructor to create an object with the following attribute values.

    - first name: Ellie
    - last name: Williams
    - ID number: 12345678
    - course: Computer Science
    - level: 5

3. Create a method called `addLevelMarks()` which uses input parameters of a 4-element integer array containing unit marks and an integer variable containing the level and places the unit marks into the correct elements of the `marks` array for the object. For example, if the level 5 unit marks are `40, 50, 60, 70` then `marks[4] = 40`, `marks[5] = 50` etc. Use your method to updates Ellie's marks with the following.

    - level 4 marks: 55, 60, 72, 64;
    - level 5 marks: 68, 62, 74, 70.

4. Create a method called `outputMarks()` which outputs unit marks for each level in which a student has been enrolled, i.e.,

```text
Ellie Williams (12345678)

Level 4: 55, 60, 72, 64
Level 5: 68, 62, 74, 70
```

5. Create a static member function called `levelAverage()` which takes in inputs of a 12-element integer array containing unit marks and an integer specifying the level and returns the average mark for that level.

6. A student's degree classification is determined by calculating a weighted average of the level 5 and 6 marks such that

$$\textsf{weighted average} = 0.25 \times \textsf{level 5 average} + 0.75 \times \textsf{level 6 average},$$ 

and then checked against the table below. 

| weighted average | Degree classification |
|:--:|:--|
| >= 70 | First-class |
| >= 60 | Upper second-class |
| >= 50 | Lower second-class |
| >= 40 | Third-class |
| < 40 | Fail |

Create a method called `classification()` which uses your static member function from exercise 5 to calculate the weighted average for a student object and outputs the degree classification and the weighted average to the nearest integer.

```
Classification: xxxx (weighted average = xx).
```

7. Ellie has evaded the infected and survived another year. In level 6 they achieved marks of 72, 68, 76 and 65 (it is impressive that the university it still functioning during a world wide cordyceps pandemic). Update the object and output their level 4, 5 and 6 marks as well as their degree classification, i.e.,

```
Ellie Williams (12345678)

Level 4: 55, 60, 72, 64
Level 5: 68, 62, 74, 70
Level 6: 72, 68, 76, 65

Classification: xxxx (weighted average = xx).
```

## Source code

The source code for this lab, including the exercise solutions, can be downloaded using the links below.

- Main source code file: [main.cpp](../code/Lab01/main.cpp)
- Car class: [Car.hpp](../code/Lab01/Car.hpp), [Car.cpp](../code/Lab01/Car.cpp)
- Student class: [Student.hpp](../code/Lab01/Student.hpp), [Student.cpp](../code/Lab01/Student.cpp)