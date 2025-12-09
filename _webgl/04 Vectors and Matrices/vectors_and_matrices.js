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
console.log('Lab 4 - Vectors and Matrices\n----------------------------');

// Define vector objects
console.log('\nVectors\n-------');
const a = new Vec3(3, 0, 4)
const b = new Vec3(1, 2, 3);
console.log("a = ", a.print());
console.log("b = ", b.print());

// Arithmetic operations on vectors
console.log('\nArithmetic operations on vectors\n--------------------------------');
console.log("a + b =", a.add(b).print());
console.log("a - b =", a.subtract(b).print());
console.log("2a    =", a.scale(2).print());
console.log("b/3   =", b.scale(1/3).print());

// Vector magnitude and normalization
console.log("\nVector magnitude and normalization\n----------------------------------");
console.log("length(a)    =",a.length());
console.log("length(b)    =",b.length());

const aHat = a.normalize();
const bHat = b.normalize();
console.log("aHat         =", aHat.print());
console.log("bHat         =", bHat.print());
console.log("length(aHat) =", aHat.length());
console.log("length(bHat) =", bHat.length());

// Dot and cross products
console.log("\nDot and cross products\n----------------------");
console.log("a . b       =", a.dot(b));

const aCrossB = a.cross(b);
console.log("a x b       =", aCrossB.print());
console.log("a . (a x b) =", a.dot(aCrossB));
console.log("b . (a x b) =", b.dot(aCrossB));

// Matrices
console.log("\nMatrices\n--------");
const A = new Mat4().set(
   1,  2,  3,  4, 
   5,  6,  7,  8, 
   9, 10, 11, 12,
  13, 14, 15, 16
);
console.log("A =\n", A.print());
console.log("\nA^T =\n", A.transpose().print());

const B = new Mat4().set(
  17, 18, 19, 20,
  21, 22, 23, 24, 
  25, 26, 27, 28,
  29, 30, 31, 32
);
console.log("\nB =\n", B.print());
console.log("\nAB =\n", A.multiply(B).print());
console.log("\nAB =\n", B.multiply(A).print());
