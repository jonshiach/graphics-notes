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
let q = new Quaternion(1, 2, 3, 4);
console.log("q = " + q);

// Quaternion length
console.log("\nQuaternion length\n-----------------")
console.log("length(q) = " + q.length());
const qHat = new Quaternion(1, 2, 3, 4).normalize();
console.log("qHat = " + qHat);
console.log("length(qHat) = " + qHat.length());

// Multiplying quaternions
const q2 = new Quaternion(5, 6, 7, 8);
console.log("\nMultiplying quaternions\n-----------------------");
console.log("q2 = " + q2);
console.log("qq2 = " + q.multiply(q2));

// Quaternion inverse
console.log("\nQuaternion inverse\n------------------")
console.log("qInv = " + q.inverse());
console.log("qInv * q = " + q.inverse().multiply(q));

// Quaternion rotation
const p = [1, 0, 0];
const axis = [0, 1, 0];
const angle = 90 * Math.PI / 180;
q = Quaternion.fromAxisAngle(axis, angle);
console.log("\nQuaternion rotation\n-------------------");
console.log("p = " + printVector(p));
console.log("q = " + q);
console.log("pRotated = " + printVector(q.rotateVector(p)));

const quaterionMatrix = q.matrix();
console.log("\nquaternion rotation matrix =\n" + quaterionMatrix.print());

const rotationMatrix = new Mat4().rotate(axis, angle);
console.log("\nrotation matrix =\n" + rotationMatrix.print());


// Quaternion camera
const yaw = 30 * Math.PI / 180;
const pitch = 45 * Math.PI / 180;
let qCamera = new Quaternion();
const qYaw = Quaternion.fromAxisAngle([0, 1, 0], yaw);
const qPitch = Quaternion.fromAxisAngle([1, 0, 0], pitch);

console.log("\nQuaternion camera\n-----------------");
console.log("qPitch = " + qPitch);
console.log("qYaw = " + qYaw);

qCamera = qPitch.multiply(qCamera);
console.log("\nqCamera = " + qCamera);

qCamera = qYaw.multiply(qCamera);
console.log("\nqCamera = " + qCamera);

