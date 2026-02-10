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

// Define quaternions
const q = new Quaternion(1, 2, 3, 4);
console.log("q = " + q.print());

// Quaternion length
console.log("\nQuaternion length\n-----------------")
console.log("length(q) = " + q.length());
const qHat = new Quaternion(1, 2, 3, 4).normalize();
console.log("qHat = " + qHat.print());
console.log("length(qHat) = " + qHat.length());

// Multiplying quaternions
const q1 = new Quaternion(1, 2, 3, 4);
const q2 = new Quaternion(5, 6, 7, 8);
console.log("\nMultiplying quaternions\n-----------------------");
console.log("q1 = " + q1.print());
console.log("q2 = " + q2.print());
console.log("q1q2 = " + q1.multiply(q2).print());

// Quaternion inverse
const qInv = q.inverse();
console.log("\nQuaternion inverse\n------------------")
console.log("qInv = " + qInv.print());
console.log("qInv * q = " + qInv.multiply(q).print());

// Quaternion rotation
const p = [1, 0, 0];
const axis = [0, 1, 0];
const angle = 90 * Math.PI / 180;
const qRot = new Quaternion().fromAxisAngle(axis, angle);
console.log("\nQuaternion rotation\n-------------------");
console.log("p = " + printVector(p));
console.log("qRot = " + qRot.print());
console.log("pRotated = " + printVector(qRot.rotateVector(p)));

const quaterionRotation = qRot.matrix();
console.log("\nquaternion rotation matrix =\n" + quaterionRotation.print());

const rotationMatrix = new Mat4().rotate(axis, angle);
console.log("\nrotation matrix =\n" + rotationMatrix.print());

const yaw = 45 * Math.PI / 180;
const pitch = 45 * Math.PI / 180;
const q3 = new Quaternion().fromEuler(yaw, pitch, 0.0);
console.log("\nq3 = " + q3.print());