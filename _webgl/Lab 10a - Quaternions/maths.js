// Vector operations
function printVector(v) {
  return `[ ${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)} ]`;
}

function addVector(a, b) {
  return [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ];
}

function subtractVector(a, b) {
  return [ a[0] - b[0], a[1] - b[1], a[2] - b[2] ];
}

function scaleVector(v, k) {
  return [ k * v[0], k * v[1], k * v[2] ];
}

function length(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function normalize(v) {
  const len = length(v);
  if (len === 0) return [0, 0, 0];
  return scaleVector(v, 1 / len);
}

function dot(a, b) {
  return  a[0] * b[0] + a[1] * b[1] +a[2] * b[2];
}

function cross(a, b) {
  return [ 
    a[1] * b[2] - a[2] * b[1], 
    a[2] * b[0] - a[0] * b[2], 
    a[0] * b[1] - a[1] * b[0] 
  ];
}

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

  print() {
    const m = this.m;
    let string = "";
    for (let i = 0; i < 4; i++) {
      const row = [
        m[i * 4 + 0].toFixed(2).padStart(8),
        m[i * 4 + 1].toFixed(2).padStart(8),
        m[i * 4 + 2].toFixed(2).padStart(8),
        m[i * 4 + 3].toFixed(2).padStart(8),
      ];
      string += "  [" + row.join(" ") + " ]\n";
    }
    return string;
  }

  copy(mat) {
    this.m.set(mat.m);
    return this;
  }

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

  multiply(mat) {
    const result = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        let sum = 0;
        for (let k  = 0; k < 4; k++) {
          sum += this.m[row + k * 4] * mat.m[k + col * 4];
        }
        result[row + col * 4] = sum;
      }
    }
    this.set(result);
    return this;
  }

  inverse() {
    let m = this.m;
    const inv = new Float32Array([
      m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10],
      -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10],      
      m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7]  - m[13] * m[3] * m[6],      
      -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7]  + m[9] * m[3] * m[6],

      -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10],
      m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10],
      -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7]  + m[12] * m[3] * m[6],
      m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7]  - m[8] * m[3] * m[6],

      m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9],
      -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9],
      m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7]  - m[12] * m[3] * m[5],
      -m[0] * m[5] * m[11] + m[0] * m[7] * m[9]  + m[4] * m[1] * m[11] - m[4] * m[3] * m[9]  - m[8] * m[1] * m[7]  + m[8] * m[3] * m[5],

      -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9],
      m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9],
      -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6]  + m[12] * m[2] * m[5],
      m[0] * m[5] * m[10] - m[0] * m[6] * m[9]  - m[4] * m[1] * m[10] + m[4] * m[2] * m[9]  + m[8] * m[1] * m[6]  - m[8] * m[2] * m[5]
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

  translate(t) {
    const [x, y, z] = t;
    const transMatrix = new Mat4().set([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
    return this.multiply(transMatrix);
  }

  scale(s) {
    const [x, y, z] = s;
    const scaleMatrix = new Mat4().set([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ]);
    return this.multiply(scaleMatrix);
  }

  rotate(axis, angle) {
    const rotationQuaternion = new Quaternion().fromAxisAngle(axis, angle);
    return this.multiply(rotationQuaternion.matrix());
  }
}

class Quaternion {
  constructor(w = 1, x = 0, y = 0, z = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  print() {
    const w = this.w.toFixed(3);
    const x = this.x.toFixed(3);
    const y = this.y.toFixed(3);
    const z = this.z.toFixed(3);
    return `[ ${w}, ( ${x}, ${y}, ${z} ) ]`;
  }

  length() {
    return Math.sqrt(
      this.w * this.w + 
      this.x * this.x + 
      this.y * this.y + 
      this.z * this.z
    );
  }

  normalize() {
    const len = this.length();
    if (len === 0) return new Quaternion(0, 0, 0, 0);
    const inv = 1 / len;
    this.w *= inv;
    this.x *= inv;
    this.y *= inv;
    this.z *= inv;
    
    return this;
  }

  conjugate() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;

    return this;
  }

  inverse() {
    const len2 = this.length() * this.length();
    if (len2 === 0) throw new Error("Cannot invert a zero quaternion");
    return new Quaternion(
      this.w / len2, 
      -this.x / len2, 
      -this.y / len2, 
      -this.z / len2
    );
  }

  multiply(q) {
    const w = this.w, x = this.x, y = this.y, z = this.z;

    this.w = w * q.w - x * q.x - y * q.y - z * q.z;
    this.x = w * q.x + x * q.w + y * q.z - z * q.y;
    this.y = w * q.y - x * q.z + y * q.w + z * q.x;
    this.z = w * q.z + x * q.y - y * q.x + z * q.w;

    return this;
  }

  fromAxisAngle(axis, angle) {
    axis = normalize(axis);
    const halfAngle = 0.5 * angle;
    const s = Math.sin(halfAngle);

    this.w = Math.cos(halfAngle);
    this.x = axis[0] * s;
    this.y = axis[1] * s;
    this.z = axis[2] * s;

    return this.normalize();
  }

  rotateVector(v) {
    const p = new Quaternion(0, ...v);
    const r = this.multiply(v).multiply(this.conjugate());
  }

  matrix() {
    const w = this.w, x = this.x, y = this.y, z = this.z;
    const xx = x * x, yy = y * y, zz = z * z;
    const wx = w * x, wy = w * y, wz = w * z;
    const xy = x * y, xz = x * z, yz = y * z;

    return new Mat4().set([
      1 - 2 * (yy + zz),  2 * (xy + wz),      2 * (xz - wy),      0,
      2 * (xy - wz),      1 - 2 * (xx + zz),  2 * (yz + wx),      0,
      2 * (xz + wy),      2 * (yz - wx),      1 - 2 * (xx + yy),  0,
      0,                  0,                  0,                  1
    ]);
  }

  fromEuler(yaw, pitch, roll) {
    const halfPitch = 0.5 * pitch;
    const halfYaw = -0.5 * yaw;
    const halfRoll = 0.5 * roll;
    const sx = Math.sin(halfPitch), cx = Math.cos(halfPitch);
    const sy = Math.sin(halfYaw),   cy = Math.cos(halfYaw);
    const sz = Math.sin(halfRoll),  cz = Math.cos(halfRoll);

    this.w = cx * cy * cz + sx * sy * sz;
    this.x = sx * cy * cz - cx * sy * sz;
    this.y = cx * sy * cz + sx * cy * sz;
    this.z = cx * cy * sz - sx * sy * cz;

    return this.normalize();
  }

  setFromEuler(x, y, z) {
    const hx = x * 0.5, hy = y * 0.5, hz = z * 0.5;

    const sx = Math.sin(hx), cx = Math.cos(hx);
    const sy = Math.sin(hy), cy = Math.cos(hy);
    const sz = Math.sin(hz), cz = Math.cos(hz);

    this.w = cx * cy * cz - sx * sy * sz;
    this.x = sx * cy * cz + cx * sy * sz;
    this.y = cx * sy * cz - sx * cy * sz;
    this.z = cx * cy * sz + sx * sy * cz;

    return this.normalize();
  }
}