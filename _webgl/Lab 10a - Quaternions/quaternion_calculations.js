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
console.log("length(q) = " + q.length());

// Unit quaternion
const qHat = new Quaternion(1, 2, 3, 4).normalize();
console.log("\nqHat = " + qHat.print());
console.log("length(qHat) = " + qHat.length());

// Quaternion conjugate
const qConjugate = new Quaternion(1, 2, 3, 4).conjugate();
console.log("\nconjugate(q) = " + qConjugate.print());

// Multiplying quaternions
const q1 = new Quaternion(1, 2, 3, 4);
const q2 = new Quaternion(5, 6, 7, 8);
console.log("\nq1 = " + q1.print());
console.log("q2 = " + q2.print());
console.log("q1q2 = " + q1.multiply(q2).print());

// Quaternion inverse
const qInv = q.inverse();
console.log("\nqInv = " + qInv.print())
console.log("qInv * q = " + qInv.multiply(q).print())

// Rotation quaternion
const qRot = new Quaternion().fromAxisAngle([0, 1, 0], 90 * Math.PI / 180);
const p = new Quaternion(0, 1, 0, 0);
const qRotInv = qRot.inverse();
console.log("\nqRot = " + qRot.print());
console.log("p = " + p.print());
console.log("qRotInv = " + qRotInv.print());

const pRotated = qRot.multiply(p).multiply(qRotInv);
console.log("\npRotated = " + pRotated.print());


const quaterionRotation = rotationQuaternion.matrix();
console.log("\nquaternion rotation matrix =\n" + quaterionRotation.print());

const rotationMatrix = new Mat4().rotate(axis, angle);
console.log("\nrotation matrix =\n" + rotationMatrix.print());

const yaw = 45 * Math.PI / 180;
const pitch = 45 * Math.PI / 180;
const roll = 45 * Math.PI / 180;
const qFromEuler = new Quaternion().fromEuler(yaw, pitch, roll);
console.log("\nquaternion from Euler = " + qFromEuler.print());

const q3 = new Quaternion().setFromEuler(pitch, yaw, roll);
console.log("\nquaternion from Euler = " + q3.print());
