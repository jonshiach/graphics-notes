// 3-element vector class
class Vec3 {

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.array = [x, y, z];
  }

  // Print vector
  print() {
    return `[ ${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.z.toFixed(4)} ]`;
  }

  // Arithmetic operations
  add(v) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(s) {
    return new Vec3(this.x * s, this.y * s, this.z * s);
  }

  // Length and normalization
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const len = this.length();
    if (len === 0) return new Vec3(0, 0, 0);
    const inv = 1 / len;
    return new Vec3(this.x * inv, this.y * inv, this.z * inv);
  }

  // Dot and cross products
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    )
  }

}

// 4x4 Matrix class
class Mat4 {
  constructor() {
    this.m = new Float32Array(16);
  }

  // Print matrix
  print() {
    let string = "";
    for (let i = 0; i < 4; i++) {
      const row = [
        this.m[i * 4 + 0].toFixed(4),
        this.m[i * 4 + 1].toFixed(4),
        this.m[i * 4 + 2].toFixed(4),
        this.m[i * 4 + 3].toFixed(4),
      ];
      string += "  [ " + row.join("  ") + " ]\n";
    }
    return string;
  }
  
  // Set
  set(...values) {
    if (values.length !== 16) {
      throw new Error("Mat4.set() requires 16 values");
    }
    for (let i = 0; i < 16; i++) {
      this.m[i] = values[i];
    }
    return this;
  }

  // Arithmetic operations
  transpose() {
    let m = this.m;
    return new Mat4().set(
      m[0], m[4], m[8],  m[12],
      m[1], m[5], m[6],  m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15]
    );
  }

  multiply(mat) {
    const c = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        for (let i  = 0; i < 4; i++) {
          c[col * 4 + row] += this.m[i * 4 + row] * mat.m[col * 4 + i];
        }
      }
    }
    return new Mat4().set(...c);
  }

  // Transformation matrices
  translate(x, y, z) {
    return new Mat4().set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    );
  }

  scale(x, y, z) {
    return new Mat4().set(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    );
  }

  rotateZ(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return new Mat4().set(
      c,  s, 0, 0,
      -s, c, 0, 0,
      0,  0, 1, 0,
      0,  0, 0, 1
    );
  }

  // rotate(x, y, z, rad) {
  //   const len = Math.sqrt(x * x + y * y + z * z);
  //   if (len > 0) {
  //     x /= len; y /= len; z /= len;
  //   }
  //   const c = Math.cos(rad);
  //   const s = Math.sin(rad);
  //   const t = 1 - c;

  //   return new Mat4().set(
  //     t * x * x + c,      t * x * y + s * z,  t * x * z - s * y,  0,
  //     t * y * x - s * z,  t * y * y + c,      t * y * z + s * x,  0,
  //     t * z * x + s * y,  t * z * y - s * x,  t * z * z + c,      0,
  //     0, 0, 0, 1
  //   );
  // }

  rotate(x, y, z, rad) {
    const len = Math.sqrt(x * x + y * y + z * z);
    if (len > 0) {
      x /= len; y /= len; z /= len;
    }
    const c = Math.cos(0.5 * rad);
    const s = Math.sin(0.5 * rad);

    return new Quaternion(s * x, s * y, s * z, c).matrix();
  }
}

// Quaternion class
class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Quaternion matrix
  matrix () {
    const x = this.x, y = this.y, z = this.z, w = this.w;
    const x2 = x + x,  y2 = y + y,  z2 = z + z;
    const xx = x * x2, yy = y * y2, zz = z * z2;
    const xy = x * y2, xz = x * z2, xw = w * x2;
    const yz = y * z2, yw = w * y2, zw = w * z2;

    return new Mat4().set(
      1 - yy - zz,    xy + zw,        xz - yw,        0,
      xy - zw,        1 - xx - zz,    yz + xw,        0,
      xz + yw,        yz - xw,        1 - xx - yy,    0,
      0,              0,              0,              1
    );
  }

  // Euler to quaternion
  static fromEuler(pitch, yaw, roll) {
    const cp = Math.cos(0.5 * pitch);
    const sp = Math.sin(0.5 * pitch);
    const cy = Math.cos(0.5 * yaw);
    const sy = Math.sin(0.5 * yaw);
    const cr = Math.cos(0.5 * roll);
    const sr = Math.sin(0.5 * roll);

    return new Quaternion(
      cy * cp * cr + sy * sp * sr,
      cy * cp * sr - sy * sp * cr,
      cy * sp * cr + sy * cp * sr,
      sy * cp * cr - cy * sp * sr
    );
  }
}