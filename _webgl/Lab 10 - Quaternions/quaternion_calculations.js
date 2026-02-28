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

// Defining quaternions
let q = new Quaternion(1, 2, 3, 4);
console.log("q = " + q);

// Length and normalization
console.log("\nLength and normalization\n------------------------")
console.log("length(q) = " + q.length());

const qHat = q.copy().normalize();
console.log("qHat = " + qHat);
console.log("length(qHat) = " + qHat.length());

// Multiplying quaternions
console.log("\nMultiplying quaternions\n-----------------------")
let p = new Quaternion(5, 6, 7, 8);

console.log("q = " + q);
console.log("p = " + p);
console.log("qp = " + q.multiply(p));
console.log("pq = " + p.multiply(q));

// Quaternion inverse
console.log("\nInverse quaternion\n-------------------");
console.log("qInv = " + q.inverse());
console.log("qInv q = " + q.multiply(q.inverse()));
console.log("q qInv = " + q.inverse().multiply(q));

// Rotations
console.log("\nRotations\n---------")
const axis = [0, 1, 0];
const angle = 90 * Math.PI / 180;
p = [1, 0, 0];
q = Quaternion.fromAxisAngle(axis, angle);

console.log("q = " + q);
console.log("p = " + printVector(p));
console.log("pRotated = " + printVector(q.rotateVector(p)));

console.log("\nquaternion rotation matrix =\n" + q.matrix());
console.log("\nrotation matrix =\n" + new Mat4().rotate(axis, angle));

// Camera quaternion
let qOrientation = new Quaternion();
const qPitch = Quaternion.fromAxisAngle([1, 0, 0], 45 * Math.PI / 180);
const qYaw = Quaternion.fromAxisAngle([0, 1, 0], 30 * Math.PI / 180);

console.log("\nCamera quaternion\n----------------")
console.log("qOrientation = " + qOrientation);
console.log("qPitch = " + qPitch);

qOrientation = qPitch.multiply(qOrientation);
console.log("qPitch qOrientation = " + qOrientation);

qOrientation = qYaw.multiply(qOrientation);
console.log("qYaw qPitch qOrientation = " + qOrientation);

const front = qOrientation.rotateVector([0, 0, -1]);
const right = qOrientation.rotateVector([1, 0, 0]);
const up = qOrientation.rotateVector([0, 1, 0]);

console.log("front = " + printVector(front));
console.log("right = " + printVector(right));
console.log("up = " + printVector(up));
