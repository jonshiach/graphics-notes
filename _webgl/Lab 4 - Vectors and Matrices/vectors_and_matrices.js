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

// Vectors
console.log('\nVectors\n-------');

const a = [3, 0, 4];
const b = [1, 2, 3];
console.log("a = " + printVector(a));
console.log("b = " + printVector(b));

// Arithmetic operations on vectors
console.log('\nArithmetic operations on vectors\n--------------------------------');
console.log("a + b =", printVector(addVector(a, b)));
console.log("a - b =", printVector(subtractVector(a, b)));
console.log("2a    =", printVector(scaleVector(a, 2)));
console.log("b/3   =", printVector(scaleVector(b, 1/3)));

// Vector magnitude and normalization
console.log("\nVector magnitude and normalization\n----------------------------------");
console.log("length(a)    = " + length(a));
console.log("length(b)    = " + length(b));

const aHat = normalize(a);
const bHat = normalize(b);
console.log("aHat         = " + printVector(aHat));
console.log("bHat         = " + printVector(bHat));
console.log("length(aHat) = " + length(aHat));
console.log("length(bHat) = " + length(bHat));

// Dot and cross products
console.log("\nDot and cross products\n----------------------");
console.log("a . b = " +  dot(a, b));

const aCrossB = cross(a, b);
console.log("a x b = " + printVector(aCrossB));
console.log("a . (a x b) = " + dot(a, aCrossB));
console.log("b . (a x b) = " + dot(b, aCrossB));

// Matrices
console.log("\nMatrices\n--------");
const A = new Mat4().set([
   1,  2,  3,  4,
   5,  6,  7,  8,
   9, 10, 11, 12,
  13, 14, 15, 16
]);
console.log("A =\n" + A.print());

const AT = new Mat4().copy(A);
console.log("\nA^T =\n" + AT.transpose().print());
console.log("\nA =\n" + A.print());

const B = new Mat4().set([
  17, 18, 19, 20,
  21, 22, 23, 24,
  25, 26, 27, 28,
  29, 30, 31, 32
]);

const AB = new Mat4().copy(B).multiply(A);
console.log("\nB =\n" + B.print());
console.log("\nAB =\n" + AB.print());


const C = new Mat4().set([
  1, 3, 2, 1,
  1, 1, 2, 2,
  1, 3, 3, 2,
  3, 1, 3, 2
]);
const invC = new Mat4().copy(C).inverse();

console.log("\nC =\n" + C.print());
console.log("\ninv(C) =\n" + invC.print());
console.log("\ninv(C)C =\n" + invC.multiply(C).print());